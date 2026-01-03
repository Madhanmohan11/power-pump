export interface User {
  id: string;
  uniqueGymId: string;
  name: string;
  phone: string;
  address: string;
  email: string;
  membershipType: 'basic' | 'premium' | 'elite';
  startDate: string;
  endDate: string;
  status: 'active' | 'expired' | 'suspended';
  createdAt: string;
}

export interface AttendanceRecord {
  id: string;
  userId: string;
  uniqueGymId: string;
  userName: string;
  clockIn: string;
  clockOut: string | null;
  date: string;
}

export interface AdminCredentials {
  email: string;
  password: string;
}

export interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  todayEntries: number;
  currentlyInGym: number;
}

export type MembershipType = 'basic' | 'premium' | 'elite';

export const MEMBERSHIP_PLANS = {
  basic: { name: 'Basic', price: 29, features: ['Gym Access', 'Locker Room', 'Free Parking'] },
  premium: { name: 'Premium', price: 59, features: ['All Basic Features', 'Group Classes', 'Sauna Access', 'Personal Trainer (2 sessions/mo)'] },
  elite: { name: 'Elite', price: 99, features: ['All Premium Features', 'Unlimited Personal Training', 'Nutrition Coaching', 'Priority Booking', 'Guest Passes'] },
} as const;