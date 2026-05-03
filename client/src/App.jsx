import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { MoodProvider } from './context/MoodContext';
import Layout from './components/layout/Layout';

// Pages
import Home from './pages/Home';
import Events from './pages/Events';
import AdminLogin from './pages/admin/AdminLogin';
import Dashboard from './pages/admin/Dashboard';
import ProtectedRoute from './components/admin/ProtectedRoute';
import EventArchive from './pages/EventArchive';
import Gallery from './pages/Gallery';
import Contact from './pages/Contact';
import NotFound from './pages/NotFound'; // <--- Nuova pagina 404

function App() {
  return (
    <HelmetProvider>
      <MoodProvider>
        <Router>
          <Routes>
            {/* ROTTE PUBBLICHE */}
            <Route path="/" element={<Layout><Home /></Layout>} />
            <Route path="/events" element={<Layout><Events /></Layout>} />
            <Route path="/archivio-eventi" element={<Layout><EventArchive /></Layout>} />
            <Route path="/gallery" element={<Layout><Gallery /></Layout>} />
            <Route path="/contatti" element={<Layout><Contact /></Layout>} />

            {/* ROTTA 404: Deve essere l'ultima tra le rotte pubbliche */}
            <Route path="*" element={<Layout><NotFound /></Layout>} />

            {/* ROTTE ADMIN */}
            <Route path="/admin" element={<AdminLogin />} />
            <Route
              path="/admin/dashboard/*"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
          </Routes>
        </Router>
      </MoodProvider>
    </HelmetProvider>
  );
}

export default App;