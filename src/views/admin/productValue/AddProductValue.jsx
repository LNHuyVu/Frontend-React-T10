import React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import productValueService from "../../../services/productValue.service";
import { ToastContainer, toast } from "react-toastify";
import { FcPlus } from "react-icons/fc";
import { TiArrowBackOutline } from "react-icons/ti";
import { Link } from "react-router-dom";

import "react-toastify/dist/ReactToastify.css";
import { useSelector } from "react-redux";
//
import { Helmet } from "react-helmet";

const AddProductValue = () => {
  const userRD = useSelector((state) => state.auth.login?.currentUser);
  const slugname = require("slug");

  const navigate = useNavigate();
  const [nameValue, setNameValue] = useState("");
  const [parentIdValue, setParentIdValue] = useState("0");
  const [createdBy, setCreatedBy] = useState("");
  const [statusValue, setStatusValue] = useState("0");
  const [productValue, setProductValue] = useState([]);
  //
  const notifySuccess = () =>
    toast.success("Thành công!", {
      position: "top-right",
      autoClose: 500,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
    });
  const notifyError = () =>
    toast.error("Thất bại!", {
      position: "top-right",
      autoClose: 500,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
    });
  //
  useEffect(() => {
    init();
  }, []);
  const init = () => {
    productValueService
      .getAll("ALL", userRD)
      .then((response) => {
        setProductValue(response.data.productvalue);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(parentIdValue);
    if (parentIdValue == "") setParentIdValue(0);
    const data = {
      nameValue,
      slug: slugname(nameValue),
      createdBy: String(userRD?.user.id),
      parentIdValue,
      statusValue,
    };
    console.log(data);
    productValueService
      .create(data, userRD)
      .then((response) => {
        console.log(response.data);
        console.log("Success OK");

        notifySuccess();
        // navigate("/dashboard/product-configuration", { replace: true });
      })
      .catch((error) => {
        notifyError();
        console.log(error);
      });
  };
  return (
    <div className="row">
      <div>
        <Helmet>
          <title>Thêm cấu hình</title>
          <meta name="description" content="Helmet application" />
        </Helmet>
      </div>
      <div className="text-center d-flex justify-content-between align-items-center mb-3">
        <div>
          <Link to="/dashboard/product-configuration">
            <button className="btn border border-3 border-primary d-flex ">
              <TiArrowBackOutline className="fs-4 text-primary" />
              Quay lại
            </button>
          </Link>
        </div>

        <div>
          <h2>Thêm Mới Tài Khoản</h2>
        </div>
        <div>
          <button
            onClick={(e) => handleSubmit(e)}
            className="btn border border-3 border-success d-flex "
          >
            <FcPlus className="fs-4" />
            <span className="Lưu bài viết">Lưu bài viết</span>
          </button>
        </div>
      </div>
      <div className="col-md-6">
        <label for="exampleInputEmail1" className="form-label">
          Tên cấu hình
        </label>
        <input
          type="text"
          className="form-control"
          name="name"
          value={nameValue}
          onChange={(e) => setNameValue(e.target.value)}
        />
      </div>
      <div className="col-md-6">
        <label for="" className="form-label">
          Loại
        </label>
        <select
          className="form-select"
          aria-label="Default select example"
          name="parentIdValue"
          onChange={(e) => setParentIdValue(e.target.value)}
        >
          <option value="0">Nomal</option>
          {productValue
            .filter((child) => {
              return child.parentIdValue == 0;
            })
            .map((child, index) => {
              return <option value={child.id}>{child.nameValue}</option>;
            })}
        </select>
      </div>
      <div className="col-md-12">
        <label for="" className="form-label">
          Trạng thái
        </label>
        <select
          className="form-select"
          aria-label="Default select example"
          name="status"
          onChange={(e) => setStatusValue(e.target.value)}
        >
          <option value="0">Kiểm duyệt</option>
          <option value="1">Xuất bản</option>
        </select>
      </div>
      <div>
        <button
          className="btn btn-info w-100 mt-3"
          onClick={(e) => handleSubmit(e)}
        >
          Lưu
        </button>
      </div>
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
};

export default AddProductValue;
