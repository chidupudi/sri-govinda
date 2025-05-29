import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Button,
  TextField,
  FormControlLabel,
  Switch,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  CircularProgress
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { fetchProducts, deleteProduct, setFilters } from '../../redux/slices/productSlice';
import ProductForm from './ProductForm';
import BulkUpload from './BulkUpload';

const ProductList = () => {
  const dispatch = useDispatch();
  const { items, loading, filters } = useSelector((state) => state.products);
  const [openForm, setOpenForm] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [openBulkUpload, setOpenBulkUpload] = useState(false);

  useEffect(() => {
    dispatch(fetchProducts(filters));
  }, [dispatch, filters]);

  const handleEdit = (product) => {
    setSelectedProduct(product);
    setOpenForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      await dispatch(deleteProduct(id));
      dispatch(fetchProducts(filters));
    }
  };

  const handleFilterChange = (event) => {
    dispatch(setFilters({ [event.target.name]: event.target.value }));
  };

  const handleCloseForm = () => {
    setOpenForm(false);
    setSelectedProduct(null);
    dispatch(fetchProducts(filters));
  };

  const handleCloseBulkUpload = () => {
    setOpenBulkUpload(false);
    dispatch(fetchProducts(filters));
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ mb: 3, display: 'flex', gap: 2, alignItems: 'center' }}>
        <TextField
          name="search"
          label="Search"
          value={filters.search || ''}
          onChange={handleFilterChange}
          size="small"
        />
        <TextField
          name="category"
          label="Category"
          select
          value={filters.category || ''}
          onChange={handleFilterChange}
          size="small"
          sx={{ minWidth: 120 }}
        >
          <MenuItem value="">All</MenuItem>
          <MenuItem value="German silver">German silver</MenuItem>
          <MenuItem value="1g gold">1g gold</MenuItem>
          <MenuItem value="Panchaloha">Panchaloha</MenuItem>
          <MenuItem value="Gifts">Gifts</MenuItem>
        </TextField>
        <FormControlLabel
          control={
            <Switch
              checked={filters.lowStock || false}
              onChange={(e) => dispatch(setFilters({ lowStock: e.target.checked }))}
            />
          }
          label="Low Stock"
        />
        <Button
          variant="contained"
          onClick={() => {
            setSelectedProduct(null);
            setOpenForm(true);
          }}
        >
          Add Product
        </Button>
        <Button
          variant="outlined"
          onClick={() => setOpenBulkUpload(true)}
        >
          Bulk Upload
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Weight</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Stock</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : items.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                  <Typography variant="body1" color="text.secondary">
                    No products found
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              items.map((product) => (
                <TableRow key={product._id}>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>{product.category}</TableCell>
                  <TableCell>{product.weight}g</TableCell>
                  <TableCell>₹{product.price}</TableCell>
                  <TableCell>{product.stock}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleEdit(product)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(product._id)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openForm} onClose={() => setOpenForm(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{selectedProduct ? 'Edit Product' : 'Add Product'}</DialogTitle>
        <DialogContent>
          <ProductForm
            product={selectedProduct}
            onClose={handleCloseForm}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={openBulkUpload} onClose={() => setOpenBulkUpload(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Bulk Upload Products</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Upload a CSV file with the following columns: name, category, weight, price, costPrice, stock, description, sku
          </Typography>
          <BulkUpload onSuccess={handleCloseBulkUpload} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenBulkUpload(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ProductList;