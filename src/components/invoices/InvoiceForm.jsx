import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  MenuItem,
  Alert,
} from '@mui/material';
import api from '../../services/Api';

const INITIAL_FORM_STATE = {
  invoiceNumber: '',
  clientName: '',
  date: new Date().toISOString().split('T')[0],
  amount: '',
  status: 'pending'
};

const InvoiceForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [error, setError] = useState('');

  useEffect(() => {
    if (id) {
      fetchInvoice();
    }
  }, [id]);

  const fetchInvoice = async () => {
    try {
      const response = await api.get(`/invoices/${id}`);
      const invoice = response.data;
      setFormData({
        ...invoice,
        date: new Date(invoice.date).toISOString().split('T')[0]
      });
    } catch (err) {
      setError('Failed to fetch invoice details');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'amount' ? parseFloat(value) || value : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      if (id) {
        await api.put(`/invoices/${id}`, formData);
      } else {
        await api.post('/invoices', formData);
      }
      navigate('/home');
    } catch (err) {
      setError(err.response?.data?.message || 'Error saving invoice');
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 4 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h5" gutterBottom align="center">
            {id ? 'Edit Invoice' : 'Create New Invoice'}
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              margin="normal"
              required
              fullWidth
              label="Invoice Number"
              name="invoiceNumber"
              value={formData.invoiceNumber}
              onChange={handleChange}
            />

            <TextField
              margin="normal"
              required
              fullWidth
              label="Client Name"
              name="clientName"
              value={formData.clientName}
              onChange={handleChange}
            />

            <TextField
              margin="normal"
              required
              fullWidth
              type="date"
              label="Date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              InputLabelProps={{
                shrink: true,
              }}
            />

            <TextField
              margin="normal"
              required
              fullWidth
              type="number"
              label="Amount"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              inputProps={{ step: "0.01" }}
            />

            <TextField
              margin="normal"
              required
              fullWidth
              select
              label="Status"
              name="status"
              value={formData.status}
              onChange={handleChange}
            >
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="paid">Paid</MenuItem>
              <MenuItem value="unpaid">Unpaid</MenuItem>
            </TextField>

            <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
              >
                {id ? 'Update Invoice' : 'Create Invoice'}
              </Button>
              <Button
                fullWidth
                variant="outlined"
                onClick={() => navigate('/home')}
              >
                Cancel
              </Button>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default InvoiceForm;