import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { AlertTriangle, Loader2, Lock, Trash2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface ClearHistoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function ClearHistoryDialog({ open, onOpenChange, onSuccess }: ClearHistoryDialogProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleClearHistory = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!password.trim()) {
      toast({
        title: 'Password Required',
        description: 'Please enter your password to confirm deletion.',
        variant: 'destructive',
      });
      return;
    }

    if (!user?.email) {
      toast({
        title: 'Error',
        description: 'User session not found. Please re-authenticate.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);

    try {
      // Verify password by attempting to sign in
      const { error: authError } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: password,
      });

      if (authError) {
        toast({
          title: 'Authentication Failed',
          description: 'Incorrect password. Deletion cancelled.',
          variant: 'destructive',
        });
        setIsLoading(false);
        return;
      }

      // Password verified, proceed with deletion
      const { error: deleteError } = await supabase
        .from('scan_reports')
        .delete()
        .eq('user_id', user.id);

      if (deleteError) {
        throw deleteError;
      }

      toast({
        title: 'History Cleared',
        description: 'All scan reports have been permanently deleted.',
      });

      setPassword('');
      onOpenChange(false);
      onSuccess();

    } catch (error: any) {
      console.error('Error clearing history:', error);
      toast({
        title: 'Deletion Failed',
        description: error.message || 'Failed to clear scan history.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="w-5 h-5" />
            Clear All Scan History
          </DialogTitle>
          <DialogDescription>
            This action is permanent and cannot be undone. All scan reports and 
            associated data will be permanently deleted.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleClearHistory}>
          <div className="space-y-4 py-4">
            <div className="flex items-start gap-3 p-3 rounded-lg bg-destructive/10 border border-destructive/30">
              <AlertTriangle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-destructive">⚠️ DESTRUCTIVE ACTION</p>
                <p className="text-muted-foreground">
                  Re-enter your password to confirm you want to permanently 
                  delete all scan history records.
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirm-password" className="flex items-center gap-2">
                <Lock className="w-4 h-4" />
                Confirm Password
              </Label>
              <Input
                id="confirm-password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                autoComplete="current-password"
                required
              />
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="destructive"
              disabled={isLoading || !password.trim()}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete All Reports
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
