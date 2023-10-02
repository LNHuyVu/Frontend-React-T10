import React from "react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useEffect } from "react";
import sliderService from "../../../services/slider.service";
import { FcPlus } from "react-icons/fc";
import uploadfileService from "../../../services/uploadfile.service";
import { BsCameraFill, BsFillTrashFill } from "react-icons/bs";
import Loading from "../../../component/loading/Loading";
import { useParams } from "react-router-dom";
import { Helmet } from "react-helmet";

const EditSlider = () => {
  const param = useParams();
  let id = param.id;
  const navigate = useNavigate();
  const [imagesPreview, setImagesPreview] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const [name, setName] = useState("");
  const [link, setLink] = useState("");
  const [position, setPosition] = useState("");
  const [createdBy, setCreatedBy] = useState("");
  const [status, setStatus] = useState("");

  useEffect(() => {
    init();
  }, []);

  const init = () => {
    sliderService
      .getAll(id)
      .then((reponse) => {
        console.log("ok ", reponse.data);
        setName(reponse.data.slider.name);
        setImagesPreview(reponse.data.slider.image);
        setLink(reponse.data.slider.link);
        setPosition(reponse.data.slider.position);
        setStatus(reponse.data.slider.status);
      })
      .catch((error) => {
        console.log("Error Load Slider Id", error);
      });
  };

  const handleSubmit = () => {
    const slider = {
      id,
      name,
      link,
      position,
      status,
      image: imagesPreview,
    };
    console.log(slider);
    if (CheckValidate()) {
      sliderService
        .update(slider)
        .then((reponse) => {
          console.log("Add Slider Ok", reponse.data);
          navigate("/dashboard/slider");
        })
        .catch((error) => {
          console.log("Add Error", error);
        });
    }
  };
  const handleFiles = async (e) => {
    setIsLoading(true);
    e.stopPropagation();
    let images = [];
    const files = e.target.files;
    const formData = new FormData();
    for (let i of files) {
      formData.append("file", i);
      formData.append(
        "upload_preset",
        process.env.REACT_APP_UPLOAD_ASSETS_NAME
      );
      const reponse = await uploadfileService.apiUploadImages(formData);
      if (reponse.status === 200) {
        images = [...images, reponse.data.secure_url];
      }
    }
    setIsLoading(false);
    setImagesPreview(images);
  };
  const handleDeleteImagePreview = (image) => {
    setImagesPreview((prev) => prev.filter((item) => item !== image));
  };
  const CheckValidate = () => {
    let isValue = true;
    const check = {
      "Trạng thái": status,
      Link: link,
      "Tiêu đề": name,
      "Hình ảnh": imagesPreview,
    };
    for (const item in check) {
      if (!check[item] || check[item] == "") {
        isValue = false;
        // console.log("Ngu", item);
        alert("Vui lòng nhập:" + item);
        break;
      }
    }
    return isValue;
  };
  const arrPosition = [
    { name: "Banner", position: 1 },
    { name: "Slider", position: 2 },
    { name: "Main", position: 3 },
    { name: "Post", position: 4 },
    { name: "Accessory", position: 5 },
  ];
  return (
    <div className="row">
      <div>
        <Helmet>
          <title>Chỉnh sửa Slider</title>
          <meta name="description" content="Helmet application" />
        </Helmet>
      </div>
      <div className="text-center d-flex justify-content-between align-items-center">
        <div></div>

        <div>
          <h2>Chỉnh sửa Slider</h2>
        </div>
        <div>
          <button
            onClick={handleSubmit}
            className="btn border border-3 border-success d-flex "
          >
            <FcPlus className="fs-4" />
            Lưu
          </button>
        </div>
      </div>
      <div className="col-md-12">
        <label for="exampleInputEmail1" className="form-label">
          Tên
        </label>
        <input
          type="text"
          className="form-control"
          name="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div className="col-md-12">
        <label for="exampleInputEmail1" className="form-label">
          Link
        </label>
        <input
          type="text"
          className="form-control"
          name="link"
          value={link}
          onChange={(e) => setLink(e.target.value)}
        />
      </div>
      <div className="col-md-6">
        <label for="" className="form-label">
          Vị trí
        </label>
        <select
          className="form-select"
          aria-label="Default select example"
          name="status"
          onChange={(e) => setPosition(e.target.value)}
        >
          {arrPosition.map((item) => {
            return item.positon == position ? (
              <>
                <option value={item.position} selected>
                  {item.name}
                </option>
              </>
            ) : (
              <>
                <option value={item.positon}>{item.name}</option>
              </>
            );
          })}
        </select>
      </div>
      <div className="col-md-6">
        <label for="" className="form-label">
          Trạng thái
        </label>
        <select
          className="form-select"
          aria-label="Default select example"
          name="status"
          onChange={(e) => setStatus(e.target.value)}
        >
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
      {/*  */}
      <div className="row m-0 p-0 mt-2">
        <div className="col-md-12 p-0" style={{}}>
          <label htmlFor="file" className="form-label image-labelU bg-light">
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
      {/*  */}
      <div className="d-flex justify-content-center">
        <button
          onClick={handleSubmit}
          className="btn border border-3 border-success d-flex align-items-center"
        >
          <FcPlus className="fs-4" />
          Lưu thay đổi
        </button>
      </div>
    </div>
  );
};

export default EditSlider;
