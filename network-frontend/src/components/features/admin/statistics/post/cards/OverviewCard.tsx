import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PostOverview } from '@/types/statistics';

interface OverviewCardProps {
    overview: PostOverview;
    loading?: boolean;
}

export const OverviewCard = ({ overview, loading }: OverviewCardProps) => {
    if (loading) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Overview</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-2">
                        <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                        <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Overview</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                        <p className="text-2xl font-bold">{overview.totalPosts}</p>
                        <p className="text-sm text-gray-500">Total Posts</p>
                    </div>
                    <div className="text-center">
                        <p className="text-2xl font-bold">{overview.totalDeleted}</p>
                        <p className="text-sm text-gray-500">Deleted Posts</p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};