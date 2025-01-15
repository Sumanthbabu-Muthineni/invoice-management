import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Paper,
  CircularProgress,
  Alert,
  Button,Grid 
} from '@mui/material';
import Navbar from '../components/layout/Navbar';
import InvoiceList from '../components/invoices/InvoiceList';
import api from '../services/Api';

const Home = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    totalInvoices: 0,
    paidInvoices: 0,
    pendingAmount: 0
  });

  useEffect(() => {
    checkAuth();
    fetchDashboardStats();
  }, []);

  const checkAuth = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    }
  };

  const fetchDashboardStats = async () => {
    try {
      const response = await api.get('/invoices');
      const invoices = response.data;
      
      const stats = {
        totalInvoices: invoices.length,
        paidInvoices: invoices.filter(inv => inv.status === 'paid').length,
        pendingAmount: invoices
          .filter(inv => inv.status !== 'paid')
          .reduce((sum, inv) => sum + (inv.amount || 0), 0)
      };
      
      setStats(stats);
    } catch (err) {
      setError('Failed to fetch dashboard statistics');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f5f5f5' }}>
      <Navbar />
      
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {/* Dashboard Statistics */}
        <Box sx={{ mb: 4 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={4}>
              <Paper
                sx={{
                  p: 3,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center'
                }}
              >
                <Typography color="textSecondary" gutterBottom>
                  Total Invoices
                </Typography>
                <Typography variant="h4">
                  {isLoading ? <CircularProgress size={20} /> : stats.totalInvoices}
                </Typography>
              </Paper>
            </Grid>
            
            <Grid item xs={12} sm={6} md={4}>
              <Paper
                sx={{
                  p: 3,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center'
                }}
              >
                <Typography color="textSecondary" gutterBottom>
                  Paid Invoices
                </Typography>
                <Typography variant="h4" color="success.main">
                  {isLoading ? <CircularProgress size={20} /> : stats.paidInvoices}
                </Typography>
              </Paper>
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <Paper
                sx={{
                  p: 3,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center'
                }}
              >
                <Typography color="textSecondary" gutterBottom>
                  Pending Amount
                </Typography>
                <Typography variant="h4" color="warning.main">
                  {isLoading ? (
                    <CircularProgress size={20} />
                  ) : (
                    `$${stats.pendingAmount.toFixed(2)}`
                  )}
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </Box>

        {/* Quick Actions */}
        <Box sx={{ mb: 4 }}>
          <Paper sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">Quick Actions</Typography>
              <Button
                variant="contained"
                color="primary"
                onClick={() => navigate('/invoice/new')}
              >
                Create New Invoice
              </Button>
            </Box>
          </Paper>
        </Box>

        {/* Invoice List */}
        <InvoiceList />
      </Container>
    </Box>
  );
};

export default Home;