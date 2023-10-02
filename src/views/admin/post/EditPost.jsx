import React, { useEffect, useState } from "react";
import topicService from "../../../services/topic.service";
import postService from "../../../services/post.service";
import { BsCameraFill, BsFillTrashFill } from "react-icons/bs";
import Loading from "../../../component/loading/Loading";
import uploadfileService from "../../../services/uploadfile.service";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import { useQuill } from "react-quilljs";
import "quill/dist/quill.snow.css";
import { FcPlus } from "react-icons/fc";
import "./postAD.scss";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";

const EditPost = () => {
  const navigate = useNavigate();
  const params = useParams();
  let id = params.id;

  const slugname = require("slug");

  //Quilljs
  const { quill, quillRef } = useQuill();

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [topId, setTopId] = useState("");
  const [detail, setDetail] = useState("");
  const [type, setType] = useState("");
  const [status, setStatus] = useState("0");
  const [imagesPreview, setImagesPreview] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [key, setKey] = useState("home");
  const [toppic, setTopic] = useState([]);

  useEffect(() => {
    if (quill) {
      quill.clipboard.dangerouslyPasteHTML("<h1>React Hook for Quill!</h1>");
    }
    init();
    initTopic();
  }, [quill]);

  const init = () => {
    postService
      .getAll(id)
      .then((response) => {
        console.log("Post ID:", response.data);
        setTitle(response.data.post.title);
        setSlug(response.data.post.slug);
        setType(response.data.post.type);
        setImagesPreview(response.data.post.image);
        quillRef.current.firstChild.innerHTML = response.data.post.detail;
        setTopId(response.data.post.topId);
        setStatus(response.data.post.status);
      })
      .catch((error) => {
        console.log("Get Data Post ID Failed", error);
      });
  };
  const initTopic = () => {
    topicService
      .getAll("ALL")
      .then((response) => {
        setTopic(response.data.topic);
      })
      .catch((error) => {
        console.log("Get Data Failed");
      });
  };
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
        images = [reponse.data.secure_url];
      }
    }
    setIsLoading(false);
    setImagesPreview(images);
  };
  const handleDeleteImagePreview = (image) => {
    setImagesPreview((prev) => prev.filter((item) => item !== image));
  };
  const handleSubmit = () => {
    const post = {
      id,
      title,
      slug: slugname(title),
      detail: quillRef.current.firstChild.innerHTML,
      topId,
      image: imagesPreview,
      status,
    };
    console.log("Post Update", post);
    if (CheckValidate()) {
      postService
        .update(post)
        .then((reponse) => {
          console.log("Ok", reponse.data);
          navigate("/dashboard/post");
        })
        .catch((error) => {
          console.log("Create Post Error", error);
        });
    } else {
      console.log("Error");
    }
  };
  //Check
  const CheckValidate = () => {
    let content = quillRef.current.firstChild.innerHTML;
    if (content == "<p><br></p>") {
      content = "";
    }
    let isValue = true;
    const check = {
      "Trạng thái": status,
      "Danh mục": topId,
      "Tiêu đề bài viết": title,
      "Hình ảnh": imagesPreview,
      "Nội dung": content,
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
  return (
    <div className="PostAddAD">
      <div>
        <Helmet>
          <title>Chỉnh sửa bài viết</title>
          <meta name="description" content="Helmet application" />
        </Helmet>
      </div>
      <h2 className="text-center fw-bolder">Chỉnh sửa bài viết</h2>
      <Tabs
        id="controlled-tab-example"
        activeKey={key}
        onSelect={(k) => setKey(k)}
        className="mb-3"
      >
        <Tab eventKey="home" title="Tổng quan">
          <div className="title-img">
            <div className="">
              <label
                for="exampleInputEmail1"
                className="form-label fw-bolder fs-5"
              >
                Tiêu đề bài viết
              </label>
              <input
                type="text"
                className="form-control"
                name="name"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div className="row">
              <div className="col-md-6">
                <label for="" className="form-label fw-bolder fs-5">
                  Chọn chủ đề
                </label>
                <select
                  className="form-select"
                  aria-label="Default select example"
                  name="parentid"
                  onChange={(e) => setTopId(e.target.value)}
                >
                  <option value="0">Nomal</option>
                  {toppic.map((item) =>
                    item.id == topId ? (
                      <option value={item.id} selected>
                        {item.name}
                      </option>
                    ) : (
                      <option value={item.id}>{item.name}</option>
                    )
                  )}
                </select>
              </div>
              <div className="col-md-3">
                <label for="" className="form-label fw-bolder fs-5">
                  Vị trí
                </label>
                <select
                  className="form-select"
                  aria-label="Default select example"
                  name="status"
                  onChange={(e) => setType(e.target.value)}
                >
                  {type == "post" ? (
                    <>
                      <option value="post">Bài viết</option>
                      <option value="page">Chính sách</option>
                    </>
                  ) : (
                    <>
                      <option value="page">Chính sách</option>
                      <option value="post">Bài viết</option>
                    </>
                  )}
                </select>
              </div>
              <div className="col-md-3">
                <label for="" className="form-label fw-bolder fs-5">
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
            </div>
            {/* Img */}

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
        </Tab>
        <Tab eventKey="profile" title="Nội dung">
          <div className="content">
            <div
              className="d-flex justify-content-between"
              style={{ alignItems: "center" }}
            >
              <label
                for="exampleInputEmail1"
                className="form-label fw-bolder fs-5"
              >
                Mô tả chi tiết
              </label>
              <button
                onClick={handleSubmit}
                className="btn text-end border border-3 border-success d-flex align-items-center"
              >
                <FcPlus className="fs-4" />
                Lưu bài viết
              </button>
            </div>

            <div
              className="my-2"
              style={{ width: "100%", height: 500, background: "#fff" }}
            >
              <div ref={quillRef} />
            </div>
            <div className="btn-savem mt-5">
              <button className="btn w-100 border border-3 border-success d-flex align-items-center justify-content-center">
                <FcPlus className="fs-4" />
                Lưu bài viết
              </button>
            </div>
          </div>
        </Tab>
      </Tabs>
    </div>
  );
};

export default EditPost;
