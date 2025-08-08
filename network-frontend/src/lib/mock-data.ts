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
  { id: 1, username: 'turhaaaaa', avatarUrl: '/images/story_1.jpg' },
  { id: 2, username: 'ika.soft', avatarUrl: '/images/story_2.jpg' },
  { id: 3, username: 'hunvkhang', avatarUrl: '/images/story_3.jpg' },
  { id: 4, username: 'quinnje..', avatarUrl: '/images/story_4.jpg' },
  { id: 5, username: 'casio.hcm', avatarUrl: '/images/story_5.jpg' },
  { id: 6, username: 'casio.hcm', avatarUrl: '/images/story_5.jpg' },
  { id: 7, username: 'casio.hcm', avatarUrl: '/images/story_5.jpg' },
  { id: 8, username: 'casio.hcm', avatarUrl: '/images/story_5.jpg' },
  { id: 9, username: 'casio.hcm', avatarUrl: '/images/story_5.jpg' },
  { id: 10, username: 'casio.hcm', avatarUrl: '/images/story_5.jpg' },
  { id: 11, username: 'casio.hcm', avatarUrl: '/images/story_5.jpg' },
  { id: 12, username: 'casio.hcm', avatarUrl: '/images/story_5.jpg' },

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
    username: 'dangthedanh',
    note: 'Gợi ý cho bạn',
  },
  {
    username: 'a._.p',
    note: 'Có whp._oaht_ và 12 người khác theo dõi',
  },
  {
    username: 'justmymems_',
    note: 'Đang theo dõi _thnnhggg',
  },
  {
    username: 'haophan1102',
    note: 'Có thanchou.cvt theo dõi',
  },
  {
    username: 'lvannam_',
    note: 'Có neti.ber và 5 người khác theo dõi',
  },
];
