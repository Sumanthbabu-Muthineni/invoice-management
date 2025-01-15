import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  Chip,
  IconButton,
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const getStatusColor = (status) => {
  switch (status.toLowerCase()) {
    case 'paid':
      return 'success';
    case 'unpaid':
      return 'error';
    case 'pending':
      return 'warning';
    default:
      return 'default';
  }
};

const InvoiceCard = ({ invoice, onDelete }) => {
  const navigate = useNavigate();

  const handleEdit = () => {
    navigate(`/invoice/edit/${invoice._id}`);
  };

  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6" component="div">
            Invoice #{invoice.invoiceNumber}
          </Typography>
          <Chip
            label={invoice.status}
            color={getStatusColor(invoice.status)}
            size="small"
          />
        </Box>

        <Box display="flex" justifyContent="space-between" mb={1}>
          <Typography color="text.secondary">Client:</Typography>
          <Typography>{invoice.clientName}</Typography>
        </Box>

        <Box display="flex" justifyContent="space-between" mb={1}>
          <Typography color="text.secondary">Amount:</Typography>
          <Typography>${invoice.amount.toFixed(2)}</Typography>
        </Box>

        <Box display="flex" justifyContent="space-between" mb={1}>
          <Typography color="text.secondary">Date:</Typography>
          <Typography>
            {new Date(invoice.date).toLocaleDateString()}
          </Typography>
        </Box>

        <Box display="flex" justifyContent="flex-end" mt={2}>
          <IconButton 
            color="primary" 
            onClick={handleEdit}
            size="small"
            sx={{ mr: 1 }}
          >
            <EditIcon />
          </IconButton>
          <IconButton 
            color="error" 
            onClick={() => onDelete(invoice._id)}
            size="small"
          >
            <DeleteIcon />
          </IconButton>
        </Box>
      </CardContent>
    </Card>
  );
};

export default InvoiceCard;