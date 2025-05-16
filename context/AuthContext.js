// context/AuthContext.js
"use client"

import { createContext, useContext, useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const { data: session, status } = useSession();
  const [user, setUser] = useState(null);
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'authenticated' && session) {
      // If we have a session but no user type, fetch user data
      if (session.user && !session.user.userType) {
        fetch('/api/auth/user-type')
          .then(res => res.json())
          .then(data => {
            if (data.user) {
              setUser({
                ...session.user,
                userType: data.user.userType
              });
            } else {
              // User needs to select type
              router.push('/auth/select-type');
            }
          })
          .catch(error => {
            console.error('Error fetching user type:', error);
          })
          .finally(() => {
            setLoading(false);
          });
      } else if (session.user) {
        // We already have the user type in the session
        setUser(session.user);
        setLoading(false);
      }
    } else if (status === 'unauthenticated') {
      setUser(null);
      setLoading(false);
    }
  }, [session, status, router]);

  const setUserType = async (userType) => {
    try {
      setLoading(true);
      const response = await fetch('/api/auth/user-type', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userType }),
      });
      
      const data = await response.json();
      
      if (response.ok && data.user) {
        setUser({
          ...session.user,
          userType: data.user.userType
        });
        
        // Redirect based on user type
        if (userType === 'influencer') {
          router.push('/influencer/dashboard');
        } else {
          router.push('/brand/dashboard');
        }
      }
    } catch (error) {
      console.error('Error setting user type:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, setUserType }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
