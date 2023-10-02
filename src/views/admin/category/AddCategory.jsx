import React, { useState, useEffect } from "react";
import categoryService from "../../../services/category.service";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { FcPlus } from "react-icons/fc";
import { TiArrowBackOutline } from "react-icons/ti";
import { Link } from "react-router-dom";
import { BsCameraFill, BsFillTrashFill } from "react-icons/bs";
import Loading from "../../../component/loading/Loading";
import uploadfileService from "../../../services/uploadfile.service";
//
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Helmet } from "react-helmet";

const AddCategory = () => {
  //
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

  const [imagesPreview, setImagesPreview] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const userRD = useSelector((state) => state.auth.login?.currentUser);

  const navigate = useNavigate();
  const slugname = require("slug");
  const [name, setName] = useState("");
  const [parentId, setParentId] = useState("0");
  const [status, setStatus] = useState("0");
  //Load parentid
  const [category, setCategory] = useState([]);
  useEffect(() => {
    init();
  }, []);
  const saveUser = (e) => {
    e.preventDefault();
    //create
    const category_create = {
      name,
      slug: slugname(name),
      image: imagesPreview,
      parentId,
      createdBy: String(userRD?.user.id),
      status,
    };
    console.log("Category new", category_create);
    // CheckValidate();
    if (CheckValidate()) {
      categoryService
        .create(category_create, userRD)
        .then((response) => {
          console.log("Created User Successflly!", response.data);
          navigate("/dashboard/category", { replace: true });
        })
        .catch((error) => {
          notifyError();
          console.log("Songthing went wrong", error);
        });
    }
  };
  //Clear
  const handleClear = () => {
    setName("");
  };

  const init = () => {
    categoryService
      .getAll("ALL", userRD)
      .then((response) => {
        console.log("Get Data OK", response.data);
        setCategory(response.data.category);
      })
      .catch((error) => {
        console.log("Get Data Failed");
      });
  };
  const CheckValidate = () => {
    let isValue = true;
    const check = {
      "Trạng thái": status,
      "Danh mục": parentId,
      "Tên danh mục": name,
    };
    for (const item in check) {
      if (!check[item] || check[item] == "") {
        isValue = false;
        // console.log("Vui lòng nhập:" + item);
        alert("Vui lòng nhập:" + item);
        break;
      }
    }
    return isValue;
  };
  //Handle File
  const handleFiles = async (e) => {
    setIsLoading(true);
    e.stopPropagation();
    let images = [];
    const files = e.target.files;
    // console.log("file", files);
    const formData = new FormData();
    for (let i of files) {
      formData.append("file", i);
      formData.append(
        "upload_preset",
        process.env.REACT_APP_UPLOAD_ASSETS_NAME
      );
      const reponse = await uploadfileService.apiUploadImages(formData);
      // console.log('reponse',reponse);
      if (reponse.status === 200) {
        images = [...images, reponse.data.secure_url];
      }
    }
    setIsLoading(false);
    setImagesPreview((prev) => [...prev, ...images]);
  };
  const handleDeleteImagePreview = (image) => {
    setImagesPreview((prev) => prev.filter((item) => item !== image));
  };

  return (
    <div>
      <div>
        <Helmet>
          <title>Thêm Danh Mục Sản Phẩm</title>
          <meta name="description" content="Helmet application" />
        </Helmet>
      </div>
      <div className="text-center d-flex justify-content-between align-items-center mb-3">
        <div>
          <Link to="/dashboard/category">
            <button className="btn border border-3 border-primary d-flex ">
              <TiArrowBackOutline className="fs-4 text-primary" />
              Quay lại
            </button>
          </Link>
        </div>

        <div>
          <h2>Thêm Danh Mục Sản Phẩm</h2>
        </div>
        <div>
          <button
            onClick={(e) => saveUser(e)}
            className="btn border border-3 border-success d-flex "
          >
            <FcPlus className="fs-4" />
            <span className="Lưu bài viết">Lưu bài viết</span>
          </button>
        </div>
      </div>
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
              {category.map((item) => (
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
          <div className="mb-3">
            <div className="row m-0 p-0 mt-2">
              <div className="col-md-12 p-0" style={{}}>
                <label
                  htmlFor="file"
                  className="form-label image-labelU bg-light"
                >
                  {isLoading ? (
                    <Loading />
                  ) : (
                    <span>
                      <BsCameraFill className="icon-camera" />
                    </span>
                  )}
                </label>
                <input
                  hidden
                  id="file"
                  type="file"
                  className="form-control"
                  name="file"
                  onChange={handleFiles}
                  multiple
                />
              </div>
              {/*  */}
              <div className="col-md-12 py-2 row row-cols-1 row-cols-lg-1 g-1 g-lg-1 justify-content-center">
                {imagesPreview.map((item) => {
                  return (
                    <div key={item} className="col img-preview w-50">
                      <img className="w-100 h-100" src={item} alt={item} />
                      <span onClick={() => handleDeleteImagePreview(item)}>
                        <BsFillTrashFill />
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* <h4 className="text-center">Chức năng</h4>
          <button
            className="btn btn-info w-100 m-1"
            onClick={(e) => saveUser(e)}
          >
            Lưu
          </button>
          <button
            onClick={() => {
              handleClear();
            }}
            className="btn btn-danger w-100 m-1"
          >
            Xóa
          </button> */}
        </div>
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

export default AddCategory;
