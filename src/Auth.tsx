import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
axios.defaults.withCredentials = true;

interface User {
  email: string;
  name: string;
  picture: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;     
}


const AuthContext = createContext<AuthContextType>({ 
  user: null, 
  loading: true 
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const verifyUserSession = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/user/me/');
      
      if (response.data.isLoggedIn) {
        setUser(response.data.user);
      }
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

useEffect(() => {
  const verify = async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
    try {
      const res = await axios.get("http://localhost:8000/api/user/me/");
      if (res.data.isLoggedIn) setUser(res.data.user);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  verify();
}, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);