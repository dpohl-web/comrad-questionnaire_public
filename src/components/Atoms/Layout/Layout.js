import React from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import './Layout.css';
import Application from '../../../containers/Application/Application';

export default function Layout() {
  const location = useLocation();

  return (
    <div className="layout">
      <Routes location={location}>
        <Route
          path="/*"
          element={<Application location={location} />}
        />
      </Routes>
    </div>
  );
}
