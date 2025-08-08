import PostCard from "./PostCard";
import { type Post } from "@/lib/mock-data";

export default function PostList({ posts }: { posts: Post[] }) {
  return (
    <div className="mx-auto max-w-screen-sm px-4">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}
