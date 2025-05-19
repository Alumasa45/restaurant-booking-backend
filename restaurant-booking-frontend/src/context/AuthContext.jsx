import React, { createContext, useState, useEffect, useContext } from 'react';
import { 
  login as authLogin, 
  logout as authLogout,
  getCurrentUser, 
  isAuthenticated as checkAuth,
  isAdmin as checkAdmin,
  verifyToken
} from '../services/authService';

// Create context
const AuthContext = createContext();

// Custom hook to use the auth context
export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  // Initialize auth state from localStorage on mount
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Check if token exists and is valid
        if (checkAuth()) {
          const user = getCurrentUser();
          setCurrentUser(user);
          setIsAdmin(checkAdmin());
          setIsAuthenticated(true);
          
          // Verify token with backend
          const { valid } = await verifyToken();
          if (!valid) {
            // If token is invalid, log out
            handleLogout();
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        setAuthError('Failed to initialize authentication');
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // Login handler
  const handleLogin = async (email, password) => {
    setAuthError(null);
    try {
      const result = await authLogin(email, password);
      
      if (result.success) {
        setCurrentUser(result.user);
        setIsAuthenticated(true);
        setIsAdmin(result.user?.role === 'admin' || 
                  (result.user?.roles && result.user.roles.includes('admin')));
        return { success: true };
      } else {
        setAuthError(result.message);
        return { success: false, message: result.message };
      }
    } catch (error) {
      const errorMsg = 'Login failed. Please try again.';
      setAuthError(errorMsg);
      return { success: false, message: errorMsg };
    }
  };

  // Logout handler
  const handleLogout = () => {
    authLogout();
    setCurrentUser(null);
    setIsAuthenticated(false);
    setIsAdmin(false);
    setAuthError(null);
  };

  // Update user info
  const updateUserInfo = (userInfo) => {
    setCurrentUser(prevUser => ({
      ...prevUser,
      ...userInfo
    }));
    
    // Update in localStorage if needed
    if (localStorage.getItem('user')) {
      const storedUser = JSON.parse(localStorage.getItem('user'));
      localStorage.setItem('user', JSON.stringify({
        ...storedUser,
        ...userInfo
      }));
    }
  };

  // Context value
  const value = {
    currentUser,
    isAuthenticated,
    isAdmin,
    loading,
    error: authError,
    login: handleLogin,
    logout: handleLogout,
    updateUserInfo
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthContext;