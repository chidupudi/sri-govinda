import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  TextField
} from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { createCustomer, updateCustomer } from '../../features/customer/customerSlice';

const CustomerForm = ({ open, onClose, onSuccess }) => {
  const dispatch = useDispatch();
  const { selectedCustomer } = useSelector(state => state.customers);

  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      phone: '',
      address: {
        street: '',
        city: '',
        state: '',
        pincode: ''
      },
      gstNumber: ''
    },
    validationSchema: Yup.object({
      name: Yup.string().required('Required'),
      email: Yup.string().email('Invalid email address'),
      phone: Yup.string().required('Required'),
      address: Yup.object({
        street: Yup.string(),
        city: Yup.string(),
        state: Yup.string(),
        pincode: Yup.string()
      }),
      gstNumber: Yup.string()
    }),
    onSubmit: async (values) => {
      try {
        if (selectedCustomer) {
          await dispatch(updateCustomer({ id: selectedCustomer.id, customerData: values }));
        } else {
          await dispatch(createCustomer(values));
        }
        onSuccess();
      } catch (error) {
        console.error('Error saving customer:', error);
      }
    }
  });

  // Fixed useEffect to properly handle form reset and population
  useEffect(() => {
    if (selectedCustomer) {
      formik.setValues({
        name: selectedCustomer.name || '',
        email: selectedCustomer.email || '',
        phone: selectedCustomer.phone || '',
        address: selectedCustomer.address || {
          street: '',
          city: '',
          state: '',
          pincode: ''
        },
        gstNumber: selectedCustomer.gstNumber || ''
      });
    } else {
      formik.resetForm();
    }
  }, [selectedCustomer]); // Only depend on selectedCustomer

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>{selectedCustomer ? 'Edit Customer' : 'Add Customer'}</DialogTitle>
      <form onSubmit={formik.handleSubmit}>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                name="name"
                label="Name"
                value={formik.values.name}
                onChange={formik.handleChange}
                error={formik.touched.name && Boolean(formik.errors.name)}
                helperText={formik.touched.name && formik.errors.name}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                name="phone"
                label="Phone"
                value={formik.values.phone}
                onChange={formik.handleChange}
                error={formik.touched.phone && Boolean(formik.errors.phone)}
                helperText={formik.touched.phone && formik.errors.phone}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                name="email"
                label="Email"
                value={formik.values.email}
                onChange={formik.handleChange}
                error={formik.touched.email && Boolean(formik.errors.email)}
                helperText={formik.touched.email && formik.errors.email}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                name="gstNumber"
                label="GST Number"
                value={formik.values.gstNumber}
                onChange={formik.handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                name="address.street"
                label="Street"
                value={formik.values.address.street}
                onChange={formik.handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                name="address.city"
                label="City"
                value={formik.values.address.city}
                onChange={formik.handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                name="address.state"
                label="State"
                value={formik.values.address.state}
                onChange={formik.handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                name="address.pincode"
                label="Pincode"
                value={formik.values.address.pincode}
                onChange={formik.handleChange}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained" color="primary">
            {selectedCustomer ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default CustomerForm;