import { useEffect } from 'react';
import { CartValidationNotice } from './components/common/CartValidationNotice';
import { BrowserRouter } from 'react-router-dom';
import { AppRoutes } from './routes';
import { AuthProvider } from './contexts/AuthContext';
import { useMenuStore } from './stores/useMenuStore';

function App() {
  const fetchProducts = useMenuStore((state) => state.fetchProducts);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return (
    <BrowserRouter>
      <AuthProvider>
        <CartValidationNotice />
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
