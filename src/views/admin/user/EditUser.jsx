import React from "react";
import { useState, useEffect } from "react";
import userService from "../../../services/user.service";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Loading from "../../../component/loading/Loading";
import { BsCameraFill, BsFillTrashFill } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import productImgService from "../../../services/productImg.service";
import { Helmet } from "react-helmet";

const EditUser = () => {
  const navigate = useNavigate();
  const params = useParams();
  let id = params.id;
  const [imagesPreview, setImagesPreview] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const GENDER = [
    {
      value: "1",
      nameGender: "Nam",
    },
    {
      value: "0",
      nameGender: "Nữ",
    },
  ];
  const ROLES = [
    {
      value: "T2",
      name: "Nhân viên",
    },
    {
      value: "T1",
      name: "Admin",
    },
    {
      value: "T3",
      name: "Khách hàng",
    },
  ];
  ///
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [gender, setGender] = useState("1");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [roles, setRoles] = useState("T2");
  const [status, setStatus] = useState("0");
  //
  const [category, setCategory] = useState([]);
  // const [category, setCategory]=useState([]);
  //Load parentid
  useEffect(() => {
    init();
  }, []);
  const userRD = useSelector((state) => state.auth.login?.currentUser);

  const init = () => {
    //GET ID
    userService
      .getAll(id, userRD)
      .then((response) => {
        console.log("User", response.data);
        setName(response.data.users.name);
        setAddress(response.data.users.address);
        setRoles(response.data.users.roles);
        setGender(response.data.users.gender);
        setPhone(response.data.users.phone);
        setImagesPreview(response.data.users.img);
        setStatus(response.data.users.status);
        setEmail(response.data.users.email);
      })
      .catch((error) => {
        console.log("Get Data Failed ID");
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
      const reponse = await productImgService.apiUploadImages(formData);
      // console.log('reponse',reponse);
      if (reponse.status === 200) {
        images = [...images, reponse.data.secure_url];
      }
    }
    setIsLoading(false);
    setImagesPreview((prev) => [...prev, ...images]);
  };
  // console.log("IMGPRE:", imagesPreview);
  // console.log(process.env.REACT_APP_UPLOAD_ASSETS_NAME);
  const handleDeleteImagePreview = (image) => {
    setImagesPreview((prev) => prev.filter((item) => item !== image));
  };
  //Check Value
  const CheckValidate = () => {
    let isValue = true;
    const check = {
      "Tên người dùng": name,
      "Tài khoản email": email,
      "Địa chỉ": address,
      "Số điện thoại": phone,
    };
    console.log("count", check.length);
    for (const item in check) {
      if (!check[item] || check[item] == "") {
        isValue = false;
        // console.log("Ngu", item);
        alert("Vui lòng chọn:" + item);
        break;
      }
    }
    return isValue;
  };
  const updateUser = (e) => {
    e.preventDefault();
    //create
    const user_edit = {
      name,
      email,
      gender,
      img: imagesPreview,
      address,
      phone,
      roles,
      status,
      id,
    };
    if (CheckValidate()) {
      userService
        .update(user_edit, userRD)
        .then((response) => {
          console.log("Created User Successflly!", response.data);
          navigate("/dashboard/user", { replace: true });
        })
        .catch((error) => {
          console.log("Songthing went wrong", error);
        });
    }
  };
  return (
    <div>
      <div>
        <Helmet>
          <title>Chỉnh sửa tài khoản</title>
          <meta name="description" content="Helmet application" />
        </Helmet>
      </div>
      <h3 className="text-center">Chỉnh Sửa Tài Khoản</h3>
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
                multiple
              />
            </div>
            {/*  */}
            <div className="col-md-12 py-2 row row-cols-2 row-cols-lg-2 g-2 g-lg-2">
              {imagesPreview.map((item) => {
                return (
                  <div key={item} className="col img-preview">
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
        {/*  */}
        <div className="col-md-9 row">
          <div className="col-md-6">
            <div className="">
              <label for="exampleInputEmail1" className="form-label">
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
            <div className="">
              <label for="exampleInputEmail1" className="form-label">
                Giới tính
              </label>
              <select
                className="form-select"
                aria-label="Default select example"
                name="gender"
                onChange={(e) => setGender(e.target.value)}
              >
                {GENDER.map((item) => {
                  return item.value == gender ? (
                    <option value={item.value} selected>
                      {item.nameGender}
                    </option>
                  ) : (
                    <option value={item.value}>{item.nameGender}</option>
                  );
                })}
              </select>
            </div>
            <div className="">
              <label for="exampleInputEmail1" className="form-label">
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
              <label for="exampleInputEmail1" className="form-label">
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
          </div>
          {/*  */}
          <div className="col-md-6">
            <div>
              <label for="exampleInputEmail1" className="form-label">
                Email
              </label>
              <input
                disabled
                type="email"
                className="form-control"
                name="name"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="">
              <label for="exampleInputEmail1" className="form-label">
                Phân quyền
              </label>
              <select
                className="form-select"
                aria-label="Default select example"
                name="status"
                onChange={(e) => setRoles(e.target.value)}
              >
                {ROLES.map((item) => {
                  return item.value == roles ? (
                    <option value={item.value} selected>
                      {item.name}
                    </option>
                  ) : (
                    <option value={item.value}>{item.name}</option>
                  );
                })}
              </select>
            </div>
            <div className="">
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
          </div>
        </div>
      </div>
      <div className="">
        <h4 className="text-center">Chức năng</h4>
        <button
          className="btn btn-info w-100 m-1"
          onClick={(e) => updateUser(e)}
        >
          Lưu
        </button>
      </div>
    </div>
  );
};

export default EditUser;
