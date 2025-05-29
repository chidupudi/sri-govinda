import React, { useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Grid
} from '@mui/material';
import { Print as PrintIcon, Download as DownloadIcon } from '@mui/icons-material';
import { getOrder } from '../../features/order/orderSlice';
import { jsPDF } from 'jspdf';

const Invoice = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { currentOrder, isLoading } = useSelector(state => state.orders);
  const invoiceRef = useRef();

  useEffect(() => {
    dispatch(getOrder(id));
  }, [dispatch, id]);

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    const doc = new jsPDF();
    doc.html(invoiceRef.current, {
      callback: function (doc) {
        doc.save(`invoice-${currentOrder.orderNumber}.pdf`);
      },
      x: 10,
      y: 10
    });
  };

  if (isLoading || !currentOrder) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant="h4">Invoice</Typography>
        <Box>
          <Button
            startIcon={<PrintIcon />}
            onClick={handlePrint}
            sx={{ mr: 1 }}
          >
            Print
          </Button>
          <Button
            startIcon={<DownloadIcon />}
            onClick={handleDownload}
          >
            Download PDF
          </Button>
        </Box>
      </Box>

      <Paper sx={{ p: 3 }} ref={invoiceRef}>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Typography variant="h6">Sri Govinda</Typography>
            <Typography>Your Shop Address</Typography>
            <Typography>Phone: Your Phone</Typography>
            <Typography>Email: Your Email</Typography>
            <Typography>GST No: Your GST Number</Typography>
          </Grid>
          <Grid item xs={6} sx={{ textAlign: 'right' }}>
            <Typography>Invoice No: {currentOrder.orderNumber}</Typography>
            <Typography>Date: {new Date(currentOrder.createdAt).toLocaleDateString()}</Typography>
          </Grid>
        </Grid>

        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" gutterBottom>Customer Details</Typography>
          {currentOrder.customer && (
            <>
              <Typography>{currentOrder.customer.name}</Typography>
              <Typography>{currentOrder.customer.phone}</Typography>
              <Typography>{currentOrder.customer.address?.street}</Typography>
              <Typography>
                {currentOrder.customer.address?.city}, {currentOrder.customer.address?.state}
              </Typography>
              {currentOrder.customer.gstNumber && (
                <Typography>GST No: {currentOrder.customer.gstNumber}</Typography>
              )}
            </>
          )}
        </Box>

        <TableContainer sx={{ mt: 4 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Item</TableCell>
                <TableCell align="right">Weight (g)</TableCell>
                <TableCell align="right">Quantity</TableCell>
                <TableCell align="right">Price</TableCell>
                <TableCell align="right">Total</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {currentOrder.items.map((item) => (
                <TableRow key={item._id}>
                  <TableCell>{item.product.name}</TableCell>
                  <TableCell align="right">{item.weight}</TableCell>
                  <TableCell align="right">{item.quantity}</TableCell>
                  <TableCell align="right">₹{item.price}</TableCell>
                  <TableCell align="right">₹{item.price * item.quantity}</TableCell>
                </TableRow>
              ))}
              <TableRow>
                <TableCell colSpan={4} align="right">Subtotal:</TableCell>
                <TableCell align="right">₹{currentOrder.subtotal}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell colSpan={4} align="right">GST (18%):</TableCell>
                <TableCell align="right">₹{currentOrder.gst}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell colSpan={4} align="right">
                  <Typography variant="h6">Total:</Typography>
                </TableCell>
                <TableCell align="right">
                  <Typography variant="h6">₹{currentOrder.total}</Typography>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>

        <Box sx={{ mt: 4 }}>
          <Typography variant="body2">Payment Method: {currentOrder.paymentMethod}</Typography>
          <Typography variant="body2" sx={{ mt: 2 }}>Thank you for your business!</Typography>
        </Box>
      </Paper>
    </Box>
  );
};

export default Invoice;