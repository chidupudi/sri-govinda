// src/components/billing/Billing.js
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Grid,
  Paper,
  Button,
  TextField,
  MenuItem,
  Typography,
  Autocomplete,
  Alert,
  Divider
} from '@mui/material';
import { createOrder, addToCart } from '../../features/order/orderSlice';
import { fetchCustomers } from '../../features/customer/customerSlice';
import { fetchProducts } from '../../features/products/productSlice';
import Cart from './Cart';
import { useNavigate } from 'react-router-dom';

const Billing = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { cart, loading, error } = useSelector(state => state.orders);
  const { items: customers } = useSelector(state => state.customers);
  const { items: products } = useSelector(state => state.products);

  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('Cash');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);

  const paymentMethods = ['Cash', 'Card', 'UPI', 'Bank Transfer'];

  useEffect(() => {
    dispatch(fetchCustomers({}));
    dispatch(fetchProducts({}));
  }, [dispatch]);

  const handleAddProduct = () => {
    if (selectedProduct && quantity > 0) {
      dispatch(addToCart({ product: selectedProduct, quantity }));
      setSelectedProduct(null);
      setQuantity(1);
    }
  };

  const handleSubmit = async () => {
    if (cart.length === 0) return;
    
    const orderData = {
      customerId: selectedCustomer?.id,
      items: cart.map(item => ({
        product: item.product,
        quantity: item.quantity,
        price: item.product.price
      })),
      paymentMethod,
      total: cart.reduce((total, item) => total + (item.product.price * item.quantity), 0),
      gstAmount: cart.reduce((total, item) => total + (item.product.price * item.quantity * 0.18), 0)
    };
    
    const result = await dispatch(createOrder(orderData));
    if (result.type === 'orders/create/fulfilled') {
      navigate('/orders');
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>Billing</Typography>
      
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
      )}

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2, mb: 2 }}>
            <Typography variant="h6" gutterBottom>Add Products</Typography>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={6}>
                <Autocomplete
                  options={products}
                  getOptionLabel={(product) => `${product.name} - ₹${product.price}`}
                  value={selectedProduct}
                  onChange={(event, newValue) => setSelectedProduct(newValue)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Select Product"
                      fullWidth
                    />
                  )}
                />
              </Grid>
              <Grid item xs={3}>
                <TextField
                  label="Quantity"
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  fullWidth
                />
              </Grid>
              <Grid item xs={3}>
                <Button 
                  variant="contained" 
                  onClick={handleAddProduct}
                  fullWidth
                >
                  Add
                </Button>
              </Grid>
            </Grid>
          </Paper>

          <Paper sx={{ p: 2, mb: 2 }}>
            <Cart />
          </Paper>

          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>Customer Details</Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Autocomplete
                  options={customers}
                  getOptionLabel={(customer) => `${customer.name} (${customer.phone})`}
                  value={selectedCustomer}
                  onChange={(event, newValue) => setSelectedCustomer(newValue)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Select Customer"
                      fullWidth
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  select
                  label="Payment Method"
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  fullWidth
                >
                  {paymentMethods.map((method) => (
                    <MenuItem key={method} value={method}>
                      {method}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, position: 'sticky', top: 20 }}>
            <Typography variant="h6" gutterBottom>Order Summary</Typography>
            <Divider sx={{ my: 2 }} />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography>Subtotal:</Typography>
              <Typography>₹{cart.reduce((total, item) => total + (item.product.price * item.quantity), 0).toFixed(2)}</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography>GST (18%):</Typography>
              <Typography>₹{(cart.reduce((total, item) => total + (item.product.price * item.quantity), 0) * 0.18).toFixed(2)}</Typography>
            </Box>
            <Divider sx={{ my: 2 }} />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="subtitle1">Total:</Typography>
              <Typography variant="subtitle1">
                ₹{(cart.reduce((total, item) => total + (item.product.price * item.quantity), 0) * 1.18).toFixed(2)}
              </Typography>
            </Box>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              size="large"
              onClick={handleSubmit}
              disabled={cart.length === 0 || loading}
            >
              {loading ? 'Processing...' : 'Generate Invoice'}
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Billing;