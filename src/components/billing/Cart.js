import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Typography,
  TextField
} from '@mui/material';
import { Delete as DeleteIcon } from '@mui/icons-material';
import { removeFromCart, updateCartItemQuantity } from '../../features/order/orderSlice';

const Cart = () => {
  const dispatch = useDispatch();
  const { cart } = useSelector(state => state.orders);

  const handleQuantityChange = (productId, quantity) => {
    if (quantity > 0) {
      dispatch(updateCartItemQuantity({ productId, quantity }));
    }
  };

  const calculateSubtotal = () => {
    return cart.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  };

  const calculateGST = () => {
    return calculateSubtotal() * 0.18; // 18% GST
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateGST();
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>Cart</Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Product</TableCell>
              <TableCell align="right">Price</TableCell>
              <TableCell align="right">Quantity</TableCell>
              <TableCell align="right">Total</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {cart.map((item) => (
              <TableRow key={item.product._id}>
                <TableCell>{item.product.name}</TableCell>
                <TableCell align="right">₹{item.product.price}</TableCell>
                <TableCell align="right">
                  <TextField
                    type="number"
                    value={item.quantity}
                    onChange={(e) => handleQuantityChange(item.product._id, parseInt(e.target.value))}
                    size="small"
                    inputProps={{ min: 1 }}
                    sx={{ width: 80 }}
                  />
                </TableCell>
                <TableCell align="right">₹{item.product.price * item.quantity}</TableCell>
                <TableCell align="right">
                  <IconButton
                    color="error"
                    onClick={() => dispatch(removeFromCart(item.product._id))}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            <TableRow>
              <TableCell colSpan={3} align="right">Subtotal:</TableCell>
              <TableCell align="right" colSpan={2}>₹{calculateSubtotal()}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell colSpan={3} align="right">GST (18%):</TableCell>
              <TableCell align="right" colSpan={2}>₹{calculateGST()}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell colSpan={3} align="right">
                <Typography variant="h6">Total:</Typography>
              </TableCell>
              <TableCell align="right" colSpan={2}>
                <Typography variant="h6">₹{calculateTotal()}</Typography>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default Cart;