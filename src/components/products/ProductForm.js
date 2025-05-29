import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import {
  Box,
  TextField,
  Button,
  MenuItem,
  Grid,
  Alert,
  CircularProgress
} from '@mui/material';
import { createProduct, updateProduct, fetchProducts } from '../../features/products/productSlice';
import * as Yup from 'yup';
import { useFormik } from 'formik';

const ProductForm = ({ product, onClose }) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const validationSchema = Yup.object({
    name: Yup.string().required('Product name is required'),
    category: Yup.string().required('Category is required'),
    price: Yup.number().required('Price is required').positive('Price must be positive'),
    weight: Yup.number().positive('Weight must be positive'),
    costPrice: Yup.number().positive('Cost price must be positive'),
    stock: Yup.number().integer('Stock must be a whole number').min(0, 'Stock cannot be negative')
  });

  const formik = useFormik({
    initialValues: {
      name: product?.name || '',
      category: product?.category || 'German silver',
      price: product?.price || '',
      weight: product?.weight || '',
      costPrice: product?.costPrice || '',
      stock: product?.stock || 1,
      description: product?.description || ''
    },
    validationSchema,
    onSubmit: async (values) => {
      setLoading(true);
      setError('');
      setSuccess('');
      
      try {
        console.log('Submitting product:', values);
        
        if (product) {
          // Update existing product
          const result = await dispatch(updateProduct({ 
            id: product.id, 
            productData: values 
          }));
          
          if (updateProduct.fulfilled.match(result)) {
            setSuccess('Product updated successfully!');
            // Wait a moment for the update to complete
            setTimeout(() => {
              dispatch(fetchProducts({})); // Refresh the products list
              onClose();
            }, 1000);
          } else {
            throw new Error(result.payload || 'Failed to update product');
          }
        } else {
          // Create new product
          const result = await dispatch(createProduct(values));
          
          if (createProduct.fulfilled.match(result)) {
            setSuccess('Product created successfully!');
            console.log('Product created:', result.payload);
            // Wait a moment for the creation to complete
            setTimeout(() => {
              dispatch(fetchProducts({})); // Refresh the products list
              onClose();
            }, 1000);
          } else {
            throw new Error(result.payload || 'Failed to create product');
          }
        }
      } catch (err) {
        console.error('Error saving product:', err);
        setError(err.message || 'Failed to save product. Please try again.');
      } finally {
        setLoading(false);
      }
    }
  });

  return (
    <Box component="form" onSubmit={formik.handleSubmit} sx={{ mt: 2 }}>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      
      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {success}
        </Alert>
      )}

      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            name="name"
            label="Product Name"
            fullWidth
            required
            value={formik.values.name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.name && Boolean(formik.errors.name)}
            helperText={formik.touched.name && formik.errors.name}
          />
        </Grid>
        
        <Grid item xs={12}>
          <TextField
            name="category"
            label="Category"
            select
            fullWidth
            required
            value={formik.values.category}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.category && Boolean(formik.errors.category)}
            helperText={formik.touched.category && formik.errors.category}
          >
            <MenuItem value="German silver">German silver</MenuItem>
            <MenuItem value="1g gold">1g gold</MenuItem>
            <MenuItem value="Panchaloha">Panchaloha</MenuItem>
            <MenuItem value="Gifts">Gifts</MenuItem>
          </TextField>
        </Grid>
        
        <Grid item xs={6}>
          <TextField
            name="price"
            label="Price (₹)"
            type="number"
            fullWidth
            required
            value={formik.values.price}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.price && Boolean(formik.errors.price)}
            helperText={formik.touched.price && formik.errors.price}
          />
        </Grid>
        
        <Grid item xs={6}>
          <TextField
            name="weight"
            label="Weight (g)"
            type="number"
            fullWidth
            value={formik.values.weight}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.weight && Boolean(formik.errors.weight)}
            helperText={formik.touched.weight && formik.errors.weight}
          />
        </Grid>
        
        <Grid item xs={6}>
          <TextField
            name="costPrice"
            label="Cost Price (₹)"
            type="number"
            fullWidth
            value={formik.values.costPrice}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.costPrice && Boolean(formik.errors.costPrice)}
            helperText={formik.touched.costPrice && formik.errors.costPrice}
          />
        </Grid>
        
        <Grid item xs={6}>
          <TextField
            name="stock"
            label="Stock"
            type="number"
            fullWidth
            value={formik.values.stock}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.stock && Boolean(formik.errors.stock)}
            helperText={formik.touched.stock && formik.errors.stock}
          />
        </Grid>
        
        <Grid item xs={12}>
          <TextField
            name="description"
            label="Description"
            fullWidth
            multiline
            rows={3}
            value={formik.values.description}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
        </Grid>
      </Grid>
      
      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
        <Button onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button 
          type="submit" 
          variant="contained"
          disabled={loading}
          startIcon={loading ? <CircularProgress size={20} /> : null}
        >
          {loading ? 'Saving...' : (product ? 'Update' : 'Create')}
        </Button>
      </Box>
    </Box>
  );
};

export default ProductForm;