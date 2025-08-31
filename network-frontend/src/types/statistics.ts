// User status statistics
export interface UserStatusStat {
  status: 'PENDING' | 'ACTIVE' | 'SUSPENDED' | 'DELETED';
  count: string;
}

// User verification statistics
export interface UserVerificationStat {
  total: number;
  verified: number;
  percentage: number;
}

// New users statistics by period
export interface NewUsersStat {
  period: string;
  count: string;
}

export type PeriodType = 'day' | 'month' | 'year';

// Gender statistics
export interface GenderStat {
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  count: string;
}

// Age group statistics
export type AgeGroup = '13-17' | '18-24' | '25-34' | '35-44' | '45-54' | '55+';

export interface AgeGroupStat {
  ageGroup: AgeGroup;
  count: string;
}

// Main statistics response types
export interface StatisticsResponse {
  userStatus: UserStatusStat[];
  totalUsers: number;
  userVerification: UserVerificationStat;
  newUsers: NewUsersStat[];
  genderDistribution: GenderStat[];
  ageDistribution: AgeGroupStat[];
}

// Follow statistics types
export interface TopFollower {
  avatar: string;
  username: string;
  profileId: string;
  followers_count: string;
  fullname: string;
}

export interface TopFollowing {
  avatar: string;
  username: string;
  profileId: string;
  following_count: string;
  fullname: string;
}

export interface FollowGrowthStat {
  period: string;
  count: string;
}

export interface MutualRateStat {
  totalFollows: number;
  mutualFollows: number;
  rate: number;
}

export interface FollowStatusDistribution {
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
  count: number;
  percentage: number;
}

export interface RejectedRateStat {
  total: number;
  rejected: number;
  rate: number;
}

// User status statistics
export interface UserStatusStat {
  status: 'PENDING' | 'ACTIVE' | 'SUSPENDED' | 'DELETED';
  count: string;
}

// User verification statistics
export interface UserVerificationStat {
  total: number;
  verified: number;
  percentage: number;
}

// New users statistics by period
export interface NewUsersStat {
  period: string;
  count: string;
}


// Age group statistics
export interface AgeGroupStat {
  ageGroup: AgeGroup;
  count: string;
}

// Main statistics response types
export interface StatisticsResponse {
  userStatus: UserStatusStat[];
  totalUsers: number;
  userVerification: UserVerificationStat;
  newUsers: NewUsersStat[];
  genderDistribution: GenderStat[];
  ageDistribution: AgeGroupStat[];
}

// Follow statistics response types
export interface FollowStatisticsResponse {
  topFollowers: TopFollower[];
  topFollowing: TopFollowing[];
  growth: FollowGrowthStat[];
  mutualRate: MutualRateStat;
  statusDistribution: FollowStatusDistribution[];
  rejectedRate: RejectedRateStat;
}

export interface PostOverview {
  totalPosts: number;
  totalDeleted: number;
}

export interface PostByDay {
  date: string;
  count: string;
}

export interface TopPost {
  id: string;
  content: string;
  likes?: number;
  comments?: number;
  saves?: number;
  media: string | null;
}

export interface PostStatistics {
  overview: PostOverview | null;
  postsByDay: PostByDay[];
  topLiked: TopPost[];
  topCommented: TopPost[];
  mostSaved: TopPost[];
  byGender: GenderStat[];
  byAgeGroup: AgeGroupStat[];
}