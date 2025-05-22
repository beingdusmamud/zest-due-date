
import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Session, User } from '@supabase/supabase-js';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/components/ui/sonner';

interface AuthContextType {
  session: Session | null;
  user: User | null;
  profile: any | null;
  loading: boolean;
  signUp: (email: string, password: string) => Promise<{error: any | null}>;
  signIn: (email: string, password: string) => Promise<{error: any | null}>;
  signOut: () => Promise<void>;
  updateProfile: (updates: any) => Promise<{error: any | null, data: any | null}>;
  uploadAvatar: (file: File) => Promise<{error: any | null, url: string | null}>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, newSession) => {
        setSession(newSession);
        setUser(newSession?.user ?? null);
        
        if (event === 'SIGNED_IN') {
          fetchProfile(newSession?.user?.id);
        } else if (event === 'SIGNED_OUT') {
          setProfile(null);
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session: initialSession } }) => {
      setSession(initialSession);
      setUser(initialSession?.user ?? null);
      
      if (initialSession?.user) {
        fetchProfile(initialSession.user.id);
      }
      
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchProfile = async (userId: string | undefined) => {
    if (!userId) return;
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        return;
      }

      setProfile(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
      });
      
      if (error) return { error };
      
      toast.success('Account created successfully! Please check your email to verify your account.');
      return { error: null };
    } catch (error: any) {
      return { error };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) return { error };
      
      toast.success('Signed in successfully!');
      navigate('/');
      return { error: null };
    } catch (error: any) {
      return { error };
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    navigate('/');
    toast.success('Signed out successfully!');
  };

  const updateProfile = async (updates: any) => {
    if (!user?.id) return { error: new Error('User not authenticated'), data: null };
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id)
        .select();
        
      if (error) return { error, data: null };
      
      setProfile({ ...profile, ...updates });
      toast.success('Profile updated successfully!');
      return { error: null, data };
    } catch (error: any) {
      return { error, data: null };
    }
  };

  const uploadAvatar = async (file: File) => {
    if (!user?.id) return { error: new Error('User not authenticated'), url: null };
    
    try {
      const fileExt = file.name.split('.').pop();
      const filePath = `avatars/${user.id}-${Math.random()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);
        
      if (uploadError) return { error: uploadError, url: null };
      
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);
        
      const { error: updateError } = await updateProfile({ avatar_url: publicUrl });
      
      if (updateError) return { error: updateError, url: null };
      
      return { error: null, url: publicUrl };
    } catch (error: any) {
      return { error, url: null };
    }
  };

  return (
    <AuthContext.Provider value={{
      session,
      user,
      profile,
      loading,
      signUp,
      signIn,
      signOut,
      updateProfile,
      uploadAvatar
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
