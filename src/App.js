import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { store } from './app/store';
import DashboardLayout from './components/dashboard/DashboardLayout';
import Reports from './components/reports/Reports';
import CustomerList from './components/customer/CustomerList';
import ProductList from './components/products/ProductList';
import ExpenseList from './components/expense/ExpenseList';
import OrderList from './components/billing/OrderList';
import Billing from './components/billing/Billing';
import BillList from './components/billing/BillList';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
      light: '#42a5f5',
      dark: '#1565c0',
    },
    secondary: {
      main: '#9c27b0',
      light: '#ba68c8',
      dark: '#7b1fa2',
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h6: {
      fontWeight: 500,
      letterSpacing: 0.5,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        },
      },
    },
  },
});

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <CssBaseline />
          <Router>
            <Routes>
              <Route path="/" element={<DashboardLayout />}>
                <Route index element={<Reports />} />
                <Route path="customers" element={<CustomerList />} />
                <Route path="products" element={<ProductList />} />
                <Route path="expenses" element={<ExpenseList />} />
                <Route path="orders" element={<OrderList />} />
                <Route path="billing" element={<Billing />} />
                <Route path="bills" element={<BillList />} />
              </Route>
            </Routes>
          </Router>
        </LocalizationProvider>
      </ThemeProvider>
    </Provider>
  );
}

export default App;
