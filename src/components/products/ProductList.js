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
  CircularProgress,
  Card,
  CardContent
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { fetchProducts, deleteProduct, setFilters } from '../../features/products/productSlice';
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
      try {
        await dispatch(deleteProduct(id));
        dispatch(fetchProducts(filters));
      } catch (error) {
        console.error('Error deleting product:', error);
      }
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
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Products Management
          </Typography>
          
          <Box sx={{ mb: 3, display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
            <TextField
              name="search"
              label="Search Products"
              value={filters.search || ''}
              onChange={handleFilterChange}
              size="small"
              sx={{ minWidth: 200 }}
            />
            <TextField
              name="category"
              label="Category"
              select
              value={filters.category || ''}
              onChange={handleFilterChange}
              size="small"
              sx={{ minWidth: 150 }}
            >
              <MenuItem value="">All Categories</MenuItem>
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
              label="Low Stock Only"
            />
            <Box sx={{ ml: 'auto', display: 'flex', gap: 2 }}>
              <Button
                variant="outlined"
                onClick={() => setOpenBulkUpload(true)}
              >
                Bulk Upload
              </Button>
              <Button
                variant="contained"
                onClick={() => {
                  setSelectedProduct(null);
                  setOpenForm(true);
                }}
              >
                Add Product
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <TableContainer component={Paper} elevation={0}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell>Weight (g)</TableCell>
                  <TableCell>Price (₹)</TableCell>
                  <TableCell>Cost Price (₹)</TableCell>
                  <TableCell>Stock</TableCell>
                  <TableCell>SKU</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                      <CircularProgress />
                      <Typography variant="body2" sx={{ mt: 1 }}>
                        Loading products...
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : items.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                      <Typography variant="body1" color="text.secondary">
                        No products found
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {filters.search || filters.category || filters.lowStock 
                          ? 'Try adjusting your filters or add a new product'
                          : 'Get started by adding your first product'
                        }
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  items.map((product) => (
                    <TableRow 
                      key={product.id} 
                      hover
                      sx={{ 
                        '&:hover': { 
                          backgroundColor: 'action.hover' 
                        } 
                      }}
                    >
                      <TableCell>
                        <Typography variant="body2" fontWeight="medium">
                          {product.name}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {product.category}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {product.weight || '-'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" fontWeight="medium">
                          ₹{product.price}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {product.costPrice ? `₹${product.costPrice}` : '-'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography 
                          variant="body2"
                          color={product.stock <= 10 ? 'error.main' : 'text.primary'}
                          fontWeight={product.stock <= 10 ? 'medium' : 'normal'}
                        >
                          {product.stock}
                          {product.stock <= 10 && ' (Low)'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">
                          {product.sku || '-'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <IconButton 
                            onClick={() => handleEdit(product)}
                            size="small"
                            color="primary"
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                          <IconButton 
                            onClick={() => handleDelete(product.id)}
                            size="small"
                            color="error"
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Product Form Dialog */}
      <Dialog 
        open={openForm} 
        onClose={() => setOpenForm(false)} 
        maxWidth="md" 
        fullWidth
        PaperProps={{
          sx: { borderRadius: 2 }
        }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          {selectedProduct ? 'Edit Product' : 'Add New Product'}
        </DialogTitle>
        <DialogContent>
          <ProductForm
            product={selectedProduct}
            onClose={handleCloseForm}
          />
        </DialogContent>
      </Dialog>

      {/* Bulk Upload Dialog */}
      <Dialog 
        open={openBulkUpload} 
        onClose={() => setOpenBulkUpload(false)} 
        maxWidth="sm" 
        fullWidth
        PaperProps={{
          sx: { borderRadius: 2 }
        }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          Bulk Upload Products
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Upload a CSV file with the following columns: name, category, weight, price, costPrice, stock, description, sku
          </Typography>
          <BulkUpload onSuccess={handleCloseBulkUpload} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenBulkUpload(false)}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ProductList;