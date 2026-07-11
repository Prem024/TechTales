import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = () => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Redirect admin users to the admin blogs panel if they try to access user-only pages
  const userOnlyPaths = ['/dashboard', '/create'];
  const isUserOnlyPath = userOnlyPaths.includes(location.pathname) || location.pathname.startsWith('/edit/');
  
  if (user?.role === 'admin' && isUserOnlyPath) {
    return <Navigate to="/admin/blogs" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
