//Customer Profile
import React, { useEffect, useState } from "react";
import axios from "axios";
import "./CustomerProfile.css";

function CustomerProfile(props) {
  const [profile, setProfile] = useState(null);

  const cid =props.data; //1//JSON.parse(localStorage.getItem("userSession"))?.cid;
  const REACT_APP_BASE_API_URL = process.env.REACT_APP_BASE_API_URL;

  useEffect(() => {
    axios
      .get(`${REACT_APP_BASE_API_URL}/customer/getcustomerdetails/${cid}`)
      .then((res) => setProfile(res.data))
      .catch((err) => console.error(err));
  }, [cid, REACT_APP_BASE_API_URL]);

  if (!profile) {
    return <h3>Loading Profile...</h3>;
  }

  return (
    <div className="customer-profile-container">
      <div className="customer-profile-card">
        <h2 className="customer-profile-title">
          Customer Profile
        </h2>

        <div className="profile-image-section">
          <img
            src={profile.CPicName}
            alt="Customer"
            className="profile-image"
          />
        </div>

        <div className="profile-details">

          <div className="profile-row">
            <span className="label">Customer Name</span>
            <span>{profile.CustomerName}</span>
          </div>

          <div className="profile-row">
            <span className="label">User ID</span>
            <span>{profile.CUserId}</span>
          </div>

          <div className="profile-row">
            <span className="label">State ID</span>
            <span>{profile.CStId}</span>
          </div>

          <div className="profile-row">
            <span className="label">City ID</span>
            <span>{profile.CCtId}</span>
          </div>

          <div className="profile-row">
            <span className="label">Address</span>
            <span>{profile.CAddress}</span>
          </div>

          <div className="profile-row">
            <span className="label">Contact</span>
            <span>{profile.CContact}</span>
          </div>

          <div className="profile-row">
            <span className="label">Email</span>
            <span>{profile.CEmail}</span>
          </div>

        </div>
      </div>
    </div>
  );
}

export default CustomerProfile;