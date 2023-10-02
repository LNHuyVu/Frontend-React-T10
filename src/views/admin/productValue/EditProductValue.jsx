import React from "react";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import productValueService from "../../../services/productValue.service";
import { useSelector } from "react-redux";
import { Helmet } from "react-helmet";

const EditProductValue = () => {
  const userRD = useSelector((state) => state.auth.login?.currentUser);

  const params = useParams();
  let id = params.id;
  const slugname = require("slug");
  const navigate = useNavigate();
  const [nameValue, setNameValue] = useState("");
  const [slug, setSlug] = useState("");
  const [parentIdValue, setParentIdValue] = useState("0");
  const [statusValue, setStatusValue] = useState("0");
  const [productValue, setProductValue] = useState([]);

  useEffect(() => {
    init();
    initParentId();
  }, []);
  const init = () => {
    productValueService
      .getAll(id, userRD)
      .then((response) => {
        setNameValue(response.data.productvalue.nameValue);
        setSlug(response.data.productvalue.slug);
        setParentIdValue(response.data.productvalue.parentIdValue);
        setStatusValue(response.data.productvalue.statusValue);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const initParentId = () => {
    productValueService
      .getAll("ALL", userRD)
      .then((response) => {
        setProductValue(response.data.productvalue);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const handleUpdate = (e) => {
    e.preventDefault();
    const data_update = {
      id,
      nameValue,
      slug: slugname(nameValue),
      parentIdValue,
      statusValue,
    };
    productValueService
      .update(data_update, userRD)
      .then((response) => {
        console.log(response.data);
        console.log("Success OK");
        navigate("/dashboard/product-configuration", { replace: true });
      })
      .catch((error) => {
        console.log(error);
      });
  };
  return (
    <div className="row mt-2">
      <div>
        <Helmet>
          <title>Chỉnh sửa cấu hình</title>
          <meta name="description" content="Helmet application" />
        </Helmet>
      </div>
      <h3 className="text-center">Chỉnh sửa cấu hình</h3>
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
          {productValue
            .filter((child) => {
              return child.id === parentIdValue;
            })
            .map((child, index) => {
              return (
                <option
                  selected
                  value={parentIdValue === 0 ? 0 : parentIdValue}
                >
                  {parentIdValue === 0 ? "Nomal" : child.nameValue}
                </option>
              );
            })}
          <option selected value="0">
            Nomal
          </option>
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
          {/* <option selected>Status</option> */}
          {statusValue == 0 ? (
            <>
              <option value="0">Kiểm duyệt</option>
              <option value="1">Xuất bản</option>
            </>
          ) : (
            <>
              <option value="1">Xuất bản</option>
              <option value="0">Kiểm duyệt</option>
            </>
          )}
        </select>
      </div>
      <div>
        <button
          className="btn btn-info w-100 mt-3"
          onClick={(e) => handleUpdate(e)}
        >
          Lưu
        </button>
      </div>
    </div>
  );
};

export default EditProductValue;
