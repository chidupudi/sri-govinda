import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Alert
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { getReport } from '../../features/reports/reportSlice';

const Reports = () => {
  const dispatch = useDispatch();
  const { reportData, isLoading, isError, message } = useSelector(
    state => state.reports || {
      reportData: null,
      isLoading: false,
      isError: false,
      message: ''
    }
  );

  const [startDate, setStartDate] = useState(new Date(new Date().setMonth(new Date().getMonth() - 1)));
  const [endDate, setEndDate] = useState(new Date());
  const [activeReport, setActiveReport] = useState('sales');

  const loadReport = useCallback(() => {
    dispatch(getReport({
      reportType: activeReport,
      params: {
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString()
      }
    }));
  }, [dispatch, activeReport, startDate, endDate]);

  useEffect(() => {
    loadReport();
  }, [loadReport]);

  const renderSalesChart = () => {
    if (!reportData) return null;
    return (
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={reportData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="_id" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="totalSales" stroke="#8884d8" />
          <Line type="monotone" dataKey="orderCount" stroke="#82ca9d" />
        </LineChart>
      </ResponsiveContainer>
    );
  };

  const renderInventoryChart = () => {
    if (!reportData) return null;
    return (
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={reportData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="_id" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="totalStock" fill="#8884d8" />
          <Bar dataKey="lowStockItems" fill="#82ca9d" />
        </BarChart>
      </ResponsiveContainer>
    );
  };

  const renderCustomerChart = () => {
    if (!reportData) return null;
    return (
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={reportData}
            dataKey="totalSpent"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={100}
            fill="#8884d8"
            label
          />
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    );
  };

  const renderExpenseChart = () => {
    if (!reportData) return null;
    return (
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={reportData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="_id" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="totalExpenses" fill="#8884d8" />
          <Bar dataKey="averageExpense" fill="#82ca9d" />
        </BarChart>
      </ResponsiveContainer>
    );
  };

  const renderProfitLossChart = () => {
    if (!reportData) return null;
    return (
      <Box sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom>
          Profit & Loss Summary
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="subtitle1">Total Sales</Typography>
              <Typography variant="h4">${reportData.totalSales.toFixed(2)}</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="subtitle1">Total Expenses</Typography>
              <Typography variant="h4">${reportData.totalExpenses.toFixed(2)}</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="subtitle1">Net Profit</Typography>
              <Typography variant="h4" color={reportData.netProfit >= 0 ? 'success.main' : 'error.main'}>
                ${reportData.netProfit.toFixed(2)}
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    );
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Paper sx={{ p: 2 }}>
              <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                <Button
                  variant={activeReport === 'sales' ? 'contained' : 'outlined'}
                  onClick={() => setActiveReport('sales')}
                >
                  Sales Report
                </Button>
                <Button
                  variant={activeReport === 'inventory' ? 'contained' : 'outlined'}
                  onClick={() => setActiveReport('inventory')}
                >
                  Inventory Report
                </Button>
                <Button
                  variant={activeReport === 'customers' ? 'contained' : 'outlined'}
                  onClick={() => setActiveReport('customers')}
                >
                  Customer Report
                </Button>
                <Button
                  variant={activeReport === 'expenses' ? 'contained' : 'outlined'}
                  onClick={() => setActiveReport('expenses')}
                >
                  Expense Report
                </Button>
                <Button
                  variant={activeReport === 'profit-loss' ? 'contained' : 'outlined'}
                  onClick={() => setActiveReport('profit-loss')}
                >
                  Profit & Loss
                </Button>
              </Box>

              <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                <DatePicker
                  label="Start Date"
                  value={startDate}
                  onChange={setStartDate}
                  renderInput={(params) => <TextField {...params} />}
                />
                <DatePicker
                  label="End Date"
                  value={endDate}
                  onChange={setEndDate}
                  renderInput={(params) => <TextField {...params} />}
                />
              </Box>

              <Button variant="contained" onClick={loadReport}>
                Generate Report
              </Button>
            </Paper>

            {isError && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {message}
              </Alert>
            )}

            {isLoading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                <CircularProgress />
              </Box>
            ) : (
              <Paper elevation={3} sx={{ p: 2 }}>
                <Box>
                  {activeReport === 'sales' && renderSalesChart()}
                  {activeReport === 'inventory' && renderInventoryChart()}
                  {activeReport === 'customers' && renderCustomerChart()}
                  {activeReport === 'expenses' && renderExpenseChart()}
                  {activeReport === 'profit-loss' && renderProfitLossChart()}
                </Box>
              </Paper>
            )}
          </Grid>
        </Grid>
      </LocalizationProvider>
    </Container>
  );
};

export default Reports;