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
  Typography,
  MenuItem,
  Select,
  FormControl,
  InputLabel
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { fetchExpenses, deleteExpense, setSelectedExpense, getExpenseSummary } from '../../features/expense/expenseSlice'; // Fixed import
import ExpenseForm from './ExpenseForm';
import ExpenseSummary from './ExpenseSummary';

const ExpenseList = () => {
  const dispatch = useDispatch();
  const { items: expenses, total } = useSelector(state => state.expenses); // Fixed destructuring
  
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [category, setCategory] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [openForm, setOpenForm] = useState(false);

  // Wrap fetchExpenses in useCallback
  const fetchExpensesData = useCallback(() => {
    const params = {
      page: page + 1,
      limit: rowsPerPage,
      ...(startDate && { startDate: startDate.toISOString() }),
      ...(endDate && { endDate: endDate.toISOString() }),
      ...(category && { category })
    };
    dispatch(fetchExpenses(params)); // Fixed function name
    dispatch(getExpenseSummary(params));
  }, [page, rowsPerPage, startDate, endDate, category, dispatch]);
  
  useEffect(() => {
    fetchExpensesData();
  }, [fetchExpensesData]);

  const handleEdit = (expense) => {
    dispatch(setSelectedExpense(expense));
    setOpenForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      await dispatch(deleteExpense(id));
      fetchExpensesData();
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

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

  return (
    <Box sx={{ p: 3 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <ExpenseSummary />
        </Grid>
        
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h5">Expenses</Typography>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => {
                    dispatch(setSelectedExpense(null));
                    setOpenForm(true);
                  }}
                >
                  Add Expense
                </Button>
              </Box>
              
              <Grid container spacing={2} sx={{ mb: 2 }}>
                <Grid item xs={12} sm={3}>
                  <DatePicker
                    label="Start Date"
                    value={startDate}
                    onChange={setStartDate}
                    renderInput={(params) => <TextField {...params} fullWidth />}
                  />
                </Grid>
                <Grid item xs={12} sm={3}>
                  <DatePicker
                    label="End Date"
                    value={endDate}
                    onChange={setEndDate}
                    renderInput={(params) => <TextField {...params} fullWidth />}
                  />
                </Grid>
                <Grid item xs={12} sm={3}>
                  <FormControl fullWidth>
                    <InputLabel>Category</InputLabel>
                    <Select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      label="Category"
                    >
                      <MenuItem value="">All</MenuItem>
                      {categories.map((cat) => (
                        <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={3}>
                  <Button
                    variant="outlined"
                    onClick={() => {
                      setStartDate(null);
                      setEndDate(null);
                      setCategory('');
                    }}
                    fullWidth
                    sx={{ height: '100%' }}
                  >
                    Clear Filters
                  </Button>
                </Grid>
              </Grid>

              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Date</TableCell>
                      <TableCell>Title</TableCell>
                      <TableCell>Category</TableCell>
                      <TableCell>Amount</TableCell>
                      <TableCell>Payment Method</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {expenses.map((expense) => (
                      <TableRow key={expense.id}>
                        <TableCell>
                          {new Date(expense.date?.toDate?.() || expense.date).toLocaleDateString()}
                        </TableCell>
                        <TableCell>{expense.title}</TableCell>
                        <TableCell>{expense.category}</TableCell>
                        <TableCell>₹{expense.amount.toFixed(2)}</TableCell>
                        <TableCell>{expense.paymentMethod}</TableCell>
                        <TableCell>
                          <IconButton onClick={() => handleEdit(expense)}>
                            <EditIcon />
                          </IconButton>
                          <IconButton onClick={() => handleDelete(expense.id)}>
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

      <ExpenseForm
        open={openForm}
        onClose={() => setOpenForm(false)}
        onSuccess={() => {
          setOpenForm(false);
          fetchExpensesData();
        }}
      />
    </Box>
  );
};

export default ExpenseList;