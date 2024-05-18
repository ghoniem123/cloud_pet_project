/* eslint-disable no-unused-vars */
import { useState } from 'react'
import React from 'react';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import LoginPage from './pages/LoginPage';
import { Route, Routes, Navigate } from 'react-router-dom';

export const UserContext = React.createContext(null);

function App() {
  const [user, setUser] = useState(()=>{return JSON.parse(sessionStorage.getItem('user')) || null});

  console.log("AAAAAAAAAAAAAA      ",user);

  return (
  <UserContext.Provider value = {{user, setUser}} >
        <Routes>
        <Route path="/" element={<RegisterPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
  </UserContext.Provider>
  );
}

export default App;
