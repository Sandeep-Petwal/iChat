/* eslint-disable no-unused-vars */
import { useState, useContext } from 'react';
import { ChatContext } from "../context/ChatContext"
import { useNavigate } from 'react-router-dom';
import { Toaster, toast } from 'react-hot-toast';
import axios from 'axios';
import { Link } from 'react-router-dom';

function Login() {
  const { user, login, logout, verifyUser } = useContext(ChatContext);


  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();



  const handleSubmit = async (event) => {
    event.preventDefault();
    if (loading) return;
    console.log('Form submitting :', { email, password });

    try {
      setLoading(true);
      const response = await axios.post(`${apiUrl}/auth/login`, { email, password });
      if (response.data) {
        toast.success("Login successful");
        const { user_id, email, name } = response.data.data;
        const token = response.data.token;
        login(user_id, email, name);
        localStorage.setItem("ichat_token", token)
        navigate("/");
      }
    } catch (error) {
      console.log(error);
      console.table(error.response)
      toast.error(error.response.data.error);
    } finally {
      setLoading(false);
    }
  };


  // if logged in
  if (user.isLoggedIn) {
    return (
      <div className="mt-16 max-w-sm mx-auto bg-gray-800 text-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-semibold mb-2">Welcome Back, {user.name}!</h2>
        <p className="text-gray-400 mb-4">You are logged in as {user.email}</p>
        <Link to="/">
          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded transition duration-300">
            Go to Home
          </button>
        </Link>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center  py-10  bg-gray-900">
      <div className="w-full max-w-md p-8 bg-gray-800 rounded-lg shadow-md">
        <h2 className="text-3xl font-bold text-center text-white mb-6">Login</h2>
        <p className="text-lg text-gray-400 text-center mb-4">Login to your account</p>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-300 text-sm font-semibold mb-2" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border border-gray-600 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-300 text-sm font-semibold mb-2" htmlFor="password">
              Password
            </label>
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border border-gray-600 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
              required
            />
          </div>
          <div className="mb-4 flex items-center">
            <input
              type="checkbox"
              id="showPassword"
              checked={showPassword}
              onChange={() => setShowPassword(!showPassword)}
              className="mr-2"
            />
            <label className="text-gray-300 text-sm" htmlFor="showPassword">
              Show Password
            </label>
          </div>
          <button
            type="submit"
            className="w-full py-3 mt-4 text-white bg-blue-600 rounded-md hover:bg-blue-700 transition duration-300"
          >
            Submit
          </button>
        </form>
        <p className="mt-6 text-center text-gray-400">
          Don’t have an account?{' '}
          <button
            onClick={() => navigate('/signup')}
            className="text-blue-500 hover:underline"
          >
            Sign Up
          </button>
        </p>
      </div>


      <Toaster
        position="top-center"
        reverseOrder={false}
      />
    </div>
  );
}

export default Login;
