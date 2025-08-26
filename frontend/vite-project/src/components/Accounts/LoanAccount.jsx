import React, { useState } from "react";

const LoanAccount = () => {
  const [loanAmount, setLoanAmount] = useState(5000);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Loan Account</h2>
      <p>Outstanding Loan: ${loanAmount}</p>
      <button className="bg-blue-500 text-white px-4 py-2 rounded">Pay Installment</button>
    </div>
  );
};

export default LoanAccount;
