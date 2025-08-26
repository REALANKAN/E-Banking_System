import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import API_BASE_URL from "../config";

const AdminPanel = () => {
  const { user } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user || user.accountType !== "admin") {
      setError("Unauthorized access. Admins only.");
      setLoading(false);
      return;
    }
  
    const fetchAdminData = async () => {
      try {
        // Fetch the token from the user context or from local storage
        const token = user?.token || localStorage.getItem("token");
  
        const [usersRes, transactionsRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/admin/users`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${API_BASE_URL}/admin/transactions`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);
  
        setUsers(usersRes.data);
        setTransactions(transactionsRes.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching admin data:", err.response?.data?.message || err.message);
        setError("Error fetching admin data.");
        setLoading(false);
      }
    };
  
    fetchAdminData();
  }, [user]);
  

  if (loading) {
    return (
      <div className="container text-center mt-5">
        <h2 className="text-primary">Loading Admin Panel...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container text-center mt-5">
        <h2 className="text-danger">{error}</h2>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <h2 className="mb-3 text-primary text-center">🔹 Admin Panel</h2>

      {/* Users List */}
      <div className="card shadow-lg p-4 mb-4">
        <h4 className="text-dark">👥 All Users</h4>
        <table className="table table-striped table-hover">
          <thead className="table-primary">
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Account Type</th>
              <th>Balance (₹)</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center text-muted">No users found</td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user._id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.accountType}</td>
                  <td>₹{user.balance.toFixed(2)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Transactions List */}
      <div className="card shadow-lg p-4">
        <h4 className="text-dark"> Transaction History</h4>
        <table className="table table-bordered">
          <thead className="table-success">
            <tr>
              <th>User ID</th>
              <th>Type</th>
              <th>Amount (₹)</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {transactions.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center text-muted">No transactions found</td>
              </tr>
            ) : (
              transactions.map((tx) => (
                <tr key={tx._id}>
                  <td>{tx.userId}</td>
                  <td className={tx.type === "deposit" ? "text-success" : "text-danger"}>{tx.type}</td>
                  <td>₹{tx.amount.toFixed(2)}</td>
                  <td>{new Date(tx.timestamp).toLocaleString()}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminPanel;
