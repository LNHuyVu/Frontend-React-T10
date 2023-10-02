import React, { useState, useEffect } from "react";
import categoryService from "../../../services/category.service";
import productService from "../../../services/product.service";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Loading from "../../../component/loading/Loading";
import { BsCameraFill, BsFillTrashFill } from "react-icons/bs";
import productImgService from "../../../services/productImg.service";
import productValueService from "../../../services/productValue.service";
import productStoreService from "../../../services/productStore.service";
import productOptionService from "../../../services/productOption.service";
import { NumericFormat } from "react-number-format";
import { useSelector } from "react-redux";
//
import { useQuill } from "react-quilljs";
import "quill/dist/quill.snow.css";
import { Helmet } from "react-helmet";

const EditProduct = () => {
  const userRD = useSelector((state) => state.auth.login?.currentUser);

  const { quill, quillRef } = useQuill();

  const [key, setKey] = useState("home");
  const navigate = useNavigate();
  const slugname = require("slug");
  const params = useParams();
  let id = params.id;
  //
  const [isLoading, setIsLoading] = useState(false);
  const [productValue, setProductValue] = useState([]);
  const [isCategory, setIsCategory] = useState(false);
  const [category, setCategory] = useState([]);

  //Product
  const [nameProduct, setNameProduct] = useState("");
  const [slugProduct, setSlugProduct] = useState("");
  const [catId, setCatId] = useState("");
  const [detail, setDetail] = useState("");
  const [status, setStatus] = useState("");
  const [price, setPrice] = useState("");
  const [type, setType] = useState("");
  const [proId, setProId] = useState("");

  //Option
  const [demand, setDemand] = useState("");
  const [img, setImg] = useState("");
  const [cpu, setCpu] = useState("");
  const [cpuGen, setCpuGen] = useState("");
  const [ram, setRam] = useState("");
  const [hdrive, setHdrive] = useState("");
  const [card, setCard] = useState("");
  const [screen, setScreen] = useState("");
  const [system, setSystem] = useState("");
  const [optionId, setOptionId] = useState("");
  //Img
  const [imgId, setImgId] = useState("");
  const [link, setLink] = useState("");
  const [imagesPreview, setImagesPreview] = useState([]);
  //Store
  const [storeId, setStoreId] = useState("");
  const [number, setNumber] = useState("");
  const [importPrices, setImportPrices] = useState("");

  //Load parentid
  useEffect(() => {
    init();
  }, []);
  const init = () => {
    //GET ID
    console.log(id);
    productService
      .getAll(id)
      .then((response) => {
        console.log("hihi", response.data.product);
        //Start Product
        setNameProduct(response.data.product.nameProduct);
        setCatId(response.data.product.catId);
        setType(response.data.product.type);
        quillRef.current.firstChild.innerHTML = response.data.product.detail;
        // setDetail(response.data.product.detail);
        setStatus(response.data.product.status);
        setSlugProduct(response.data.product.slugProduct);
        setPrice(response.data.product.price);
        setProId(response.data.product.proId);
        //End Product
        if (response.data.product.type == "PK") {
          setIsCategory(true);
        } else {
          setOptionId(response.data.product.option.id);
          setDemand(response.data.product.option.demandName.id);
          setCpu(response.data.product.option.cpuName.id);
          setCard(response.data.product.option.cardName.id);
          setSystem(response.data.product.option.systemName.id);
          setHdrive(response.data.product.option.hdriveName.id);
          setRam(response.data.product.option.ramName.id);
          setCpuGen(response.data.product.option.cpuGenName.id);
          setScreen(response.data.product.option.screenName.id);
        }
        //Start Store
        setStoreId(response.data.product.store.id);
        setImportPrices(response.data.product.store.importPrices);
        setNumber(response.data.product.store.number);
        //End Start

        //Start Img
        setImgId(response.data.product.imgData.id);
        setImagesPreview(response.data.product.imgData.link);
        //End Img
      })
      .catch((error) => {
        console.log("Get Data Failed ID", error);
      });
    //
    // //GET OPTION
    categoryService
      .getAll("ALL", userRD)
      .then((response) => {
        // console.log("Get Data OK", response.data.category);
        setCategory(response.data.category);
      })
      .catch((error) => {
        console.log("Get Data Failed Option");
      });
    productValueService
      .getAll("ALL")
      .then((response) => {
        // console.log("Get PRO Value", response.data);
        setProductValue(response.data.productvalue);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const CheckValidateLT = () => {
    let contentLT = quillRef.current.firstChild.innerHTML;
    if (contentLT == "<p><br></p>") {
      contentLT = "";
    }
    setLink(imagesPreview);
    let isValue = true;
    const check = {
      "Mô tả": contentLT,
      "Nhu cầu": demand,
      "Trạng thái": status,
      CPU: cpu,
      RAM: ram,
      "Ổ cứng": hdrive,
      "Kích thước màn hình": screen,
      "Card đồ họa": card,
      "Hệ điều hành": system,
      "Tên sản phẩm": nameProduct,
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
    let contentPK = quillRef.current.firstChild.innerHTML;
    if (contentPK == "<p><br></p>") {
      contentPK = "";
    }

    setLink(imagesPreview);
    let isValue = true;
    const check = {
      "Mô tả": contentPK,
      "Trạng thái": status,
      "Tên sản phẩm": nameProduct,
      slugProduct,
      Giá: price,
      "Danh mục": catId,
      "Hình ảnh": imagesPreview,
      "Giá nhập": importPrices,
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
  //Handle Submit
  const handleUpdate = async (e) => {
    // e.preventDefault();
    //Product
    const product = {
      nameProduct,
      slugProduct,
      catId,
      price: parseInt(String(price).replace(/,/g, "")),
      detail: quillRef.current.firstChild.innerHTML,
      type,
      proId,
      createdBy: "VIP",
      status,
      id,
    };
    console.log("Product: ", product);
    //Product IMG
    const product_img = {
      id: imgId,
      link: imagesPreview,
      status: 1,
    };
    console.log("Img: ", product_img);
    //Product Option
    const product_option = {
      id: optionId,
      ram: parseInt(ram),
      cpu: parseInt(cpu),
      hdrive: parseInt(hdrive),
      screen: parseInt(screen),
      demand: parseInt(demand),
      system: parseInt(system),
      card: parseInt(card),
      cpuGen: parseInt(cpuGen),
    };
    console.log("Option: ", product_option);
    const product_store = {
      id: storeId,
      importPrices: parseInt(String(importPrices).replace(/,/g, "")),
      number,
    };
    console.log("Store: ", product_store);
    if (type == "LT") {
      if (CheckValidateLT()) {
        // console.log(type);
        console.log("product", product);
        console.log("option", product_option);
        console.log("img", product_img);
        await productService
          .update(product)
          .then((response) => {
            console.log("data product successfully", response.data);
            productImgService
              .update(product_img)
              .then((response) => {
                console.log("data img successfully", response.data);
              })
              .catch((error) => {
                console.log("Songthing img went wrong", error);
              });
            productStoreService
              .update(product_store)
              .then((response) => {
                console.log("data store successfully", response.data);
              })
              .catch((error) => {
                console.log("Songthing store went wrong", error);
              });
            productOptionService
              .update(product_option)
              .then((response) => {
                console.log("data option successfully", response.data);
                navigate("/dashboard/product", { replace: true });
                init();
              })
              .catch((error) => {
                console.log("Songthing went wrong", error);
              });
          })
          .catch((error) => {
            console.log("Songthing product went wrong", error);
          });
      }
    } else {
      if (CheckValidatePK()) {
        productService
          .update(product)
          .then((reponse) => {
            console.log("Product OK", reponse.data);
            //IMG
            productImgService
              .update(product_img)
              .then((response) => {
                console.log("IMG OK", response.data);
              })
              .catch((error) => {
                console.log(error);
              });
            //Store
            productStoreService
              .update(product_store)
              .then((reponse) => {
                console.log("Product Store", reponse.data);
              })
              .catch((error) => {
                console.log(error);
              });
            navigate("/dashboard/product", { replace: true });
            init();
          })
          .catch((error) => {
            console.log(error);
          });
      } else {
        console.log(false);
      }
    }
  };
  // Clear
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
  //handleName and Slug
  const handChangNameAndSlug = (e) => {
    setNameProduct(e.target.value);
    setSlugProduct(slugname(e.target.value));
  };
  return (
    <div>
      <div>
        <Helmet>
          <title>Chỉnh sửa sản phẩm</title>
          <meta name="description" content="Helmet application" />
        </Helmet>
      </div>
      <h3 className="text-center">Chỉnh Sửa Thông Tin Sản Phẩm</h3>
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
                disabled
                // onChange={handleType}
              >
                {type == "LT" ? (
                  <>
                    <option value="0">Laptop</option>
                  </>
                ) : (
                  <>
                    <option value="1">Phụ kiện</option>
                  </>
                )}
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
                {category
                  .filter((child) => {
                    return child.status == 1 && child.id == catId;
                  })
                  .map((child, index) => {
                    return (
                      <option selected value={child.id}>
                        {child.name}
                      </option>
                    );
                  })}
                <option value="0">Nomal</option>
                {category
                  .filter((child) => {
                    return child.status == 1 && child.parentId != 0;
                  })
                  .map((child, index) => {
                    return <option value={child.id}>{child.name}</option>;
                  })}
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
        <Tab eventKey="profile" title="Cấu hình" disabled={isCategory}>
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
                {productValue
                  .filter((child) => {
                    return child.parentIdValue == 7;
                  })
                  .map((child, index) => {
                    return (
                      <>
                        {child.id == demand ? (
                          <option selected value={child.id}>
                            {child.nameValue}
                          </option>
                        ) : (
                          <option value={child.id}>{child.nameValue}</option>
                        )}
                      </>
                    );
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
                {productValue
                  .filter((child) => {
                    return child.parentIdValue == 2;
                  })
                  .map((child, index) => {
                    return (
                      <>
                        {child.id == ram ? (
                          <option selected value={child.id}>
                            {child.nameValue}
                          </option>
                        ) : (
                          <option value={child.id}>{child.nameValue}</option>
                        )}
                      </>
                    );
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
                {productValue
                  .filter((child) => {
                    return child.parentIdValue == 1;
                  })
                  .map((child, index) => {
                    return (
                      <>
                        {child.id == cpu ? (
                          <option selected value={child.id}>
                            {child.nameValue}
                          </option>
                        ) : (
                          <option value={child.id}>{child.nameValue}</option>
                        )}
                      </>
                    );
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
                {productValue
                  .filter((child) => {
                    return child.parentIdValue == 5;
                  })
                  .map((child, index) => {
                    return (
                      <>
                        {child.id == cpuGen ? (
                          <option selected value={child.id}>
                            {child.nameValue}
                          </option>
                        ) : (
                          <option value={child.id}>{child.nameValue}</option>
                        )}
                      </>
                    );
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
                {productValue
                  .filter((child) => {
                    return child.parentIdValue == 3;
                  })
                  .map((child, index) => {
                    return (
                      <>
                        {child.id == screen ? (
                          <option selected value={child.id}>
                            {child.nameValue}
                          </option>
                        ) : (
                          <option value={child.id}>{child.nameValue}</option>
                        )}
                      </>
                    );
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
                {productValue
                  .filter((child) => {
                    return child.parentIdValue == 6;
                  })
                  .map((child, index) => {
                    return (
                      <>
                        {child.id == system ? (
                          <option selected value={child.id}>
                            {child.nameValue}
                          </option>
                        ) : (
                          <option value={child.id}>{child.nameValue}</option>
                        )}
                      </>
                    );
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
                {productValue
                  .filter((child) => {
                    return child.parentIdValue == 8;
                  })
                  .map((child, index) => {
                    return (
                      <>
                        {child.id == card ? (
                          <option selected value={child.id}>
                            {child.nameValue}
                          </option>
                        ) : (
                          <option value={child.id}>{child.nameValue}</option>
                        )}
                      </>
                    );
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
                {productValue
                  .filter((child) => {
                    return child.parentIdValue == 4;
                  })
                  .map((child, index) => {
                    return (
                      <>
                        {child.id == hdrive ? (
                          <option selected value={child.id}>
                            {child.nameValue}
                          </option>
                        ) : (
                          <option value={child.id}>{child.nameValue}</option>
                        )}
                      </>
                    );
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
                type="text"
                className="form-control"
                name="name"
                value={number}
                onChange={(e) => setNumber(e.target.value)}
              />
            </div>
          </div>
        </Tab>
      </Tabs>
      <h4 className="text-center">Chức năng</h4>
      <button
        className="btn btn-info w-100 m-1"
        onClick={(e) => handleUpdate(e)}
      >
        Lưu thay đổi
      </button>
    </div>
  );
};

export default EditProduct;
