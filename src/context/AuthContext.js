import { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';
import { auth } from '../services/firebase';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);      
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    const restoreSession = async () => {
      try {
        const saved = await AsyncStorage.getItem('user');
        if (saved) setUser(JSON.parse(saved));
      } catch (e) {
        console.log('Session restore error:', e);
      } finally {
        setLoading(false);
      }
    };
    restoreSession();
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const userData = { uid: firebaseUser.uid, email: firebaseUser.email };
        setUser(userData);
        await AsyncStorage.setItem('user', JSON.stringify(userData));
      }
    });
    return unsubscribe;
  }, []);

  const login = async (email, password) => {
    const result = await signInWithEmailAndPassword(auth, email, password);
    const userData = { uid: result.user.uid, email: result.user.email };
    setUser(userData);
    await AsyncStorage.setItem('user', JSON.stringify(userData));
    return userData;
  };

  const register = async (email, password) => {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    const userData = { uid: result.user.uid, email: result.user.email };
    setUser(userData);
    await AsyncStorage.setItem('user', JSON.stringify(userData));
    return userData;
  };

  const logout = async () => {
    await signOut(auth);
    await AsyncStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);