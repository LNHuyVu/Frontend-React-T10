import React, { useState, useEffect, useRef } from "react";
import productService from "../../../services/product.service";
import productValueService from "../../../services/productValue.service";
import categoryService from "../../../services/category.service";
import { useNavigate } from "react-router-dom";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import "./listproduct.scss";
import { BsCameraFill, BsFillTrashFill } from "react-icons/bs";
import Loading from "../../../component/loading/Loading";
import productOptionService from "../../../services/productOption.service";
import productStoreService from "../../../services/productStore.service";
import productImgService from "../../../services/productImg.service";
import { FcPlus } from "react-icons/fc";
import { TiArrowBackOutline } from "react-icons/ti";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { NumericFormat } from "react-number-format";
import { useSelector } from "react-redux";
//QuillJs
import { useQuill } from "react-quilljs";
import "quill/dist/quill.snow.css";
import { Helmet } from "react-helmet";

const AddProduct = () => {
  const userRD = useSelector((state) => state.auth.login?.currentUser);

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
  // Quilljs
  const { quill, quillRef } = useQuill();
  //
  const d = new Date();
  let code = d.getTime();
  const [key, setKey] = useState("home");
  const [imagesPreview, setImagesPreview] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  //Ref disable
  const [disabled, setDisable] = useState(false);
  // Product
  const slugname = require("slug");
  const [nameProduct, setNameProduct] = useState("");
  const [slugProduct, setSlugProduct] = useState("");
  const [catId, setCatId] = useState("0");
  const [detail, setDetail] = useState("");
  const [proId, setProId] = useState("");
  const [type, setType] = useState("LT");
  const [price, setPrice] = useState("");
  const [status, setStatus] = useState("0");
  // Product Option
  const [optionId, setoptionId] = useState("");
  const [cpu, setCpu] = useState("");
  const [demand, setDemand] = useState("");
  const [cpuGen, setCpuGen] = useState("");
  const [ram, setRam] = useState("");
  const [hdrive, setHdrive] = useState("");
  const [card, setCard] = useState("");
  const [screen, setScreen] = useState("");
  const [system, setSystem] = useState("");
  // Product Store
  const [storeId, setStoreId] = useState("");
  const [importPrices, setImportPrices] = useState("");
  const [number, setNumber] = useState("10");
  // Product Image
  const [link, setLink] = useState("");
  const [imgId, setImgId] = useState("");
  const [statusImg, setStatusImg] = useState("1");
  // Product Value
  const [productValue, setProductValue] = useState([]);
  const [category, setCategory] = useState([]);
  //Clear
  const handleClear = () => {
    setNameProduct("");
  };
  //Load parentid
  useEffect(() => {
    init();
    initProValue();
  }, []);
  const init = () => {
    categoryService
      .getAll("ALL", userRD)
      .then((response) => {
        // console.log("Get Data OK", response.data);
        setCategory(response.data.category);
      })
      .catch((error) => {
        console.log("Get Data Failed");
      });
  };
  // console.log("category", category);
  const initProValue = () => {
    productValueService
      .getAll("ALL", userRD)
      .then((response) => {
        // console.log("Get Data OK", response.data);
        setProductValue(response.data.productvalue);
      })
      .catch((error) => {
        console.log("Get Data Product Value Failed");
      });
  };
  // console.log("product", productValue);
  //Handle File
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
  //Handle onChang Name and SLug
  const handChangNameAndSlug = (e) => {
    setNameProduct(e.target.value);
    setSlugProduct(slugname(e.target.value));
  };
  //Check ValidateLT
  const CheckValidateLT = () => {
    let content = quillRef.current.firstChild.innerHTML;
    if (content == "<p><br></p>") {
      content = "";
    }
    setProId(code);
    setStoreId(code);
    setoptionId(code);
    setImgId(code);
    setLink(imagesPreview);
    let isValue = true;
    const check = {
      "Nhu cầu": demand,
      "Trạng thái": status,
      CPU: cpu,
      RAM: ram,
      "Ổ cứng": hdrive,
      "Kích thước màn hình": screen,
      "Card đồ họa": card,
      "Hệ điều hành": system,
      "Tên sản phẩm": nameProduct,
      "Nội dung": content,
      slugProduct,
      Giá: price,
      "Danh mục": catId,
      "Hình ảnh": imagesPreview,
      "Giá nhập": importPrices,
      "Thế hệ CPU": cpuGen,
      "Số lượng": number,
    };
    console.log("count", check.length);
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
  //CheckValidatePK
  const CheckValidatePK = () => {
    let content = quillRef.current.firstChild.innerHTML;
    if (content == "<p><br></p>") {
      content = "";
    }
    setProId(code);
    setStoreId(code);
    setImgId(code);
    setLink(imagesPreview);
    let isValue = true;
    const check = {
      "Trạng thái": status,
      "Tên sản phẩm": nameProduct,
      slugProduct,
      Giá: price,
      "Danh mục": catId,
      "Hình ảnh": imagesPreview,
      "Giá nhập": importPrices,
      "Số lượng": number,
      "Nội dung": content,
    };
    console.log("count", check.length);
    for (const item in check) {
      if (!check[item] || check[item] == "") {
        isValue = false;
        alert("Vui lòng nhập:" + item);
        break;
      }
    }
    return isValue;
  };
  //Handle Submit
  const handleSubmit = (e) => {
    // e.preventDefault();

    //Product
    const product = {
      nameProduct,
      slugProduct,
      catId,
      price: parseInt(price.replace(/,/g, "")),
      detail: quillRef.current.firstChild.innerHTML,
      type,
      proId: code,
      createdBy: "VIP",
      status,
    };
    console.log("Product: ", product);
    //Product IMG
    const product_img = {
      link: imagesPreview,
      imgId: code,
      status: statusImg,
    };
    console.log("Img: ", product_img);
    //Product Option
    const product_option = {
      optionId: code,
      ram,
      cpu,
      hdrive,
      screen,
      demand,
      system,
      card,
      cpuGen,
    };
    console.log("Option: ", product_option);
    const product_store = {
      storeId: code,
      importPrices: parseInt(importPrices.replace(/,/g, "")),
      number,
    };
    console.log("Store: ", product_store);
    if (type == "LT") {
      if (CheckValidateLT()) {
        productService
          .create(product)
          .then((reponse) => {
            console.log("Product OK", reponse.data);
            //IMG
            productImgService
              .create(product_img)
              .then((response) => {
                console.log("IMG OK", response.data);
              })
              .catch((error) => {
                console.log(error);
              });
            //Option
            productOptionService
              .create(product_option)
              .then((reponse) => {
                console.log("Product Option", reponse.data);
              })
              .catch((error) => {
                console.log(error);
              });
            //Store
            productStoreService
              .create(product_store)
              .then((reponse) => {
                console.log("Product Store", reponse.data);
              })
              .catch((error) => {
                console.log(error);
              });
            navigate("/dashboard/product", { replace: true });
          })
          .catch((error) => {
            notifyError();
            console.log(error);
          });
      } else {
        console.log(false);
      }
    } else {
      if (CheckValidatePK()) {
        productService
          .create(product)
          .then((reponse) => {
            console.log("Product OK", reponse.data);
            //IMG
            productImgService
              .create(product_img)
              .then((response) => {
                console.log("IMG OK", response.data);
              })
              .catch((error) => {
                console.log(error);
              });
            //Store
            productStoreService
              .create(product_store)
              .then((reponse) => {
                console.log("Product Store", reponse.data);
              })
              .catch((error) => {
                console.log(error);
              });
            navigate("/dashboard/product", { replace: true });
          })
          .catch((error) => {
            notifyError();
            console.log(error);
          });
      } else {
        console.log(false);
      }
    }
  };
  //Handle Type
  const handleType = () => {
    setType(type == "LT" ? "PK" : "LT");
    setDisable(disabled ? false : true);
  };
  return (
    <div>
      <div>
        <Helmet>
          <title>Thêm sản phẩm</title>
          <meta name="description" content="Helmet application" />
        </Helmet>
      </div>
      <div className="text-center d-flex justify-content-between align-items-center mb-3">
        <div>
          <Link to="/dashboard/product">
            <button className="btn border border-3 border-primary d-flex ">
              <TiArrowBackOutline className="fs-4 text-primary" />
              Quay lại
            </button>
          </Link>
        </div>

        <div>
          <h2>Thêm Sản Phẩm</h2>
        </div>
        <div>
          <button
            onClick={(e) => handleSubmit()}
            className="btn border border-3 border-success d-flex "
          >
            <FcPlus className="fs-4" />
            <span className="Lưu bài viết">Lưu bài viết</span>
          </button>
        </div>
      </div>
      <Tabs
        id="controlled-tab-example"
        activeKey={key}
        onSelect={(k) => setKey(k)}
        className="mb-3 m-0 d-flex justify-content-center bg-transparent fw-bold"
      >
        <Tab eventKey="home" title="Tổng quan" className="">
          <div className="row">
            <div className="col-md-6">
              <label for="exampleInputEmail1" className="form-label">
                Tên sản phẩm
              </label>
              <input
                type="text"
                className="form-control"
                name="name"
                value={nameProduct}
                onChange={handChangNameAndSlug}
                // onChange={(e) => setNameProduct(e.target.value)}
              />
            </div>
            <div className="col-md-6">
              <label for="" className="form-label">
                Loại sản phẩm
              </label>
              <select
                className="form-select"
                aria-label="Default select example"
                name="status"
                onChange={handleType}
              >
                <option value="LT">Laptop</option>
                <option value="PK">Phụ kiện</option>
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
                <option value="0">Kiểm duyệt</option>
                <option value="1">Xuất bản</option>
              </select>
            </div>
            <div className="col-md-6">
              <label for="" className="form-label">
                Chọn danh mục sản phẩm
              </label>
              <select
                className="form-select"
                aria-label="Default select example"
                name="parentid"
                onChange={(e) => setCatId(e.target.value)}
              >
                <option value="0">Nomal</option>
                {type == "LT" ? (
                  <>
                    {category
                      .filter((child) => {
                        return child.status == 1 && child.parentId == 1;
                      })
                      .map((child, index) => {
                        return <option value={child.id}>{child.name}</option>;
                      })}
                  </>
                ) : (
                  <>
                    {category
                      .filter((child) => {
                        return child.status == 1 && child.parentId == 2;
                      })
                      .map((child, index) => {
                        return <option value={child.id}>{child.name}</option>;
                      })}
                  </>
                )}
              </select>
            </div>
            <div className="col-md-12">
              <label for="exampleInputEmail1" className="form-label">
                Mô tả chi tiết
              </label>
              <div style={{ width: "100%", height: 350, background: "#fff" }}>
                <div ref={quillRef} />
              </div>
            </div>
          </div>
        </Tab>
        <Tab eventKey="profile" title="Cấu hình" disabled={disabled}>
          <div className="row">
            <div className="col-md-6">
              <label for="" className="form-label">
                Nhu cầu
              </label>
              <select
                className="form-select"
                aria-label="Default select example"
                name="detail"
                onChange={(e) => setDemand(e.target.value)}
              >
                <option selected>Nomal</option>
                {productValue
                  .filter((child) => {
                    return child.parentIdValue == 7;
                  })
                  .map((child, index) => {
                    return <option value={child.id}>{child.nameValue}</option>;
                  })}
              </select>
            </div>
            <div className="col-md-6">
              <label for="exampleInputEmail1" className="form-label">
                Ram
              </label>
              <select
                className="form-select"
                aria-label="Default select example"
                name="typyid"
                onChange={(e) => setRam(e.target.value)}
              >
                <option selected>Nomal</option>
                {productValue
                  .filter((child) => {
                    return child.parentIdValue == 2;
                  })
                  .map((child, index) => {
                    return <option value={child.id}>{child.nameValue}</option>;
                  })}
              </select>
            </div>
            <div className="col-md-6">
              <label for="exampleInputEmail1" className="form-label">
                CPU
              </label>

              <select
                className="form-select"
                aria-label="Default select example"
                name="typyid"
                onChange={(e) => setCpu(e.target.value)}
              >
                <option selected>Nomal</option>
                {productValue
                  .filter((child) => {
                    return child.parentIdValue == 1;
                  })
                  .map((child, index) => {
                    return <option value={child.id}>{child.nameValue}</option>;
                  })}
              </select>
            </div>
            <div className="col-md-6">
              <label for="exampleInputEmail1" className="form-label">
                Thế hệ CPU
              </label>

              <select
                className="form-select"
                aria-label="Default select example"
                name="typyid"
                onChange={(e) => setCpuGen(e.target.value)}
              >
                <option selected>Nomal</option>
                {productValue
                  .filter((child) => {
                    return child.parentIdValue == 5;
                  })
                  .map((child, index) => {
                    return <option value={child.id}>{child.nameValue}</option>;
                  })}
              </select>
            </div>
            <div className="col-md-6">
              <label for="exampleInputEmail1" className="form-label">
                Màn hình
              </label>
              <select
                className="form-select"
                aria-label="Default select example"
                name="typyid"
                onChange={(e) => setScreen(e.target.value)}
              >
                <option selected>Nomal</option>
                {productValue
                  .filter((child) => {
                    return child.parentIdValue == 3;
                  })
                  .map((child, index) => {
                    return <option value={child.id}>{child.nameValue}</option>;
                  })}
              </select>
            </div>
            <div className="col-md-6">
              <label for="exampleInputEmail1" className="form-label">
                Hệ thống (Windown)
              </label>
              <select
                className="form-select"
                aria-label="Default select example"
                name="typyid"
                onChange={(e) => setSystem(e.target.value)}
              >
                <option selected>Nomal</option>
                {productValue
                  .filter((child) => {
                    return child.parentIdValue == 6;
                  })
                  .map((child, index) => {
                    return <option value={child.id}>{child.nameValue}</option>;
                  })}
              </select>
            </div>{" "}
            <div className="col-md-6">
              <label for="exampleInputEmail1" className="form-label">
                Card đồ họa
              </label>
              <select
                className="form-select"
                aria-label="Default select example"
                name="typyid"
                onChange={(e) => setCard(e.target.value)}
              >
                <option selected>Nomal</option>
                {productValue
                  .filter((child) => {
                    return child.parentIdValue == 8;
                  })
                  .map((child, index) => {
                    return <option value={child.id}>{child.nameValue}</option>;
                  })}
              </select>
            </div>
            <div className="col-md-6">
              <label for="exampleInputEmail1" className="form-label">
                Bộ nhớ
              </label>
              <select
                className="form-select"
                aria-label="Default select example"
                name="typyid"
                onChange={(e) => setHdrive(e.target.value)}
              >
                <option selected>Nomal</option>
                {productValue
                  .filter((child) => {
                    return child.parentIdValue == 4;
                  })
                  .map((child, index) => {
                    return <option value={child.id}>{child.nameValue}</option>;
                  })}
              </select>
            </div>
          </div>
        </Tab>
        <Tab eventKey="image" title="Hình ảnh">
          <div className="py-2">
            <label htmlFor="file" className="form-label image-label bg-light">
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
              // value=''
              onChange={handleFiles}
              // value={img}
              // onChange={(e) => setImg(e.target.value)}
              multiple
            />
          </div>
          <div className="text-center">
            <div className="row row-cols-2 row-cols-lg-5 g-2 g-lg-3">
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
          {/* <button className="btn btn-info w-100">Lưu</button> */}
        </Tab>
        <Tab eventKey="detail" title="Chi tiết">
          <div className="row">
            <div className="col-md-6">
              <label for="exampleInputEmail1" className="form-label">
                Giá nhập
              </label>
              <NumericFormat
                className="form-control"
                thousandSeparator={true}
                value={importPrices}
                onChange={(e) => setImportPrices(e.target.value)}
              />
              <span>
                <i>
                  <b>Lưu ý:</b> Sử dụng đơn vị tiền tệ <b>VND</b>(Việt Nam Đồng)
                </i>
              </span>
            </div>
            <div className="col-md-6">
              <label for="exampleInputEmail1" className="form-label">
                Giá bán
              </label>
              <NumericFormat
                className="form-control"
                thousandSeparator={true}
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </div>
            <div className="col-md-6 mt-2">
              <label for="exampleInputEmail1" className="form-label">
                Số lượng
              </label>
              <input
                type="number"
                className="form-control"
                name="name"
                value={number}
                pattern="([0-9]{1,3}).([0-9]{1,3})"
                onChange={(e) => setNumber(e.target.value)}
              />
            </div>
          </div>
          <button
            className="btn btn-info w-100 mt-2"
            // onClick={(e) => handleSubmit()}
            onClick={(e) => handleSubmit()}
          >
            Lưu sản phẩm
          </button>
        </Tab>
      </Tabs>
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

export default AddProduct;
