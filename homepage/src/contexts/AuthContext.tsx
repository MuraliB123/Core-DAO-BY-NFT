import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  username: string;
  email: string;
  type: 'creator' | 'user';
  avatar: string;
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Dummy users
const dummyUsers: User[] = [
  {
    id: '1',
    username: 'creator',
    email: 'creator@youtube.com',
    type: 'creator',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=creator'
  },
  {
    id: '2',
    username: 'user',
    email: 'user@youtube.com',
    type: 'user',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user'
  }
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Check if user is already logged in (from localStorage)
    const savedUser = localStorage.getItem('youtube-user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    // Simple authentication - in real app, this would be API call
    const foundUser = dummyUsers.find(u => u.username === username);
    
    if (foundUser && password === 'password') {
      setUser(foundUser);
      localStorage.setItem('youtube-user', JSON.stringify(foundUser));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('youtube-user');
  };

  const value: AuthContextType = {
    user,
    login,
    logout,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};