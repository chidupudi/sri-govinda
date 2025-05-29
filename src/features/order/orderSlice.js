// src/features/order/orderSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import firebaseService from '../../services/firebaseService';
import { updateStock } from '../products/productSlice';
import { updateCustomerStats } from '../customer/customerSlice';

// Fetch all orders
export const fetchOrders = createAsyncThunk(
  'orders/fetchAll',
  async (filters = {}, { rejectWithValue }) => {
    try {
      const options = {
        orderBy: { field: 'createdAt', direction: 'desc' }
      };

      // Add filters
      if (filters.status) {
        options.where = [{ field: 'status', operator: '==', value: filters.status }];
      }

      if (filters.startDate && filters.endDate) {
        const startDate = new Date(filters.startDate);
        const endDate = new Date(filters.endDate);
        options.where = [
          ...(options.where || []),
          { field: 'createdAt', operator: '>=', value: startDate },
          { field: 'createdAt', operator: '<=', value: endDate }
        ];
      }

      let orders = await firebaseService.getAll('orders', options);

      // Populate customer data
      const customerIds = [...new Set(orders.filter(o => o.customerId).map(o => o.customerId))];
      const customers = {};
      
      if (customerIds.length > 0) {
        for (const customerId of customerIds) {
          try {
            const customer = await firebaseService.getById('customers', customerId);
            customers[customerId] = customer;
          } catch (error) {
            console.warn(`Customer ${customerId} not found`);
          }
        }
      }

      // Add customer data to orders
      orders = orders.map(order => ({
        ...order,
        customer: order.customerId ? customers[order.customerId] : null
      }));

      return orders;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Create order
export const createOrder = createAsyncThunk(
  'orders/create',
  async (orderData, { rejectWithValue, dispatch }) => {
    try {
      // Calculate totals
      const subtotal = orderData.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      const gstAmount = subtotal * 0.18;
      const total = subtotal + gstAmount;

      const order = await firebaseService.create('orders', {
        ...orderData,
        orderNumber: firebaseService.generateId('ORD-'),
        subtotal,
        gst: gstAmount,
        total,
        status: 'completed',
        paymentStatus: 'paid'
      });

      // Update product stock
      for (const item of orderData.items) {
        dispatch(updateStock({ id: item.product.id, stockChange: -item.quantity }));
      }

      // Update customer stats if customer exists
      if (orderData.customerId) {
        dispatch(updateCustomerStats({ 
          customerId: orderData.customerId, 
          orderAmount: total 
        }));
      }

      return order;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Get single order
export const getOrder = createAsyncThunk(
  'orders/getOne',
  async (id, { rejectWithValue }) => {
    try {
      const order = await firebaseService.getById('orders', id);
      
      // Populate customer data
      if (order.customerId) {
        try {
          const customer = await firebaseService.getById('customers', order.customerId);
          order.customer = customer;
        } catch (error) {
          console.warn(`Customer ${order.customerId} not found`);
        }
      }

      return order;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Cancel order
export const cancelOrder = createAsyncThunk(
  'orders/cancel',
  async (id, { rejectWithValue, dispatch, getState }) => {
    try {
      const order = getState().orders.items.find(o => o.id === id);
      if (!order) throw new Error('Order not found');

      const updatedOrder = await firebaseService.update('orders', id, { 
        status: 'cancelled',
        cancelledAt: new Date().toISOString()
      });

      // Restore product stock
      for (const item of order.items) {
        dispatch(updateStock({ id: item.product.id, stockChange: item.quantity }));
      }

      return updatedOrder;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  items: [],
  currentOrder: null,
  cart: [],
  loading: false,
  error: null,
  total: 0
};

const orderSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    // Cart management
    addToCart: (state, action) => {
      const { product, quantity = 1 } = action.payload;
      const existingItem = state.cart.find(item => item.product.id === product.id);
      
      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        state.cart.push({ product, quantity });
      }
    },
    removeFromCart: (state, action) => {
      state.cart = state.cart.filter(item => item.product.id !== action.payload);
    },
    updateCartItemQuantity: (state, action) => {
      const { productId, quantity } = action.payload;
      const item = state.cart.find(item => item.product.id === productId);
      if (item && quantity > 0) {
        item.quantity = quantity;
      }
    },
    clearCart: (state) => {
      state.cart = [];
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch orders
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
        state.total = action.payload.length;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create order
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.items.unshift(action.payload);
        state.cart = [];
        state.currentOrder = action.payload;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Get order
      .addCase(getOrder.fulfilled, (state, action) => {
        state.currentOrder = action.payload;
      })
      .addCase(getOrder.rejected, (state, action) => {
        state.error = action.payload;
      })
      // Cancel order
      .addCase(cancelOrder.fulfilled, (state, action) => {
        const index = state.items.findIndex(item => item.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
        if (state.currentOrder?.id === action.payload.id) {
          state.currentOrder = action.payload;
        }
      });
  }
});

export const { 
  addToCart, 
  removeFromCart, 
  updateCartItemQuantity,
  clearCart,
  clearError
} = orderSlice.actions;

export default orderSlice.reducer;