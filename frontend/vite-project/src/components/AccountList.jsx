import React from "react";
import { Link } from "react-router-dom";

const AccountList = () => {
  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Manage Your Accounts</h2>
      <div className="grid grid-cols-1 gap-4">
        <Link to="/accounts/savings" className="p-4 bg-blue-500 text-white rounded-lg">
          Savings Account
        </Link>
        <Link to="/accounts/loan" className="p-4 bg-green-500 text-white rounded-lg">
          Loan Account
        </Link>
        <Link to="/accounts/insurance" className="p-4 bg-yellow-500 text-white rounded-lg">
          Insurance Account
        </Link>
      </div>
    </div>
  );
};

export default AccountList;
