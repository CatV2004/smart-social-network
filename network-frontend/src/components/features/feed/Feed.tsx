import Post from '@/components/features/post/PostCard';

export default function Feed() {
  const posts = [
    { 
      id: 1, 
      user: { username: 'Hualorani', avatar: '/images/avatar3.jpg' },
      image: '/images/post1.jpg',
      caption: 'Hualorani do trang chủ quilip sai ALI-SUAN đã ngoài và có thể sẽ giải thưởng làm hiện.',
      likes: 13754,
      timestamp: '2 ngày trước',
      comments: []
    },
    // ...thêm các post khác
  ];

  return (
    <div className="space-y-6">
      {posts.map(post => (
        <Post key={post.id} post={post} />
      ))}
    </div>
  );
}