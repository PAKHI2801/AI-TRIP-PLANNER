import { Link } from 'react-router-dom';
import React, { useState } from 'react';
import bg5 from '../../../assets/bg5.jpg';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaGoogle } from 'react-icons/fa';
import { validateForm } from 'middleware/authMiddleware';
import { SignUp } from 'controllers/Signup';
import { isLogin } from 'controllers/Login';
import { auth, provider, signInWithPopup } from 'config/Firebase';
import { useNavigate } from 'react-router-dom';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from 'config/db'; // adjust path if needed

function Login() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [isFlipping, setIsFlipping] = useState(false);
  const navigate = useNavigate();

  const handleToggle = () => {
    setIsFlipping(true);
    setTimeout(() => {
      setIsSignUp((prev) => !prev);
      setIsFlipping(false);
    }, 200);
  };

  const [errors, setErrors] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      toast.success(`Welcome, ${user.displayName}, your profile is verified successfully!`);
      console.log('Google user:', user);

      const userDocRef = doc(db, 'users', user.uid);
      const adminDocRef = doc(db, 'admin', user.uid);

      const [userSnap, adminSnap] = await Promise.all([
        getDoc(userDocRef),
        getDoc(adminDocRef),
      ]);

      let role = '';

      if (adminSnap.exists()) {
        role = 'admin';
      } else if (userSnap.exists()) {
        role = 'user';
      } else {
        // First-time Google login — create basic user profile
        await setDoc(userDocRef, {
          username: user.displayName || 'New User',
          email: user.email,
          role: 'user',
          createdAt: serverTimestamp(),
        });
        role = 'user';
      }

      // Store user ID if needed
      localStorage.setItem('adminId', user.uid);

     
    } catch (error) {
      toast.error('Google sign-in failed');
      console.error(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Only needed once

    console.log(`${isSignUp ? 'Sign Up' : 'Login'} form submitted!`);

    setErrors('');
    setSuccess('');

    const req = { body: formData };

    const res = (response) => {
      if (response.status === 200) {
        toast.success(response.message);
        setFormData({
          username: '',
          email: '',
          password: '',
          // role: '' // Include if needed
        });
        if (!isSignUp) {
          if (response.role === 'user') {
            navigate('/user'); // Navigate to user dashboard
          } else if (response.role === 'admin') {
            navigate('/admin'); // Navigate to admin dashboard
          }
        }
      }
    };

    const next = (err) => {
      toast.error(err.message);
    };
    try {
      if (isSignUp) {
        validateForm(req, res, (middlewareErr) => {
          if (middlewareErr) {
            next(middlewareErr);
          } else {
            SignUp(req, res, next);
          }
        });
      } else {
        //isLogin(req, res, next);
        const response = await isLogin(req);
        localStorage.setItem('adminId', response.user.uid); // Await login result
        toast.success(response.message);
        // Navigate after login
        if (response.user.role === 'user') {
          navigate('/user');
        } else if (response.user.role === 'admin') {
          navigate('/admin');
        }
      }
    } catch (error) {
      // toast.error(error.message)
      toast.error('Invalid Email or Password');
    }
  };

  const commonInputClasses =
    'w-full px-4 py-2 border-2 border-white rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 bg-transparent text-white placeholder-white';

  return (
    <div
      className="w-full h-screen bg-cover bg-center flex items-center justify-center p-4" // Added p-4 for padding on smaller screens
      style={{ backgroundImage: `url(${bg5})` }}
    >
      <div
        className={`w-full max-w-sm sm:max-w-md bg-white/20 backdrop-blur-md rounded-xl p-6 sm:p-10 mx-auto transform-gpu transition-transform duration-500 ${ // Adjusted max-w and padding
          isFlipping ? 'rotate-y-90' : ''
        }`}
        style={{ perspective: '1000px' }}
      >
        <h2 className="text-3xl font-bold text-white mb-2 mt-0 text-center">
          {isSignUp ? 'Create Account' : 'Welcome Back'}
        </h2>
        <p className="text-sm font-medium text-white mb-5 text-center">
          {isSignUp
            ? 'Please Fill in the Details to Register'
            : 'Please Enter Your Details to Continue'}
        </p>

        {/* Toggle Switch */}
        <div className="flex justify-center mb-6">
          <span className="text-lg font-bold text-white mr-5">Login</span>
          <label className="relative w-[50px] h-[20px] flex items-center mt-1">
            <input
              type="checkbox"
              checked={isSignUp}
              className="peer sr-only"
              onChange={handleToggle}
            />
            <span className="absolute top-0 left-0 right-0 bottom-0 cursor-pointer border-2 border-white bg-white rounded-[5px] transition duration-300 peer-checked:bg-[#2d8cf0]" />
            <span className="absolute bottom-[2px] left-[-2px] w-[20px] h-[20px] bg-white border-2 border-[#323232] rounded-[5px] shadow-[0_3px_0_0_#323232] transition-transform duration-300 peer-checked:translate-x-[30px]" />
          </label>
          <span className="text-lg font-bold text-white ml-5">Sign Up</span>
        </div>
        <div>
          {/* ... Your Login form code ... */}
          <ToastContainer position="top-center" autoClose={5000} />
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {isSignUp && (
            <>
              {/* Role Selection Toggle Boxes */}
              <div className="mb-6">
                <label className="block text-white text-center font-bold mb-2">
                  Hey, Who Are You ?
                </label>
                <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6"> {/* Changed to flex-col on small, flex-row on sm and up */}
                  {/* User Box */}
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, role: 'user' })}
                    className={`w-full sm:w-40 px-4 py-2 rounded-lg border-2 font-bold transition-all duration-300 ${ // Adjusted width
                      formData.role === 'user'
                        ? 'bg-white text-[#0a3a63] border-white shadow-lg scale-105'
                        : 'bg-transparent text-white border-white hover:bg-white/20'
                    }`}
                  >
                    User
                  </button>

                  {/* Admin Box */}
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, role: 'admin' })}
                    className={`w-full sm:w-40 px-4 py-2 rounded-lg border-2 font-bold transition-all duration-300 ${ // Adjusted width
                      formData.role === 'admin'
                        ? 'bg-white text-[#0a3a63] border-white shadow-lg scale-105'
                        : 'bg-transparent text-white border-white hover:bg-white/20'
                    }`}
                  >
                    Admin
                  </button>
                </div>
              </div>

              {/* Username */}
              <div>
                <label className="block text-white font-bold mb-1">
                  Username
                </label>
                <input
                  type="text"
                  name="username"
                  placeholder="Enter Your Full Name"
                  className={commonInputClasses}
                  value={formData.username}
                  onChange={handleChange}
                  required
                />
              </div>
            </>
          )}

          {/* Email Field */}
          <div>
            <label className="block text-white font-bold mb-1">Email</label>
            <input
              type="email"
              name="email"
              placeholder="Enter Your Email"
              className={commonInputClasses}
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          {/* Password Field */}
          {!isSignUp && (
            <div>
              <label className="block text-white font-bold mb-1">
                Password
              </label>
              <input
                type="password"
                name="password"
                placeholder="Enter Your Password"
                value={formData.password}
                onChange={handleChange}
                className={commonInputClasses}
                required
              />
            </div>
          )}

          {isSignUp && (
            <>
              <div>
                <label className="block text-white font-bold mb-1">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  placeholder="At least 8 Characters"
                  className={commonInputClasses}
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>
            </>
          )}

          {!isSignUp && (
            <div className="flex flex-col sm:flex-row justify-between items-center text-sm text-white space-y-2 sm:space-y-0"> {/* Added flex-col on small, flex-row on sm and up, and spacing */}
              <label className="flex items-center font-bold">
                <input type="checkbox" className="mr-2" /> Remember me
              </label>
              <Link to="/forgot" className="hover:underline font-medium text-white">
                Forgot Password?
              </Link>
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-white text-[#0a3a63] border-black border-2
                       hover:bg-black hover:text-white text-lg font-bold py-2 rounded-lg
                       shadow-md transition mb-1"
          >
            {isSignUp ? 'Sign Up' : 'Sign In'}
          </button>
          {!isSignUp && (
            <>
             <p></p>

              <button
                type="button"
                onClick={handleGoogleSignIn}
                className="w-full bg-white text-[#0a3a63] border-black border-2
                 hover:bg-black hover:text-white text-lg font-bold py-2 rounded-lg
                 shadow-md transition flex items-center justify-center gap-3"
              >
                <FaGoogle className="text-2xl" /> Verify Your Account
              </button>
            </>
          )}

          <p className="text-center text-sm text-white font-bold mt-1">
            {isSignUp ? (
              <>
                Already have an account?{' '}
                <span
                  onClick={handleToggle}
                  className="text-white font-bold hover:underline cursor-pointer"
                >
                  Sign in
                </span>
              </>
            ) : (
              <>
                Don't have an account?{' '}
                <span
                  onClick={handleToggle}
                  className="text-white font-semibold hover:underline cursor-pointer"
                >
                  Sign up for free
                </span>
              </>
            )}
          </p>
        </form>
      </div>
    </div>
  );
}

export default Login;