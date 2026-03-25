import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth } from '../firebase';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, user => {
      if (user) {
        setCurrentUser({
          id: user.uid,
          email: user.email,
          name: user.displayName || user.email.split('@')[0]
        });
      } else {
        setCurrentUser(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const login = async (email, password) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      return { success: true };
    } catch (error) {
      if (error.code === 'auth/invalid-credential') {
        return { success: false, error: 'Invalid email or password.' };
      }
      return { success: false, error: 'Failed to log in: ' + error.message };
    }
  };

  const register = async (email, password, name) => {
    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(res.user, { displayName: name });
      // The onAuthStateChanged will handle setting the current user shortly after
      return { success: true };
    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        return { success: false, error: 'Email already exists.' };
      }
      if (error.code === 'auth/weak-password') {
        return { success: false, error: 'Password should be at least 6 characters.' };
      }
      return { success: false, error: error.message };
    }
  };

  const logout = async () => {
    await signOut(auth);
  };

  return (
    <AuthContext.Provider value={{ currentUser, login, register, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
