import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session, AuthError } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

interface UserProfile {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  total_sessions_booked: number;
  is_first_session_used: boolean;
  created_at: string;
  updated_at: string;
}

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string, fullName: string, phone: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Fetch user profile from database
  const fetchProfile = async (userId: string, retries = 3) => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        // If profile doesn't exist (PGRST116 error code)
        if (error.code === 'PGRST116') {
          // Get user details to create profile
          const { data: { user } } = await supabase.auth.getUser();
          
          if (user && retries > 0) {
            console.log('Profile not found, attempting to create...');
            
            // Try to create the profile
            const { data: newProfile, error: createError } = await supabase
              .from('user_profiles')
              .insert({
                id: userId,
                full_name: user.user_metadata?.full_name || '',
                email: user.email || '',
                phone: user.user_metadata?.phone || '',
              })
              .select()
              .single();
            
            if (createError) {
              console.error('Error creating profile:', createError);
              // Wait and retry to fetch
              await new Promise(resolve => setTimeout(resolve, 1000));
              return fetchProfile(userId, retries - 1);
            }
            
            console.log('Profile created:', newProfile);
            setProfile(newProfile);
            return newProfile;
          }
        }
        throw error;
      }
      
      console.log('Profile loaded:', data);
      setProfile(data);
      return data;
    } catch (error) {
      console.error('Error fetching profile:', error);
      return null;
    }
  };

  // Initialize auth state
  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      }
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      } else {
        setProfile(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Sign up new user
  const signUp = async (email: string, password: string, fullName: string, phone: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            phone: phone,
          },
        },
      });

      if (error) throw error;

      if (data.user && data.session) {
        // User is auto-confirmed, wait for profile to be created by trigger
        console.log('Waiting for profile creation...');
        const profileData = await fetchProfile(data.user.id, 5);
        
        if (profileData) {
          toast({
            title: 'Account created!',
            description: 'Welcome to Mindful Wave!',
          });
        } else {
          toast({
            title: 'Account created!',
            description: 'Please refresh the page if you experience issues.',
          });
        }
      } else {
        // Email confirmation required (shouldn't happen if we disabled it)
        toast({
          title: 'Account created!',
          description: 'Please check your email to verify your account.',
        });
      }
    } catch (error) {
      const authError = error as AuthError;
      toast({
        title: 'Sign up failed',
        description: authError.message,
        variant: 'destructive',
      });
      throw error;
    }
  };

  // Sign in existing user
  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      toast({
        title: 'Welcome back!',
        description: 'You have successfully signed in.',
      });
    } catch (error) {
      const authError = error as AuthError;
      toast({
        title: 'Sign in failed',
        description: authError.message,
        variant: 'destructive',
      });
      throw error;
    }
  };

  // Sign out user
  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      setUser(null);
      setProfile(null);
      setSession(null);

      toast({
        title: 'Signed out',
        description: 'You have been successfully signed out.',
      });
    } catch (error) {
      const authError = error as AuthError;
      toast({
        title: 'Sign out failed',
        description: authError.message,
        variant: 'destructive',
      });
      throw error;
    }
  };

  // Reset password
  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;

      toast({
        title: 'Password reset email sent',
        description: 'Please check your email for the password reset link.',
      });
    } catch (error) {
      const authError = error as AuthError;
      toast({
        title: 'Password reset failed',
        description: authError.message,
        variant: 'destructive',
      });
      throw error;
    }
  };

  // Update user profile
  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user) throw new Error('No user logged in');

    try {
      const { error } = await supabase
        .from('user_profiles')
        .update(updates)
        .eq('id', user.id);

      if (error) throw error;

      await fetchProfile(user.id);

      toast({
        title: 'Profile updated',
        description: 'Your profile has been successfully updated.',
      });
    } catch (error) {
      toast({
        title: 'Update failed',
        description: 'Failed to update profile. Please try again.',
        variant: 'destructive',
      });
      throw error;
    }
  };

  // Refresh profile data
  const refreshProfile = async () => {
    if (user) {
      await fetchProfile(user.id);
    }
  };

  const value = {
    user,
    profile,
    session,
    loading,
    signUp,
    signIn,
    signOut,
    resetPassword,
    updateProfile,
    refreshProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
