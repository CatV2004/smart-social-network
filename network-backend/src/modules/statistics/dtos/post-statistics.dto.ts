import { ApiProperty } from '@nestjs/swagger';

export class PostStatisticsDto {
    @ApiProperty({ description: 'Tổng số bài viết' })
    totalPosts: number;

    @ApiProperty({ description: 'Tổng số bài viết đã xóa mềm' })
    totalDeleted: number;

    @ApiProperty({ description: 'Thống kê số bài viết theo ngày' })
    postsByDay: { date: string; count: number }[];

    @ApiProperty({ description: 'Top 10 bài viết nhiều like nhất' })
    topLiked: { id: string; content: string; likes: number; media?: string | null }[];

    @ApiProperty({ description: 'Top 10 bài viết nhiều comment nhất' })
    topCommented: { id: string; content: string; comments: number; media?: string | null }[];

    @ApiProperty({ description: 'Thống kê số bài viết theo giới tính tác giả' })
    postsByGender: { gender: string; count: number }[];

    @ApiProperty({ description: 'Thống kê số bài viết theo nhóm tuổi' })
    postsByAgeGroup: { ageGroup: string; count: number }[];

    @ApiProperty({ description: 'Top 10 bài viết được lưu nhiều nhất' })
    mostSaved: { id: string; content: string; saves: number; media?: string | null }[];
}
