import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../redux/slices/authSlice';
import { getImageUrl } from '../utils/imageHelper';
import { PenSquare, LogOut } from 'lucide-react';

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
              {user?.role === 'admin' ? (
                <Link
                  to="/admin/blogs"
                  className="flex items-center text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors"
                >
                  Admin Panel
                </Link>
              ) : (
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
                    Dashboard
                  </Link>
                </>
              )}
              <Link
                to="/profile"
                className="flex items-center space-x-2 p-1 hover:bg-gray-50 rounded-full transition-colors"
                title="View Profile"
              >
                <img
                  src={getImageUrl(user?.profileImage)}
                  alt="Profile"
                  className="w-8 h-8 rounded-full object-cover border border-indigo-100 hover:border-indigo-500 transition-colors bg-gray-50"
                  onError={(e) => {
                    e.target.src = "https://cdn-icons-png.flaticon.com/512/149/149071.png";
                  }}
                />
                <span className="hidden sm:inline text-sm font-semibold text-gray-700 capitalize max-w-[100px] truncate">
                  {user?.userName}
                </span>
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
