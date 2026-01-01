import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Shield, Anchor, Lock, Mail, AlertTriangle, Loader2 } from 'lucide-react';
import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().trim().email({ message: "Invalid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

export default function Auth() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, signIn, isLoading: authLoading } = useAuth();
  const { toast } = useToast();
  
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/scan';

  useEffect(() => {
    if (user && !authLoading) {
      navigate(from, { replace: true });
    }
  }, [user, authLoading, navigate, from]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validation = loginSchema.safeParse({ email, password });
    if (!validation.success) {
      toast({
        title: 'Validation Error',
        description: validation.error.errors[0].message,
        variant: 'destructive',
      });
      return;
    }
    
    setIsLoading(true);
    
    const { error } = await signIn(email, password);
    
    if (error) {
      toast({
        title: 'Authentication Failed',
        description: error.message === 'Invalid login credentials' 
          ? 'Invalid credentials. Access denied.'
          : error.message,
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Access Granted',
        description: 'Welcome, authorized personnel.',
      });
    }
    
    setIsLoading(false);
  };

  if (authLoading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="relative w-20 h-20 mx-auto">
            <div className="absolute inset-0 bg-primary/20 rounded-full animate-pulse" />
            <div className="absolute inset-2 bg-primary/10 rounded-full flex items-center justify-center">
              <Anchor className="w-10 h-10 text-primary" />
            </div>
            <Shield className="w-6 h-6 text-accent absolute -bottom-1 -right-1" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              SMART PORT DEFENCE SYSTEM
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              Cyber Risk Assessment Portal
            </p>
          </div>
        </div>

        {/* Warning Banner */}
        <div className="flex items-start gap-3 p-4 rounded-lg bg-destructive/10 border border-destructive/30">
          <AlertTriangle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="font-bold text-destructive">⚠️ AUTHORIZED PERSONNEL ONLY</p>
            <p className="text-muted-foreground">
              This is a restricted military/defence system. Unauthorized access 
              is strictly prohibited and will be prosecuted under applicable law.
            </p>
          </div>
        </div>

        {/* Login Form */}
        <Card className="border-2 border-primary/20">
          <CardHeader className="space-y-1 text-center border-b bg-muted/50">
            <CardTitle className="text-lg flex items-center justify-center gap-2">
              <Lock className="w-5 h-5" />
              Admin Authentication
            </CardTitle>
            <CardDescription>
              Enter your credentials to access the system
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@defense.gov.in"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading}
                  autoComplete="email"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="flex items-center gap-2">
                  <Lock className="w-4 h-4" />
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading}
                  autoComplete="current-password"
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Authenticating...
                  </>
                ) : (
                  <>
                    <Shield className="w-4 h-4 mr-2" />
                    Authenticate
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center space-y-2">
          <p className="text-xs text-muted-foreground">
            By accessing this system, you agree to comply with all security 
            protocols and data handling procedures.
          </p>
          <p className="text-xs text-muted-foreground/60">
            Contact system administrator for access requests.
          </p>
        </div>
      </div>
    </div>
  );
}
