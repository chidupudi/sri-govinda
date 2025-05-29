import { CircularProgress, Backdrop } from '@mui/material';

export default function Loading({ isLoading }) {
  return (
    <Backdrop open={isLoading} style={{ zIndex: 9999 }}>
      <CircularProgress color="primary" />
    </Backdrop>
  );
}