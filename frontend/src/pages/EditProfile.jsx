import { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { updateUserProfile, clearError } from '../redux/slices/authSlice';
import { getImageUrl } from '../utils/imageHelper';
import { Camera, ArrowLeft, Loader2, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const EditProfile = () => {
  const { user, isLoading, error } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [validationError, setValidationError] = useState('');

  useEffect(() => {
    if (user) {
      setUserName(user.userName || '');
      setPreviewUrl(getImageUrl(user.profileImage));
    }
    dispatch(clearError());
  }, [user, dispatch]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Reset validation error
    setValidationError('');

    // Supported formats check: jpg, jpeg, png
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (!allowedTypes.includes(file.type)) {
      const msg = 'Unsupported file format. Only JPG, JPEG, and PNG are allowed.';
      setValidationError(msg);
      toast.error(msg);
      return;
    }

    // Maximum size: 2MB
    if (file.size > 2 * 1024 * 1024) {
      const msg = 'File is too large. Maximum size allowed is 2MB.';
      setValidationError(msg);
      toast.error(msg);
      return;
    }

    setSelectedFile(file);
    
    // Create preview URL
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);

    // Clean up memory when component unmounts or file changes
    return () => URL.revokeObjectURL(objectUrl);
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userName.trim()) {
      return toast.error('Username cannot be empty');
    }

    setValidationError('');

    const formData = new FormData();
    formData.append('userName', userName.trim());
    if (password) {
      formData.append('password', password);
    }
    if (selectedFile) {
      formData.append('images', selectedFile);
    }

    const result = await dispatch(updateUserProfile({ id: user._id, formData }));
    if (updateUserProfile.fulfilled.match(result)) {
      toast.success('Profile updated successfully!');
      navigate('/profile');
    } else {
      toast.error(result.payload || 'Failed to update profile');
    }
  };

  return (
    <div className="max-w-xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      {/* Back Button */}
      <button
        onClick={() => navigate('/profile')}
        className="flex items-center text-sm font-medium text-gray-500 hover:text-gray-700 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Profile
      </button>

      <div className="bg-white shadow-xl rounded-3xl overflow-hidden border border-gray-100 p-6 sm:p-8">
        <h2 className="text-2xl font-extrabold text-gray-900 mb-8">Edit Your Profile</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Avatar Upload */}
          <div className="flex flex-col items-center">
            <div className="relative group cursor-pointer" onClick={triggerFileSelect}>
              <img
                src={previewUrl}
                alt="Profile Preview"
                className="h-28 w-28 rounded-full object-cover bg-gray-50 ring-4 ring-indigo-50 shadow-md group-hover:opacity-90 transition-opacity"
                onError={(e) => {
                  e.target.src = "https://cdn-icons-png.flaticon.com/512/149/149071.png";
                }}
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera className="w-6 h-6 text-white" />
              </div>
            </div>
            
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".jpg,.jpeg,.png"
              className="hidden"
            />
            
            <button
              type="button"
              onClick={triggerFileSelect}
              className="mt-3 text-sm font-semibold text-indigo-600 hover:text-indigo-500"
            >
              Change Profile Photo
            </button>
            <p className="mt-1 text-xs text-gray-400">JPG, JPEG or PNG. Max 2MB</p>
          </div>

          {validationError && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 text-sm text-red-700 flex items-start rounded-r-xl">
              <AlertCircle className="w-5 h-5 mr-3 flex-shrink-0 mt-0.5 text-red-500" />
              <span>{validationError}</span>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 text-sm text-red-700 flex items-start rounded-r-xl">
              <AlertCircle className="w-5 h-5 mr-3 flex-shrink-0 mt-0.5 text-red-500" />
              <span>{error}</span>
            </div>
          )}

          {/* Form Fields */}
          <div>
            <label htmlFor="userName" className="block text-sm font-semibold text-gray-700 mb-2">
              Username
            </label>
            <input
              type="text"
              id="userName"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              className="shadow-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-xl py-3 px-4 border transition-all"
              required
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
              Email Address (Read-only)
            </label>
            <input
              type="email"
              id="email"
              value={user?.email || ''}
              className="shadow-sm bg-gray-50 block w-full sm:text-sm border-gray-200 rounded-xl py-3 px-4 border text-gray-500 cursor-not-allowed"
              disabled
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
              New Password (Leave blank to keep current)
            </label>
            <input
              type="password"
              id="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="shadow-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-xl py-3 px-4 border transition-all"
            />
          </div>

          <div className="pt-4 flex justify-end space-x-3 border-t border-gray-100">
            <button
              type="button"
              onClick={() => navigate('/profile')}
              className="bg-white py-2.5 px-6 border border-gray-300 rounded-full shadow-sm text-sm font-semibold text-gray-700 hover:bg-gray-50 focus:outline-none transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="inline-flex justify-center items-center py-2.5 px-8 border border-transparent shadow-sm text-sm font-semibold rounded-full text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-75 transition-colors"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;
