import React from 'react';
import { useSelector } from 'react-redux';
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  useTheme
} from '@mui/material';
import { PieChart } from '@mui/x-charts';

const ExpenseSummary = () => {
  const { summary } = useSelector(state => state.expenses);
  const theme = useTheme();

  const totalExpense = summary.reduce((acc, curr) => acc + curr.total, 0);

  const chartData = summary.map((item, index) => ({
    id: index,
    value: item.total,
    label: item._id
  }));

  // Use theme for styling
  const styles = {
    card: {
      backgroundColor: theme.palette.background.paper,
      // ... other styles using theme
    }
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Expense Summary
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Box sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="h4" color="primary">
                ₹{totalExpense.toFixed(2)}
              </Typography>
              <Typography variant="subtitle1" color="textSecondary">
                Total Expenses
              </Typography>
            </Box>
            <Box sx={{ mt: 2 }}>
              {summary.map((item) => (
                <Box
                  key={item._id}
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    mb: 1
                  }}
                >
                  <Typography variant="body2">{item._id}</Typography>
                  <Typography variant="body2">
                    ₹{item.total.toFixed(2)} ({((item.total / totalExpense) * 100).toFixed(1)}%)
                  </Typography>
                </Box>
              ))}
            </Box>
          </Grid>
          <Grid item xs={12} md={8}>
            {summary.length > 0 && (
              <Box sx={{ height: 300 }}>
                <PieChart
                  series={[{
                    data: chartData,
                    highlightScope: { faded: 'global', highlighted: 'item' },
                    faded: { innerRadius: 30, additionalRadius: -30 }
                  }]}
                  height={300}
                />
              </Box>
            )}
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default ExpenseSummary;