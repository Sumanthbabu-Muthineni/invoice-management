import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import theme from './theme';
import { AuthProvider } from './context/AuthContext';

// Import your components here
import Login from './components/auth/Login';
import Signup from './components/auth/Signup';
import Home from './pages/Home';
import InvoiceForm from './components/invoices/InvoiceForm';

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/home" element={<Home />} />
            <Route path="/invoice/new" element={<InvoiceForm />} />
            <Route path="/invoice/edit/:id" element={<InvoiceForm />} />
            <Route path="/" element={<Navigate to="/login" replace />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;