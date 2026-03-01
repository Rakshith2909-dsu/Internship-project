import React, { useState, useEffect } from 'react';
import { useAuth } from '@/components/Auth/AuthProvider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, User, Mail, Phone, Calendar, Save } from 'lucide-react';
import { format } from 'date-fns';
import Navigation from '@/components/Navigation';
import { EmailPreferencesCard } from '@/components/Dashboard/EmailPreferencesCard';

export const Profile: React.FC = () => {
  const { user, profile, updateProfile, loading: authLoading } = useAuth();
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name);
      setPhone(profile.phone);
    }
  }, [profile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSaving(true);

    try {
      await updateProfile({
        full_name: fullName,
        phone: phone,
      });
      setSuccess('Profile updated successfully!');
      setIsEditing(false);
    } catch (err) {
      setError('Failed to update profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (profile) {
      setFullName(profile.full_name);
      setPhone(profile.phone);
    }
    setIsEditing(false);
    setError('');
    setSuccess('');
  };

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <>
      <Navigation />
      <div className="container mx-auto px-4 pt-24 pb-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">My Profile</h1>
          <p className="text-muted-foreground">Manage your account information</p>
        </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Profile Information Card */}
        <Card>
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
            <CardDescription>Update your personal details</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              
              {success && (
                <Alert className="border-green-500 bg-green-50 text-green-900">
                  <AlertDescription>{success}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="fullName"
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    disabled={!isEditing || saving}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    value={profile?.email || ''}
                    disabled
                    className="pl-10 bg-muted"
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Email cannot be changed
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    disabled={!isEditing || saving}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="flex gap-2">
                {!isEditing ? (
                  <Button
                    type="button"
                    onClick={() => setIsEditing(true)}
                    className="w-full"
                  >
                    Edit Profile
                  </Button>
                ) : (
                  <>
                    <Button
                      type="submit"
                      disabled={saving}
                      className="flex-1"
                    >
                      {saving ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="mr-2 h-4 w-4" />
                          Save Changes
                        </>
                      )}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleCancel}
                      disabled={saving}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                  </>
                )}
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Account Stats Card */}
        <Card>
          <CardHeader>
            <CardTitle>Account Statistics</CardTitle>
            <CardDescription>Your booking history</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                <span className="font-medium">Total Sessions</span>
              </div>
              <span className="text-2xl font-bold">{profile?.total_sessions_booked || 0}</span>
            </div>

            <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
              <div className="flex items-center gap-2">
                <User className="h-5 w-5 text-primary" />
                <span className="font-medium">Member Since</span>
              </div>
              <span className="text-sm font-medium">
                {profile?.created_at
                  ? format(new Date(profile.created_at), 'MMM yyyy')
                  : 'N/A'}
              </span>
            </div>

            <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
              <div className="flex items-center gap-2">
                <span className="font-medium">First Session Status</span>
              </div>
              <span className={`text-sm font-medium px-3 py-1 rounded-full ${
                profile?.is_first_session_used
                  ? 'bg-green-100 text-green-700'
                  : 'bg-blue-100 text-blue-700'
              }`}>
                {profile?.is_first_session_used ? 'Used' : 'Available (Free)'}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Email Preferences Card */}
        <EmailPreferencesCard />
      </div>
    </div>
    </>
  );
};
