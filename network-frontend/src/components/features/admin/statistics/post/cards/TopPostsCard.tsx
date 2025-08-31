import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { TopPost } from "@/types/statistics";

interface TopPostsCardProps {
  title: string;
  data: TopPost[];
  metric: "likes" | "comments" | "saves";
  loading?: boolean;
}

export const TopPostsCard = ({
  title,
  data,
  metric,
  loading,
}: TopPostsCardProps) => {
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gray-200 rounded animate-pulse"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-3 bg-gray-200 rounded animate-pulse w-1/4"></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {data.slice(0, 5).map((post, index) => (
            <div key={post.id} className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                <Avatar className="w-12 h-12">
                  {post.media ? (
                    <AvatarImage src={post.media} alt={post.content} />
                  ) : (
                    <AvatarFallback>
                      {post.content.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  )}
                </Avatar>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{post.content}</p>
                <p className="text-sm text-gray-500">
                  {metric === "likes" && `${post.likes} likes`}
                  {metric === "comments" && `${post.comments} comments`}
                  {metric === "saves" && `${post.saves} saves`}
                </p>
              </div>
              <div className="text-sm font-medium text-gray-900">
                #{index + 1}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
