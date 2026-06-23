
import React, { useState } from "react";
import "./VenderHome.css";
import Product from "../ProductViews/Product";

function VenderHome({ vender, onLogout }) {
  const [showProduct, setShowProduct] = useState(false);

  if (showProduct) {
    return (
      <Product
        data={vender.Vid}
        onBack={() => setShowProduct(false)}
      />
    );
  }

  return (
   <div className="vendor-home">
  <h2>Welcome Vendor Home</h2>

  <img src={vender.VPicName} alt="Vendor" />

  <div className="vendor-card">
    <p><b>Vendor ID:</b> {vender.Vid}</p>
    <p><b>Name:</b> {vender.VenderName}</p>
  </div>

  <div className="vendor-buttons">
    <button
      className="manage-btn"
      onClick={() => setShowProduct(true)}
    >
      Manage Product
    </button>

    <button
      className="logout-btn"
      onClick={onLogout}
    >
      Logout
    </button>
  </div>
</div>
  );
}

export default VenderHome;