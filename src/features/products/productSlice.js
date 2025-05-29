// src/features/products/productSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import firebaseService from '../../services/firebaseService';

// Fetch all products
export const fetchProducts = createAsyncThunk(
  'products/fetchAll',
  async (filters = {}, { rejectWithValue }) => {
    try {
      const options = {};
      
      if (filters.category) {
        options.where = [{ field: 'category', operator: '==', value: filters.category }];
      }
      
      if (filters.lowStock) {
        options.where = [...(options.where || []), { field: 'stock', operator: '<=', value: 10 }];
      }

      options.orderBy = { field: 'createdAt', direction: 'desc' };

      let products = await firebaseService.getAll('products', options);

      // Apply search filter on client side (Firestore doesn't support case-insensitive search)
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        products = products.filter(product => 
          product.name.toLowerCase().includes(searchTerm) ||
          product.category.toLowerCase().includes(searchTerm)
        );
      }

      return products;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Create product
export const createProduct = createAsyncThunk(
  'products/create',
  async (productData, { rejectWithValue }) => {
    try {
      const product = await firebaseService.create('products', {
        ...productData,
        stock: productData.stock || 0,
        sku: `PRD-${Date.now()}`
      });
      return product;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Update product
export const updateProduct = createAsyncThunk(
  'products/update',
  async ({ id, productData }, { rejectWithValue }) => {
    try {
      const product = await firebaseService.update('products', id, productData);
      return product;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Delete product
export const deleteProduct = createAsyncThunk(
  'products/delete',
  async (id, { rejectWithValue }) => {
    try {
      await firebaseService.delete('products', id);
      return id;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Update stock
export const updateStock = createAsyncThunk(
  'products/updateStock',
  async ({ id, stockChange }, { rejectWithValue, getState }) => {
    try {
      const currentProduct = getState().products.items.find(p => p.id === id);
      const newStock = Math.max(0, currentProduct.stock + stockChange);
      
      const product = await firebaseService.update('products', id, { stock: newStock });
      return product;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  items: [],
  loading: false,
  error: null,
  filters: {
    category: '',
    search: '',
    lowStock: false
  }
};

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = {
        category: '',
        search: '',
        lowStock: false
      };
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch products
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create product
      .addCase(createProduct.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.error = action.payload;
      })
      // Update product
      .addCase(updateProduct.fulfilled, (state, action) => {
        const index = state.items.findIndex(item => item.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.error = action.payload;
      })
      // Delete product
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.items = state.items.filter(item => item.id !== action.payload);
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.error = action.payload;
      })
      // Update stock
      .addCase(updateStock.fulfilled, (state, action) => {
        const index = state.items.findIndex(item => item.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      });
  }
});

export const { setFilters, clearFilters, clearError } = productSlice.actions;
export default productSlice.reducer;