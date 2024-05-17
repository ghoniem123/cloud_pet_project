// import { useState } from 'react'
import React from 'react';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import LoginPage from './pages/LoginPage';
import { Route, Routes, Navigate } from 'react-router-dom';
import './style.css'
export const CartIDContext = React.createContext();


function App() {

  return (
        <Routes>
        <Route path="/" element={<RegisterPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
  );
}

export default App;
