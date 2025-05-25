import React, { useState } from 'react';
import { addCollege } from '../../../api/collegeApi'; // Adjust path if your functions.js is elsewhere

const AddCollegeModal = ({ isOpen, onClose, onCollegeAdded, }) => {
  const [collegeName, setCollegeName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (!collegeName.trim() || !username.trim() || !email.trim() || !password.trim()) {
      setError("All fields are required.");
      return;
    }
    // Basic email validation
    if (!/\S+@\S+\.\S+/.test(email)) {
        setError("Please enter a valid email address.");
        return;
    }

    setIsLoading(true);
    try {
      const collegeData = {
        name: collegeName,
          username,
          email,
          password,
        
      };
      const newCollege = await addCollege(collegeData); // Use your actual API function
      onCollegeAdded(newCollege); // Callback to refresh list or notify parent
      handleClose();
    } catch (err) {
      setError(err.message || "Failed to add college. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setCollegeName('');
    setUsername('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setError(null);
    setIsLoading(false);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-gray-900/70 backdrop-blur-sm flex justify-center items-center z-50 p-4 animate-fadeIn"
      onClick={handleClose}
    >
      <div
        className="bg-white py-8 px-8 rounded-xl shadow-2xl max-w-lg w-full relative max-h-[90vh] overflow-y-auto transform transition-all duration-300 scale-100 animate-scaleIn"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="absolute top-0 left-0 right-0 h-2 bg-primary rounded-t-xl"></div>
        <button
          className="absolute top-4 right-4 bg-gray-100 hover:bg-gray-200 transition-colors duration-200 rounded-full w-10 h-10 flex items-center justify-center text-gray-500 hover:text-gray-700"
          onClick={handleClose}
          aria-label="Close popup"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
        
        <h2 className="text-primary text-2xl font-bold mb-6 text-center">Add New College</h2>
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 border border-red-300 rounded-md text-sm">
            {error}
          </div>
        )}

        <p className="text-sm text-gray-500 mb-4 text-center">All fields are required</p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="collegeName" className="block text-sm font-medium text-gray-700 mb-1">
              College Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="collegeName"
              value={collegeName}
              onChange={(e) => setCollegeName(e.target.value)}
              className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-primary focus:border-primary text-base"
              placeholder="Enter the full name of the college"
              required
            />
          </div>
          
          <p className="text-sm font-semibold text-gray-600 pt-2 border-t border-gray-200">College Admin User Details</p>
          
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
              Admin Username <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-primary focus:border-primary text-base"
              placeholder="Username for college admin account"
              required
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Admin Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-primary focus:border-primary text-base"
              placeholder="example@college.edu"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Admin Password <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-primary focus:border-primary text-base"
              placeholder="Create a secure password"
              required
              minLength="6"
            />
          </div>
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
              Confirm Admin Password <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-primary focus:border-primary text-base"
              placeholder="Re-enter the same password"
              required
              minLength="6"
            />
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              disabled={isLoading}
              className="px-5 py-2.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-5 py-2.5 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50"
            >
              {isLoading ? 'Adding...' : 'Add College'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCollegeModal;