import pytest
import numpy as np
from unittest.mock import Mock, patch, MagicMock
import networkx as nx
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from app.services.graph_heuristics import GraphHeuristicsService  


class TestGraphHeuristicsService:
    
    @pytest.fixture
    def mock_db(self):
        return Mock(spec=Session)
    
    @pytest.fixture
    def service(self, mock_db):
        return GraphHeuristicsService(mock_db)
    
    @pytest.fixture
    def sample_graph(self):
        """Tạo một đồ thị mẫu để testing"""
        graph = nx.DiGraph()
        
        # Thêm nodes với các thuộc tính
        graph.add_node("user1", username="user1", first_name="John", last_name="Doe", 
                      bio="Developer", location="Hanoi")
        graph.add_node("user2", username="user2", first_name="Jane", last_name="Smith", 
                      bio="Designer", location="HCMC")
        graph.add_node("user3", username="user3", first_name="Bob", last_name="Johnson", 
                      bio="Manager", location="Danang")
        graph.add_node("user4", username="user4", first_name="Alice", last_name="Brown", 
                      bio="Engineer", location="Hanoi")
        
        # Thêm edges (follow relationships)
        graph.add_edge("user1", "user2", created_at=datetime.now())
        graph.add_edge("user1", "user3", created_at=datetime.now())
        graph.add_edge("user2", "user3", created_at=datetime.now())
        graph.add_edge("user3", "user4", created_at=datetime.now())
        
        return graph
    
    def test_should_rebuild_graph_first_time(self, service):
        """Test should_rebuild_graph khi chưa build lần nào"""
        assert service.should_rebuild_graph() == True
    
    def test_should_rebuild_graph_within_cache_duration(self, service):
        """Test should_rebuild_graph khi vẫn trong thời gian cache"""
        service.last_build_time = datetime.now() - timedelta(seconds=100)
        assert service.should_rebuild_graph() == False
    
    def test_should_rebuild_graph_after_cache_duration(self, service):
        """Test should_rebuild_graph khi hết thời gian cache"""
        service.last_build_time = datetime.now() - timedelta(seconds=400)
        assert service.should_rebuild_graph() == True
    
    @patch('app.services.graph_heuristics.text')
    def test_build_graph_from_database_success(self, mock_text, service, mock_db):
        """Test build_graph_from_database thành công"""
        # Mock database results
        mock_users_result = Mock()
        mock_users_result.fetchall.return_value = [
            ("user1", "user1", "John", "Doe", "Developer", "Hanoi"),
            ("user2", "user2", "Jane", "Smith", "Designer", "HCMC")
        ]
        
        mock_edges_result = Mock()
        mock_edges_result.fetchall.return_value = [
            ("user1", "user2", datetime.now()),
            ("user2", "user1", datetime.now())
        ]
        
        mock_db.execute.side_effect = [mock_users_result, mock_edges_result]
        
        # Gọi hàm
        graph = service.build_graph_from_database()
        
        # Kiểm tra kết quả
        assert graph.number_of_nodes() == 2
        assert graph.number_of_edges() == 2
        assert "user1" in graph
        assert "user2" in graph
        assert graph.has_edge("user1", "user2")
        assert graph.has_edge("user2", "user1")
    
    @patch('app.services.graph_heuristics.text')
    def test_build_graph_from_database_empty(self, mock_text, service, mock_db):
        """Test build_graph_from_database với database rỗng"""
        mock_users_result = Mock()
        mock_users_result.fetchall.return_value = []
        
        mock_edges_result = Mock()
        mock_edges_result.fetchall.return_value = []
        
        mock_db.execute.side_effect = [mock_users_result, mock_edges_result]
        
        graph = service.build_graph_from_database()
        
        assert graph.number_of_nodes() == 0
        assert graph.number_of_edges() == 0
    
    def test_calculate_heuristic_scores_basic(self, service, sample_graph):
        """Test tính heuristic scores cơ bản"""
        service.graph = sample_graph
        
        scores = service.calculate_heuristic_scores("user1", "user2")
        
        # Kiểm tra các scores có tồn tại
        assert 'common_neighbors' in scores
        assert 'jaccard_coefficient' in scores
        assert 'adamic_adar_index' in scores
        assert 'preferential_attachment' in scores
        assert 'path_similarity' in scores
        
        # Kiểm tra kiểu dữ liệu
        assert isinstance(scores['common_neighbors'], int)
        assert isinstance(scores['jaccard_coefficient'], float)
        assert isinstance(scores['path_similarity'], float)
    
    def test_calculate_heuristic_scores_nonexistent_nodes(self, service):
        """Test tính heuristic scores với nodes không tồn tại"""
        service.graph = nx.DiGraph()
        
        scores = service.calculate_heuristic_scores("nonexistent1", "nonexistent2")
        
        assert scores == {}
    
    def test_combine_heuristic_scores_basic(self, service):
        """Test kết hợp heuristic scores cơ bản"""
        test_scores = {
            'common_neighbors_normalized': 0.5,
            'jaccard_coefficient': 0.3,
            'adamic_adar_index': 0.4,
            'path_similarity': 0.6,
            'preferential_attachment': 100,
            'target_in_degree': 30
        }
        
        result = service.combine_heuristic_scores(test_scores)
        
        # Kiểm tra kết quả nằm trong khoảng 0-1
        assert 0 <= result <= 1
        assert isinstance(result, float)
    
    def test_combine_heuristic_scores_with_penalty(self, service):
        """Test kết hợp heuristic scores với hình phạt cho popular users"""
        test_scores = {
            'common_neighbors_normalized': 0.5,
            'jaccard_coefficient': 0.3,
            'adamic_adar_index': 0.4,
            'path_similarity': 0.6,
            'preferential_attachment': 2000,  # Rất cao
            'target_in_degree': 100  # Rất popular
        }
        
        result = service.combine_heuristic_scores(test_scores)
        
        # Score nên thấp hơn do hình phạt
        assert 0 <= result <= 1
    
    def test_combine_heuristic_scores_empty(self, service):
        """Test kết hợp heuristic scores với input rỗng"""
        result = service.combine_heuristic_scores({})
        assert result == 0.0
    
    def test_combine_heuristic_scores_invalid_values(self, service):
        """Test kết hợp heuristic scores với giá trị không hợp lệ"""
        test_scores = {
            'common_neighbors_normalized': float('nan'),
            'jaccard_coefficient': float('inf'),
            'path_similarity': -1.0
        }
        
        result = service.combine_heuristic_scores(test_scores)
        assert 0 <= result <= 1
    
    @patch('app.services.graph_heuristics.text')
    def test_get_candidate_users(self, mock_text, service, mock_db):
        """Test lấy candidate users"""
        mock_result = Mock()
        mock_result.fetchall.return_value = [("user3",), ("user4",)]
        mock_db.execute.return_value = mock_result
        
        candidates = service.get_candidate_users("user1", 10)
        
        assert len(candidates) == 2
        assert "user3" in candidates
        assert "user4" in candidates
        mock_db.execute.assert_called_once()
    
    @patch('app.services.graph_heuristics.text')
    def test_get_candidate_users_empty(self, mock_text, service, mock_db):
        """Test lấy candidate users khi không có candidate nào"""
        mock_result = Mock()
        mock_result.fetchall.return_value = []
        mock_db.execute.return_value = mock_result
        
        candidates = service.get_candidate_users("user1", 10)
        
        assert candidates == []
    
    @patch('app.services.graph_heuristics.text')
    def test_get_user_info(self, mock_text, service, mock_db):
        """Test lấy thông tin user"""
        mock_result = Mock()
        mock_result.first.return_value = (
            "user1", "user1", "John", "Doe", "Hanoi", "Developer", 100, 50, 25
        )
        mock_db.execute.return_value = mock_result
        
        user_info = service.get_user_info("user1")
        
        assert user_info is not None
        assert user_info['user_id'] == "user1"
        assert user_info['username'] == "user1"
        assert user_info['first_name'] == "John"
        assert user_info['followers_count'] == 100
        assert user_info['posts_count'] == 25
    
    @patch('app.services.graph_heuristics.text')
    def test_get_user_info_nonexistent(self, mock_text, service, mock_db):
        """Test lấy thông tin user không tồn tại"""
        mock_result = Mock()
        mock_result.first.return_value = None
        mock_db.execute.return_value = mock_result
        
        user_info = service.get_user_info("nonexistent")
        
        assert user_info is None
    
    @patch.object(GraphHeuristicsService, 'build_graph_from_database')
    def test_generate_recommendations_user_not_in_graph(self, mock_build_graph, service):
        """Test generate recommendations khi user không có trong graph"""
        mock_build_graph.return_value = nx.DiGraph()  # Empty graph
        
        recommendations = service.generate_recommendations("user1", 5)
        
        assert recommendations == []
    
    @patch.object(GraphHeuristicsService, 'build_graph_from_database')
    @patch.object(GraphHeuristicsService, 'get_candidate_users')
    def test_generate_recommendations_no_candidates(self, mock_get_candidates, mock_build_graph, service):
        """Test generate recommendations khi không có candidate nào"""
        mock_build_graph.return_value = nx.DiGraph()
        mock_get_candidates.return_value = []
        
        recommendations = service.generate_recommendations("user1", 5)
        
        assert recommendations == []
    
    def test_get_jaccard_recommendations(self, service, sample_graph):
        """Test jaccard recommendations"""
        service.graph = sample_graph
        service.last_build_time = datetime.now()  
        
        # Mock get_user_info
        with patch.object(service, 'get_user_info') as mock_get_info:
            mock_get_info.return_value = {
                'user_id': 'user4', 'username': 'user4', 'first_name': 'Alice',
                'last_name': 'Brown', 'location': 'Hanoi', 'bio': 'Engineer',
                'followers_count': 50, 'following_count': 30, 'posts_count': 15
            }
            
            recommendations = service.get_jaccard_recommendations("user1", 5)
            
            assert len(recommendations) > 0
            assert 'score' in recommendations[0]
            assert 'algorithm' in recommendations[0]
    
    def test_get_common_neighbors_recommendations(self, service, sample_graph):
        """Test common neighbors recommendations"""
        service.graph = sample_graph
        service.last_build_time = datetime.now()  

        # Mock get_user_info
        with patch.object(service, 'get_user_info') as mock_get_info:
            mock_get_info.return_value = {
                'user_id': 'user4', 'username': 'user4', 'first_name': 'Alice',
                'last_name': 'Brown', 'location': 'Hanoi', 'bio': 'Engineer',
                'followers_count': 50, 'following_count': 30, 'posts_count': 15
            }

            recommendations = service.get_common_neighbors_recommendations("user1", 5)

            assert len(recommendations) > 0
            assert 'score' in recommendations[0]
            assert 'common_neighbors_count' in recommendations[0]


# Test integration
class TestGraphHeuristicsServiceIntegration:
    
    @patch('app.services.graph_heuristics.text')
    def test_integration_workflow(self, mock_text, mock_db):
        """Test toàn bộ workflow tích hợp"""
        service = GraphHeuristicsService(mock_db)
        
        # Mock database responses
        mock_users_result = Mock()
        mock_users_result.fetchall.return_value = [
            ("user1", "user1", "John", "Doe", "Developer", "Hanoi"),
            ("user2", "user2", "Jane", "Smith", "Designer", "HCMC"),
            ("user3", "user3", "Bob", "Johnson", "Manager", "Danang")
        ]
        
        mock_edges_result = Mock()
        mock_edges_result.fetchall.return_value = [
            ("user1", "user2", datetime.now()),
            ("user2", "user3", datetime.now())
        ]
        
        mock_candidates_result = Mock()
        mock_candidates_result.fetchall.return_value = [("user3",)]
        
        mock_user_info_result = Mock()
        mock_user_info_result.first.return_value = (
            "user3", "user3", "Bob", "Johnson", "Danang", "Manager", 150, 75, 40
        )
        
        mock_db.execute.side_effect = [
            mock_users_result,  # build_graph - users
            mock_edges_result,   # build_graph - edges
            mock_candidates_result,  # get_candidate_users
            mock_user_info_result   # get_user_info
        ]
        
        # Generate recommendations
        recommendations = service.generate_recommendations("user1", 5)
        
        # Kiểm tra kết quả
        assert len(recommendations) == 1
        assert recommendations[0]['user_id'] == 'user3'
        assert recommendations[0]['username'] == 'user3'
        assert recommendations[0]['first_name'] == 'Bob'
        assert 'final_score' in recommendations[0]


if __name__ == "__main__":
    pytest.main([__file__, "-v"])