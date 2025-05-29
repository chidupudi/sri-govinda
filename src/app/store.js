import { configureStore } from '@reduxjs/toolkit';
import customerReducer from '../features/customer/customerSlice';
import expenseReducer from '../features/expense/expenseSlice';
import reportReducer from '../features/reports/reportSlice';
import productReducer from '../redux/slices/productSlice';
import orderReducer from '../features/order/orderSlice';
import billReducer from '../features/bill/billSlice';

export const store = configureStore({
  reducer: {
    customers: customerReducer,
    expenses: expenseReducer,
    reports: reportReducer,
    products: productReducer,
    orders: orderReducer,
    bills: billReducer
  }
});