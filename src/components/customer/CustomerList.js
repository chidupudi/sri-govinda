// src/components/customer/CustomerList.js
import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { fetchCustomers, deleteCustomer, setSelectedCustomer } from '../../features/customer/customerSlice';
import CustomerForm from './CustomerForm';

const CustomerList = () => {
  const dispatch = useDispatch();
  const { items: customers, total, loading } = useSelector(state => state.customers);
  
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [openForm, setOpenForm] = useState(false);

  const fetchCustomersData = useCallback(() => {
    dispatch(fetchCustomers({ search }));
  }, [dispatch, search]);

  useEffect(() => {
    fetchCustomersData();
  }, [fetchCustomersData]);

  const handleEdit = (customer) => {
    dispatch(setSelectedCustomer(customer));
    setOpenForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this customer?')) {
      await dispatch(deleteCustomer(id));
      fetchCustomersData();
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Get paginated customers
  const paginatedCustomers = customers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <Box sx={{ p: 3 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h5">Customers</Typography>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => {
                    dispatch(setSelectedCustomer(null));
                    setOpenForm(true);
                  }}
                >
                  Add Customer
                </Button>
              </Box>
              
              <TextField
                label="Search"
                variant="outlined"
                size="small"
                fullWidth
                sx={{ mb: 2 }}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />

              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Name</TableCell>
                      <TableCell>Phone</TableCell>
                      <TableCell>Email</TableCell>
                      <TableCell>GST Number</TableCell>
                      <TableCell>Total Purchases</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {paginatedCustomers.map((customer) => (
                      <TableRow key={customer.id}>
                        <TableCell>{customer.name}</TableCell>
                        <TableCell>{customer.phone}</TableCell>
                        <TableCell>{customer.email}</TableCell>
                        <TableCell>{customer.gstNumber}</TableCell>
                        <TableCell>{customer.totalPurchases || 0}</TableCell>
                        <TableCell>
                          <IconButton onClick={() => handleEdit(customer)}>
                            <EditIcon />
                          </IconButton>
                          <IconButton onClick={() => handleDelete(customer.id)}>
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <TablePagination
                  rowsPerPageOptions={[5, 10, 25]}
                  component="div"
                  count={customers.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                />
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <CustomerForm
        open={openForm}
        onClose={() => setOpenForm(false)}
        onSuccess={() => {
          setOpenForm(false);
          fetchCustomersData();
        }}
      />
    </Box>
  );
};

export default CustomerList;