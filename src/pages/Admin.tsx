import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Users, UserPlus, Clock, BarChart3, LogOut, Trash2, Search, 
  Menu, X, TrendingUp, Activity, Calendar, ChevronRight, CalendarDays, Pencil, Save
} from 'lucide-react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { isAdminLoggedIn, adminLogin, adminLogout, getUsers, addUser, updateUser, deleteUser, getDashboardStats, getTodayAttendance, getAttendanceByDateRange } from '@/lib/store';
import { User, MembershipType } from '@/lib/types';
import logo from '@/assets/power-pump-logo.jpeg';

const Admin = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [users, setUsers] = useState<User[]>([]);
  const [stats, setStats] = useState(getDashboardStats());
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dateRange, setDateRange] = useState({
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  });
  const [formData, setFormData] = useState<{ 
    name: string; phone: string; address: string; email: string; 
    membershipType: MembershipType; startDate: string; endDate: string; 
    status: 'active' | 'expired' | 'suspended' 
  }>({ 
    name: '', phone: '', address: '', email: '', membershipType: 'basic', 
    startDate: '', endDate: '', status: 'active' 
  });

  useEffect(() => {
    setIsLoggedIn(isAdminLoggedIn());
    refreshData();
  }, []);

  const refreshData = () => {
    setUsers(getUsers());
    setStats(getDashboardStats());
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminLogin(email, password)) {
      setIsLoggedIn(true);
      setError('');
    } else {
      setError('Invalid credentials');
    }
  };

  const handleLogout = () => {
    adminLogout();
    setIsLoggedIn(false);
  };

  const handleAddUser = () => {
    addUser(formData);
    setIsAddOpen(false);
    setFormData({ name: '', phone: '', address: '', email: '', membershipType: 'basic', startDate: '', endDate: '', status: 'active' });
    refreshData();
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      phone: user.phone,
      address: user.address || '',
      email: user.email || '',
      membershipType: user.membershipType,
      startDate: user.startDate,
      endDate: user.endDate,
      status: user.status
    });
    setIsEditOpen(true);
  };

  const handleUpdateUser = () => {
    if (editingUser) {
      updateUser(editingUser.id, formData);
      setEditingUser(null);
      setIsEditOpen(false);
      setFormData({ name: '', phone: '', address: '', email: '', membershipType: 'basic', startDate: '', endDate: '', status: 'active' });
      refreshData();
    }
  };

  const handleDeleteUser = (id: string) => {
    if (confirm('Are you sure you want to delete this user?')) {
      deleteUser(id);
      refreshData();
    }
  };

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.uniqueGymId.includes(searchTerm.toUpperCase())
  );

  const navItems = [
    { id: 'dashboard', icon: BarChart3, label: 'Dashboard' },
    { id: 'users', icon: Users, label: 'Members' },
    { id: 'attendance', icon: Clock, label: 'Attendance' }
  ];

  const statCards = [
    { label: 'Total Members', value: stats.totalUsers, icon: Users, color: 'from-blue-500 to-blue-600', bgColor: 'bg-blue-500/10' },
    { label: 'Active Members', value: stats.activeUsers, icon: Activity, color: 'from-green-500 to-green-600', bgColor: 'bg-green-500/10' },
    { label: 'Today Check-ins', value: stats.todayEntries, icon: TrendingUp, color: 'from-amber-500 to-orange-500', bgColor: 'bg-amber-500/10' },
    { label: 'Currently In Gym', value: stats.currentlyInGym, icon: Clock, color: 'from-primary to-red-500', bgColor: 'bg-primary/10' }
  ];

  // Login Screen
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20 flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <div className="flex flex-col items-center gap-3 mb-8">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl" />
              <img src={logo} alt="Power Pump" className="relative h-20 w-20 rounded-full object-cover border-2 border-primary/50" />
            </div>
            <span className="font-display text-3xl tracking-wider">POWER PUMP</span>
            <span className="text-muted-foreground text-sm">Admin Portal</span>
          </div>
          
          <div className="bg-card/80 backdrop-blur-sm border border-border/50 rounded-2xl p-8 shadow-2xl">
            <h1 className="font-display text-xl text-center mb-6 tracking-wide">SECURE LOGIN</h1>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs text-muted-foreground uppercase tracking-wide">Email</label>
                <Input 
                  placeholder="admin@powerpump.com" 
                  type="email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  className="bg-background/50 border-border/50 h-11"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs text-muted-foreground uppercase tracking-wide">Password</label>
                <Input 
                  placeholder="••••••••" 
                  type="password" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  className="bg-background/50 border-border/50 h-11"
                />
              </div>
              {error && (
                <motion.p 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }}
                  className="text-destructive text-sm bg-destructive/10 p-2 rounded-lg text-center"
                >
                  {error}
                </motion.p>
              )}
              <Button type="submit" className="w-full h-11 bg-primary hover:bg-primary/90 font-medium">
                Sign In
              </Button>
            </form>
            <div className="mt-6 pt-4 border-t border-border/30">
              <p className="text-xs text-muted-foreground text-center">
                Demo credentials: <span className="text-foreground">admin@powerpump.com</span> / <span className="text-foreground">admin123</span>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/10 flex">
      {/* Sidebar - Desktop */}
      <aside className="w-64 bg-card/50 backdrop-blur-sm border-r border-border/50 hidden lg:flex flex-col">
        <div className="p-6 border-b border-border/50">
          <div className="flex items-center gap-3">
            <img src={logo} alt="Power Pump" className="h-10 w-10 rounded-full object-cover border border-primary/30" />
            <div>
              <span className="font-display text-lg block">POWER PUMP</span>
              <span className="text-xs text-muted-foreground">Admin Panel</span>
            </div>
          </div>
        </div>
        
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map(item => (
            <button 
              key={item.id} 
              onClick={() => setActiveTab(item.id)} 
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                activeTab === item.id 
                  ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20' 
                  : 'text-muted-foreground hover:bg-secondary/50 hover:text-foreground'
              }`}
            >
              <item.icon className="h-5 w-5" />
              <span className="font-medium text-sm">{item.label}</span>
              <ChevronRight className={`h-4 w-4 ml-auto transition-transform ${activeTab === item.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-50'}`} />
            </button>
          ))}
        </nav>
        
        <div className="p-4 border-t border-border/50">
          <Button 
            variant="ghost" 
            onClick={handleLogout} 
            className="w-full justify-start text-muted-foreground hover:text-foreground hover:bg-secondary/50"
          >
            <LogOut className="mr-3 h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 bg-card/90 backdrop-blur-sm border-b border-border/50 z-50 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src={logo} alt="Power Pump" className="h-8 w-8 rounded-full object-cover" />
            <span className="font-display text-lg">POWER PUMP</span>
          </div>
          <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
        
        {mobileMenuOpen && (
          <motion.nav 
            initial={{ opacity: 0, y: -10 }} 
            animate={{ opacity: 1, y: 0 }}
            className="mt-3 pb-2 space-y-1"
          >
            {navItems.map(item => (
              <button 
                key={item.id} 
                onClick={() => { setActiveTab(item.id); setMobileMenuOpen(false); }} 
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg ${
                  activeTab === item.id ? 'bg-primary text-primary-foreground' : 'text-muted-foreground'
                }`}
              >
                <item.icon className="h-4 w-4" />
                <span className="text-sm">{item.label}</span>
              </button>
            ))}
            <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2.5 text-muted-foreground">
              <LogOut className="h-4 w-4" />
              <span className="text-sm">Sign Out</span>
            </button>
          </motion.nav>
        )}
      </div>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-auto lg:pt-8 pt-20">
        {activeTab === 'dashboard' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
            <div className="mb-8">
              <h1 className="font-display text-2xl md:text-3xl tracking-wide">Dashboard</h1>
              <p className="text-muted-foreground text-sm mt-1">Welcome back! Here's your gym overview.</p>
            </div>
            
            <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6">
              {statCards.map((s, i) => (
                <motion.div 
                  key={s.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-card/60 backdrop-blur-sm border border-border/50 rounded-2xl p-5 hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className={`p-2.5 rounded-xl ${s.bgColor}`}>
                      <s.icon className={`h-5 w-5 bg-gradient-to-r ${s.color} bg-clip-text text-transparent`} style={{ color: s.color.includes('primary') ? 'hsl(var(--primary))' : undefined }} />
                    </div>
                  </div>
                  <p className="text-muted-foreground text-xs uppercase tracking-wide mb-1">{s.label}</p>
                  <p className="font-display text-3xl md:text-4xl">{s.value}</p>
                </motion.div>
              ))}
            </div>

            {/* Quick Actions */}
            <div className="mt-8 grid md:grid-cols-2 gap-4">
              <div className="bg-card/60 backdrop-blur-sm border border-border/50 rounded-2xl p-5">
                <div className="flex items-center gap-2 mb-4">
                  <Calendar className="h-4 w-4 text-primary" />
                  <h3 className="font-medium text-sm">Recent Activity</h3>
                </div>
                <div className="space-y-3">
                  {getTodayAttendance().slice(0, 4).map(record => (
                    <div key={record.id} className="flex items-center justify-between py-2 border-b border-border/30 last:border-0">
                      <div>
                        <p className="text-sm font-medium">{record.userName}</p>
                        <p className="text-xs text-muted-foreground">{record.uniqueGymId}</p>
                      </div>
                      <Badge className={!record.clockOut ? 'bg-green-500/20 text-green-400 border-0' : 'bg-muted text-muted-foreground border-0'}>
                        {record.clockOut ? 'Left' : 'In Gym'}
                      </Badge>
                    </div>
                  ))}
                  {getTodayAttendance().length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-4">No check-ins today</p>
                  )}
                </div>
              </div>
              
              <div className="bg-card/60 backdrop-blur-sm border border-border/50 rounded-2xl p-5">
                <div className="flex items-center gap-2 mb-4">
                  <Users className="h-4 w-4 text-primary" />
                  <h3 className="font-medium text-sm">Quick Stats</h3>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Occupancy Rate</span>
                    <span className="text-sm font-medium">{stats.totalUsers > 0 ? Math.round((stats.currentlyInGym / stats.totalUsers) * 100) : 0}%</span>
                  </div>
                  <div className="h-2 bg-secondary rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-primary to-red-500 rounded-full transition-all"
                      style={{ width: `${stats.totalUsers > 0 ? (stats.currentlyInGym / stats.totalUsers) * 100 : 0}%` }}
                    />
                  </div>
                  <div className="pt-2 grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-secondary/30 rounded-xl">
                      <p className="font-display text-xl">{stats.activeUsers}</p>
                      <p className="text-xs text-muted-foreground">Active</p>
                    </div>
                    <div className="text-center p-3 bg-secondary/30 rounded-xl">
                      <p className="font-display text-xl">{stats.totalUsers - stats.activeUsers}</p>
                      <p className="text-xs text-muted-foreground">Expired</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'users' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div>
                <h1 className="font-display text-2xl md:text-3xl tracking-wide">Members</h1>
                <p className="text-muted-foreground text-sm mt-1">{users.length} total members registered</p>
              </div>
              <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20">
                    <UserPlus className="mr-2 h-4 w-4" />Add Member
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-card/95 backdrop-blur-sm border-border/50 max-w-2xl">
                  <DialogHeader>
                    <DialogTitle className="font-display text-xl">Add New Member</DialogTitle>
                    <p className="text-sm text-muted-foreground">Fill in the member details below</p>
                  </DialogHeader>
                  <div className="space-y-6 mt-4">
                    {/* Personal Information Section */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 pb-2 border-b border-border/50">
                        <Users className="h-4 w-4 text-primary" />
                        <h3 className="text-sm font-medium">Personal Information</h3>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-xs text-muted-foreground uppercase tracking-wide">Full Name *</label>
                          <Input 
                            placeholder="John Doe" 
                            value={formData.name} 
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })} 
                            className="bg-background/50 h-10" 
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs text-muted-foreground uppercase tracking-wide">Phone Number *</label>
                          <Input 
                            placeholder="+91 98765 43210" 
                            value={formData.phone} 
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })} 
                            className="bg-background/50 h-10" 
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-xs text-muted-foreground uppercase tracking-wide">Email Address</label>
                          <Input 
                            placeholder="john@example.com" 
                            type="email"
                            value={formData.email} 
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })} 
                            className="bg-background/50 h-10" 
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs text-muted-foreground uppercase tracking-wide">Address</label>
                          <Input 
                            placeholder="123 Main St, City" 
                            value={formData.address} 
                            onChange={(e) => setFormData({ ...formData, address: e.target.value })} 
                            className="bg-background/50 h-10" 
                          />
                        </div>
                      </div>
                    </div>

                    {/* Membership Details Section */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 pb-2 border-b border-border/50">
                        <Calendar className="h-4 w-4 text-primary" />
                        <h3 className="text-sm font-medium">Membership Details</h3>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <label className="text-xs text-muted-foreground uppercase tracking-wide">Membership Plan *</label>
                          <Select value={formData.membershipType} onValueChange={(v) => setFormData({ ...formData, membershipType: v as MembershipType })}>
                            <SelectTrigger className="bg-background/50 h-10"><SelectValue /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="basic">Basic</SelectItem>
                              <SelectItem value="premium">Premium</SelectItem>
                              <SelectItem value="elite">Elite</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs text-muted-foreground uppercase tracking-wide">Start Date *</label>
                          <Input 
                            type="date" 
                            value={formData.startDate} 
                            onChange={(e) => setFormData({ ...formData, startDate: e.target.value })} 
                            className="bg-background/50 h-10" 
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs text-muted-foreground uppercase tracking-wide">End Date *</label>
                          <Input 
                            type="date" 
                            value={formData.endDate} 
                            onChange={(e) => setFormData({ ...formData, endDate: e.target.value })} 
                            className="bg-background/50 h-10" 
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-3 pt-2">
                      <Button 
                        variant="outline" 
                        onClick={() => setIsAddOpen(false)} 
                        className="flex-1 border-border/50"
                      >
                        Cancel
                      </Button>
                      <Button 
                        onClick={handleAddUser} 
                        className="flex-1 bg-primary hover:bg-primary/90"
                        disabled={!formData.name || !formData.phone || !formData.startDate || !formData.endDate}
                      >
                        <UserPlus className="mr-2 h-4 w-4" />
                        Add Member
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>

              {/* Edit Member Dialog */}
              <Dialog open={isEditOpen} onOpenChange={(open) => {
                setIsEditOpen(open);
                if (!open) {
                  setEditingUser(null);
                  setFormData({ name: '', phone: '', address: '', email: '', membershipType: 'basic', startDate: '', endDate: '', status: 'active' });
                }
              }}>
                <DialogContent className="bg-card/95 backdrop-blur-sm border-border/50 max-w-2xl">
                  <DialogHeader>
                    <DialogTitle className="font-display text-xl">Edit Member</DialogTitle>
                    <p className="text-sm text-muted-foreground">
                      {editingUser && `Editing ${editingUser.name} (${editingUser.uniqueGymId})`}
                    </p>
                  </DialogHeader>
                  <div className="space-y-6 mt-4">
                    {/* Personal Information Section */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 pb-2 border-b border-border/50">
                        <Users className="h-4 w-4 text-primary" />
                        <h3 className="text-sm font-medium">Personal Information</h3>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-xs text-muted-foreground uppercase tracking-wide">Full Name *</label>
                          <Input 
                            placeholder="John Doe" 
                            value={formData.name} 
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })} 
                            className="bg-background/50 h-10" 
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs text-muted-foreground uppercase tracking-wide">Phone Number *</label>
                          <Input 
                            placeholder="+91 98765 43210" 
                            value={formData.phone} 
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })} 
                            className="bg-background/50 h-10" 
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-xs text-muted-foreground uppercase tracking-wide">Email Address</label>
                          <Input 
                            placeholder="john@example.com" 
                            type="email"
                            value={formData.email} 
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })} 
                            className="bg-background/50 h-10" 
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs text-muted-foreground uppercase tracking-wide">Address</label>
                          <Input 
                            placeholder="123 Main St, City" 
                            value={formData.address} 
                            onChange={(e) => setFormData({ ...formData, address: e.target.value })} 
                            className="bg-background/50 h-10" 
                          />
                        </div>
                      </div>
                    </div>

                    {/* Membership Details Section */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 pb-2 border-b border-border/50">
                        <Calendar className="h-4 w-4 text-primary" />
                        <h3 className="text-sm font-medium">Membership Details</h3>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-xs text-muted-foreground uppercase tracking-wide">Membership Plan *</label>
                          <Select value={formData.membershipType} onValueChange={(v) => setFormData({ ...formData, membershipType: v as MembershipType })}>
                            <SelectTrigger className="bg-background/50 h-10"><SelectValue /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="basic">Basic</SelectItem>
                              <SelectItem value="premium">Premium</SelectItem>
                              <SelectItem value="elite">Elite</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs text-muted-foreground uppercase tracking-wide">Status</label>
                          <Select value={formData.status} onValueChange={(v) => setFormData({ ...formData, status: v as 'active' | 'expired' | 'suspended' })}>
                            <SelectTrigger className="bg-background/50 h-10"><SelectValue /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="active">Active</SelectItem>
                              <SelectItem value="expired">Expired</SelectItem>
                              <SelectItem value="suspended">Suspended</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-xs text-muted-foreground uppercase tracking-wide">Start Date *</label>
                          <Input 
                            type="date" 
                            value={formData.startDate} 
                            onChange={(e) => setFormData({ ...formData, startDate: e.target.value })} 
                            className="bg-background/50 h-10" 
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs text-muted-foreground uppercase tracking-wide">End Date *</label>
                          <Input 
                            type="date" 
                            value={formData.endDate} 
                            onChange={(e) => setFormData({ ...formData, endDate: e.target.value })} 
                            className="bg-background/50 h-10" 
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-3 pt-2">
                      <Button 
                        variant="outline" 
                        onClick={() => setIsEditOpen(false)} 
                        className="flex-1 border-border/50"
                      >
                        Cancel
                      </Button>
                      <Button 
                        onClick={handleUpdateUser} 
                        className="flex-1 bg-primary hover:bg-primary/90"
                        disabled={!formData.name || !formData.phone || !formData.startDate || !formData.endDate}
                      >
                        <Save className="mr-2 h-4 w-4" />
                        Save Changes
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
            
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search by name or Gym ID..." 
                value={searchTerm} 
                onChange={(e) => setSearchTerm(e.target.value)} 
                className="pl-10 bg-card/60 border-border/50 h-11"
              />
            </div>
            
            <div className="bg-card/60 backdrop-blur-sm border border-border/50 rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-border/50 hover:bg-transparent bg-secondary/20">
                      <TableHead className="text-xs uppercase tracking-wide text-muted-foreground font-semibold py-4">Gym ID</TableHead>
                      <TableHead className="text-xs uppercase tracking-wide text-muted-foreground font-semibold py-4">Member</TableHead>
                      <TableHead className="text-xs uppercase tracking-wide text-muted-foreground font-semibold py-4">Contact</TableHead>
                      <TableHead className="text-xs uppercase tracking-wide text-muted-foreground font-semibold py-4 hidden lg:table-cell">Address</TableHead>
                      <TableHead className="text-xs uppercase tracking-wide text-muted-foreground font-semibold py-4">Membership</TableHead>
                      <TableHead className="text-xs uppercase tracking-wide text-muted-foreground font-semibold py-4 text-center">Status</TableHead>
                      <TableHead className="text-xs uppercase tracking-wide text-muted-foreground font-semibold py-4 w-16"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.map(user => (
                      <TableRow key={user.id} className="border-border/30 hover:bg-secondary/20 transition-colors">
                        <TableCell className="py-4">
                          <span className="font-mono text-primary text-sm bg-primary/10 px-2 py-1 rounded">
                            {user.uniqueGymId}
                          </span>
                        </TableCell>
                        <TableCell className="py-4">
                          <div className="flex items-center gap-3">
                            <div className="h-9 w-9 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center border border-primary/20">
                              <span className="text-sm font-semibold text-primary">
                                {user.name.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <div>
                              <p className="font-medium text-sm">{user.name}</p>
                              <p className="text-xs text-muted-foreground">
                                {format(new Date(user.startDate), 'MMM d, yyyy')} - {format(new Date(user.endDate), 'MMM d, yyyy')}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="py-4">
                          <div className="space-y-1">
                            <p className="text-sm">{user.phone}</p>
                            <p className="text-xs text-muted-foreground">{user.email || '-'}</p>
                          </div>
                        </TableCell>
                        <TableCell className="py-4 hidden lg:table-cell">
                          <p className="text-sm text-muted-foreground max-w-[200px] truncate">
                            {user.address || '-'}
                          </p>
                        </TableCell>
                        <TableCell className="py-4">
                          <Badge 
                            variant="outline" 
                            className={`capitalize text-xs font-medium ${
                              user.membershipType === 'elite' 
                                ? 'border-amber-500/50 text-amber-400 bg-amber-500/10' 
                                : user.membershipType === 'premium' 
                                  ? 'border-blue-500/50 text-blue-400 bg-blue-500/10' 
                                  : 'border-border/50 text-muted-foreground'
                            }`}
                          >
                            {user.membershipType}
                          </Badge>
                        </TableCell>
                        <TableCell className="py-4 text-center">
                          <Badge 
                            className={`text-xs border-0 ${
                              user.status === 'active' 
                                ? 'bg-green-500/20 text-green-400' 
                                : 'bg-destructive/20 text-destructive'
                            }`}
                          >
                            {user.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="py-4">
                          <div className="flex items-center gap-1">
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => handleEditUser(user)}
                              className="h-8 w-8 text-muted-foreground hover:text-primary hover:bg-primary/10"
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => handleDeleteUser(user.id)}
                              className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                    {filteredUsers.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-12 text-muted-foreground">
                          <div className="flex flex-col items-center gap-2">
                            <Users className="h-8 w-8 text-muted-foreground/50" />
                            <p>No members found</p>
                            <p className="text-xs">Try adjusting your search or add a new member</p>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'attendance' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div>
                <h1 className="font-display text-2xl md:text-3xl tracking-wide">Attendance</h1>
                <p className="text-muted-foreground text-sm mt-1">
                  {dateRange.startDate === dateRange.endDate 
                    ? `Records for ${format(new Date(dateRange.startDate), 'MMM d, yyyy')}`
                    : `Records from ${format(new Date(dateRange.startDate), 'MMM d')} to ${format(new Date(dateRange.endDate), 'MMM d, yyyy')}`
                  }
                </p>
              </div>
            </div>

            {/* Date Range Filter */}
            <div className="bg-card/60 backdrop-blur-sm border border-border/50 rounded-2xl p-4 mb-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <CalendarDays className="h-4 w-4" />
                  <span className="text-xs uppercase tracking-wide">Filter by Date</span>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <div className="flex items-center gap-2">
                    <label className="text-xs text-muted-foreground">From</label>
                    <Input 
                      type="date" 
                      value={dateRange.startDate}
                      onChange={(e) => setDateRange(prev => ({ ...prev, startDate: e.target.value }))}
                      className="bg-background/50 border-border/50 h-9 w-[140px] text-sm"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="text-xs text-muted-foreground">To</label>
                    <Input 
                      type="date" 
                      value={dateRange.endDate}
                      onChange={(e) => setDateRange(prev => ({ ...prev, endDate: e.target.value }))}
                      className="bg-background/50 border-border/50 h-9 w-[140px] text-sm"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        const today = new Date().toISOString().split('T')[0];
                        setDateRange({ startDate: today, endDate: today });
                      }}
                      className="text-xs h-9"
                    >
                      Today
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        const today = new Date();
                        const weekAgo = new Date(today);
                        weekAgo.setDate(today.getDate() - 7);
                        setDateRange({ 
                          startDate: weekAgo.toISOString().split('T')[0], 
                          endDate: today.toISOString().split('T')[0] 
                        });
                      }}
                      className="text-xs h-9"
                    >
                      Last 7 Days
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        const today = new Date();
                        const monthAgo = new Date(today);
                        monthAgo.setDate(today.getDate() - 30);
                        setDateRange({ 
                          startDate: monthAgo.toISOString().split('T')[0], 
                          endDate: today.toISOString().split('T')[0] 
                        });
                      }}
                      className="text-xs h-9"
                    >
                      Last 30 Days
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-card/60 backdrop-blur-sm border border-border/50 rounded-2xl overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="border-border/50 hover:bg-transparent">
                    <TableHead className="text-xs uppercase tracking-wide text-muted-foreground">Date</TableHead>
                    <TableHead className="text-xs uppercase tracking-wide text-muted-foreground">Gym ID</TableHead>
                    <TableHead className="text-xs uppercase tracking-wide text-muted-foreground">Name</TableHead>
                    <TableHead className="text-xs uppercase tracking-wide text-muted-foreground">Check In</TableHead>
                    <TableHead className="text-xs uppercase tracking-wide text-muted-foreground">Check Out</TableHead>
                    <TableHead className="text-xs uppercase tracking-wide text-muted-foreground">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {getAttendanceByDateRange(dateRange.startDate, dateRange.endDate).map(record => (
                    <TableRow key={record.id} className="border-border/30 hover:bg-secondary/20">
                      <TableCell className="text-muted-foreground text-sm">{format(new Date(record.date), 'MMM d')}</TableCell>
                      <TableCell className="font-mono text-primary text-sm">{record.uniqueGymId}</TableCell>
                      <TableCell className="font-medium">{record.userName}</TableCell>
                      <TableCell className="text-muted-foreground">{new Date(record.clockIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</TableCell>
                      <TableCell className="text-muted-foreground">{record.clockOut ? new Date(record.clockOut).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '—'}</TableCell>
                      <TableCell>
                        <Badge className={`text-xs border-0 ${!record.clockOut ? 'bg-green-500/20 text-green-400' : 'bg-muted text-muted-foreground'}`}>
                          {record.clockOut ? 'Checked Out' : 'In Gym'}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                  {getAttendanceByDateRange(dateRange.startDate, dateRange.endDate).length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                        No attendance records for the selected date range
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
};

export default Admin;
