import React, { useState, useEffect } from "react";
// import categoryService from "../../../services/category.service";
import topicService from "../../../services/topic.service";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";

const AddTopic = () => {
  const navigate = useNavigate();
  const slugname = require("slug");
  const [name, setName] = useState("");
  // const [slug, setSlug] = useState("");
  const [parentId, setParentId] = useState("0");
  const [createdBy, setCreatedBy] = useState("1");
  const [status, setStatus] = useState("0");
  const saveUser = (e) => {
    e.preventDefault();
    //create
    const Topic_create = {
      name,
      slug: slugname(name),
      parentId,
      createdBy,
      status,
    };
    console.log("Topic new", Topic_create);
    if (CheckValidate()) {
      topicService
        .create(Topic_create)
        .then((response) => {
          console.log("Created Topic Successflly!", response.data);
          navigate("/dashboard/topic", { replace: true });
        })
        .catch((error) => {
          console.log("Songthing went wrong Topic", error);
        });
    } else {
      console.log("Vui lòng kiểm tra lại thông tin topic");
    }
  };
  //Check
  const CheckValidate = () => {
    let isValue = true;
    const check = {
      "Tên danh mục": name,
      "Danh mục": parentId,
      "Người tạo": createdBy,
    };
    console.log("count", check.length);
    for (const item in check) {
      if (!check[item] || check[item] == "") {
        isValue = false;
        alert("Vui lòng chọn:" + item);
        break;
      }
    }
    return isValue;
  };
  //Clear
  const handleClear = () => {
    setName("");
  };
  //Load parentid
  const [topic, setTopic] = useState([]);
  useEffect(() => {
    init();
  }, []);
  const init = () => {
    topicService
      .getAll("ALL")
      .then((response) => {
        console.log("Get Data OK", response.data);
        setTopic(response.data.topic);
      })
      .catch((error) => {
        console.log("Get Data Failed");
      });
  };
  console.log("topic", topic);
  return (
    <div>
      <div>
        <Helmet>
          <title>Thêm chủ đề bài viết</title>
          <meta name="description" content="Helmet application" />
        </Helmet>
      </div>
      <h3 className="text-center">Thêm Mới Danh Mục Bài Viết</h3>
      <div className="row">
        <div className="col-md-6">
          <div className="mb-3">
            <label for="exampleInputEmail1" className="form-label">
              Tên danh mục
            </label>
            <input
              type="text"
              className="form-control"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label for="" className="form-label">
              Chọn danh mục
            </label>
            <select
              className="form-select"
              aria-label="Default select example"
              name="parentid"
              onChange={(e) => setParentId(e.target.value)}
            >
              <option value="0">Nomal</option>
              {topic.map((item) => (
                <option value={item.id}>{item.name}</option>
              ))}
            </select>
          </div>

          <div className="mb-3">
            <label for="" className="form-label">
              Trạng thái
            </label>
            <select
              className="form-select"
              aria-label="Default select example"
              name="status"
              onChange={(e) => setStatus(e.target.value)}
            >
              {/* <option selected>Status</option> */}
              <option value="0">Kiểm duyệt</option>
              <option value="1">Xuất bản</option>
            </select>
          </div>
        </div>
        <div className="col-md-6">
          <h4 className="text-center">Chức năng</h4>
          <button
            className="btn btn-info w-100 m-1"
            onClick={(e) => saveUser(e)}
          >
            Lưu
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddTopic;
