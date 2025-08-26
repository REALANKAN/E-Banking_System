import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import API_BASE_URL from "../config";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Login() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { data } = await axios.post(`${API_BASE_URL}/api/auth/login`, { email, password });

      // Log the user in by setting the context
      login(data);

      // Show success toast notification
      toast.success("Logged In Successfully!", {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });

      // Clear any error message
      setError("");

      // Navigate to dashboard after a slight delay to show the toast
      setTimeout(() => {
        navigate("/dashboard");
      }, 2000);
    } catch (err) {
      setLoading(false); // Ensure loading is stopped on error

      // Handle error with toast
      toast.error(err.response?.data?.message || "❌ Invalid credentials. Please try again.", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });

      // Set error state for additional display
      setError(err.response?.data?.message || "❌ Invalid credentials. Please try again.");
    } finally {
      setLoading(false); // Ensure loading is stopped even on success
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div
        className="card shadow p-4"
        style={{
          width: "90%",
          maxWidth: "400px",
          borderRadius: "10px",
          margin: "0 auto",
        }}
      >
        <h2 className="text-center mb-3 text-primary">Secure Login</h2>
        {error && <div className="alert alert-danger">{error}</div>}
        <ToastContainer />

        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-control"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            className="btn btn-primary w-100"
            type="submit"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="text-center mt-3">
          Don't have an account?{" "}
          <a href="/register" className="text-primary">
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
}

export default Login;
