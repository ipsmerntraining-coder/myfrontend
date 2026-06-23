import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Product.css";

function Product({ data, onBack }) {
  const venderid = data;
  const REACT_APP_BASE_API_URL = process.env.REACT_APP_BASE_API_URL;

  const [pid, setPId] = useState();
  const [pname, setPName] = useState("");
  const [pprice, setPPrice] = useState("");
  const [oprice, setOPrice] = useState("");
  const [ppicname, setPPicName] = useState("");
  const [pcatgid, setPCatgId] = useState("");
  const [pcatglist, setPCatgList] = useState([]);
  const [image, setImage] = useState({ preview: "", data: "" });
  const [plist, setPList] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [imageUploaded, setImageUploaded] = useState(false);

  /* ---------------- Load categories & PID ---------------- */
  useEffect(() => {
    getNewPid();

    axios
      .get(`${REACT_APP_BASE_API_URL}/productcatg/showproductcatg`)
      .then((res) => setPCatgList(res.data))
      .catch((err) => alert(err.message));
  }, []);

  /* ---------------- Load products ---------------- */
  useEffect(() => {
    fetchProducts();
  }, [venderid]);

  const fetchProducts = () => {
    if (!venderid) return;

    axios
      .get(
        `${REACT_APP_BASE_API_URL}/product/showproductbyvender/${venderid}`
      )
      .then((res) => setPList(res.data))
      .catch((err) => alert(err.message));
  };

  const getNewPid = () => {
    axios
      .get(`${REACT_APP_BASE_API_URL}/product/getmaxpid`)
      .then((res) => setPId(res.data.length + 1))
      .catch((err) => alert(err.message));
  };

  /* ---------------- Image select ---------------- */
  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    setImage({
      preview: URL.createObjectURL(file),
      data: file,
    });

    setImageUploaded(false);
  };

  /* ---------------- Upload image ---------------- */
  const handleUpload = async () => {
    if (!image.data) {
      alert("Select image first");
      return;
    }

    const formData = new FormData();
    formData.append("file", image.data);

    try {
      const res = await fetch(
        `${REACT_APP_BASE_API_URL}/product/saveproductimage`,
        {
          method: "POST",
          body: formData,
        }
      );

      const result = await res.json();

      if (res.ok) {
        setPPicName(result.imageUrl);
        setImageUploaded(true);
        alert("Image uploaded successfully");
      } else {
        alert("Upload failed");
      }
    } catch (err) {
      alert(err.message);
    }
  };

  /* ---------------- Save / Update ---------------- */
  const handleSaveButton = () => {
    if (
      !pname ||
      !pprice ||
      !oprice ||
      !pcatgid ||
      !ppicname
    ) {
      alert("Please fill all fields and upload image");
      return;
    }

    const obj = {
      pid,
      pname,
      pprice,
      oprice,
      ppicname,
      pcatgid,
      vid: venderid,
      status: "Inactive",
    };

    const apiCall = isEditing
      ? axios.put(
          `${REACT_APP_BASE_API_URL}/product/updateproduct/${pid}`,
          obj
        )
      : axios.post(
          `${REACT_APP_BASE_API_URL}/product/saveproduct`,
          obj
        );

    apiCall
      .then(() => {
        alert(
          isEditing
            ? "Product Updated Successfully"
            : "Product Added Successfully"
        );

        fetchProducts();
        closePopup();
      })
      .catch((err) => alert(err.message));
  };

  /* ---------------- Edit ---------------- */
  const handleEdit = (item) => {
    setPId(item.pid);
    setPName(item.pname);
    setPPrice(item.pprice);
    setOPrice(item.oprice);
    setPPicName(item.ppicname);
    setPCatgId(item.pcatgid);

    setImage({
      preview: item.ppicname,
      data: "",
    });

    setImageUploaded(true);
    setIsEditing(true);
    setShowPopup(true);
  };

  /* ---------------- Delete ---------------- */
  const handleDelete = (pid) => {
    if (!window.confirm("Delete product?")) return;

    axios
      .put(
        `${REACT_APP_BASE_API_URL}/product/updateproductstatus/${pid}/Inactive`
      )
      .then(() => {
        alert("Product Deleted Successfully");
        fetchProducts();
      })
      .catch((err) => alert(err.message));
  };

  /* ---------------- Close Popup ---------------- */
  const closePopup = () => {
    setShowPopup(false);
    setIsEditing(false);
    setImageUploaded(false);

    setPName("");
    setPPrice("");
    setOPrice("");
    setPPicName("");
    setPCatgId("");

    setImage({
      preview: "",
      data: "",
    });

    getNewPid();
  };

  return (
    <div style={{ padding: 20 }}>
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 20,
        }}
      >
        <button
          onClick={onBack}
          style={{
            background: "#6c757d",
            color: "#fff",
            border: "none",
            padding: "10px 15px",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          ← Back
        </button>

        <h2>Manage Products</h2>

        <button
          onClick={() => setShowPopup(true)}
          style={{
            background: "green",
            color: "#fff",
            border: "none",
            padding: "10px 15px",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          ➕ Add New Product
        </button>
      </div>

      {/* Modal */}
      {showPopup && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h3>
              {isEditing
                ? "Edit Product"
                : "Add Product"}
            </h3>

            <label>
              Product ID : <b>{pid}</b>
            </label>

            <input
              type="text"
              placeholder="Product Name"
              value={pname}
              onChange={(e) => setPName(e.target.value)}
            />

            <input
              type="number"
              placeholder="Price"
              value={pprice}
              onChange={(e) => setPPrice(e.target.value)}
            />

            <input
              type="number"
              placeholder="Offer Price"
              value={oprice}
              onChange={(e) => setOPrice(e.target.value)}
            />

            <select
              value={pcatgid}
              onChange={(e) =>
                setPCatgId(e.target.value)
              }
            >
              <option value="">
                -- Select Category --
              </option>

              {pcatglist.map((c) => (
                <option
                  key={c.pcatgid}
                  value={c.pcatgid}
                >
                  {c.pcatgname}
                </option>
              ))}
            </select>

            <input
              type="file"
              onChange={handleFileChange}
            />

            {image.preview && (
              <img
                src={image.preview}
                alt="Preview"
                width="100"
                style={{
                  borderRadius: "5px",
                  marginTop: "10px",
                }}
              />
            )}

            <button onClick={handleUpload}>
              Upload Image
            </button>

            <div className="modal-actions">
              <button onClick={closePopup}>
                Cancel
              </button>

              <button
                disabled={!imageUploaded}
                onClick={handleSaveButton}
              >
                {isEditing
                  ? "Update Product"
                  : "Save Product"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Product Table */}
      <table
        width="100%"
        style={{
          marginTop: 20,
          background: "black",
          color: "white",
        }}
      >
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Price</th>
            <th>Offer</th>
            <th>Category</th>
            <th>Image</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {plist.map((item, i) => (
            <tr key={item.pid}>
              <td>{i + 1}</td>
              <td>{item.pname}</td>
              <td>{item.pprice}</td>
              <td>{item.oprice}</td>

              <td>
                {
                  pcatglist.find(
                    (c) =>
                      c.pcatgid === item.pcatgid
                  )?.pcatgname
                }
              </td>

              <td>
                <img
                  src={item.ppicname}
                  alt={item.pname}
                  width="50"
                  style={{
                    borderRadius: "5px",
                  }}
                />
              </td>

              <td>{item.status}</td>

              <td>
                <button
                  onClick={() =>
                    handleEdit(item)
                  }
                >
                  Edit
                </button>

                <button
                  onClick={() =>
                    handleDelete(item.pid)
                  }
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
export default Product;
