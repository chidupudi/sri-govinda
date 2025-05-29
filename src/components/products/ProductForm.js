import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import {
  Box,
  TextField,
  Button,
  MenuItem,
  Grid
} from '@mui/material';
import { createProduct, updateProduct } from '../../redux/slices/productSlice';
import * as Yup from 'yup';
import { useFormik } from 'formik';

const ProductForm = ({ product, onClose }) => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    name: product?.name || '',
    category: product?.category || 'German silver',
    price: product?.price || '',
    weight: product?.weight || '',
    costPrice: product?.costPrice || '',
    stock: product?.stock || 1
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (product) {
      await dispatch(updateProduct({ id: product._id, productData: formData }));
    } else {
      await dispatch(createProduct(formData));
    }
    onClose();
  };

  const validationSchema = Yup.object({
    name: Yup.string().required('Required'),
    price: Yup.number().required('Required').positive(),
    weight: Yup.number().positive(),
    stock: Yup.number().integer().min(0)
  });

  const formik = useFormik({
    initialValues: {
      name: product?.name || '',
      category: product?.category || 'German silver',
      price: product?.price || '',
      weight: product?.weight || '',
      costPrice: product?.costPrice || '',
      stock: product?.stock || 1
    },
    validationSchema: Yup.object({
      name: Yup.string().required('Required'),
      price: Yup.number().required('Required').positive(),
      weight: Yup.number().positive(),
      stock: Yup.number().integer().min(0)
    }),
    onSubmit: async (values) => {
      if (product) {
        await dispatch(updateProduct({ id: product._id, productData: values }));
      } else {
        await dispatch(createProduct(values));
      }
      onClose();
    }
  });
  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            name="name"
            label="Product Name"
            fullWidth
            required
            value={formData.name}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            name="category"
            label="Category"
            select
            fullWidth
            required
            value={formData.category}
            onChange={handleChange}
          >
            <MenuItem value="German silver">German silver</MenuItem>
            <MenuItem value="1g gold">1g gold</MenuItem>
          </TextField>
        </Grid>
        <Grid item xs={6}>
          <TextField
            name="price"
            label="Price (₹)"
            type="number"
            fullWidth
            required
            value={formData.price}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            name="stock"
            label="Stock"
            type="number"
            fullWidth
            value={formData.stock}
            onChange={handleChange}
          />
        </Grid>
      </Grid>
      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
        <Button onClick={onClose}>Cancel</Button>
        <Button type="submit" variant="contained">
          {product ? 'Update' : 'Create'}
        </Button>
      </Box>
    </Box>
  );
};

export default ProductForm;