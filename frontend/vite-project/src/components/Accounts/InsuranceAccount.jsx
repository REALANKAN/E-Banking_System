import React, { useState } from "react";

const InsuranceAccount = () => {
  const [premium, setPremium] = useState(1000);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Insurance Account</h2>
      <p>Premium Amount: ${premium}</p>
      <button className="bg-purple-500 text-white px-4 py-2 rounded">Pay Premium</button>
    </div>
  );
};

export default InsuranceAccount;
