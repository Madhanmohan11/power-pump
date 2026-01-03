import { User, AttendanceRecord, DashboardStats } from './types';

const USERS_KEY = 'gym_users';
const ATTENDANCE_KEY = 'gym_attendance';
const ADMIN_AUTH_KEY = 'gym_admin_auth';

// Demo admin credentials (in production, use proper auth)
const ADMIN_EMAIL = 'admin@powerpump.com';
const ADMIN_PASSWORD = 'admin123';

// Generate unique gym ID
export function generateGymId(): string {
  const prefix = 'PP';
  const number = Math.floor(10000 + Math.random() * 90000);
  return `${prefix}${number}`;
}

// Users
export function getUsers(): User[] {
  const data = localStorage.getItem(USERS_KEY);
  return data ? JSON.parse(data) : [];
}

export function saveUsers(users: User[]): void {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function addUser(user: Omit<User, 'id' | 'uniqueGymId' | 'createdAt'>): User {
  const users = getUsers();
  const newUser: User = {
    ...user,
    id: crypto.randomUUID(),
    uniqueGymId: generateGymId(),
    createdAt: new Date().toISOString(),
  };
  users.push(newUser);
  saveUsers(users);
  return newUser;
}

export function updateUser(id: string, updates: Partial<User>): User | null {
  const users = getUsers();
  const index = users.findIndex(u => u.id === id);
  if (index === -1) return null;
  users[index] = { ...users[index], ...updates };
  saveUsers(users);
  return users[index];
}

export function deleteUser(id: string): boolean {
  const users = getUsers();
  const filtered = users.filter(u => u.id !== id);
  if (filtered.length === users.length) return false;
  saveUsers(filtered);
  return true;
}

export function getUserByGymId(gymId: string): User | null {
  const users = getUsers();
  return users.find(u => u.uniqueGymId === gymId) || null;
}

export function isUserCheckedIn(gymId: string): boolean {
  const records = getAttendanceRecords();
  const today = new Date().toISOString().split('T')[0];
  return records.some(r => r.uniqueGymId === gymId && r.date === today && !r.clockOut);
}

// Attendance
export function getAttendanceRecords(): AttendanceRecord[] {
  const data = localStorage.getItem(ATTENDANCE_KEY);
  return data ? JSON.parse(data) : [];
}

export function saveAttendanceRecords(records: AttendanceRecord[]): void {
  localStorage.setItem(ATTENDANCE_KEY, JSON.stringify(records));
}

export function clockIn(gymId: string): { success: boolean; message: string; record?: AttendanceRecord } {
  const user = getUserByGymId(gymId);
  if (!user) {
    return { success: false, message: 'Invalid Gym ID. User not found.' };
  }

  if (user.status !== 'active') {
    return { success: false, message: `Membership is ${user.status}. Please contact reception.` };
  }

  const records = getAttendanceRecords();
  const today = new Date().toISOString().split('T')[0];
  
  // Check if already clocked in without clocking out
  const activeSession = records.find(
    r => r.uniqueGymId === gymId && r.date === today && !r.clockOut
  );

  if (activeSession) {
    return { success: false, message: 'Already checked in. Please check out first.' };
  }

  const newRecord: AttendanceRecord = {
    id: crypto.randomUUID(),
    userId: user.id,
    uniqueGymId: gymId,
    userName: user.name,
    clockIn: new Date().toISOString(),
    clockOut: null,
    date: today,
  };

  records.push(newRecord);
  saveAttendanceRecords(records);

  return { success: true, message: `Welcome, ${user.name}! Checked in successfully.`, record: newRecord };
}

export function clockOut(gymId: string): { success: boolean; message: string; record?: AttendanceRecord } {
  const user = getUserByGymId(gymId);
  if (!user) {
    return { success: false, message: 'Invalid Gym ID. User not found.' };
  }

  const records = getAttendanceRecords();
  const today = new Date().toISOString().split('T')[0];
  
  const activeSessionIndex = records.findIndex(
    r => r.uniqueGymId === gymId && r.date === today && !r.clockOut
  );

  if (activeSessionIndex === -1) {
    return { success: false, message: 'No active session found. Please check in first.' };
  }

  records[activeSessionIndex].clockOut = new Date().toISOString();
  saveAttendanceRecords(records);

  return { success: true, message: `Goodbye, ${user.name}! Checked out successfully.`, record: records[activeSessionIndex] };
}

export function getUserAttendanceHistory(userId: string): AttendanceRecord[] {
  const records = getAttendanceRecords();
  return records.filter(r => r.userId === userId).sort((a, b) => 
    new Date(b.clockIn).getTime() - new Date(a.clockIn).getTime()
  );
}

export function getTodayAttendance(): AttendanceRecord[] {
  const records = getAttendanceRecords();
  const today = new Date().toISOString().split('T')[0];
  return records.filter(r => r.date === today);
}

export function getAttendanceByDateRange(startDate: string, endDate: string): AttendanceRecord[] {
  const records = getAttendanceRecords();
  return records.filter(r => r.date >= startDate && r.date <= endDate)
    .sort((a, b) => new Date(b.clockIn).getTime() - new Date(a.clockIn).getTime());
}

// Dashboard Stats
export function getDashboardStats(): DashboardStats {
  const users = getUsers();
  const todayRecords = getTodayAttendance();
  
  const activeUsers = users.filter(u => u.status === 'active').length;
  const currentlyInGym = todayRecords.filter(r => !r.clockOut).length;

  return {
    totalUsers: users.length,
    activeUsers,
    todayEntries: todayRecords.length,
    currentlyInGym,
  };
}

// Admin Auth (simple localStorage-based for demo)
export function adminLogin(email: string, password: string): boolean {
  if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
    localStorage.setItem(ADMIN_AUTH_KEY, 'true');
    return true;
  }
  return false;
}

export function adminLogout(): void {
  localStorage.removeItem(ADMIN_AUTH_KEY);
}

export function isAdminLoggedIn(): boolean {
  return localStorage.getItem(ADMIN_AUTH_KEY) === 'true';
}

// Initialize with demo data if empty
export function initializeDemoData(): void {
  const users = getUsers();
  if (users.length === 0) {
    const demoUsers: Omit<User, 'id' | 'uniqueGymId' | 'createdAt'>[] = [
      { name: 'John Smith', phone: '555-0101', address: '123 Main St, Mumbai', email: 'john@email.com', membershipType: 'premium', startDate: '2024-01-01', endDate: '2025-01-01', status: 'active' },
      { name: 'Sarah Johnson', phone: '555-0102', address: '456 Park Ave, Delhi', email: 'sarah@email.com', membershipType: 'elite', startDate: '2024-03-15', endDate: '2025-03-15', status: 'active' },
      { name: 'Mike Williams', phone: '555-0103', address: '789 Oak Rd, Bangalore', email: 'mike@email.com', membershipType: 'basic', startDate: '2024-06-01', endDate: '2024-12-01', status: 'expired' },
    ];
    demoUsers.forEach(addUser);
  }
}