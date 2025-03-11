
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, fullName: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          console.error('Error fetching session:', error);
          toast({
            title: 'Authentication Error',
            description: 'Failed to retrieve your session. Please try again.',
            variant: 'destructive',
          });
        } else {
          setSession(session);
          setUser(session?.user ?? null);
        }
      } catch (error) {
        console.error('Unexpected error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setIsLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [toast]);

  const sendWelcomeEmail = async (email: string, fullName: string) => {
    try {
      toast({
        title: "Sending Welcome Email",
        description: "Preparing to send a welcome email...",
      });
      
      const { data, error } = await supabase.functions.invoke('send-reminder-email', {
        body: {
          email,
          personName: fullName || 'there',
          eventType: 'welcome',
          eventDate: new Date().toISOString(),
          daysUntil: 0,
          customMessage: "We're thrilled to have you join us! Cheerful Reminder is here to help you never miss an important date. Start by adding your first reminder."
        }
      });

      if (error) {
        console.error('Error sending welcome email:', error);
        toast({
          title: "Welcome Email Error",
          description: "There was an issue sending the welcome email. You can try again from the Settings page.",
          variant: "destructive",
        });
      } else {
        console.log('Welcome email sent successfully:', data);
        toast({
          title: "Welcome Email",
          description: "A welcome email has been sent (in test mode, check the Resend owner's email).",
        });
      }
    } catch (error) {
      console.error('Unexpected error sending welcome email:', error);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      
      if (error) {
        toast({
          title: 'Sign In Failed',
          description: error.message,
          variant: 'destructive',
        });
        throw error;
      }
      
      // Send welcome email after successful login
      if (data.user) {
        const { data: profileData } = await supabase
          .from('profiles')
          .select('full_name')
          .eq('id', data.user.id)
          .single();
          
        const fullName = profileData?.full_name || data.user.user_metadata?.full_name || '';
        
        // We'll show a toast about the welcome email before actually sending it
        toast({
          title: 'Welcome back!',
          description: 'You have successfully signed in. We\'re sending you a welcome email.',
        });
        
        // Send the welcome email
        sendWelcomeEmail(email, fullName);
      } else {
        toast({
          title: 'Welcome back!',
          description: 'You have successfully signed in.',
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      setIsLoading(true);
      const { error, data } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          data: {
            full_name: fullName,
          }
        }
      });
      
      if (error) {
        toast({
          title: 'Sign Up Failed',
          description: error.message,
          variant: 'destructive',
        });
        throw error;
      }

      if (data.user) {
        // Create a profile record
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: data.user.id,
            email,
            full_name: fullName,
          });

        if (profileError) {
          console.error('Error creating profile:', profileError);
        }
      }
      
      toast({
        title: 'Account created!',
        description: 'Please check your email to confirm your account.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        toast({
          title: 'Sign Out Failed',
          description: error.message,
          variant: 'destructive',
        });
        throw error;
      }
      
      toast({
        title: 'Signed out',
        description: 'You have been successfully signed out.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      
      if (error) {
        toast({
          title: 'Reset Password Failed',
          description: error.message,
          variant: 'destructive',
        });
        throw error;
      }
      
      toast({
        title: 'Password Reset Email Sent',
        description: 'Check your email for a password reset link.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    user,
    session,
    isLoading,
    signIn,
    signUp,
    signOut,
    resetPassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
}
