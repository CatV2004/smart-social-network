export interface Story {
  id: number;
  username: string;
  avatarUrl: string;
}

export interface Post {
  id: number;
  username: string;
  avatarUrl: string;
  imageUrl: string;
  caption: string;
  likes: number;
  commentsCount: number;
}

export const mockStories: Story[] = [
  { id: 1, username: 'nvanA', avatarUrl: '/images/story_1.jpg' },
  { id: 2, username: 'nvanB', avatarUrl: '/images/story_2.jpg' },
  { id: 3, username: 'nvanC', avatarUrl: '/images/story_3.jpg' },
  { id: 4, username: 'nvanD', avatarUrl: '/images/story_4.jpg' },
  { id: 5, username: 'nvanE', avatarUrl: '/images/story_5.jpg' },
  { id: 6, username: 'nvanF', avatarUrl: '/images/story_5.jpg' },
  { id: 7, username: 'nvanG', avatarUrl: '/images/story_5.jpg' },
  { id: 8, username: 'nvanH', avatarUrl: '/images/story_5.jpg' },
  { id: 9, username: 'nvanI', avatarUrl: '/images/story_5.jpg' },
  { id: 10, username: 'nvanK', avatarUrl: '/images/story_5.jpg' },
  { id: 11, username: 'nvanL', avatarUrl: '/images/story_5.jpg' },
  { id: 12, username: 'nvanM', avatarUrl: '/images/story_5.jpg' },
];

export const mockPosts: Post[] = [
  {
    id: 1,
    username: 't1.valorant',
    avatarUrl: '/images/t1_avatar.jpg',
    imageUrl: '/images/post_image_1.jpg',
    caption: 'VALORANT 챌린저스 코리아의 밤 ALL-STAR 선수들과 함께!',
    likes: 13754,
    commentsCount: 51,
  },
  // Thêm các bài post khác tại đây...
];

export const mockSuggestions = [
  {
    username: 'Test1',
    note: 'Gợi ý cho bạn',
  },
  {
    username: 'Test2',
    note: 'Có whp._oaht_ và 12 người khác theo dõi',
  },
  {
    username: 'Test3',
    note: 'Đang theo dõi _thnnhggg',
  },
  {
    username: 'Test4',
    note: 'Có thanchou.cvt theo dõi',
  },
  {
    username: 'Test5',
    note: 'Có neti.ber và 5 người khác theo dõi',
  },
];
