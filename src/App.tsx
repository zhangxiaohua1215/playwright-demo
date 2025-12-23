import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import BasicFormPage from './pages/BasicFormPage';
import SelectTestPage from './pages/SelectTestPage';

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Navigate to="/basic" replace />} />
        <Route path="basic" element={<BasicFormPage />} />
        <Route path="select" element={<SelectTestPage />} />
      </Route>
    </Routes>
  );
};

export default App;
