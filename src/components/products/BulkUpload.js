import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import {
  Box,
  Button,
  Typography,
  Alert,
  CircularProgress
} from '@mui/material';
import { CloudUpload as CloudUploadIcon } from '@mui/icons-material';
// Removed the non-existent productService import since we're using Firebase
import { fetchProducts } from '../../features/products/productSlice';

const BulkUpload = ({ onSuccess }) => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const dispatch = useDispatch();

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile && selectedFile.type === 'text/csv') {
      setFile(selectedFile);
      setError('');
    } else {
      setError('Please select a valid CSV file');
      setFile(null);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file first');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // For now, we'll show a message that bulk upload needs backend implementation
      // In a real app, you would implement CSV parsing and bulk product creation
      setError('Bulk upload feature requires backend implementation. Please add products individually for now.');
      setFile(null);
      
      // Refresh the products list
      dispatch(fetchProducts({}));
      
      // Note: Remove this setTimeout in production - it's just for demo
      setTimeout(() => {
        if (onSuccess) onSuccess();
      }, 2000);
    } catch (err) {
      setError('Upload failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Select a CSV file with columns: name, category, weight, price, costPrice, stock
      </Typography>
      
      <input
        accept=".csv"
        style={{ display: 'none' }}
        id="raised-button-file"
        type="file"
        onChange={handleFileChange}
      />
      <label htmlFor="raised-button-file">
        <Button
          variant="outlined"
          component="span"
          startIcon={<CloudUploadIcon />}
          disabled={loading}
        >
          Select CSV File
        </Button>
      </label>
      
      {file && (
        <Typography variant="body2" sx={{ mt: 1 }}>
          Selected file: {file.name}
        </Typography>
      )}
      
      {error && (
        <Alert severity="error" sx={{ mt: 1 }}>
          {error}
        </Alert>
      )}
      
      <Button
        variant="contained"
        onClick={handleUpload}
        disabled={!file || loading}
        sx={{ mt: 2 }}
        startIcon={loading ? <CircularProgress size={20} /> : null}
      >
        {loading ? 'Processing...' : 'Upload'}
      </Button>
    </Box>
  );
};

export default BulkUpload;