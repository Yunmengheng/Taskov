'use client'; // 👈 REQUIRED for any component that uses hooks in App Router

import React, { useEffect, useState, createContext, useContext } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user' | 'guest';
  provider?: 'email' | 'google' | 'facebook' | 'guest';
}

interface AuthContextType {
  currentUser: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  loginWithFacebook: () => Promise<void>;
  loginAsGuest: () => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isGuest: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    if (email && password) {
      const mockUser: User = {
        id: '1',
        name: email.split('@')[0],
        email,
        role: email.includes('admin') ? 'admin' : 'user',
        provider: 'email'
      };
      setCurrentUser(mockUser);
      localStorage.setItem('user', JSON.stringify(mockUser));
    } else {
      throw new Error('Invalid credentials');
    }
  };

  const loginWithGoogle = async (): Promise<void> => {
    await new Promise(res => setTimeout(res, 500));
    const mockGoogleUser: User = {
      id: 'g-' + Date.now(),
      name: 'Google User',
      email: 'user@gmail.com',
      role: 'user',
      provider: 'google'
    };
    setCurrentUser(mockGoogleUser);
    localStorage.setItem('user', JSON.stringify(mockGoogleUser));
  };

  const loginWithFacebook = async (): Promise<void> => {
    await new Promise(res => setTimeout(res, 500));
    const mockFacebookUser: User = {
      id: 'fb-' + Date.now(),
      name: 'Facebook User',
      email: 'user@facebook.com',
      role: 'user',
      provider: 'facebook'
    };
    setCurrentUser(mockFacebookUser);
    localStorage.setItem('user', JSON.stringify(mockFacebookUser));
  };

  const loginAsGuest = async (): Promise<void> => {
    await new Promise(res => setTimeout(res, 500));
    const mockGuestUser: User = {
      id: 'guest-' + Date.now(),
      name: 'Guest User',
      email: 'guest@example.com',
      role: 'guest',
      provider: 'guest'
    };
    setCurrentUser(mockGuestUser);
    localStorage.setItem('user', JSON.stringify(mockGuestUser));
  };

  const signup = async (name: string, email: string, password: string): Promise<void> => {
    if (name && email && password) {
      const newUser: User = {
        id: Date.now().toString(),
        name,
        email,
        role: 'user',
        provider: 'email'
      };
      setCurrentUser(newUser);
      localStorage.setItem('user', JSON.stringify(newUser));
    } else {
      throw new Error('Invalid information');
    }
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('user');
  };

  const value: AuthContextType = {
    currentUser,
    login,
    signup,
    loginWithGoogle,
    loginWithFacebook,
    loginAsGuest,
    logout,
    isAuthenticated: !!currentUser,
    isAdmin: currentUser?.role === 'admin',
    isGuest: currentUser?.role === 'guest',
  };

  if (isLoading) {
    return (
      <div className="flex w-full h-screen justify-center items-center">
        Loading...
      </div>
    );
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
