import React, { useState } from "react";
import { useDispatch } from "react-redux";
import "./register.scss";
import { useNavigate, Link } from "react-router-dom";
import productImgService from "../../services/productImg.service";
import Loading from "../loading/Loading";
import { BsCameraFill, BsFillPatchCheckFill } from "react-icons/bs";
import { TbConfetti } from "react-icons/tb";

import { SlClose } from "react-icons/sl";
import { registerUser } from "../../redux/apiRequest";
//
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
//
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { Helmet } from "react-helmet";

const Register = () => {
  const [imagesPreview, setImagesPreview] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  //
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  //
  const GENDER = [
    {
      value: "0",
      nameGender: "Nam",
    },
    {
      value: "1",
      nameGender: "Nữ",
    },
  ];
  //
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [gender, setGender] = useState("0");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [roles, setRoles] = useState("T3");
  const [status, setStatus] = useState("1");
  const saveUser = (e) => {
    e.preventDefault();
    //create
    const user_create = {
      name,
      email,
      gender,
      img: imagesPreview,
      password,
      address,
      phone,
      roles,
      createdBy: "VIP",
      status,
    };
    console.log(user_create);
    let validate = CheckValidate(user_create);
    if (validate.isValue == false) {
      notifyError(validate.message);
    } else {
      let valueRegister;
      let myPromise = new Promise((resolve, reject) => {
        valueRegister = registerUser(user_create, dispatch, navigate);
        resolve(valueRegister);
      });
      myPromise
        .then((result) => {
          console.log(result);
          if (result.errCode != 0) {
            notifyError(result.value);
          } else {
            handleShow();
          }
        })
        .catch((error) => {
          console.error(error);
        });
    }
  };
  //Check value
  const CheckValidate = (user) => {
    let isValue = true;
    let message = "";
    let checkUser = {};
    const check = {
      "Nhập tên người dùng": name,
      "Nhập email": user.email,
      "Nhập mật khẩu": user.password,
      "Nhập địa chỉ": user.address,
      "Nhập số điện thoại": user.phone,
    };
    for (const item in check) {
      if (!check[item] || check[item] == "") {
        isValue = false;
        message = item;
        break;
      }
    }
    if (isValue == true) {
      if (validateEmail(user.email) != true) {
        isValue = false;
        message = "Email không hợp lệ";
        return (checkUser = { isValue, message });
      }
      if (validatePhoneNumber(user.phone) != true) {
        isValue = false;
        message = "Số điện thoại không hợp lệ";
        return (checkUser = { isValue, message });
      }
      if (validatePassword(user.password) != true) {
        isValue = false;
        message = "Mật khẩu 5 kí tự trở lên";
        return (checkUser = { isValue, message });
      }
    }
    return (checkUser = { isValue, message });
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
      const reponse = await productImgService.apiUploadImages(formData);
      if (reponse.status === 200) {
        images = [reponse.data.secure_url];
      }
    }
    setIsLoading(false);
    setImagesPreview(images);
  };
  //Validate
  function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  }
  function validatePhoneNumber(phoneNumber) {
    if (phoneNumber.charAt(0) != 0) return false;
    if (isNaN(phoneNumber) || phoneNumber.length !== 10) {
      return false;
    }
    return true;
  }
  function validatePassword(password) {
    if (password.length < 5) {
      return false;
    }
    return true;
  }
  //Toastify
  const notifyError = (name) => {
    toast.error(name, {
      position: "top-center",
      autoClose: 300,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  };
  return (
    <div className="register-form-user">
      <div>
        <Helmet>
          <title>Đăng ký</title>
          <meta name="description" content="Helmet application" />
        </Helmet>
      </div>
      <Modal show={show} fullscreen="md-down" onHide={handleClose}>
        <Modal.Header>
          <Modal.Title>Thông báo</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="text-center">
            <BsFillPatchCheckFill size={100} color="green" />
            <h4>
              <TbConfetti size={50} color="orange" />
              <TbConfetti size={50} color="orange" />
              <TbConfetti size={50} color="orange" />
            </h4>
          </div>
          <h4 className="text-center">Chúc mừng bạn đã đăng ký thành công</h4>
          <div className="">
            <Link to="/login">
              <button
                className="w-100 mt-2 btn border border-2 border-primary bg-light"
                onClick={handleClose}
              >
                Đi đến trang đăng nhập
              </button>
            </Link>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Link to="../">
            <Button variant="primary" onClick={handleClose}>
              Quay lại
            </Button>
          </Link>
        </Modal.Footer>
      </Modal>
      <div className="login-form">
        <form className="p-3">
          <div>
            <div className="d-flex justify-content-between">
              <div></div>
              <div>
                <h3 className="text-center">Đăng ký</h3>
              </div>
              <div className="pe-2">
                <Link to="../">
                  <SlClose size={30} />
                </Link>
              </div>
            </div>
            <div className="row">
              <div className="col-md-3">
                <div className="row">
                  <div className="col-md-12 py-2" style={{}}>
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
                  <div className="col-md-12">
                    {imagesPreview.map((item) => {
                      return (
                        <div key={item} className="img-preview">
                          <img
                            src={item}
                            alt={item}
                            style={{ width: "100%", height: 160 }}
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
              {/*  */}
              <div className="col-md-9 row">
                <div className="col-md-6">
                  <div className="">
                    <label for="exampleInputEmail1" className="form-label fs-5">
                      Tên người dùng
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      name="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>

                  <div>
                    <label for="exampleInputEmail1" className="form-label fs-5">
                      Email
                    </label>
                    <input
                      type="email"
                      className="form-control"
                      name="name"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div className="">
                    <label for="exampleInputEmail1" className="form-label fs-5">
                      Mật khẩu
                    </label>
                    <input
                      type="password"
                      className="form-control"
                      name="name"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                </div>
                {/*  */}
                <div className="col-md-6">
                  <div className="">
                    <label for="exampleInputEmail1" className="form-label fs-5">
                      Số điện thoại
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      name="name"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>
                  <div className="">
                    <label for="exampleInputEmail1" className="form-label fs-5">
                      Địa chỉ
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      name="name"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                    />
                  </div>
                  <div className="">
                    <label for="exampleInputEmail1" className="form-label fs-5">
                      Giới tính
                    </label>
                    <select
                      className="form-select"
                      aria-label="Default select example"
                      name="gender"
                      onChange={(e) => setGender(e.target.value)}
                    >
                      {GENDER.map((item) => {
                        return (
                          <option value={item.value}>{item.nameGender}</option>
                        );
                      })}
                    </select>
                  </div>
                </div>
                <div className="mt-2 text-center">
                  <button
                    className="btn btn-info w-100 m-1"
                    onClick={(e) => saveUser(e)}
                  >
                    Tạo tài khoản
                  </button>
                </div>
              </div>
            </div>
          </div>
        </form>
        <div className="col-12" style={{ backgroundColor: "red" }}>
          {/* {this.state.errMessage} */}
        </div>
      </div>
      <ToastContainer
        position="top-center"
        autoClose={300}
        limit={1}
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

export default Register;
