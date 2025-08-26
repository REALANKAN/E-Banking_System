import React, { useState } from "react";

const SavingsAccount = () => {
  const [balance, setBalance] = useState(0);

  const handleDeposit = () => {
    // Add deposit logic
    setBalance(balance + 100); // Example deposit
  };

  const handleWithdraw = () => {
    // Add withdraw logic
    setBalance(balance - 50); // Example withdraw
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Savings Account</h2>
      <p>Balance: ${balance}</p>
      <button onClick={handleDeposit} className="bg-green-500 text-white px-4 py-2 rounded mr-2">Deposit</button>
      <button onClick={handleWithdraw} className="bg-red-500 text-white px-4 py-2 rounded">Withdraw</button>
    </div>
  );
};

export default SavingsAccount;
