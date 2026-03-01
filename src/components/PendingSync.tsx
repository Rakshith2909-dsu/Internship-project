import { useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

/**
 * Background component that attempts to sync `pendingBookings` from localStorage
 * to the Supabase `bookings` table periodically and when the browser goes online.
 */
const PendingSync = () => {
  const intervalRef = useRef<number | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    let isActive = true;

    const trySync = async () => {
      if (!isActive) return;
      try {
        const raw = localStorage.getItem("pendingBookings") || "[]";
        const pending = JSON.parse(raw) as Array<Record<string, any>>;
        if (!pending || pending.length === 0) return;

        // Prepare payload: remove client-only fields
        const payload = pending.map((b) => {
          const copy: Record<string, any> = { ...b };
          delete copy._savedAt;
          delete copy._status;
          return copy;
        });

        const { error } = await supabase.from("bookings").insert(payload);
        if (error) throw error;

        // Clear pending bookings on successful sync
        localStorage.removeItem("pendingBookings");
        const now = new Date().toISOString();
        localStorage.setItem('lastSyncAt', now);
        localStorage.removeItem('lastSyncError');
        // notify other windows/components
        window.dispatchEvent(new CustomEvent('pendingSync:updated', { detail: { lastSyncAt: now, pending: 0 } }));
        toast({ title: "Pending bookings synced", description: `Synced ${payload.length} bookings.` });
      } catch (err) {
        // Most likely network or credentials issue — keep pending and retry later
        console.warn("PendingSync: sync failed, will retry later", err);
        try {
          const now = new Date().toISOString();
          localStorage.setItem('lastSyncError', String(err));
          localStorage.setItem('lastSyncAttempt', now);
          window.dispatchEvent(new CustomEvent('pendingSync:updated', { detail: { lastSyncError: String(err) } }));
        } catch (e) {
          // ignore
        }
      }
    };

    // Immediate attempt
    trySync();

    // Retry every 30s
    intervalRef.current = window.setInterval(trySync, 30000) as unknown as number;

    // Try when browser reports online
    window.addEventListener("online", trySync);

    return () => {
      isActive = false;
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      window.removeEventListener("online", trySync);
    };
  }, [toast]);

  return null;
};

export default PendingSync;
