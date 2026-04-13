import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../redux/slices/authSlice';
import { PenSquare, LogOut, User as UserIcon } from 'lucide-react';

const Navbar = () => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="container mx-auto px-4 content-center h-16 flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
          TechTales
        </Link>

        <div className="flex items-center space-x-4">
          {isAuthenticated ? (
            <>
              <Link
                to="/create"
                className="hidden md:flex items-center text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors"
              >
                <PenSquare className="w-4 h-4 mr-1" />
                Write
              </Link>
              <Link
                to="/dashboard"
                className="flex items-center text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors"
              >
                <UserIcon className="w-4 h-4 mr-1" />
                Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center text-sm font-medium text-gray-600 hover:text-red-600 transition-colors"
                title="Logout"
              >
                <LogOut className="w-4 h-4 mr-1" />
                <span className="hidden md:inline">Logout</span>
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="text-sm font-medium bg-indigo-600 text-white px-4 py-2 rounded-full hover:bg-indigo-700 transition-colors"
              >
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
