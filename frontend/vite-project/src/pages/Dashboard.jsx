import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import API_BASE_URL from "../config";

function Dashboard() {
  const { user } = useContext(AuthContext);
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [transactionType, setTransactionType] = useState("all");

  useEffect(() => {
    fetchData();
  }, []);

  // Fetch all data at once
  const fetchData = async () => {
    setLoading(true);
    try {
      const [balanceResponse, transactionsResponse] = await Promise.all([
        axios.get(`${API_BASE_URL}/api/account/balance`, {
          headers: { Authorization: `Bearer ${user.token}` },
        }),
        axios.get(`${API_BASE_URL}/api/account/transactions`, {
          headers: { Authorization: `Bearer ${user.token}` },
        }),
      ]);

      setBalance(balanceResponse.data.balance);
      setTransactions(transactionsResponse.data);
      setError("");
    } catch (err) {
      setError("Failed to load account data. Please try again later.");
      console.error("Dashboard data fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Filter transactions based on selected type
  const filteredTransactions = transactionType === "all"
    ? transactions
    : transactions.filter(txn => txn.type.toLowerCase() === transactionType);

  // Calculate recent activity stats
  const getActivityStats = () => {
    const lastWeekDate = new Date();
    lastWeekDate.setDate(lastWeekDate.getDate() - 7);
    
    const recentTransactions = transactions.filter(
      txn => new Date(txn.timestamp) >= lastWeekDate
    );
    
    const deposits = recentTransactions
      .filter(txn => txn.type.toLowerCase() === "deposit")
      .reduce((sum, txn) => sum + txn.amount, 0);
      
    const withdrawals = recentTransactions
      .filter(txn => txn.type.toLowerCase() === "withdrawal")
      .reduce((sum, txn) => sum + txn.amount, 0);
      
    return { count: recentTransactions.length, deposits, withdrawals };
  };

  const activityStats = getActivityStats();

  // Format currency with commas and decimal points
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2
    }).format(amount).replace('₹', '₹ ');
  };

  return (
    <div className="container-fluid py-4">
      {error && (
        <div className="alert alert-danger alert-dismissible fade show" role="alert">
          <i className="bi bi-exclamation-triangle-fill me-2"></i>
          {error}
          <button type="button" className="btn-close" onClick={() => setError("")}></button>
        </div>
      )}
      
      {message && (
        <div className="alert alert-success alert-dismissible fade show" role="alert">
          <i className="bi bi-check-circle-fill me-2"></i>
          {message}
          <button type="button" className="btn-close" onClick={() => setMessage("")}></button>
        </div>
      )}

      {/* Dashboard Header */}
      <div className="row mb-4 align-items-center">
        <div className="col-md-8">
          <h2 className="fw-bold text-primary">
            <i className="bi bi-speedometer2 me-2"></i>
            Financial Dashboard
          </h2>
          <p className="text-muted">Welcome back, {user?.name || "Valued Customer"}</p>
        </div>
        <div className="col-md-4 text-md-end">
          <button 
            className="btn btn-outline-primary me-2" 
            onClick={fetchData}
            disabled={loading}
          >
            <i className="bi bi-arrow-clockwise me-1"></i>
            {loading ? "Refreshing..." : "Refresh"}
          </button>
          <button className="btn btn-primary">
            <i className="bi bi-plus-lg me-1"></i>
            New Transaction
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <ul className="nav nav-tabs nav-fill mb-4">
        <li className="nav-item">
          <button 
            className={`nav-link ${activeTab === "overview" ? "active" : ""}`}
            onClick={() => setActiveTab("overview")}
          >
            <i className="bi bi-grid-1x2-fill me-1"></i>
            Overview
          </button>
        </li>
        <li className="nav-item">
          <button 
            className={`nav-link ${activeTab === "accounts" ? "active" : ""}`}
            onClick={() => setActiveTab("accounts")}
          >
            <i className="bi bi-wallet2 me-1"></i>
            Accounts
          </button>
        </li>
        <li className="nav-item">
          <button 
            className={`nav-link ${activeTab === "transactions" ? "active" : ""}`}
            onClick={() => setActiveTab("transactions")}
          >
            <i className="bi bi-list-ul me-1"></i>
            Transactions
          </button>
        </li>
        <li className="nav-item">
          <button 
            className={`nav-link ${activeTab === "services" ? "active" : ""}`}
            onClick={() => setActiveTab("services")}
          >
            <i className="bi bi-gear-fill me-1"></i>
            Services
          </button>
        </li>
      </ul>

      {/* Dashboard Content */}
      {activeTab === "overview" && (
        <>
          {/* Summary Cards Row */}
          <div className="row mb-4">
            <div className="col-md-3 col-sm-6 mb-3 mb-md-0">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body">
                  <div className="d-flex align-items-center">
                    <div className="rounded-circle bg-primary bg-opacity-10 p-3 me-3">
                      <i className="bi bi-wallet2 text-primary fs-4"></i>
                    </div>
                    <div>
                      <h6 className="card-subtitle mb-1 text-muted">Total Balance</h6>
                      <h3 className="card-title mb-0">{formatCurrency(balance)}</h3>
                    </div>
                  </div>
                </div>
                <div className="card-footer bg-transparent border-0 text-end">
                  <a href="#" className="text-decoration-none">View Details →</a>
                </div>
              </div>
            </div>

            <div className="col-md-3 col-sm-6 mb-3 mb-md-0">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body">
                  <div className="d-flex align-items-center">
                    <div className="rounded-circle bg-success bg-opacity-10 p-3 me-3">
                      <i className="bi bi-graph-up-arrow text-success fs-4"></i>
                    </div>
                    <div>
                      <h6 className="card-subtitle mb-1 text-muted">Income (7d)</h6>
                      <h3 className="card-title mb-0">{formatCurrency(activityStats.deposits)}</h3>
                    </div>
                  </div>
                </div>
                <div className="card-footer bg-transparent border-0 text-end">
                  <a href="#" className="text-decoration-none">View Details →</a>
                </div>
              </div>
            </div>

            <div className="col-md-3 col-sm-6 mb-3 mb-md-0">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body">
                  <div className="d-flex align-items-center">
                    <div className="rounded-circle bg-danger bg-opacity-10 p-3 me-3">
                      <i className="bi bi-graph-down-arrow text-danger fs-4"></i>
                    </div>
                    <div>
                      <h6 className="card-subtitle mb-1 text-muted">Expenses (7d)</h6>
                      <h3 className="card-title mb-0">{formatCurrency(activityStats.withdrawals)}</h3>
                    </div>
                  </div>
                </div>
                <div className="card-footer bg-transparent border-0 text-end">
                  <a href="#" className="text-decoration-none">View Details →</a>
                </div>
              </div>
            </div>

            <div className="col-md-3 col-sm-6">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body">
                  <div className="d-flex align-items-center">
                    <div className="rounded-circle bg-info bg-opacity-10 p-3 me-3">
                      <i className="bi bi-arrow-left-right text-info fs-4"></i>
                    </div>
                    <div>
                      <h6 className="card-subtitle mb-1 text-muted">Transactions (7d)</h6>
                      <h3 className="card-title mb-0">{activityStats.count}</h3>
                    </div>
                  </div>
                </div>
                <div className="card-footer bg-transparent border-0 text-end">
                  <a href="#" className="text-decoration-none">View Details →</a>
                </div>
              </div>
            </div>
          </div>

          {/* Account Type Cards */}
          <h4 className="mb-3 fw-bold">Your Accounts</h4>
          <div className="row mb-4">
            <div className="col-md-4 mb-3">
              <div className="card border-0 shadow-sm h-100 overflow-hidden">
                <div className="position-absolute bg-primary opacity-10 top-0 end-0 w-50 h-100 rounded-circle translate-middle-y translate-x-25"></div>
                <div className="card-body position-relative">
                  <div className="d-flex justify-content-between align-items-start mb-4">
                    <div>
                      <i className="bi bi-piggy-bank fs-2 text-primary"></i>
                      <h5 className="card-title mt-2 mb-0 fw-bold">Savings Account</h5>
                      <p className="text-muted small">Primary Account</p>
                    </div>
                    <span className="badge bg-primary rounded-pill">Active</span>
                  </div>
                  <h3 className="mb-3">{formatCurrency(balance)}</h3>
                  <p className="card-text small text-muted mb-0">Account No: XXXX-XXXX-2345</p>
                </div>
                <div className="card-footer bg-transparent d-flex justify-content-between border-0">
                  <button className="btn btn-sm btn-outline-primary">
                    <i className="bi bi-arrow-down-up me-1"></i>
                    Transfer
                  </button>
                  <button className="btn btn-sm btn-primary">
                    <i className="bi bi-clipboard-data me-1"></i>
                    View Details
                  </button>
                </div>
              </div>
            </div>

            <div className="col-md-4 mb-3">
              <div className="card border-0 shadow-sm h-100 overflow-hidden">
                <div className="position-absolute bg-success opacity-10 top-0 end-0 w-50 h-100 rounded-circle translate-middle-y translate-x-25"></div>
                <div className="card-body position-relative">
                  <div className="d-flex justify-content-between align-items-start mb-4">
                    <div>
                      <i className="bi bi-cash-coin fs-2 text-success"></i>
                      <h5 className="card-title mt-2 mb-0 fw-bold">Loan Account</h5>
                      <p className="text-muted small">Personal Loan</p>
                    </div>
                    <span className="badge bg-secondary rounded-pill">Not Active</span>
                  </div>
                  <h3 className="mb-3">{formatCurrency(0)}</h3>
                  <p className="card-text small text-muted mb-0">Apply for instant personal loans</p>
                </div>
                <div className="card-footer bg-transparent d-flex justify-content-between border-0">
                  <button className="btn btn-sm btn-outline-success">
                    <i className="bi bi-calculator me-1"></i>
                    Calculator
                  </button>
                  <button className="btn btn-sm btn-success">
                    <i className="bi bi-cash-stack me-1"></i>
                    Apply Now
                  </button>
                </div>
              </div>
            </div>

            <div className="col-md-4 mb-3">
              <div className="card border-0 shadow-sm h-100 overflow-hidden">
                <div className="position-absolute bg-warning opacity-10 top-0 end-0 w-50 h-100 rounded-circle translate-middle-y translate-x-25"></div>
                <div className="card-body position-relative">
                  <div className="d-flex justify-content-between align-items-start mb-4">
                    <div>
                      <i className="bi bi-shield-check fs-2 text-warning"></i>
                      <h5 className="card-title mt-2 mb-0 fw-bold">Insurance</h5>
                      <p className="text-muted small">Life & Health</p>
                    </div>
                    <span className="badge bg-secondary rounded-pill">Not Active</span>
                  </div>
                  <h3 className="mb-3">{formatCurrency(0)}</h3>
                  <p className="card-text small text-muted mb-0">Secure your future with insurance plans</p>
                </div>
                <div className="card-footer bg-transparent d-flex justify-content-between border-0">
                  <button className="btn btn-sm btn-outline-warning">
                    <i className="bi bi-info-circle me-1"></i>
                    Plans
                  </button>
                  <button className="btn btn-sm btn-warning text-dark">
                    <i className="bi bi-shield-plus me-1"></i>
                    Get Insured
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Transaction History Section - Visible in both Overview and Transactions tabs */}
      {(activeTab === "overview" || activeTab === "transactions") && (
        <>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h4 className="mb-0 fw-bold">Transaction History</h4>
            <div className="d-flex gap-2">
              <div className="btn-group">
                <button 
                  className={`btn ${transactionType === "all" ? "btn-primary" : "btn-outline-primary"}`}
                  onClick={() => setTransactionType("all")}
                >
                  All
                </button>
                <button 
                  className={`btn ${transactionType === "deposit" ? "btn-primary" : "btn-outline-primary"}`}
                  onClick={() => setTransactionType("deposit")}
                >
                  Deposits
                </button>
                <button 
                  className={`btn ${transactionType === "withdrawal" ? "btn-primary" : "btn-outline-primary"}`}
                  onClick={() => setTransactionType("withdrawal")}
                >
                  Withdrawals
                </button>
              </div>
              <button className="btn btn-outline-secondary">
                <i className="bi bi-funnel me-1"></i>
                Filter
              </button>
            </div>
          </div>

          <div className="card border-0 shadow-sm mb-4">
            <div className="card-body p-0">
              {loading ? (
                <div className="d-flex justify-content-center align-items-center p-5">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              ) : filteredTransactions.length === 0 ? (
                <div className="text-center py-5">
                  <i className="bi bi-inbox fs-1 text-muted"></i>
                  <p className="mt-3 mb-0">No transactions found</p>
                  <p className="text-muted small">Transactions will appear here when you make them</p>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover align-middle mb-0">
                    <thead className="table-light">
                      <tr>
                        <th scope="col" className="border-0">Transaction</th>
                        <th scope="col" className="border-0">Type</th>
                        <th scope="col" className="border-0">Date & Time</th>
                        <th scope="col" className="border-0">Status</th>
                        <th scope="col" className="border-0">Amount</th>
                        <th scope="col" className="border-0 text-end">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredTransactions.map((txn) => (
                        <tr key={txn._id}>
                          <td>
                            <div className="d-flex align-items-center">
                              <div className={`rounded-circle p-2 me-3 ${
                                txn.type.toLowerCase() === "deposit" 
                                  ? "bg-success bg-opacity-10" 
                                  : "bg-danger bg-opacity-10"
                              }`}>
                                <i className={`bi ${
                                  txn.type.toLowerCase() === "deposit" 
                                    ? "bi-arrow-down-left text-success" 
                                    : "bi-arrow-up-right text-danger"
                                }`}></i>
                              </div>
                              <div>
                                <p className="mb-0 fw-medium">{txn.description || (txn.type.toLowerCase() === "deposit" ? "Deposit" : "Withdrawal")}</p>
                                <p className="text-muted small mb-0">ID: {txn._id.substring(0, 8)}...</p>
                              </div>
                            </div>
                          </td>
                          <td>
                            <span className={`badge ${
                              txn.type.toLowerCase() === "deposit" 
                                ? "bg-success" 
                                : "bg-danger"
                            }`}>
                              {txn.type}
                            </span>
                          </td>
                          <td>
                            <p className="mb-0">{new Date(txn.timestamp).toLocaleDateString()}</p>
                            <p className="text-muted small mb-0">{new Date(txn.timestamp).toLocaleTimeString()}</p>
                          </td>
                          <td>
                            <span className="badge bg-success">Completed</span>
                          </td>
                          <td className={`fw-bold ${
                            txn.type.toLowerCase() === "deposit" 
                              ? "text-success" 
                              : "text-danger"
                          }`}>
                            {txn.type.toLowerCase() === "deposit" ? "+" : "-"}
                            {formatCurrency(txn.amount)}
                          </td>
                          <td className="text-end">
                            <button className="btn btn-sm btn-light me-1" title="View Details">
                              <i className="bi bi-eye"></i>
                            </button>
                            <button className="btn btn-sm btn-light" title="Download Receipt">
                              <i className="bi bi-download"></i>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
            <div className="card-footer bg-white border-0">
              <div className="d-flex justify-content-between align-items-center">
                <p className="text-muted small mb-0">Showing {filteredTransactions.length} transactions</p>
                <nav>
                  <ul className="pagination pagination-sm mb-0">
                    <li className="page-item disabled"><a className="page-link" href="#">Previous</a></li>
                    <li className="page-item active"><a className="page-link" href="#">1</a></li>
                    <li className="page-item"><a className="page-link" href="#">2</a></li>
                    <li className="page-item"><a className="page-link" href="#">3</a></li>
                    <li className="page-item"><a className="page-link" href="#">Next</a></li>
                  </ul>
                </nav>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Accounts Tab Content */}
      {activeTab === "accounts" && (
        <div className="text-center py-5">
          <i className="bi bi-bank2 fs-1 text-primary mb-3"></i>
          <h4>Account Management</h4>
          <p className="text-muted">You can manage all your accounts here</p>
          <button className="btn btn-primary">View All Accounts</button>
        </div>
      )}

      {/* Services Tab Content */}
      {activeTab === "services" && (
        <div className="text-center py-5">
          <i className="bi bi-gear fs-1 text-primary mb-3"></i>
          <h4>Banking Services</h4>
          <p className="text-muted">Explore our range of banking services</p>
          <button className="btn btn-primary">Explore Services</button>
        </div>
      )}
    </div>
  );
}

export default Dashboard;