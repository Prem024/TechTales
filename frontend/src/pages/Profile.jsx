import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { getImageUrl } from '../utils/imageHelper';
import { User, Mail, Shield, Edit3 } from 'lucide-react';

const Profile = () => {
  const { user } = useSelector((state) => state.auth);

  if (!user) return null;

  return (
    <div className="max-w-3xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="bg-white shadow-xl rounded-3xl overflow-hidden border border-gray-100">
        {/* Banner Decoration */}
        <div className="h-32 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>

        {/* Profile Card Header */}
        <div className="relative px-6 pb-6 pt-0 sm:pb-8 sm:px-8">
          <div className="flex flex-col sm:flex-row items-center sm:items-end -mt-16 sm:space-x-5">
            <div className="relative group">
              <img
                src={getImageUrl(user.profileImage)}
                alt={user.userName}
                className="h-32 w-32 rounded-full ring-4 ring-white object-cover bg-gray-50 shadow-md"
                onError={(e) => {
                  e.target.src = "https://cdn-icons-png.flaticon.com/512/149/149071.png";
                }}
              />
            </div>
            <div className="mt-6 sm:mt-0 text-center sm:text-left flex-grow">
              <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight capitalize">
                {user.userName}
              </h1>
              <p className="text-sm font-medium text-indigo-600">Personal Account</p>
            </div>
            <div className="mt-6 sm:mt-0 flex justify-center sm:justify-end">
              <Link
                to="/profile/edit"
                className="inline-flex items-center px-6 py-2.5 border border-gray-300 rounded-full shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all hover:shadow"
              >
                <Edit3 className="mr-2 h-4 w-4 text-gray-500" />
                Edit Profile
              </Link>
            </div>
          </div>

          {/* Details Section */}
          <div className="mt-12 border-t border-gray-100 pt-8">
            <h2 className="text-lg font-bold text-gray-900 mb-6">Profile Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center space-x-4 bg-gray-50 p-4 rounded-2xl border border-gray-100">
                <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
                  <User className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Username</p>
                  <p className="text-base font-semibold text-gray-900 capitalize">{user.userName}</p>
                </div>
              </div>

              <div className="flex items-center space-x-4 bg-gray-50 p-4 rounded-2xl border border-gray-100">
                <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
                  <Mail className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Email Address</p>
                  <p className="text-base font-semibold text-gray-900">{user.email}</p>
                </div>
              </div>

              <div className="flex items-center space-x-4 bg-gray-50 p-4 rounded-2xl border border-gray-100 md:col-span-2">
                <div className="p-3 bg-pink-50 text-pink-600 rounded-xl">
                  <Shield className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Account Role</p>
                  <p className="text-base font-semibold text-gray-900 uppercase tracking-wider">{user.role || 'User'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
