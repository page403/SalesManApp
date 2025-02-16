import { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '@/utils/supabase';

type User = {
  id: number;
  username: string;
  name: string;
  area: string;
  acceptable: boolean;
};

type AuthContextType = {
  user: User | null;
  setUser: (user: User | null) => void;
};

export const AuthContext = createContext<AuthContextType>({
  user: null,
  setUser: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const savedUser = await AsyncStorage.getItem('user');
      if (savedUser) {
        const parsedUser = JSON.parse(savedUser);
        
        // Verify user exists and is acceptable in the database
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('username', parsedUser.username)
          .eq('acceptable', true)
          .single();

        if (error) {
          console.error('Error verifying user:', error);
          await AsyncStorage.removeItem('user');
          setUser(null);
          return;
        }

        if (data) {
          setUser(data);
        } else {
          // User not found or not acceptable, clear storage
          await AsyncStorage.removeItem('user');
          setUser(null);
        }
      }
    } catch (error) {
      console.error('Error loading user:', error);
      // Clear storage on error
      await AsyncStorage.removeItem('user');
      setUser(null);
    }
  };

  const handleSetUser = async (newUser: User | null) => {
    try {
      if (newUser) {
        // Verify user exists and is acceptable in the database
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('username', newUser.username)
          .eq('acceptable', true)
          .single();

        if (error || !data) {
          console.error('Error verifying user:', error);
          throw new Error('User verification failed');
        }

        await AsyncStorage.setItem('user', JSON.stringify(data));
        setUser(data);
      } else {
        await AsyncStorage.removeItem('user');
        setUser(null);
      }
    } catch (error) {
      console.error('Error saving user:', error);
      await AsyncStorage.removeItem('user');
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, setUser: handleSetUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
} 