// src/components/reports/Reports.js
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
  Alert,
  Card,
  CardContent,
  Divider,
  useTheme,
  alpha
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers';
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  Area,
  AreaChart
} from 'recharts';
import {
  TrendingUp,
  TrendingDown,
  AttachMoney,
  ShoppingCart,
  People,
  Inventory,
  AccountBalance,
  Assessment
} from '@mui/icons-material';
import { 
  generateSalesReport,
  generateInventoryReport,
  generateCustomerReport,
  generateExpenseReport,
  generateProfitLossReport,
  clearReport
} from '../../features/reports/reportSlice';

const StatCard = ({ title, value, change, changeType, icon: Icon, color }) => {
  const theme = useTheme();
  
  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box>
            <Typography color="textSecondary" gutterBottom variant="body2">
              {title}
            </Typography>
            <Typography variant="h4" component="div" sx={{ mb: 1 }}>
              {value}
            </Typography>
            {change && (
              <Box display="flex" alignItems="center">
                {changeType === 'increase' ? (
                  <TrendingUp color="success" fontSize="small" />
                ) : (
                  <TrendingDown color="error" fontSize="small" />
                )}
                <Typography 
                  variant="body2" 
                  color={changeType === 'increase' ? 'success.main' : 'error.main'}
                  sx={{ ml: 0.5 }}
                >
                  {change}
                </Typography>
              </Box>
            )}
          </Box>
          <Box
            sx={{
              p: 2,
              borderRadius: 2,
              backgroundColor: alpha(theme.palette[color]?.main || color, 0.1)
            }}
          >
            <Icon 
              sx={{ 
                fontSize: 32, 
                color: theme.palette[color]?.main || color
              }} 
            />
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

const Reports = () => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const { reportData, loading, error, reportType } = useSelector(state => state.reports);

  const [startDate, setStartDate] = useState(new Date(new Date().setMonth(new Date().getMonth() - 1)));
  const [endDate, setEndDate] = useState(new Date());
  const [activeReport, setActiveReport] = useState('sales');

  const loadReport = useCallback(() => {
    const params = {
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString()
    };

    dispatch(clearReport());

    switch (activeReport) {
      case 'sales':
        dispatch(generateSalesReport(params));
        break;
      case 'inventory':
        dispatch(generateInventoryReport());
        break;
      case 'customers':
        dispatch(generateCustomerReport(params));
        break;
      case 'expenses':
        dispatch(generateExpenseReport(params));
        break;
      case 'profit-loss':
        dispatch(generateProfitLossReport(params));
        break;
      default:
        break;
    }
  }, [dispatch, activeReport, startDate, endDate]);

  useEffect(() => {
    loadReport();
  }, [activeReport]);

  const reportButtons = [
    { key: 'sales', label: 'Sales Report', icon: TrendingUp, color: 'primary' },
    { key: 'inventory', label: 'Inventory Report', icon: Inventory, color: 'secondary' },
    { key: 'customers', label: 'Customer Report', icon: People, color: 'info' },
    { key: 'expenses', label: 'Expense Report', icon: AccountBalance, color: 'warning' },
    { key: 'profit-loss', label: 'Profit & Loss', icon: Assessment, color: 'success' }
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82ca9d', '#ffc658'];

  const renderSalesReport = () => {
    if (!reportData || reportData.length === 0) {
      return (
        <Typography variant="body1" color="textSecondary" align="center" sx={{ py: 4 }}>
          No sales data available for the selected period
        </Typography>
      );
    }

    const totalSales = reportData.reduce((sum, item) => sum + item.totalSales, 0);
    const totalOrders = reportData.reduce((sum, item) => sum + item.orderCount, 0);
    const avgOrderValue = totalOrders > 0 ? totalSales / totalOrders : 0;

    return (
      <>
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} md={4}>
            <StatCard
              title="Total Sales"
              value={`₹${totalSales.toLocaleString()}`}
              change="+12.5%"
              changeType="increase"
              icon={AttachMoney}
              color="success"
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <StatCard
              title="Total Orders"
              value={totalOrders.toLocaleString()}
              change="+8.3%"
              changeType="increase"
              icon={ShoppingCart}
              color="primary"
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <StatCard
              title="Avg Order Value"
              value={`₹${avgOrderValue.toLocaleString()}`}
              change="+4.1%"
              changeType="increase"
              icon={TrendingUp}
              color="info"
            />
          </Grid>
        </Grid>

        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Sales Trend Over Time
            </Typography>
            <ResponsiveContainer width="100%" height={400}>
              <AreaChart data={reportData}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={theme.palette.primary.main} stopOpacity={0.8}/>
                    <stop offset="95%" stopColor={theme.palette.primary.main} stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="_id" />
                <YAxis />
                <Tooltip 
                  formatter={(value, name) => [
                    name === 'totalSales' ? `₹${value.toLocaleString()}` : value,
                    name === 'totalSales' ? 'Sales' : 'Orders'
                  ]}
                />
                <Legend />
                <Area 
                  type="monotone" 
                  dataKey="totalSales" 
                  stroke={theme.palette.primary.main}
                  fillOpacity={1}
                  fill="url(#colorSales)"
                  name="Sales (₹)"
                />
                <Line 
                  type="monotone" 
                  dataKey="orderCount" 
                  stroke={theme.palette.secondary.main}
                  strokeWidth={3}
                  name="Orders"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </>
    );
  };

  const renderInventoryReport = () => {
    if (!reportData || reportData.length === 0) {
      return (
        <Typography variant="body1" color="textSecondary" align="center" sx={{ py: 4 }}>
          No inventory data available
        </Typography>
      );
    }

    const totalValue = reportData.reduce((sum, item) => sum + item.totalValue, 0);
    const totalItems = reportData.reduce((sum, item) => sum + item.itemCount, 0);
    const lowStockItems = reportData.reduce((sum, item) => sum + item.lowStockItems, 0);

    return (
      <>
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} md={4}>
            <StatCard
              title="Total Inventory Value"
              value={`₹${totalValue.toLocaleString()}`}
              icon={AttachMoney}
              color="primary"
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <StatCard
              title="Total Items"
              value={totalItems.toLocaleString()}
              icon={Inventory}
              color="secondary"
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <StatCard
              title="Low Stock Items"
              value={lowStockItems.toString()}
              change={lowStockItems > 0 ? "Attention Required" : "All Good"}
              changeType={lowStockItems > 0 ? "decrease" : "increase"}
              icon={TrendingDown}
              color="warning"
            />
          </Grid>
        </Grid>

        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Inventory by Category
                </Typography>
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart data={reportData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="_id" />
                    <YAxis />
                    <Tooltip formatter={(value, name) => [
                      name === 'totalValue' ? `₹${value.toLocaleString()}` : value,
                      name === 'totalValue' ? 'Value' : name === 'totalStock' ? 'Stock' : 'Low Stock Items'
                    ]} />
                    <Legend />
                    <Bar dataKey="totalStock" fill={theme.palette.primary.main} name="Total Stock" />
                    <Bar dataKey="lowStockItems" fill={theme.palette.error.main} name="Low Stock Items" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Category Distribution
                </Typography>
                <ResponsiveContainer width="100%" height={350}>
                  <PieChart>
                    <Pie
                      data={reportData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ _id, percent }) => `${_id} (${(percent * 100).toFixed(0)}%)`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="totalValue"
                    >
                      {reportData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`₹${value.toLocaleString()}`, 'Value']} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </>
    );
  };

  const renderCustomerReport = () => {
    if (!reportData || reportData.length === 0) {
      return (
        <Typography variant="body1" color="textSecondary" align="center" sx={{ py: 4 }}>
          No customer data available for the selected period
        </Typography>
      );
    }

    const totalCustomers = reportData.length;
    const totalSpent = reportData.reduce((sum, customer) => sum + customer.totalSpent, 0);
    const avgSpending = totalCustomers > 0 ? totalSpent / totalCustomers : 0;

    return (
      <>
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} md={4}>
            <StatCard
              title="Active Customers"
              value={totalCustomers.toString()}
              icon={People}
              color="primary"
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <StatCard
              title="Total Customer Spending"
              value={`₹${totalSpent.toLocaleString()}`}
              icon={AttachMoney}
              color="success"
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <StatCard
              title="Avg Spending per Customer"
              value={`₹${avgSpending.toLocaleString()}`}
              icon={TrendingUp}
              color="info"
            />
          </Grid>
        </Grid>

        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Top Customers by Spending
                </Typography>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={reportData.slice(0, 10)} layout="horizontal">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" width={100} />
                    <Tooltip formatter={(value) => [`₹${value.toLocaleString()}`, 'Total Spent']} />
                    <Bar dataKey="totalSpent" fill={theme.palette.primary.main} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Customer Spending Distribution
                </Typography>
                <ResponsiveContainer width="100%" height={400}>
                  <PieChart>
                    <Pie
                      data={reportData.slice(0, 8)}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="totalSpent"
                    >
                      {reportData.slice(0, 8).map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`₹${value.toLocaleString()}`, 'Total Spent']} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </>
    );
  };

  const renderExpenseReport = () => {
    if (!reportData || reportData.length === 0) {
      return (
        <Typography variant="body1" color="textSecondary" align="center" sx={{ py: 4 }}>
          No expense data available for the selected period
        </Typography>
      );
    }

    const totalExpenses = reportData.reduce((sum, item) => sum + item.totalExpenses, 0);
    const categoryCount = reportData.length;
    const avgExpensePerCategory = categoryCount > 0 ? totalExpenses / categoryCount : 0;
    const highestCategory = reportData.reduce((max, item) => 
      item.totalExpenses > max.totalExpenses ? item : max, reportData[0]);

    return (
      <>
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} md={3}>
            <StatCard
              title="Total Expenses"
              value={`₹${totalExpenses.toLocaleString()}`}
              change="-5.2%"
              changeType="increase"
              icon={AccountBalance}
              color="error"
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <StatCard
              title="Categories"
              value={categoryCount.toString()}
              icon={Assessment}
              color="primary"
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <StatCard
              title="Avg per Category"
              value={`₹${avgExpensePerCategory.toLocaleString()}`}
              icon={TrendingDown}
              color="warning"
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <StatCard
              title="Highest Category"
              value={highestCategory._id}
              change={`₹${highestCategory.totalExpenses.toLocaleString()}`}
              icon={TrendingUp}
              color="secondary"
            />
          </Grid>
        </Grid>

        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Expenses by Category
                </Typography>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={reportData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="_id" />
                    <YAxis />
                    <Tooltip formatter={(value, name) => [
                      `₹${value.toLocaleString()}`,
                      name === 'totalExpenses' ? 'Total Expenses' : 'Average Expense'
                    ]} />
                    <Legend />
                    <Bar dataKey="totalExpenses" fill={theme.palette.error.main} name="Total Expenses" />
                    <Bar dataKey="averageExpense" fill={theme.palette.warning.main} name="Average Expense" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Expense Distribution
                </Typography>
                <ResponsiveContainer width="100%" height={400}>
                  <PieChart>
                    <Pie
                      data={reportData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ _id, percent }) => `${_id} (${(percent * 100).toFixed(0)}%)`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="totalExpenses"
                    >
                      {reportData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`₹${value.toLocaleString()}`, 'Total Expenses']} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </>
    );
  };

  const renderProfitLossReport = () => {
    if (!reportData) {
      return (
        <Typography variant="body1" color="textSecondary" align="center" sx={{ py: 4 }}>
          No profit & loss data available for the selected period
        </Typography>
      );
    }

    const profitMarginColor = reportData.netProfit >= 0 ? 'success' : 'error';

    return (
      <>
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} md={3}>
            <StatCard
              title="Total Revenue"
              value={`₹${reportData.totalSales.toLocaleString()}`}
              change="+15.3%"
              changeType="increase"
              icon={AttachMoney}
              color="success"
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <StatCard
              title="Total Expenses"
              value={`₹${reportData.totalExpenses.toLocaleString()}`}
              change="+8.7%"
              changeType="decrease"
              icon={AccountBalance}
              color="error"
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <StatCard
              title="Net Profit"
              value={`₹${reportData.netProfit.toLocaleString()}`}
              change={`${reportData.profitMargin.toFixed(1)}%`}
              changeType={reportData.netProfit >= 0 ? "increase" : "decrease"}
              icon={reportData.netProfit >= 0 ? TrendingUp : TrendingDown}
              color={profitMarginColor}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <StatCard
              title="Profit Margin"
              value={`${reportData.profitMargin.toFixed(1)}%`}
              icon={Assessment}
              color={profitMarginColor}
            />
          </Grid>
        </Grid>

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Revenue vs Expenses
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={[
                    { name: 'Revenue', value: reportData.totalSales, fill: theme.palette.success.main },
                    { name: 'COGS', value: reportData.costOfGoodsSold, fill: theme.palette.warning.main },
                    { name: 'Expenses', value: reportData.totalExpenses, fill: theme.palette.error.main },
                    { name: 'Net Profit', value: Math.max(0, reportData.netProfit), fill: theme.palette.info.main }
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`₹${value.toLocaleString()}`, 'Amount']} />
                    <Bar dataKey="value" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Profit Breakdown
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'Gross Profit', value: Math.max(0, reportData.grossProfit) },
                        { name: 'Operating Expenses', value: reportData.totalExpenses },
                        { name: 'Cost of Goods', value: reportData.costOfGoodsSold }
                      ]}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      <Cell fill={theme.palette.success.main} />
                      <Cell fill={theme.palette.error.main} />
                      <Cell fill={theme.palette.warning.main} />
                    </Pie>
                    <Tooltip formatter={(value) => [`₹${value.toLocaleString()}`, 'Amount']} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Card sx={{ mt: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Financial Summary
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Box sx={{ p: 2, backgroundColor: alpha(theme.palette.success.main, 0.1), borderRadius: 1 }}>
                  <Typography variant="subtitle1" color="success.main">Revenue</Typography>
                  <Typography variant="h5">₹{reportData.totalSales.toLocaleString()}</Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={6}>
                <Box sx={{ p: 2, backgroundColor: alpha(theme.palette.warning.main, 0.1), borderRadius: 1 }}>
                  <Typography variant="subtitle1" color="warning.main">Cost of Goods Sold</Typography>
                  <Typography variant="h5">₹{reportData.costOfGoodsSold.toLocaleString()}</Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={6}>
                <Box sx={{ p: 2, backgroundColor: alpha(theme.palette.info.main, 0.1), borderRadius: 1 }}>
                  <Typography variant="subtitle1" color="info.main">Gross Profit</Typography>
                  <Typography variant="h5">₹{reportData.grossProfit.toLocaleString()}</Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={6}>
                <Box sx={{ p: 2, backgroundColor: alpha(theme.palette.error.main, 0.1), borderRadius: 1 }}>
                  <Typography variant="subtitle1" color="error.main">Operating Expenses</Typography>
                  <Typography variant="h5">₹{reportData.totalExpenses.toLocaleString()}</Typography>
                </Box>
              </Grid>
            </Grid>
            <Divider sx={{ my: 2 }} />
            <Box sx={{ 
              p: 2, 
              backgroundColor: alpha(theme.palette[profitMarginColor].main, 0.1), 
              borderRadius: 1,
              border: `2px solid ${theme.palette[profitMarginColor].main}`
            }}>
              <Typography variant="h6" color={`${profitMarginColor}.main`}>
                Net Profit: ₹{reportData.netProfit.toLocaleString()} 
                <Typography component="span" variant="body1" sx={{ ml: 1 }}>
                  ({reportData.profitMargin.toFixed(2)}% margin)
                </Typography>
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </>
    );
  };

  const renderReportContent = () => {
    switch (activeReport) {
      case 'sales':
        return renderSalesReport();
      case 'inventory':
        return renderInventoryReport();
      case 'customers':
        return renderCustomerReport();
      case 'expenses':
        return renderExpenseReport();
      case 'profit-loss':
        return renderProfitLossReport();
      default:
        return null;
    }
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>
            Business Reports & Analytics
          </Typography>
          <Typography variant="body1" color="textSecondary">
            Comprehensive insights into your business performance
          </Typography>
        </Box>

        {/* Report Type Selection */}
        <Paper sx={{ p: 3, mb: 3 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Select Report Type
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 3 }}>
                {reportButtons.map(({ key, label, icon: Icon, color }) => (
                  <Button
                    key={key}
                    variant={activeReport === key ? 'contained' : 'outlined'}
                    onClick={() => setActiveReport(key)}
                    startIcon={<Icon />}
                    color={color}
                    sx={{ 
                      borderRadius: 2,
                      px: 3,
                      py: 1
                    }}
                  >
                    {label}
                  </Button>
                ))}
              </Box>
            </Grid>

            {/* Date Range Selection */}
            {activeReport !== 'inventory' && (
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  Date Range
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
                  <DatePicker
                    label="Start Date"
                    value={startDate}
                    onChange={setStartDate}
                    renderInput={(params) => <TextField {...params} size="small" />}
                  />
                  <DatePicker
                    label="End Date"
                    value={endDate}
                    onChange={setEndDate}
                    renderInput={(params) => <TextField {...params} size="small" />}
                  />
                  <Button 
                    variant="contained" 
                    onClick={loadReport}
                    disabled={loading}
                    sx={{ px: 4 }}
                  >
                    {loading ? <CircularProgress size={20} /> : 'Generate Report'}
                  </Button>
                </Box>
              </Grid>
            )}
          </Grid>
        </Paper>

        {/* Error Display */}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {/* Loading State */}
        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress size={60} />
          </Box>
        )}

        {/* Report Content */}
        {!loading && (
          <Box>
            {renderReportContent()}
          </Box>
        )}
      </LocalizationProvider>
    </Container>
  );
};

export default Reports;