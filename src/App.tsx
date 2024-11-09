import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { FirebaseProvider } from './contexts/FirebaseContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import Home from './components/Home';
import Calculator from './components/Calculator';
import Dashboard from './components/dashboard/Dashboard';
import { FAQ } from './components/FAQ';

const App = () => {
  return (
    <FirebaseProvider>
      <Router>
        <div className="min-h-screen bg-[#f8f9fa] flex flex-col">
          <Header />
          <div className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/calculator" element={<Calculator />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/faq" element={<FAQ />} />
            </Routes>
          </div>
          <Footer />
        </div>
      </Router>
    </FirebaseProvider>
  );
};

export default App;