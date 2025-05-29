import React, { useEffect, useState } from 'react';
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
import { getCustomers, deleteCustomer, setSelectedCustomer } from '../../features/customer/customerSlice';
import CustomerForm from './CustomerForm';

// Add missing imports
// import { CircularProgress } from '@mui/material';

// Add this import at the top
import { useCallback } from 'react';

const CustomerList = () => {
  const dispatch = useDispatch();
  const { customers, total } = useSelector(state => state.customers);
  
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [openForm, setOpenForm] = useState(false);

  const fetchCustomers = useCallback(() => {
    dispatch(getCustomers({
      page: page + 1,
      limit: rowsPerPage,
      search
    }));
  }, [dispatch, page, rowsPerPage, search]);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  // Remove unused variables or use them
  // const loadingIndicator = isLoading ? <CircularProgress /> : null;
  // const pageInfo = `Page ${currentPage} of ${Math.ceil(total / rowsPerPage)}`;

  const handleEdit = (customer) => {
    dispatch(setSelectedCustomer(customer));
    setOpenForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this customer?')) {
      await dispatch(deleteCustomer(id));
      fetchCustomers();
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

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
                    {customers.map((customer) => (
                      <TableRow key={customer._id}>
                        <TableCell>{customer.name}</TableCell>
                        <TableCell>{customer.phone}</TableCell>
                        <TableCell>{customer.email}</TableCell>
                        <TableCell>{customer.gstNumber}</TableCell>
                        <TableCell>{customer.totalPurchases}</TableCell>
                        <TableCell>
                          <IconButton onClick={() => handleEdit(customer)}>
                            <EditIcon />
                          </IconButton>
                          <IconButton onClick={() => handleDelete(customer._id)}>
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
                  count={total}
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
          fetchCustomers();
        }}
      />
    </Box>
  );
};

export default CustomerList;
