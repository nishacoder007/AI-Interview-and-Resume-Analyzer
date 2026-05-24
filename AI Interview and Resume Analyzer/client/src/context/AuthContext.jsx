import React, { createContext, useState, useEffect } from 'react';
import API from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check local storage for existing session
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');

    if (storedUser && storedToken) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (err) {
        console.error('Error parsing stored user details:', err);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
    }
    setLoading(false);
  }, []);

  // Login handler
  const login = async (email, password) => {
    try {
      setLoading(true);
      const res = await API.post('/auth/login', { email, password });
      
      const userData = {
        id: res.data._id || res.data.id,
        name: res.data.name,
        email: res.data.email,
        role: res.data.role,
        title: res.data.title || 'Software Engineer',
        bio: res.data.bio || 'Passionate developer interested in building modern web applications and optimizing systems.',
        experienceLevel: res.data.experienceLevel || 'Mid-Level',
        skills: res.data.skills || ['React', 'Node.js', 'JavaScript']
      };

      setUser(userData);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(userData));
      return { success: true };
    } catch (error) {
      console.error('Login action error:', error.response?.data?.message || error.message);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Login failed. Please check your credentials.' 
      };
    } finally {
      setLoading(false);
    }
  };

  // Register handler
  const register = async (name, email, password) => {
    try {
      setLoading(true);
      const res = await API.post('/auth/register', { name, email, password });

      const userData = {
        id: res.data._id || res.data.id,
        name: res.data.name,
        email: res.data.email,
        role: res.data.role,
        title: res.data.title || 'Software Engineer',
        bio: res.data.bio || 'Passionate developer interested in building modern web applications and optimizing systems.',
        experienceLevel: res.data.experienceLevel || 'Mid-Level',
        skills: res.data.skills || ['React', 'Node.js', 'JavaScript']
      };

      setUser(userData);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(userData));
      return { success: true };
    } catch (error) {
      console.error('Register action error:', error.response?.data?.message || error.message);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Registration failed. Try a different email.' 
      };
    } finally {
      setLoading(false);
    }
  };

  // Update Profile handler
  const updateProfile = async (profileData) => {
    try {
      setLoading(true);
      const res = await API.put('/auth/profile', profileData);

      const userData = {
        id: res.data._id || res.data.id,
        name: res.data.name,
        email: res.data.email,
        role: res.data.role,
        title: res.data.title,
        bio: res.data.bio,
        experienceLevel: res.data.experienceLevel,
        skills: res.data.skills
      };

      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      return { success: true };
    } catch (error) {
      console.error('Update profile error:', error.response?.data?.message || error.message);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to update profile details.'
      };
    } finally {
      setLoading(false);
    }
  };

  // Logout handler
  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  const value = {
    user,
    loading,
    login,
    register,
    updateProfile,
    logout,
    isAuthenticated: !!user
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
