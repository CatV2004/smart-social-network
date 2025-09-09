import networkx as nx
import numpy as np
from typing import List, Dict, Any, Set, Tuple, Optional
from sqlalchemy.orm import Session
from sqlalchemy import text
import logging
import time
from datetime import datetime
import math

logger = logging.getLogger(__name__)

class GraphHeuristicsService:
    def __init__(self, db: Session):
        self.db = db
        self.graph = nx.DiGraph()
        self.last_build_time = None
        self.graph_cache_duration = 300  # 5 minutes
    
    def should_rebuild_graph(self) -> bool:
        """Kiểm tra xem có cần rebuild graph không"""
        if self.last_build_time is None:
            return True
        return (datetime.now() - self.last_build_time).total_seconds() > self.graph_cache_duration
    
    def build_graph_from_database(self, force_rebuild: bool = False) -> nx.DiGraph:
        """Xây dựng đồ thị từ database với caching"""
        if not force_rebuild and not self.should_rebuild_graph() and self.graph.number_of_nodes() > 0:
            logger.info("Using cached graph")
            return self.graph
        
        logger.info("Building graph from database...")
        start_time = time.time()
        
        # Reset graph
        self.graph = nx.DiGraph()
        
        try:
            # Lấy tất cả users với các trường cần thiết
            users_query = text("""
            SELECT 
                u.id as user_id, 
                u.username,
                u."firstName" as first_name,
                u."lastName" as last_name,
                p.bio,
                p.location,
                p.avatar
            FROM users u
            JOIN profiles p ON u.id = p.user_id
            WHERE u.status = 'ACTIVE' AND u.deleted_at IS NULL
            """)
            
            user_result = self.db.execute(users_query)
            user_rows = user_result.fetchall()
            
            # Thêm tất cả nodes với các thuộc tính cần thiết
            for row in user_rows:
                user_id = str(row[0])  # user_id là cột đầu tiên
                self.graph.add_node(
                    user_id,
                    username=row[1],
                    first_name=row[2],
                    last_name=row[3],
                    bio=row[4],
                    location=row[5]
                )
            
            logger.info(f"Added {len(user_rows)} users to graph")
            
            # Thêm edges (follows relationships) - chỉ lấy các follows đã được chấp nhận
            follows_query = text("""
            SELECT 
                f1.id as follower_user_id,
                f2.id as following_user_id,
                fl.created_at as follow_date
            FROM follows fl
            JOIN profiles p1 ON fl.follower_id = p1.id
            JOIN profiles p2 ON fl.following_id = p2.id
            JOIN users f1 ON p1.user_id = f1.id
            JOIN users f2 ON p2.user_id = f2.id
            WHERE fl.status = 'ACCEPTED'
            AND f1.status = 'ACTIVE' AND f2.status = 'ACTIVE'
            AND f1.deleted_at IS NULL AND f2.deleted_at IS NULL
            """)
            
            edge_result = self.db.execute(follows_query)
            edge_rows = edge_result.fetchall()
            edge_count = 0
            
            for row in edge_rows:
                source_id = str(row[0])  # follower_user_id
                target_id = str(row[1])  # following_user_id
                follow_date = row[2]
                
                # Chỉ thêm edge nếu cả source và target đều có trong graph
                if source_id in self.graph and target_id in self.graph:
                    self.graph.add_edge(source_id, target_id, created_at=follow_date)
                    edge_count += 1
            
            self.last_build_time = datetime.now()
            build_time = time.time() - start_time
            logger.info(f"Graph built in {build_time:.2f}s with {self.graph.number_of_nodes()} nodes and {edge_count} edges")
            
        except Exception as e:
            self.db.rollback()
            logger.error(f"Error building graph: {str(e)}", exc_info=True)
            raise
        
        return self.graph
    
    def calculate_heuristic_scores(self, source_id: str, target_id: str) -> Dict[str, float]:
        """
        Tính các heuristic scores giữa 2 nodes trong graph.
        Trả về dict chứa nhiều loại thang đo similarity.
        """
        scores: Dict[str, float] = {}

        # Kiểm tra tồn tại
        if source_id not in self.graph or target_id not in self.graph:
            return scores

        try:
            undirected_graph = self.graph.to_undirected()

            # --- 1. Common Neighbors ---
            try:
                common_neighbors = list(nx.common_neighbors(undirected_graph, source_id, target_id))
                source_neighbors = list(undirected_graph.neighbors(source_id))
                scores["common_neighbors"] = len(common_neighbors)
                scores["common_neighbors_normalized"] = len(common_neighbors) / max(len(source_neighbors), 1)
            except Exception as e:
                logger.warning(f"Common neighbors error: {e}")
                scores["common_neighbors"] = 0
                scores["common_neighbors_normalized"] = 0.0

            # --- 2. Jaccard Coefficient ---
            try:
                jaccard = next(nx.jaccard_coefficient(undirected_graph, [(source_id, target_id)]))[2]
                scores["jaccard_coefficient"] = jaccard
            except Exception as e:
                logger.warning(f"Jaccard error: {e}")
                scores["jaccard_coefficient"] = 0.0

            # --- 3. Adamic-Adar Index ---
            try:
                adamic_adar = next(nx.adamic_adar_index(undirected_graph, [(source_id, target_id)]))[2]
                scores["adamic_adar_index"] = adamic_adar
            except Exception as e:
                logger.warning(f"Adamic-Adar error: {e}")
                scores["adamic_adar_index"] = 0.0

            # --- 4. Preferential Attachment ---
            try:
                pref_attach = next(nx.preferential_attachment(undirected_graph, [(source_id, target_id)]))[2]
                scores["preferential_attachment"] = pref_attach
            except Exception as e:
                logger.warning(f"Preferential Attachment error: {e}")
                scores["preferential_attachment"] = 0.0

            # --- 5. Shortest Path ---
            try:
                if nx.has_path(undirected_graph, source_id, target_id):
                    shortest_path = nx.shortest_path_length(undirected_graph, source=source_id, target=target_id)
                    scores["shortest_path_length"] = shortest_path
                    scores["path_similarity"] = 1.0 / (shortest_path + 1)
                else:
                    scores["shortest_path_length"] = -1
                    scores["path_similarity"] = 0.0
            except Exception as e:
                logger.warning(f"Shortest path error: {e}")
                scores["shortest_path_length"] = -1
                scores["path_similarity"] = 0.0

            # --- 6. Degree Features ---
            scores["source_degree"] = self.graph.degree(source_id)
            scores["target_degree"] = self.graph.degree(target_id)
            scores["source_in_degree"] = self.graph.in_degree(source_id)
            scores["source_out_degree"] = self.graph.out_degree(source_id)
            scores["target_in_degree"] = self.graph.in_degree(target_id)
            scores["target_out_degree"] = self.graph.out_degree(target_id)

            # --- 7. Neighbors Intersection / Union ---
            try:
                source_neighbors = set(undirected_graph.neighbors(source_id))
                target_neighbors = set(undirected_graph.neighbors(target_id))
                scores["neighbors_intersection"] = len(source_neighbors & target_neighbors)
                scores["neighbors_union"] = len(source_neighbors | target_neighbors)
            except Exception as e:
                logger.warning(f"Neighbor intersection/union error: {e}")
                scores["neighbors_intersection"] = 0
                scores["neighbors_union"] = 0
                
            # 8. Friend-of-Friend score
            try:
                # Tính số mutual friends (A -> B -> C, where A is source, C is target)
                following_source = set(self.graph.successors(source_id))
                fof_score = 0
                for friend_id in following_source:
                    if target_id in set(self.graph.successors(friend_id)):
                        fof_score += 1
                scores['friend_of_friend_score'] = fof_score
            except Exception as e:
                logger.warning(f"Error calculating friend-of-friend score: {e}")
                scores['friend_of_friend_score'] = 0

        except Exception as e:
            logger.error(f"Error calculating heuristic scores: {e}", exc_info=True)

        return scores

    
    # def combine_heuristic_scores(self, scores: Dict[str, float]) -> float:
    #     """Kết hợp các heuristic scores thành một score tổng"""
    #     weights = {
    #         'common_neighbors_normalized': 0.25,
    #         'jaccard_coefficient': 0.20,
    #         'adamic_adar_index': 0.15,
    #         'path_similarity': 0.20,
    #         'preferential_attachment': 0.10,
    #         'target_in_degree_normalized': 0.10 
    #     }
        
    #     try:
    #         # Normalize degree features
    #         max_degree = max(scores.get('target_in_degree', 1), 1)
    #         scores['target_in_degree_normalized'] = scores.get('target_in_degree', 0) / max_degree
            
    #         final_score = 0.0
    #         total_weight = 0.0
            
    #         for feature, weight in weights.items():
    #             if feature in scores:
    #                 value = scores[feature]
    #                 # Ensure value is within reasonable bounds
    #                 if not np.isfinite(value):
    #                     value = 0.0
    #                 final_score += weight * value
    #                 total_weight += weight
            
    #         # Normalize by total weight used
    #         if total_weight > 0:
    #             final_score /= total_weight
            
    #         return min(max(final_score, 0.0), 1.0)  # Clamp between 0 and 1
    #     except Exception as e:
    #         logger.error(f"Error combining scores: {e}")
    #         return 0.0
    def combine_heuristic_scores(self, scores: Dict[str, float]) -> float:
        """Kết hợp các heuristic scores thành một score tổng"""
        if not scores:
            return 0.0
        
        # Làm sạch các giá trị NaN/Inf/None
        cleaned_scores = {}
        for k, v in scores.items():
            if v is None or (isinstance(v, float) and (math.isnan(v) or math.isinf(v))):
                cleaned_scores[k] = 0.0
            else:
                cleaned_scores[k] = max(0.0, float(v))

        # Thêm trọng số cho từng heuristic
        weights = {
            'common_neighbors_normalized': 0.45,  # giữ cao
            'jaccard_coefficient': 0.15,
            'adamic_adar_index': 0.15,
            'path_similarity': 0.08,
            'preferential_attachment': 0.01,      
            'target_in_degree_normalized': 0.01,
            'friend_of_friend_score': 0.15      
        }
        
        try:
            max_degree = max(cleaned_scores.get('target_in_degree', 1), 1)
            target_in_degree_norm = cleaned_scores.get('target_in_degree', 0) / max_degree

            popularity_penalty = 1.0 / (1.0 + np.exp(0.1 * (cleaned_scores.get('target_in_degree', 0) - 50)))
            cleaned_scores['target_in_degree_normalized'] = target_in_degree_norm * popularity_penalty
            
            # Hình phạt cho preferential attachment quá cao
            pref_attach = cleaned_scores.get('preferential_attachment', 0)
            if pref_attach > 1000:
                pref_attach_penalty = 1000 / pref_attach
                cleaned_scores['preferential_attachment'] = pref_attach * pref_attach_penalty
            
            final_score = 0.0
            total_weight = 0.0
            
            for feature, weight in weights.items():
                if feature in cleaned_scores:
                    value = cleaned_scores[feature]
                    if not np.isfinite(value):
                        value = 0.0
                    final_score += weight * value
                    total_weight += weight
            
            if total_weight > 0:
                final_score /= total_weight
            
            # Bonus
            common_bonus = min(cleaned_scores.get('common_neighbors_normalized', 0) * 0.1, 0.05)
            jaccard_bonus = min(cleaned_scores.get('jaccard_coefficient', 0) * 0.1, 0.05)
            fof_bonus = min(cleaned_scores.get('friend_of_friend_score', 0) * 0.1, 0.05)  
            final_score += common_bonus + jaccard_bonus + fof_bonus
            
            return min(max(final_score, 0.0), 1.0)
        except Exception as e:
            logger.error(f"Error combining scores: {e}")
            return 0.0
        
    def get_candidate_users(self, user_id: str, limit: int = 1000) -> List[str]:
        """Lấy danh sách user candidate để recommend (không follow nhau)"""
        query = text("""
        WITH user_following AS (
            -- Người mà user đang follow
            SELECT f2.id as following_user_id
            FROM follows fl
            JOIN profiles p1 ON fl.follower_id = p1.id
            JOIN profiles p2 ON fl.following_id = p2.id
            JOIN users f1 ON p1.user_id = f1.id
            JOIN users f2 ON p2.user_id = f2.id
            WHERE f1.id = :user_id AND fl.status = 'ACCEPTED'
            AND f1.status = 'ACTIVE' AND f2.status = 'ACTIVE'
            
            UNION
            
            -- Người follow user
            SELECT f1.id as follower_user_id
            FROM follows fl
            JOIN profiles p1 ON fl.follower_id = p1.id
            JOIN profiles p2 ON fl.following_id = p2.id
            JOIN users f1 ON p1.user_id = f1.id
            JOIN users f2 ON p2.user_id = f2.id
            WHERE f2.id = :user_id AND fl.status = 'ACCEPTED'
            AND f1.status = 'ACTIVE' AND f2.status = 'ACTIVE'
        ),
        all_active_users AS (
            SELECT u.id as user_id 
            FROM users u
            WHERE u.status = 'ACTIVE' 
            AND u.deleted_at IS NULL
            AND u.id != :user_id
        )
        SELECT au.user_id 
        FROM all_active_users au
        WHERE au.user_id NOT IN (SELECT following_user_id FROM user_following)
        ORDER BY (
            SELECT COUNT(*) 
            FROM follows fl 
            JOIN profiles p ON fl.following_id = p.id 
            JOIN users u ON p.user_id = u.id 
            WHERE u.id = au.user_id AND fl.status = 'ACCEPTED'
        ) DESC
        LIMIT :limit
        """)
        
        try:
            result = self.db.execute(query, {'user_id': user_id, 'limit': limit})
            rows = result.fetchall()
            return [str(row[0]) for row in rows]
        except Exception as e:
            self.db.rollback()
            logger.error(f"Error getting candidate users: {e}")
            return []
    
    def get_user_info(self, user_id: str) -> Optional[Dict[str, Any]]:
        """Lấy thông tin user từ database với các trường cần thiết"""
        query = text("""
        SELECT 
            u.id as user_id, 
            u.username, 
            u."firstName" as first_name,
            u."lastName" as last_name, 
            p.location, 
            p.bio,
            (
                SELECT COUNT(*) 
                FROM follows fl 
                JOIN profiles pr ON fl.following_id = pr.id 
                JOIN users u2 ON pr.user_id = u2.id 
                WHERE u2.id = :user_id AND fl.status = 'ACCEPTED'
            ) as followers_count,
            (
                SELECT COUNT(*) 
                FROM follows fl 
                JOIN profiles p ON fl.follower_id = p.id 
                JOIN users u2 ON p.user_id = u2.id 
                WHERE u2.id = :user_id AND fl.status = 'ACCEPTED'
            ) as following_count,
            (
                SELECT COUNT(*) 
                FROM posts p 
                WHERE p."authorId" IN (
                    SELECT pr.id FROM profiles pr WHERE pr.user_id = :user_id
                ) AND p.deleted_at IS NULL
            ) as posts_count,
            p.avatar
        FROM users u
        JOIN profiles p ON u.id = p.user_id
        WHERE u.id = :user_id AND u.status = 'ACTIVE' AND u.deleted_at IS NULL
        """)
        
        try:
            result = self.db.execute(query, {'user_id': user_id}).first()
            if result:
                return {
                    'user_id': str(result[0]),
                    'username': result[1],
                    'first_name': result[2],
                    'last_name': result[3],
                    'location': result[4],
                    'bio': result[5],
                    'followers_count': result[6] or 0,
                    'following_count': result[7] or 0,
                    'posts_count': result[8] or 0,
                    'avatar': result[9] or ''
                }
            return None
        except Exception as e:
            self.db.rollback()
            logger.error(f"Error getting user info: {e}")
            return None
    
    def generate_recommendations(self, user_id: str, top_n: int = 10) -> List[Dict[str, Any]]:
        """Generate recommendations dựa trên heuristic scores với description"""
        try:
            # Build graph
            self.build_graph_from_database()
            
            # Kiểm tra user có tồn tại trong graph
            if user_id not in self.graph:
                logger.warning(f"User {user_id} not found in graph")
                return []
            
            # Lấy danh sách candidate users
            candidate_users = self.get_candidate_users(user_id, 500)
            
            # Lọc chỉ những user có trong đồ thị
            graph_nodes = set(self.graph.nodes())
            valid_candidates = [uid for uid in candidate_users if uid in graph_nodes]
            
            logger.info(f"Processing {len(valid_candidates)} valid candidates for user {user_id}")
            
            recommendations = []
            processed_count = 0
            
            for candidate_id in valid_candidates:
                try:
                    # Tính heuristic scores
                    heuristic_scores = self.calculate_heuristic_scores(user_id, candidate_id)
                    
                    # Kết hợp scores thành final score
                    final_score = self.combine_heuristic_scores(heuristic_scores)
                    
                    # Lấy thông tin user
                    user_info = self.get_user_info(candidate_id)
                    
                    if user_info and final_score > 0:  # Chỉ recommend nếu score > 0
                        # Thêm description dựa trên các heuristic scores
                        description = self._generate_description_from_heuristics(user_id, candidate_id, heuristic_scores)
                        
                        recommendations.append({
                            **user_info,
                            'similarity_score': final_score,
                            'final_score': final_score,
                            'common_features': {
                                **heuristic_scores,
                                'description': description
                            }
                        })
                    
                    processed_count += 1
                    
                    # Log progress
                    if processed_count % 100 == 0:
                        logger.info(f"Processed {processed_count}/{len(valid_candidates)} candidates")
                        
                except Exception as e:
                    logger.error(f"Error processing candidate {candidate_id}: {str(e)}")
                    continue
            
            # Sắp xếp theo score
            recommendations.sort(key=lambda x: x['final_score'], reverse=True)
            
            logger.info(f"Generated {len(recommendations)} recommendations for user {user_id}")
            return recommendations[:top_n]
            
        except Exception as e:
            self.db.rollback()
            logger.error(f"Error generating recommendations: {str(e)}", exc_info=True)
            return []

    def _generate_description_from_heuristics(self, user_id: str, candidate_id: str, heuristic_scores: Dict[str, float]) -> str:
        """Tạo description dựa trên các heuristic scores"""
        try:
            descriptions = []
            
            # Common neighbors based description
            common_neighbors = heuristic_scores.get('common_neighbors', 0)
            common_neighbors_normalized = heuristic_scores.get('common_neighbors_normalized', 0)
            
            if common_neighbors > 0:
                # Lấy thông tin về common connections để có username cụ thể
                G = self.graph
                followers_user = set(G.predecessors(user_id))
                following_user = set(G.successors(user_id))
                followers_candidate = set(G.predecessors(candidate_id))
                following_candidate = set(G.successors(candidate_id))
                
                common_followers = followers_user & followers_candidate
                common_following = following_user & following_candidate
                
                if common_followers:
                    sample_follower = next(iter(common_followers), None)
                    if sample_follower:
                        follower_info = self.get_user_info(sample_follower)
                        if follower_info:
                            username = follower_info['username']
                            if len(common_followers) == 1:
                                descriptions.append(f"Có {username} theo dõi")
                            else:
                                descriptions.append(f"Có {username} và {len(common_followers) - 1} người khác theo dõi")
                
                if common_following:
                    sample_following = next(iter(common_following), None)
                    if sample_following:
                        following_info = self.get_user_info(sample_following)
                        if following_info:
                            username = following_info['username']
                            if len(common_following) == 1:
                                descriptions.append(f"Đang theo dõi {username}")
                            else:
                                descriptions.append(f"Đang theo dõi {username} và {len(common_following) - 1} người khác")
            
            # Friend-of-friend based description
            fof_score = heuristic_scores.get('friend_of_friend_score', 0)
            if fof_score > 0:
                # Tìm mutual friends để lấy username
                G = self.graph
                following_user = set(G.successors(user_id))
                mutual_friends = []
                
                for friend_id in following_user:
                    if candidate_id in set(G.successors(friend_id)):
                        friend_info = self.get_user_info(friend_id)
                        if friend_info:
                            mutual_friends.append(friend_info)
                            if len(mutual_friends) >= 2:  # Chỉ lấy 2 người đầu
                                break
                
                if mutual_friends:
                    first_friend = mutual_friends[0]
                    if len(mutual_friends) == 1:
                        descriptions.append(f"Có {first_friend['username']} theo dõi")
                    else:
                        descriptions.append(f"Có {first_friend['username']} và {fof_score - 1} người khác đang theo dõi")
            
            # Jaccard coefficient based description
            jaccard = heuristic_scores.get('jaccard_coefficient', 0)
            if jaccard > 0.1:  # Ngưỡng jaccard
                descriptions.append(f"Có độ tương đồng cao với bạn")
            
            # Shortest path based description
            shortest_path = heuristic_scores.get('shortest_path_length', -1)
            if shortest_path == 2:
                descriptions.append(f"Kết nối gần với bạn")
            elif shortest_path == 3:
                descriptions.append(f"Cùng mạng lưới xã hội")
            
            if descriptions:
                return ". ".join(descriptions)
            else:
                return "Gợi ý cho bạn"
                    
        except Exception as e:
            logger.error(f"Error generating description: {e}")
            return "Gợi ý dựa trên mạng lưới xã hội"
    
    def get_jaccard_recommendations(self, user_id: str, top_n: int = 10) -> List[Dict[str, Any]]:
        """Recommend based on Jaccard Coefficient heuristic"""
        try:
            self.build_graph_from_database()
            undirected_graph = self.graph.to_undirected()
            
            if user_id not in undirected_graph:
                return []
            
            recommendations = []
            neighbors = set(undirected_graph.neighbors(user_id))
            all_nodes = set(undirected_graph.nodes())
            non_neighbors = all_nodes - neighbors - {user_id}
            
            for candidate_id in list(non_neighbors)[:500]:  # Giới hạn số lượng
                try:
                    jaccard = next(nx.jaccard_coefficient(undirected_graph, [(user_id, candidate_id)]))[2]
                    user_info = self.get_user_info(candidate_id)
                    
                    if user_info:
                        # CHUẨN HÓA ĐỊNH DẠNG TRẢ VỀ
                        recommendations.append({
                            **user_info,
                            'similarity_score': jaccard,
                            'final_score': jaccard,
                            'common_features': {
                                'jaccard_coefficient': jaccard
                            }
                        })
                except Exception as e:
                    logger.warning(f"Error processing jaccard for {candidate_id}: {e}")
                    continue
            
            return sorted(recommendations, key=lambda x: x['final_score'], reverse=True)[:top_n]
        except Exception as e:
            self.db.rollback()
            logger.error(f"Error in jaccard recommendations: {e}")
            return []
    
    def get_common_neighbors_recommendations(self, user_id: str, top_n: int = 10) -> List[Dict[str, Any]]:
        """Recommend based on Common Neighbors heuristic (follower/following-based)"""
        try:
            logger.info(f"Starting common neighbors recommendations for user {user_id}")
            self.build_graph_from_database()
            G = self.graph
            
            if user_id not in G:
                logger.warning(f"User {user_id} not found in graph")
                return []

            followers_user = set(G.predecessors(user_id))
            following_user = set(G.successors(user_id))
            
            logger.info(f"User {user_id} has {len(followers_user)} followers and {len(following_user)} following")

            all_nodes = set(G.nodes())
            non_neighbors = all_nodes - followers_user - following_user - {user_id}
            logger.info(f"Found {len(non_neighbors)} non-neighbor candidates")

            recommendations = []

            for candidate_id in list(non_neighbors)[:500]:
                try:
                    followers_candidate = set(G.predecessors(candidate_id))
                    following_candidate = set(G.successors(candidate_id))
                    
                    common_followers = followers_user & followers_candidate
                    common_following = following_user & following_candidate
                    common_count = len(common_followers) + len(common_following)

                    user_info = self.get_user_info(candidate_id)
                    if not user_info:
                        continue

                    # Lấy thông tin chi tiết về những người dùng chung
                    common_connections_info = self._get_common_connections_info(
                        user_id, candidate_id, common_followers, common_following
                    )

                    recommendations.append({
                        **user_info,
                        'similarity_score': min(common_count / 10.0, 1.0),  # Normalize score
                        'final_score': min(common_count / 10.0, 1.0),
                        'common_features': {
                            'common_neighbors': common_count,
                            'common_followers': len(common_followers),
                            'common_following': len(common_following),
                            'common_connections_info': common_connections_info
                        }
                    })

                except Exception as e:
                    logger.warning(f"Error processing candidate {candidate_id}: {e}")
                    continue

            logger.info(f"Generated {len(recommendations)} common neighbors recommendations")
            return sorted(recommendations, key=lambda x: x['final_score'], reverse=True)[:top_n]

        except Exception as e:
            self.db.rollback()
            logger.error(f"Error in common neighbors recommendations: {e}", exc_info=True)
            return []

    def _get_common_connections_info(self, user_id: str, candidate_id: str, 
                                common_followers: set, common_following: set) -> Dict[str, Any]:
        """Lấy thông tin chi tiết về những kết nối chung"""
        common_connections = {
            'followers': [],  # Người follow cả 2
            'following': [],  # Người được cả 2 follow
            'description': ''
        }
        
        try:
            # Lấy thông tin của common followers (tối đa 5 người)
            common_followers_list = list(common_followers)[:5]
            for follower_id in common_followers_list:
                follower_info = self.get_user_info(follower_id)
                if follower_info:
                    common_connections['followers'].append({
                        'user_id': follower_info['user_id'],
                        'username': follower_info['username'],
                        'first_name': follower_info['first_name'],
                        'last_name': follower_info['last_name'],
                        'avatar': follower_info['avatar']
                    })
            
            # Lấy thông tin của common following (tối đa 5 người)
            common_following_list = list(common_following)[:5]
            for following_id in common_following_list:
                following_info = self.get_user_info(following_id)
                if following_info:
                    common_connections['following'].append({
                        'user_id': following_info['user_id'],
                        'username': following_info['username'],
                        'first_name': following_info['first_name'],
                        'last_name': following_info['last_name'],
                        'avatar': following_info['avatar']
                    })
            
            # Tạo mô tả tự động theo đúng ngữ cảnh
            descriptions = []
            
            if common_followers:
                sample_followers = common_connections['followers'][:1]  # Lấy 1 người đầu tiên
                if sample_followers:
                    follower_username = sample_followers[0]['username']
                    
                    if len(common_followers) == 1:
                        descriptions.append(f"Có {follower_username} theo dõi")
                    else:
                        descriptions.append(f"Có {follower_username} và {len(common_followers) - 1} người khác theo dõi")
            
            if common_following:
                sample_following = common_connections['following'][:1]  # Lấy 1 người đầu tiên
                if sample_following:
                    following_username = sample_following[0]['username']
                    
                    if len(common_following) == 1:
                        descriptions.append(f"Đang theo dõi {following_username}")
                    else:
                        descriptions.append(f"Đang theo dõi {following_username} và {len(common_following) - 1} người khác")
            
            if descriptions:
                common_connections['description'] = ". ".join(descriptions)
            else:
                common_connections['description'] = "Gợi ý cho bạn"
                
        except Exception as e:
            logger.error(f"Error getting common connections info: {e}")
            common_connections['description'] = "Có kết nối chung"
        
        return common_connections
    
    def get_friend_of_friends_recommendations(self, user_id: str, top_n: int = 10) -> List[Dict[str, Any]]:
        """Recommend based on Friend-of-Friend heuristic (A -> B -> C).
        Nghĩa là: nếu A theo dõi B và B theo dõi C, thì gợi ý A theo dõi C.
        Mô tả sẽ là: "có B theo dõi" hoặc "có B và N người khác đang theo dõi".
        """
        try:
            logger.info(f"Starting friend-of-friends recommendations for user {user_id}")
            self.build_graph_from_database()
            G = self.graph

            if user_id not in G:
                logger.warning(f"User {user_id} not found in graph")
                return []

            following_user = set(G.successors(user_id))
            recommendations = []

            # Tìm ứng viên kiểu: A -> B -> C
            fof_candidates: Dict[str, Dict[str, Any]] = {}  # candidate_id -> {count: int, sources: list}

            for friend_id in following_user:
                friend_info = self.get_user_info(friend_id)
                if not friend_info:
                    continue
                    
                for fof_id in G.successors(friend_id):
                    if fof_id != user_id and fof_id not in following_user:
                        if fof_id not in fof_candidates:
                            fof_candidates[fof_id] = {
                                'count': 0,
                                'sources': []
                            }
                        
                        fof_candidates[fof_id]['count'] += 1
                        # Lưu thông tin "B đang theo dõi C"
                        if len(fof_candidates[fof_id]['sources']) < 3:
                            fof_candidates[fof_id]['sources'].append(friend_info)

            logger.info(f"User {user_id} FoF candidates: {len(fof_candidates)}")

            for candidate_id, fof_data in fof_candidates.items():
                try:
                    user_info = self.get_user_info(candidate_id)
                    if user_info:
                        score = fof_data['count']
                        sources = fof_data['sources']

                        # Tạo mô tả: "có B theo dõi" hoặc "có B và N người khác đang theo dõi"
                        description = ""
                        if sources:
                            first_source = sources[0]['username']
                            if score == 1:
                                description = f"Có {first_source} theo dõi"
                            else:
                                description = f"Có {first_source} và {score - 1} người khác đang theo dõi"
                        else:
                            description = f"Có {score} người đang theo dõi"

                        recommendations.append({
                            **user_info,
                            'similarity_score': min(score / 10.0, 1.0),
                            'final_score': min(score / 10.0, 1.0),
                            'common_features': {
                                'fof_score': score,
                                'sources': sources,  # danh sách B đã theo dõi C
                                'description': description
                            }
                        })
                except Exception as e:
                    logger.warning(f"Error processing FoF candidate {candidate_id}: {e}")
                    continue

            logger.info(f"Generated {len(recommendations)} friend-of-friends recommendations")
            return sorted(recommendations, key=lambda x: x['final_score'], reverse=True)[:top_n]

        except Exception as e:
            self.db.rollback()
            logger.error(f"Error in friend-of-friends recommendations: {e}", exc_info=True)
            return []
