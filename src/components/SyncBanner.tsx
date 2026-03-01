import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const SyncBanner = () => {
  const [pendingCount, setPendingCount] = useState<number>(0);
  const [lastSyncAt, setLastSyncAt] = useState<string | null>(null);
  const [lastError, setLastError] = useState<string | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const { toast } = useToast();

  const refresh = () => {
    try {
      const pendingRaw = localStorage.getItem('pendingBookings') || '[]';
      const parsed = JSON.parse(pendingRaw) as Array<any>;
      setPendingCount(parsed.length);
    } catch (e) {
      setPendingCount(0);
    }
    setLastSyncAt(localStorage.getItem('lastSyncAt'));
    setLastError(localStorage.getItem('lastSyncError'));
  };

  useEffect(() => {
    refresh();
    const handler = () => refresh();
    window.addEventListener('storage', handler);
    window.addEventListener('pendingSync:updated', handler as EventListener);
    return () => {
      window.removeEventListener('storage', handler);
      window.removeEventListener('pendingSync:updated', handler as EventListener);
    };
  }, []);

  const syncNow = async () => {
    setIsSyncing(true);
    try {
      const raw = localStorage.getItem('pendingBookings') || '[]';
      const pending = JSON.parse(raw) as Array<any>;
      if (!pending || pending.length === 0) {
        toast({ title: 'Nothing to sync', description: 'No pending bookings.' });
        setIsSyncing(false);
        return;
      }

      const payload = pending.map((b) => {
        const copy = { ...b };
        delete copy._savedAt;
        delete copy._status;
        return copy;
      });

      const { error } = await supabase.from('bookings').insert(payload);
      if (error) throw error;

      const now = new Date().toISOString();
      localStorage.removeItem('pendingBookings');
      localStorage.setItem('lastSyncAt', now);
      setPendingCount(0);
      setLastSyncAt(now);
      window.dispatchEvent(new CustomEvent('pendingSync:updated', { detail: { lastSyncAt: now, pending: 0 } }));
      toast({ title: 'Synced', description: `Synced ${payload.length} bookings.` });
    } catch (err) {
      console.error('Manual sync failed', err);
      const now = new Date().toISOString();
      localStorage.setItem('lastSyncError', String(err));
      localStorage.setItem('lastSyncAttempt', now);
      setLastError(String(err));
      window.dispatchEvent(new CustomEvent('pendingSync:updated', { detail: { lastSyncError: String(err) } }));
      toast({ title: 'Sync failed', description: 'Could not sync pending bookings. Check network/credentials.', variant: 'destructive' });
    } finally {
      setIsSyncing(false);
    }
  };

  if (pendingCount === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 w-[360px]">
      <div className="bg-yellow-50 border border-yellow-200 text-yellow-900 rounded-lg p-4 shadow">
        <div className="flex items-center justify-between">
          <div>
            <div className="font-semibold">Pending bookings: {pendingCount}</div>
            <div className="text-xs text-muted-foreground">
              {lastSyncAt ? `Last sync: ${new Date(lastSyncAt).toLocaleString()}` : 'No successful sync yet.'}
              {lastError && <div className="text-xxs text-red-600">Last error: {String(lastError).slice(0,100)}</div>}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button size="sm" onClick={() => window.location.assign('/admin')}>Manage</Button>
            <Button size="sm" onClick={syncNow} disabled={isSyncing}>{isSyncing ? 'Syncing...' : 'Sync Now'}</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SyncBanner;
