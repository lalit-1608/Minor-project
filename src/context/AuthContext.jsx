import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const DEMO_USERS = {
  student: {
    id: 'stu-1',
    name: 'Rahul Chauhan',
    email: 'rahul.chauhan@apex.edu',
    role: 'student',
    roleLabel: 'Student',
    rollNumber: 'CS-2023-042',
    departmentId: 'dept-cse',
    departmentName: 'Computer Science',
    semester: 5,
    className: 'CSE-A',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=256',
    bio: 'Student • 5th Semester Computer Science'
  },
  faculty: {
    id: 'fac-1',
    name: 'Mr. Ashok Rathi',
    email: 'ashok.rathi@apex.edu',
    role: 'faculty',
    roleLabel: 'Teacher',
    facultyId: 'fac-1',
    departmentId: 'dept-cse',
    departmentName: 'Computer Science',
    designation: 'Professor & Head',
    experience: '16 Years',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=256',
    bio: 'Computer Science Teacher & Department Head'
  },
  admin: {
    id: 'admin-1',
    name: 'Dr. Rajesh Verma',
    email: 'rajesh.verma@apex.edu',
    role: 'admin',
    roleLabel: 'Dean / Principal',
    departmentId: 'dept-it',
    departmentName: 'Information Technology',
    designation: 'College Principal & Dean',
    experience: '14 Years',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=256',
    bio: 'College Principal & Academic Dean'
  }
};

export const DEMO_CREDENTIALS = {
  student: {
    email: 'rahul.chauhan@apex.edu',
    password: 'Student@123',
    role: 'student'
  },
  faculty: {
    email: 'ashok.rathi@apex.edu',
    password: 'Faculty@123',
    role: 'faculty'
  },
  admin: {
    email: 'rajesh.verma@apex.edu',
    password: 'Principal@123',
    role: 'admin'
  }
};

const AUTH_STORAGE_KEY = 'studysnippet_auth_user_v1';

export function AuthProvider({ children }) {
  // Default to null (unauthenticated guest) unless a valid session was persisted
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const stored = localStorage.getItem(AUTH_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn('Could not read user from localStorage', e);
    }
    // Default is null (guest/unauthenticated), requiring explicit login
    return null;
  });

  useEffect(() => {
    if (currentUser) {
      try {
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(currentUser));
      } catch (e) {
        console.error('Could not save user to localStorage', e);
      }
    } else {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }
  }, [currentUser]);

  const loginWithCredentials = (email, password, role = 'student') => {
    if (!email || !password) {
      return { success: false, error: 'Please enter your email and password.' };
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanRole = role.trim().toLowerCase();

    // Find matching demo credential by role, email and exact password
    const credentialEntry = Object.entries(DEMO_CREDENTIALS).find(([credRole, cred]) => {
      return (
        credRole === cleanRole &&
        cred.email.toLowerCase() === cleanEmail &&
        cred.password === password
      );
    });

    if (credentialEntry) {
      const matchedRole = credentialEntry[0];
      const matchedUser = DEMO_USERS[matchedRole];
      if (matchedUser) {
        setCurrentUser(matchedUser);
        return { success: true, user: matchedUser };
      }
    }

    // Explicit rejection: no arbitrary dynamic users allowed in secure demo mode
    return {
      success: false,
      error: 'Invalid email, password, or selected role. Please check your credentials.'
    };
  };

  const logout = () => {
    setCurrentUser(null);
    try {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    } catch (e) {
      console.warn('Could not clear auth storage', e);
    }
  };

  const value = {
    currentUser,
    role: currentUser?.role || 'guest',
    isAuthenticated: !!currentUser,
    isStudent: currentUser?.role === 'student',
    isFaculty: currentUser?.role === 'faculty',
    isAdmin: currentUser?.role === 'admin',
    isPrincipal: currentUser?.role === 'admin',
    loginWithCredentials,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
