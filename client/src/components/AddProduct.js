import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

const AddProduct = () => {
  const [title, setTitle] = useState("");
  const [file, setFile] = useState("");
  const [preview, setPreview] = useState("");
  const [checkProductName, setCheckProductName] = useState("");
  const navigate = useNavigate();

  const productNameExist = (e) => {
    setTitle(e.target.value);
    e.target.value !== "" ? setCheckProductName("Any"): setCheckProductName("");
  }

  const loadImage = (e) => {
    const image = e.target.files[0];
    setFile(image);
    setPreview(URL.createObjectURL(image));
  };

  const saveProduct = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", title);
    try {
      await axios.post("http://localhost:5000/products", formData); //Axios versi terbaru tdk pakai headers
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="columns is-centered mt-5">
      <div className="column is-half">
        <form onSubmit={saveProduct}>
          <div className="field">
            <label className="label">Product Name*</label>
            <div className="control columns mt-1 ml-1">
              <input
                type="text"
                value="Product"
                className="input column is-one-fifth mr-5"
                readOnly
              />
              <input
                type="text"
                className="input column is-two-thirds"
                value={title}
                onChange={productNameExist}
                placeholder="Product Name"
              />
            </div>
          </div>

          <div className="field">
            <label className="label">Image*</label>
            <div className="control">
              <div className="file">
                <label className="file-label">
                  <input
                    type="file"
                    className="file-input"
                    onChange={loadImage}
                  />
                  <span className="file-cta">
                    <span className="file-label">Pilih sebuah gambar(Max 5MB) . . .</span>
                  </span>
                </label>
              </div>
            </div>
          </div>

          {preview ? (
            <figure className="image is-128x128">
              <img src={preview} alt="Preview Gambar" />
            </figure>
          ) : (
            ""
          )}

          <div className="field">
            <div className="control">
              <Link to="/" className="button is-danger mr-2">
                Kembali
              </Link>
              {preview && checkProductName ? (
                <button type="submit" className="button is-success">
                  Simpan
                </button>
              ) : (
                <button type="submit" className="button is-success" disabled>
                  Simpan
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;
