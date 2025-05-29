import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  TextField,
  MenuItem
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { createExpense, updateExpense } from '../../features/expense/expenseSlice';

const ExpenseForm = ({ open, onClose, onSuccess }) => {
  const dispatch = useDispatch();
  const { selectedExpense } = useSelector(state => state.expenses);

  const categories = [
    'Utilities',
    'Rent',
    'Salaries',
    'Maintenance',
    'Supplies',
    'Transportation',
    'Marketing',
    'Insurance',
    'Others'
  ];

  const paymentMethods = [
    'Cash',
    'Bank Transfer',
    'UPI',
    'Credit Card',
    'Debit Card',
    'Cheque'
  ];

  const formik = useFormik({
    initialValues: {
      title: selectedExpense?.title || '',
      amount: selectedExpense?.amount || 0,
      category: selectedExpense?.category || '',
      date: selectedExpense?.date || new Date(),
      paymentMethod: selectedExpense?.paymentMethod || ''
    },
    validationSchema: Yup.object({
      title: Yup.string().required('Required'),
      amount: Yup.number().required('Required').positive(),
      category: Yup.string().required('Required'),
      date: Yup.date().required('Required'),
      paymentMethod: Yup.string().required('Required')
    }),
    onSubmit: async (values) => {
      if (selectedExpense) {
        await dispatch(updateExpense({ id: selectedExpense._id, expenseData: values }));
      } else {
        await dispatch(createExpense(values));
      }
      onSuccess();
    }
  });

  // Update the useEffect dependency array
  // Add selectedExpense to useEffect dependencies
  useEffect(() => {
    if (selectedExpense) {
      formik.setValues({
        title: selectedExpense.title || '',
        amount: selectedExpense.amount || '',
        category: selectedExpense.category || '',
        date: selectedExpense.date ? new Date(selectedExpense.date) : new Date(),
        paymentMethod: selectedExpense.paymentMethod || '',
        description: selectedExpense.description || '',
        receiptNumber: selectedExpense.receiptNumber || ''
      });
    }
  }, [selectedExpense, formik]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>{selectedExpense ? 'Edit Expense' : 'Add Expense'}</DialogTitle>
      <form onSubmit={formik.handleSubmit}>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                name="title"
                label="Title"
                value={formik.values.title}
                onChange={formik.handleChange}
                error={formik.touched.title && Boolean(formik.errors.title)}
                helperText={formik.touched.title && formik.errors.title}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                name="amount"
                label="Amount"
                type="number"
                value={formik.values.amount}
                onChange={formik.handleChange}
                error={formik.touched.amount && Boolean(formik.errors.amount)}
                helperText={formik.touched.amount && formik.errors.amount}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                select
                name="category"
                label="Category"
                value={formik.values.category}
                onChange={formik.handleChange}
                error={formik.touched.category && Boolean(formik.errors.category)}
                helperText={formik.touched.category && formik.errors.category}
              >
                {categories.map((category) => (
                  <MenuItem key={category} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <DatePicker
                label="Date"
                value={formik.values.date}
                onChange={(value) => formik.setFieldValue('date', value)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    fullWidth
                    error={formik.touched.date && Boolean(formik.errors.date)}
                    helperText={formik.touched.date && formik.errors.date}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                select
                name="paymentMethod"
                label="Payment Method"
                value={formik.values.paymentMethod}
                onChange={formik.handleChange}
                error={formik.touched.paymentMethod && Boolean(formik.errors.paymentMethod)}
                helperText={formik.touched.paymentMethod && formik.errors.paymentMethod}
              >
                {paymentMethods.map((method) => (
                  <MenuItem key={method} value={method}>
                    {method}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                name="receiptNumber"
                label="Receipt Number"
                value={formik.values.receiptNumber}
                onChange={formik.handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={4}
                name="description"
                label="Description"
                value={formik.values.description}
                onChange={formik.handleChange}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained" color="primary">
            {selectedExpense ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default ExpenseForm;
