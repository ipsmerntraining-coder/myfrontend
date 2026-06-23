//Edit Customer Profile
import React, { useEffect, useState } from "react";
import axios from "axios";

function EditCustomerProfile({ user, onClose, onUpdate }) {
  const API = process.env.REACT_APP_BASE_API_URL;

  const [formData, setFormData] = useState(null);
  const [stlist, setStList] = useState([]);
  const [ctlist, setCtList] = useState([]);
  const [newImage, setNewImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Load Customer Details
  useEffect(() => {
    loadCustomer();
    loadStates();
  }, [user.Cid]);

  const loadCustomer = async () => {
    try {
      const res = await axios.get(
        `${API}/customer/getcustomerdetails/${user.Cid}`
      );

      setFormData(res.data);

      if (res.data.StId) {
        loadCities(res.data.StId);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const loadStates = async () => {
    try {
      const res = await axios.get(`${API}/state/show`);
      setStList(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const loadCities = async (stid) => {
    try {
      const res = await axios.get(
        `${API}/city/showcitybystate/${stid}`
      );
      setCtList(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  if (!formData) return <div>Loading...</div>;

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleStateChange = async (e) => {
    const stid = e.target.value;

    setFormData({
      ...formData,
      StId: stid,
      CtId: "",
    });

    await loadCities(stid);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    setNewImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const getImageUrl = (picName) => {
    if (!picName) return "/default-avatar.png";

    if (
      picName.startsWith("http://") ||
      picName.startsWith("https://")
    ) {
      return picName;
    }

    return `${API}/customerimages/${picName}`;
  };

  const validate = () => {
    let errs = {};

    if (!formData.CustomerName?.trim()) {
      errs.CustomerName = "Name is required";
    }

    if (!formData.StId) {
      errs.StId = "State is required";
    }

    if (!formData.CtId) {
      errs.CtId = "City is required";
    }

    if (!formData.CAddress?.trim()) {
      errs.CAddress = "Address is required";
    }

    if (!/^\d{10}$/.test(String(formData.CContact || ""))) {
      errs.CContact = "Contact must be 10 digits";
    }

    if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        formData.CEmail || ""
      )
    ) {
      errs.CEmail = "Valid Email required";
    }

    setErrors(errs);

    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    setLoading(true);

    try {
      const fd = new FormData();

      fd.append("CustomerName", formData.CustomerName);
      fd.append("CUserId", formData.CUserId);
      fd.append("StId", formData.StId);
      fd.append("CtId", formData.CtId);
      fd.append("CAddress", formData.CAddress);
      fd.append("CContact", formData.CContact);
      fd.append("CEmail", formData.CEmail);

      if (newImage) {
        fd.append("CPicName", newImage);
      }

      const res = await axios.put(
        `${API}/customer/update/${user.Cid}`,
        fd,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      alert(res.data.message);

      const updatedUser = res.data.customer;

      localStorage.setItem(
        "userSession",
        JSON.stringify(updatedUser)
      );

      if (onUpdate) {
        onUpdate(updatedUser);
      }

      if (onClose) {
        onClose();
      }
    } catch (err) {
      console.error("Update Error:", err);

      alert(
        err?.response?.data?.message ||
          "Profile update failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        padding: "20px",
        border: "1px solid #ddd",
        borderRadius: "10px",
      }}
    >
      <h3>Edit Profile</h3>

      <input
        type="text"
        name="CustomerName"
        value={formData.CustomerName || ""}
        onChange={handleChange}
        placeholder="Customer Name"
      />
      <br />
      {errors.CustomerName && (
        <p style={{ color: "red" }}>
          {errors.CustomerName}
        </p>
      )}

      <select
        value={formData.StId || ""}
        onChange={handleStateChange}
      >
        <option value="">Select State</option>

        {stlist.map((s) => (
          <option key={s.stid} value={s.stid}>
            {s.stname}
          </option>
        ))}
      </select>

      <br />
      {errors.StId && (
        <p style={{ color: "red" }}>{errors.StId}</p>
      )}

      <select
        value={formData.CtId || ""}
        onChange={(e) =>
          setFormData({
            ...formData,
            CtId: e.target.value,
          })
        }
      >
        <option value="">Select City</option>

        {ctlist.map((c) => (
          <option key={c.ctid} value={c.ctid}>
            {c.ctname}
          </option>
        ))}
      </select>

      <br />
      {errors.CtId && (
        <p style={{ color: "red" }}>{errors.CtId}</p>
      )}

      <input
        type="text"
        name="CAddress"
        value={formData.CAddress || ""}
        onChange={handleChange}
        placeholder="Address"
      />

      <br />
      {errors.CAddress && (
        <p style={{ color: "red" }}>
          {errors.CAddress}
        </p>
      )}

      <input
        type="text"
        name="CContact"
        value={formData.CContact || ""}
        onChange={handleChange}
        placeholder="Contact Number"
      />

      <br />
      {errors.CContact && (
        <p style={{ color: "red" }}>
          {errors.CContact}
        </p>
      )}

      <input
        type="email"
        name="CEmail"
        value={formData.CEmail || ""}
        onChange={handleChange}
        placeholder="Email"
      />

      <br />
      {errors.CEmail && (
        <p style={{ color: "red" }}>
          {errors.CEmail}
        </p>
      )}

      <br />

      <img
        src={
          preview
            ? preview
            : getImageUrl(formData.CPicName)
        }
        alt="Customer"
        width="100"
        height="100"
        style={{
          borderRadius: "50%",
          objectFit: "cover",
          border: "2px solid #ddd",
        }}
      />

      <br />
      <br />

      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
      />

      <br />
      <br />

      <button
        onClick={handleSubmit}
        disabled={loading}
      >
        {loading ? "Updating..." : "Save Changes"}
      </button>

      <button
        onClick={onClose}
        style={{ marginLeft: "10px" }}
      >
        Cancel
      </button>
    </div>
  );
}

export default EditCustomerProfile;