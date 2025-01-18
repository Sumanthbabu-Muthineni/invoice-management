// src/components/invoices/InvoiceList.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid2,
  Alert,
  Paper,
  CircularProgress,
  TextField,
  IconButton,
  Tooltip,
} from '@mui/material';

import {
  Add as AddIcon,
  Refresh as RefreshIcon,
  Sort as SortIcon,
} from '@mui/icons-material';
import InvoiceCard from './InvoiceCard';
import api from '../../services/Api';
const InvoiceList = () => {
  const navigate = useNavigate();
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [searchQuery, setSearchQuery] = useState('');
  const [dateRange, setDateRange] = useState({
    startDate: '',
    endDate: '',
  });

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    setLoading(true);
    try {
      const response = await api.get('/invoices');
      const invoiceData = response.data?.data || [];
      setInvoices(Array.isArray(invoiceData) ? invoiceData : []);
      setError('');
    } catch (err) {
      console.error('Error fetching invoices:', err);
      setError('Failed to fetch invoices');
      setInvoices([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this invoice?')) {
      try {
        await api.delete(`/invoices/${id}`);
        setInvoices(invoices.filter(invoice => invoice._id !== id));
      } catch (err) {
        setError('Failed to delete invoice');
      }
    }
  };

  const handleRefresh = () => {
    fetchInvoices();
  };

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleDateRangeChange = (field) => (event) => {
    setDateRange({
      ...dateRange,
      [field]: event.target.value
    });
  };

  const getFilteredAndSortedInvoices = () => {
    if (!Array.isArray(invoices)) return [];

    return invoices
      .filter(invoice => {
        // Status filter
        const statusMatch = filterStatus === 'all' ? true : invoice.status === filterStatus;
        
        // Search query filter
        const searchMatch = searchQuery === '' ? true : 
          invoice.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          invoice.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase());
        
        // Date range filter
        const invoiceDate = new Date(invoice.date);
        const startDateMatch = dateRange.startDate ? invoiceDate >= new Date(dateRange.startDate) : true;
        const endDateMatch = dateRange.endDate ? invoiceDate <= new Date(dateRange.endDate) : true;

        return statusMatch && searchMatch && startDateMatch && endDateMatch;
      })
      .sort((a, b) => {
        if (sortBy === 'date') {
          return sortOrder === 'asc' 
            ? new Date(a.date) - new Date(b.date)
            : new Date(b.date) - new Date(a.date);
        }
        if (sortBy === 'amount') {
          return sortOrder === 'asc' 
            ? a.amount - b.amount
            : b.amount - a.amount;
        }
        return 0;
      });
  };

  const filteredInvoices = getFilteredAndSortedInvoices();

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4 }}>
        <Paper elevation={3} sx={{ p: 3 }}>
          {/* Header */}
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <Typography variant="h5" component="h1">
              Invoices
            </Typography>
            <Box display="flex" gap={1}>
              <Tooltip title="Refresh">
                <IconButton onClick={handleRefresh} disabled={loading}>
                  <RefreshIcon />
                </IconButton>
              </Tooltip>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => navigate('/invoice/new')}
              >
                New Invoice
              </Button>
            </Box>
          </Box>

          {/* Search and Filters */}
          <Grid2 container spacing={2} sx={{ mb: 3 }}>
            <Grid2 item xs={12} md={4}>
              <TextField
                fullWidth
                size="small"
                label="Search invoices"
                value={searchQuery}
                onChange={handleSearch}
                placeholder="Search by client or invoice number"
              />
            </Grid2>
            <Grid2 item xs={12} sm={6} md={2}>
              <FormControl fullWidth size="small">
                <InputLabel>Filter by Status</InputLabel>
                <Select
                  value={filterStatus}
                  label="Filter by Status"
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <MenuItem value="all">All</MenuItem>
                  <MenuItem value="paid">Paid</MenuItem>
                  <MenuItem value="unpaid">Unpaid</MenuItem>
                  <MenuItem value="pending">Pending</MenuItem>
                </Select>
              </FormControl>
            </Grid2>
            <Grid2 item xs={12} sm={6} md={2}>
              <FormControl fullWidth size="small">
                <InputLabel>Sort by</InputLabel>
                <Select
                  value={sortBy}
                  label="Sort by"
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <MenuItem value="date">Date</MenuItem>
                  <MenuItem value="amount">Amount</MenuItem>
                </Select>
              </FormControl>
            </Grid2>
            <Grid2 item xs={12} sm={6} md={2}>
              <FormControl fullWidth size="small">
                <InputLabel>Order</InputLabel>
                <Select
                  value={sortOrder}
                  label="Order"
                  onChange={(e) => setSortOrder(e.target.value)}
                >
                  <MenuItem value="asc">Ascending</MenuItem>
                  <MenuItem value="desc">Descending</MenuItem>
                </Select>
              </FormControl>
            </Grid2>
          </Grid2>

          {/* Date Range Filter */}
          <Grid2 container spacing={2} sx={{ mb: 3 }}>
            <Grid2 item xs={12} sm={6}>
              <TextField
                fullWidth
                size="small"
                type="date"
                label="Start Date"
                value={dateRange.startDate}
                onChange={handleDateRangeChange('startDate')}
                InputLabelProps={{ shrink: true }}
              />
            </Grid2>
            <Grid2 item xs={12} sm={6}>
              <TextField
                fullWidth
                size="small"
                type="date"
                label="End Date"
                value={dateRange.endDate}
                onChange={handleDateRangeChange('endDate')}
                InputLabelProps={{ shrink: true }}
              />
            </Grid2>
          </Grid2>

          {/* Error Alert */}
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {/* Invoice List */}
          {loading ? (
            <Box display="flex" justifyContent="center" alignItems="center" py={4}>
              <CircularProgress />
            </Box>
          ) : filteredInvoices.length === 0 ? (
            <Box textAlign="center" py={4}>
              <Typography color="text.secondary" gutterBottom>
                No invoices found
              </Typography>
              <Button
                variant="outlined"
                startIcon={<AddIcon />}
                onClick={() => navigate('/invoice/new')}
                sx={{ mt: 2 }}
              >
                Create your first invoice
              </Button>
            </Box>
          ) : (
            <Grid2 container spacing={2}>
              {filteredInvoices.map((invoice) => (
                <Grid2 item xs={12} key={invoice._id}>
                  <InvoiceCard
                    invoice={invoice}
                    onDelete={handleDelete}
                  />
                </Grid2>
              ))}
              <Grid2 item xs={12}>
                <Typography textAlign="right" color="text.secondary">
                  Showing {filteredInvoices.length} of {invoices.length} invoices
                </Typography>
              </Grid2>
            </Grid2>
          )}
        </Paper>
      </Box>
    </Container>
  );
};

export default InvoiceList;