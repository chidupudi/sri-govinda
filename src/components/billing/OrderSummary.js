import React from 'react';
import { useSelector } from 'react-redux';
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  useTheme,
  CircularProgress
} from '@mui/material';
// Removed unused BarChart and Bar imports
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';
// Add these imports at the top
import { ResponsiveContainer, PieChart, Pie } from 'recharts';

const OrderSummary = () => {
  const { orders, isLoading } = useSelector(state => state.orders);
  const theme = useTheme();

  const calculateTotalSales = () => {
    return orders?.reduce((total, order) => {
      if (order.status !== 'cancelled') {
        return total + order.total;
      }
      return total;
    }, 0) || 0;
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  // REMOVED the duplicate theme declaration

  const calculateAverageOrderValue = () => {
    const validOrders = orders?.filter(order => order.status !== 'cancelled') || [];
    return validOrders.length ? calculateTotalSales() / validOrders.length : 0;
  };

  const getOrdersByStatus = () => {
    const statusCount = {
      completed: 0,
      pending: 0,
      cancelled: 0
    };
    orders?.forEach(order => {
      statusCount[order.status] = (statusCount[order.status] || 0) + 1;
    });
    return Object.entries(statusCount).map(([status, count]) => ({
      name: status,
      value: count
    }));
  };

  const getDailySales = () => {
    const salesByDate = {};
    orders?.forEach(order => {
      if (order.status !== 'cancelled') {
        const date = new Date(order.createdAt).toLocaleDateString();
        salesByDate[date] = (salesByDate[date] || 0) + order.total;
      }
    });
    return Object.entries(salesByDate).map(([date, total]) => ({
      date,
      total
    }));
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>Sales Summary</Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Box sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="h4" color="primary">
                ₹{calculateTotalSales().toFixed(2)}
              </Typography>
              <Typography variant="subtitle1" color="textSecondary">
                Total Sales
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="h4" color="primary">
                ₹{calculateAverageOrderValue().toFixed(2)}
              </Typography>
              <Typography variant="subtitle1" color="textSecondary">
                Average Order Value
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="h4" color="primary">
                {orders?.length || 0}
              </Typography>
              <Typography variant="subtitle1" color="textSecondary">
                Total Orders
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={8}>
            <Typography variant="h6" gutterBottom>Daily Sales</Typography>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={getDailySales()}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="total" stroke={theme.palette.primary.main} />
              </LineChart>
            </ResponsiveContainer>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom>Orders by Status</Typography>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={getOrdersByStatus()}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill={theme.palette.primary.main}
                  label
                />
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default OrderSummary;