import React, { useState, useEffect } from "react";
import categoryService from "../../../services/category.service";
// import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { BsCameraFill, BsFillTrashFill } from "react-icons/bs";
import Loading from "../../../component/loading/Loading";
import uploadfileService from "../../../services/uploadfile.service";
import { useSelector } from "react-redux";
import { Helmet } from "react-helmet";

const EditCategory = () => {
  const userRD = useSelector((state) => state.auth.login?.currentUser);

  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const slugname = require("slug");
  const params = useParams();
  let id = params.id;
  // const navigate = useNavigate();
  // const slugname = require('slug')
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [imagesPreview, setImagesPreview] = useState([]);
  const [parentId, setParentId] = useState("");
  const [parentidName, setParentidName] = useState("");
  const [status, setStatus] = useState("0");
  const [category, setCategory] = useState([]);
  // const [category, setCategory]=useState([]);
  //Load parentid
  useEffect(() => {
    init();
  }, []);

  const init = () => {
    //GET ID
    categoryService
      .getAll(id, userRD)
      .then((response) => {
        setName(response.data.category.name);
        setImagesPreview(response.data.category.image);
        setParentId(response.data.category.parentId);
        setStatus(response.data.category.status);
        console.log("GET ID", response.data);
      })
      .catch((error) => {
        console.log("Get Data Failed ID", error);
      });
    // //GET OPTION
    categoryService
      .getAll("ALL", userRD)
      .then((response) => {
        console.log("Get Data OK", response.data.category);
        setCategory(response.data.category);
      })
      .catch((error) => {
        console.log("Get Data Failed Option");
      });
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    const category_update = {
      name,
      slug: slugname(name),
      image: imagesPreview,
      parentId,
      status,
      id,
    };
    categoryService
      .update(category_update, userRD)
      .then((response) => {
        console.log("data updated successfully", response.data);
        navigate("/dashboard/category", { replace: true });
        init();
      })
      .catch((error) => {
        console.log("Songthing went wrong", error);
      });
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
          <title>Chỉnh sửa Danh Mục Sản Phẩm</title>
          <meta name="description" content="Helmet application" />
        </Helmet>
      </div>
      <h3 className="text-center">Chỉnh sửa Danh Mục Sản Phẩm</h3>
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
              Chọn cấp cha
            </label>

            {/* <h1>{parentid}</h1>
            <h1>{parentidName}</h1> */}

            <select
              className="form-select"
              aria-label="Default select example"
              name="parentid"
              onChange={(e) => setParentId(e.target.value)}
            >
              {category
                .filter((child) => {
                  return child.id === parentId;
                })
                .map((child, index) => {
                  return (
                    <option selected value={parentId === 0 ? 0 : parentId}>
                      {parentId === 0 ? "Nomal" : child.name}
                    </option>
                  );
                })}
              <option selected value="0">
                Nomal
              </option>
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
              {status == 0 ? (
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
          <div className="mb-3">
            <h4 className="text-center">Chức năng</h4>
            <button
              className="btn btn-info w-100 m-1"
              onClick={(e) => handleUpdate(e)}
            >
              Lưu
            </button>
          </div>
        </div>
        <div className="col-md-6">
          <div className="w-100">
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
      </div>
    </div>
  );
};

export default EditCategory;
