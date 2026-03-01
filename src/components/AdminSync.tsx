import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

type PendingBooking = Record<string, any> & { _savedAt?: string; _status?: string };

const AdminSync = () => {
  const [pending, setPending] = useState<PendingBooking[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const raw = localStorage.getItem("pendingBookings") || "[]";
    try {
      const parsed = JSON.parse(raw) as PendingBooking[];
      setPending(parsed);
    } catch (e) {
      setPending([]);
    }
  }, []);

  const persist = (list: PendingBooking[]) => {
    localStorage.setItem("pendingBookings", JSON.stringify(list));
    setPending(list);
  };

  const syncAll = async () => {
    if (pending.length === 0) {
      toast({ title: "Nothing to sync", description: "No pending bookings found." });
      return;
    }
    setIsSyncing(true);
    try {
      // Prepare data by removing client-only fields
      const payload = pending.map((b) => {
        const copy = { ...b };
        delete copy._savedAt;
        delete copy._status;
        return copy;
      });

      const { data, error } = await supabase.from("bookings").insert(payload);
      if (error) throw error;

      // Clear pending on success
      persist([]);
      toast({ title: "Synced", description: `Synced ${payload.length} bookings.` });
    } catch (err) {
      console.error("Sync failed:", err);
      toast({ title: "Sync Failed", description: "Could not sync to Supabase. Check network/credentials.", variant: "destructive" });
    } finally {
      setIsSyncing(false);
    }
  };

  const removeItem = (index: number) => {
    const copy = [...pending];
    copy.splice(index, 1);
    persist(copy);
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <h2 className="text-2xl font-semibold mb-4">Pending Bookings (Local)</h2>
      <Card className="mb-4">
        <CardContent>
          <div className="flex gap-2">
            <Button onClick={syncAll} disabled={isSyncing} className="bg-primary text-primary-foreground">
              {isSyncing ? "Syncing..." : "Sync All to Supabase"}
            </Button>
            <Button onClick={() => { persist([]); toast({ title: 'Cleared', description: 'Cleared pending bookings.' }); }} className="bg-muted/80">
              Clear All
            </Button>
            <Button onClick={() => {
                // create a test pending booking
                const sample = {
                  name: 'Test User',
                  email: 'test@example.com',
                  phone: '0000000000',
                  booking_date: new Date().toISOString().split('T')[0],
                  booking_time: '10:00 AM',
                  session_type: 'pranic',
                  is_first_session: true,
                  amount_paid: 0,
                  payment_status: 'pending-local',
                  _savedAt: new Date().toISOString(),
                  _status: 'pending-local'
                } as PendingBooking;
                const raw = localStorage.getItem('pendingBookings') || '[]';
                const parsed = JSON.parse(raw) as PendingBooking[];
                parsed.push(sample);
                localStorage.setItem('pendingBookings', JSON.stringify(parsed));
                setPending(parsed);
                toast({ title: 'Test booking created', description: 'A test booking was added to pending bookings.' });
              }} className="bg-accent/70">
              Create Test Booking
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-3">
        {pending.length === 0 && (
          <p className="text-muted-foreground">No pending bookings saved locally.</p>
        )}
        {pending.map((b, i) => (
          <Card key={i} className="border-border/50">
            <CardContent>
              <div className="flex justify-between">
                <div>
                  <div className="text-sm text-muted-foreground">{b._savedAt}</div>
                  <div className="font-medium">{b.name} — {b.email}</div>
                  <div className="text-sm">Date: {b.booking_date} Time: {b.booking_time}</div>
                </div>
                <div className="flex flex-col gap-2">
                  <Button size="sm" onClick={() => removeItem(i)} className="bg-destructive/80">Remove</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AdminSync;
