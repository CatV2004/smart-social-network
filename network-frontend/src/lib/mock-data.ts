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
  { id: 1, username: 'hoang.nguyen', avatarUrl: 'https://images.pexels.com/photos/12840685/pexels-photo-12840685.jpeg' },
  { id: 2, username: 'anhthu_99', avatarUrl: 'https://images.pexels.com/photos/31932274/pexels-photo-31932274.jpeg' },
  { id: 3, username: 'minhquan', avatarUrl: 'https://images.pexels.com/photos/11750442/pexels-photo-11750442.jpeg' },
  { id: 4, username: 'trang.le', avatarUrl: 'https://images.pexels.com/photos/32263469/pexels-photo-32263469.jpeg' },
  { id: 5, username: 'tuananh.official', avatarUrl: 'https://images.pexels.com/photos/32946073/pexels-photo-32946073.jpeg' },
  { id: 6, username: 'huonggiang', avatarUrl: 'https://images.pexels.com/photos/32798951/pexels-photo-32798951.jpeg' },
  { id: 7, username: 'phongvo', avatarUrl: 'https://images.pexels.com/photos/33598059/pexels-photo-33598059.jpeg' },
  { id: 8, username: 'thao.tran', avatarUrl: 'https://images.pexels.com/photos/32263840/pexels-photo-32263840.jpeg' },
  { id: 9, username: 'baohoang_23', avatarUrl: 'https://images.pexels.com/photos/33673049/pexels-photo-33673049.jpeg' },
  { id: 10, username: 'linhngoc', avatarUrl: 'https://images.pexels.com/photos/27605480/pexels-photo-27605480.jpeg' },
  { id: 11, username: 'datpham', avatarUrl: 'https://images.pexels.com/photos/33366135/pexels-photo-33366135.jpeg' },
  { id: 12, username: 'myanh', avatarUrl: 'https://images.pexels.com/photos/32908788/pexels-photo-32908788.jpeg' },
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
