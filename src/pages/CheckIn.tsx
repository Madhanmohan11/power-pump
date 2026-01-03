import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { LogIn, LogOut, CheckCircle, XCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { clockIn, clockOut, isUserCheckedIn, getUserByGymId } from '@/lib/store';
import logo from '@/assets/power-pump-logo.jpeg';

const CheckIn = () => {
  const [gymId, setGymId] = useState('');
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);
  const [isCheckedIn, setIsCheckedIn] = useState<boolean | null>(null);
  const [userName, setUserName] = useState<string>('');

  useEffect(() => {
    if (gymId.length >= 7) {
      const user = getUserByGymId(gymId);
      if (user) {
        setIsCheckedIn(isUserCheckedIn(gymId));
        setUserName(user.name);
      } else {
        setIsCheckedIn(null);
        setUserName('');
      }
    } else {
      setIsCheckedIn(null);
      setUserName('');
    }
  }, [gymId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const response = isCheckedIn ? clockOut(gymId) : clockIn(gymId);
    setResult(response);
    if (response.success) {
      setGymId('');
      setIsCheckedIn(null);
      setUserName('');
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-sm"
      >
        <Link to="/" className="flex items-center justify-center gap-2 mb-6">
          <img src={logo} alt="Power Pump" className="h-10 w-10 rounded-full object-cover" />
          <span className="font-display text-2xl tracking-wider">POWER PUMP</span>
        </Link>

        <div className="bg-card border border-border rounded-xl p-6 shadow-lg">
          <h1 className="font-display text-xl text-center mb-4 text-muted-foreground">
            {isCheckedIn === null ? 'Enter Your Gym ID' : isCheckedIn ? 'Ready to Leave?' : 'Welcome Back!'}
          </h1>
          
          {userName && (
            <p className="text-center text-sm text-primary mb-4">
              Hello, <span className="font-semibold">{userName}</span>
            </p>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              placeholder="Gym ID (e.g., PP12345)"
              value={gymId}
              onChange={(e) => setGymId(e.target.value.toUpperCase())}
              className="text-center text-base py-5 bg-background"
              required
            />
            
            <Button 
              type="submit" 
              className={`w-full py-5 font-semibold transition-all ${
                isCheckedIn 
                  ? 'bg-destructive hover:bg-destructive/90' 
                  : 'bg-primary hover:bg-primary/90'
              }`}
            >
              {isCheckedIn ? (
                <>
                  <LogOut className="mr-2 h-4 w-4" /> Check Out
                </>
              ) : (
                <>
                  <LogIn className="mr-2 h-4 w-4" /> Check In
                </>
              )}
            </Button>
          </form>

          {result && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`mt-4 p-3 rounded-lg flex items-center gap-2 text-sm ${
                result.success ? 'bg-green-500/10 border border-green-500/30' : 'bg-destructive/10 border border-destructive/30'
              }`}
            >
              {result.success ? (
                <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
              ) : (
                <XCircle className="h-5 w-5 text-destructive flex-shrink-0" />
              )}
              <p className={result.success ? 'text-green-500' : 'text-destructive'}>{result.message}</p>
            </motion.div>
          )}
        </div>

        <p className="text-center text-muted-foreground text-sm mt-4">
          <Link to="/" className="text-primary hover:underline">← Back to Home</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default CheckIn;
