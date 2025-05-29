// src/components/dashboard/Dashboard.js
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  useTheme
} from '@mui/material';
import {
  TrendingUp,
  Inventory,
  People,
  ShoppingCart,
  AttachMoney,
  TrendingDown
} from '@mui/icons-material';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

import { fetchOrders } from '../../features/order/orderSlice';
import { fetchProducts } from '../../features/products/productSlice';
import { fetchCustomers } from '../../features/customer/customerSlice';
import { fetchExpenses } from '../../features/expense/expenseSlice';

const StatCard = ({ title, value, icon: Icon, color, trend, trendValue }) => {
  const theme = useTheme();
  
  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box>
            <Typography color="textSecondary" gutterBottom variant="body2">
              {title}
            </Typography>
            <Typography variant="h4" component="div" color={color}>
              {value}
            </Typography>
            {trend && (
              <Box display="flex" alignItems="center" mt={1}>
                {trend === 'up' ? (
                  <TrendingUp color="success" fontSize="small" />
                ) : (
                  <TrendingDown color="error" fontSize="small" />
                )}
                <Typography 
                  variant="body2" 
                  color={trend === 'up' ? 'success.main' : 'error.main'}
                  sx={{ ml: 0.5 }}
                >
                  {trendValue}
                </Typography>
              </Box>
            )}
          </Box>
          <Icon 
            sx={{ 
              fontSize: 40, 
              color: theme.palette[color]?.main || color,
              opacity: 0.7 
            }} 
          />
        </Box>
      </CardContent>
    </Card>
  );
};

const Dashboard = () => {
  const dispatch = useDispatch();
  const theme = useTheme();
  
  const { items: orders, loading: ordersLoading } = useSelector(state => state.orders);
  const { items: products, loading: productsLoading } = useSelector(state => state.products);
  const { items: customers, loading: customersLoading } = useSelector(state => state.customers);
  const { items: expenses, loading: expensesLoading } = useSelector(state => state.expenses);

  const [dashboardData, setDashboardData] = useState({
    totalSales: 0,
    totalOrders: 0,
    totalCustomers: 0,
    totalProducts: 0,
    lowStockProducts: 0,
    totalExpenses: 0,
    salesData: [],
    topProducts: [],
    recentOrders: []
  });

  useEffect(() => {
    // Load all data
    dispatch(fetchOrders({}));
    dispatch(fetchProducts({}));
    dispatch(fetchCustomers({}));
    dispatch(fetchExpenses({}));
  }, [dispatch]);

  useEffect(() => {
    // Calculate dashboard metrics when data changes
    if (orders.length || products.length || customers.length || expenses.length) {
      calculateDashboardData();
    }
  }, [orders, products, customers, expenses]);

  const calculateDashboardData = () => {
    // Calculate total sales
    const completedOrders = orders.filter(order => order.status !== 'cancelled');
    const totalSales = completedOrders.reduce((sum, order) => sum + (order.total || 0), 0);
    
    // Calculate expenses for current month
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const monthlyExpenses = expenses.filter(expense => {
      const expenseDate = expense.date?.toDate ? expense.date.toDate() : new Date(expense.date);
      return expenseDate.getMonth() === currentMonth && expenseDate.getFullYear() === currentYear;
    });
    const totalExpenses = monthlyExpenses.reduce((sum, expense) => sum + (expense.amount || 0), 0);

    // Low stock products (stock <= 10)
    const lowStockProducts = products.filter(product => product.stock <= 10).length;

    // Sales data for chart (last 7 days)
    const salesData = getLast7DaysSales();
    
    // Top products by sales
    const topProducts = getTopProducts();

    // Recent orders
    const recentOrders = [...completedOrders]
      .sort((a, b) => new Date(b.createdAt?.toDate?.() || b.createdAt) - new Date(a.createdAt?.toDate?.() || a.createdAt))
      .slice(0, 5);

    setDashboardData({
      totalSales,
      totalOrders: completedOrders.length,
      totalCustomers: customers.length,
      totalProducts: products.length,
      lowStockProducts,
      totalExpenses,
      salesData,
      topProducts,
      recentOrders
    });
  };

  const getLast7DaysSales = () => {
    const last7Days = [];
    const today = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      
      const dayOrders = orders.filter(order => {
        const orderDate = order.createdAt?.toDate ? order.createdAt.toDate() : new Date(order.createdAt);
        return orderDate.toDateString() === date.toDateString() && order.status !== 'cancelled';
      });
      
      const dayTotal = dayOrders.reduce((sum, order) => sum + (order.total || 0), 0);
      
      last7Days.push({
        date: dateStr,
        sales: dayTotal,
        orders: dayOrders.length
      });
    }
    
    return last7Days;
  };

  const getTopProducts = () => {
    const productSales = {};
    
    orders.forEach(order => {
      if (order.status !== 'cancelled' && order.items) {
        order.items.forEach(item => {
          const productId = item.product?.id || item.productId;
          const productName = item.product?.name || 'Unknown Product';
          
          if (!productSales[productId]) {
            productSales[productId] = {
              name: productName,
              quantity: 0,
              revenue: 0
            };
          }
          
          productSales[productId].quantity += item.quantity || 0;
          productSales[productId].revenue += (item.price || 0) * (item.quantity || 0);
        });
      }
    });

    return Object.values(productSales)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);
  };

  const isLoading = ordersLoading || productsLoading || customersLoading || expensesLoading;

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Total Sales"
            value={`₹${dashboardData.totalSales.toLocaleString()}`}
            icon={AttachMoney}
            color="success"
            trend="up"
            trendValue="+12%"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Total Orders"
            value={dashboardData.totalOrders.toLocaleString()}
            icon={ShoppingCart}
            color="primary"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Customers"
            value={dashboardData.totalCustomers.toLocaleString()}
            icon={People}
            color="info"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Products"
            value={dashboardData.totalProducts.toLocaleString()}
            icon={Inventory}
            color="secondary"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Low Stock Items"
            value={dashboardData.lowStockProducts.toString()}
            icon={TrendingDown}
            color="warning"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Monthly Expenses"
            value={`₹${dashboardData.totalExpenses.toLocaleString()}`}
            icon={TrendingDown}
            color="error"
          />
        </Grid>
      </Grid>

      {/* Charts */}
      <Grid container spacing={3}>
        <Grid item xs={12} lg={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Sales Trend (Last 7 Days)
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={dashboardData.salesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="sales" 
                    stroke={theme.palette.primary.main}
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} lg={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Top Products
              </Typography>
              {dashboardData.topProducts.length > 0 ? (
                <ResponsiveContainer width="100%" height={260}>
                  <PieChart>
                    <Pie
                      data={dashboardData.topProducts}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="revenue"
                    >
                      {dashboardData.topProducts.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <Box display="flex" justifyContent="center" alignItems="center" height={260}>
                  <Typography color="textSecondary">No sales data available</Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Orders */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Recent Orders
              </Typography>
              {dashboardData.recentOrders.length > 0 ? (
                <Box>
                  {dashboardData.recentOrders.map((order, index) => (
                    <Box
                      key={order.id}
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                      py={1}
                      borderBottom={index < dashboardData.recentOrders.length - 1 ? 1 : 0}
                      borderColor="divider"
                    >
                      <Box>
                        <Typography variant="body1">
                          {order.orderNumber || `Order #${order.id?.slice(-6)}`}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          {order.customer?.name || 'Walk-in Customer'}
                        </Typography>
                      </Box>
                      <Box textAlign="right">
                        <Typography variant="body1" fontWeight="bold">
                          ₹{(order.total || 0).toLocaleString()}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          {new Date(order.createdAt?.toDate?.() || order.createdAt).toLocaleDateString()}
                        </Typography>
                      </Box>
                    </Box>
                  ))}
                </Box>
              ) : (
                <Typography color="textSecondary">No recent orders</Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;