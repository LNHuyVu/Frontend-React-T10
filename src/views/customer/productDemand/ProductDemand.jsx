import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import productValueService from "../../../services/productValue.service";
import categoryService from "../../../services/category.service";
import "./productdemand.scss";
import { useSelector, useDispatch } from "react-redux";
import { TiShoppingCart } from "react-icons/ti";
import { BsFillGrid3X2GapFill, BsListUl } from "react-icons/bs";

import { addToCart } from "../../../redux/slice/cartSlice";
//
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
//
import { Helmet } from "react-helmet";
const ProductDemand = () => {
  //Set time
  const date = new Date();
  const formatDate = { year: "numeric", month: "2-digit", day: "2-digit" };
  const dateNow = date.toLocaleDateString("vi-VN", formatDate);
  //
  var numeral = require("numeral");
  const userRD = useSelector((state) => state.auth.login?.currentUser);
  //Grid List View
  const [grid, setGrid] = useState("block");
  const [list, setList] = useState("none");
  //
  let [categoryFilters, setcategoryFilters] = useState(new Set());
  const dispatch = useDispatch();
  const param = useParams();
  let slug = param.slug;
  const [productValue, setProductValue] = useState([]);
  const [categories, setCategoies] = useState([]);
  useEffect(() => {
    init();
    if (grid == "block") {
      document.getElementById("g-view").style.color = "red";
    }
  }, [slug]);
  const init = () => {
    productValueService
      .getProductValueCustomer(slug)
      .then((reponse) => {
        console.log(reponse.data.productvalue);
        setProductValue(reponse.data.productvalue);
      })
      .catch((error) => {
        console.log(error);
      });
    categoryService
      .getAll("ALL")
      .then((response) => {
        setCategoies(response.data.category);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  //Toastify
  const notifySuccess = () =>
    toast.success("Đã thêm vào giỏ hàng!", {
      position: "top-center",
      autoClose: 500,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  const notifyWarning = () =>
    toast.warn("Vui lòng đăng nhập!", {
      position: "top-center",
      autoClose: 500,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  const handleAddCart = (id, title, image, price, proId, number) => {
    if (!userRD) {
      notifyWarning();
    } else {
      notifySuccess();
      let userid = userRD.user.id;
      dispatch(addToCart({ id, title, image, price, proId, userid, number }));
    }
  };

  function updateFilters(checked, categoryFilter) {
    if (checked) {
      setcategoryFilters((prev) => new Set(prev).add(categoryFilter));
    }
    if (!checked) {
      setcategoryFilters((prev) => {
        const next = new Set(prev);
        next.delete(categoryFilter);
        return next;
      });
    }
  }

  const filteredProducts =
    categoryFilters.size === 0
      ? productValue
      : productValue.filter((p) => categoryFilters.has(p.product?.catId));

  const handleView = (value) => {
    if (value == "grid") {
      setGrid("block");
      setList("none");
      document.getElementById("g-view").style.color = "red";
      document.getElementById("l-view").style.color = "black";
    }
    if (value == "list") {
      setGrid("none");
      setList("block");
      document.getElementById("g-view").style.color = "black";
      document.getElementById("l-view").style.color = "red";
    }
  };
  //Check Product Sale
  const checkProductSale = (sale, status, startD, endD) => {
    let check = true;
    if (sale == null) {
      return (check = false);
    }
    if (status == 0) {
      return (check = false);
    }
    if (
      !(
        new Date(dateNow.split("/").reverse().join("-")) >=
          new Date(startD.split("/").reverse().join("-")) &&
        new Date(dateNow.split("/").reverse().join("-")) <=
          new Date(endD.split("/").reverse().join("-"))
      )
    ) {
      return (check = false);
    }
    return check;
  };
  return (
    <div className="productdemand container-xxl">
      <div>
        <Helmet>
          <title>{productValue[0]?.product?.option?.demandName?.nameValue}</title>
          <meta name="description" content="Helmet application" />
        </Helmet>
      </div>
      <h3 className="text-center">
        {productValue[0]?.product?.option?.demandName?.nameValue}
      </h3>
      <div className="row">
        <div className="col-md-2 px-1">
          <div className="checkBox-brand">
            <h6
              style={{
                fontFamily: "Arial, Helvetica, sans-serif",
                fontWeight: "bolder",
              }}
            >
              Hãng sản xuất
            </h6>
            {categories
              .filter((item) => {
                return item.parentId == "1";
              })
              .map((item, index) => {
                return (
                  <div className="form-check p-0" key={index}>
                    <label className="form-check-label">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        onChange={(e) =>
                          updateFilters(e.target.checked, item.id)
                        }
                      />
                      <span>{item.name}</span>
                    </label>
                  </div>
                );
              })}
          </div>
        </div>
        <div className="col-md-10 px-0">
          <div className="container">
            <div className="sort d-flex justify-content-end">
              <div className="p-2" style={{ maxWidth: 200 }}>
                <select
                  className="form-select"
                  aria-label="Default select example"
                  // onChange={(e) => handleSort(e.target.value)}
                >
                  <option value="1" selected>
                    Mặc định
                  </option>
                  <option value="2">Giá tăng dần</option>
                  <option value="3">Giá giảm dần</option>
                </select>
              </div>
              <div className="py-2 grid-list-view">
                <span
                  id="g-view"
                  className="grid-view"
                  onClick={() => handleView("grid")}
                >
                  <BsFillGrid3X2GapFill size={40} />
                </span>
                <span
                  id="l-view"
                  className="list-view"
                  onClick={() => handleView("list")}
                >
                  <BsListUl size={40} />
                </span>
              </div>
            </div>
            {/* Grid */}
            <div className="row row-cols-2 row-cols-lg-4 g-2 g-lg-3">
              {filteredProducts
                .filter((child) => {
                  return child.product != null;
                })
                .map((child) => {
                  return (
                    <div className="col" style={{ display: grid }}>
                      <div className="card">
                        <Link
                          to={`/product/productdetail/${child.product?.slugProduct}`}
                        >
                          <div className="p-2 box-zoom-out">
                            <img
                              src={child.product?.imgData.link[0]}
                              className="card-img-top"
                              alt="..."
                            />
                            {checkProductSale(
                              child?.product?.sale,
                              child?.product?.sale?.status,
                              child?.product?.sale?.startDay,
                              child?.product?.sale?.endDay
                            ) == false ? (
                              <></>
                            ) : (
                              <>
                                <span className="sale px-2">
                                  Giảm giá:{" "}
                                  {numeral(
                                    child.product?.sale.valueSale
                                  ).format("0,0")}
                                  đ
                                </span>
                              </>
                            )}
                          </div>
                        </Link>

                        <div className="card-body">
                          <h5
                            className="card-title"
                            style={{ fontSize: "100%" }}
                          >
                            <Link
                              to={`/product/productdetail/${child.product?.slugProduct}`}
                            >
                              <span
                                className="card-text-home"
                                style={{ color: "#000" }}
                              >
                                {child.product?.nameProduct}
                              </span>
                            </Link>

                            <div className="mt-1 container overflow-hidden">
                              <div className="row gx-2">
                                <div className="col">
                                  <div
                                    className="border bg-light text-center"
                                    style={{
                                      borderRadius: 5,
                                      background: "#fff",
                                      fontSize: "80%",
                                    }}
                                  >
                                    Ram{" "}
                                    {child.product?.option.ramName.nameValue}
                                  </div>
                                </div>
                                <div class="col">
                                  <div
                                    class="border bg-light text-center"
                                    style={{
                                      borderRadius: 5,
                                      background: "#fff",
                                      fontSize: "80%",
                                    }}
                                  >
                                    {child.product?.option.hdriveName.nameValue}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </h5>
                          <div className="card-text">
                            <div className="d-flex justify-content-lg-between">
                              {checkProductSale(
                                child.product?.sale,
                                child.product?.sale?.status,
                                child?.product?.sale?.startDay,
                                child?.product?.sale?.endDay
                              ) == false ? (
                                <>
                                  <span
                                    className="px-2"
                                    style={{
                                      fontWeight: "bold",
                                      color: "blue",
                                      background: "#9370D8",
                                      borderRadius: 10,
                                    }}
                                  >
                                    {numeral(child?.product?.price).format(
                                      "0,0"
                                    )}
                                    <u>đ</u>
                                  </span>
                                </>
                              ) : (
                                <>
                                  <span
                                    className="px-2"
                                    style={{
                                      fontWeight: "bold",
                                      color: "blue",
                                      background: "#9370D8",
                                      borderRadius: 10,
                                    }}
                                  >
                                    {numeral(
                                      parseInt(child?.product.price) -
                                        child?.product?.sale?.valueSale
                                    ).format("0,0")}
                                    <u>đ</u>
                                  </span>
                                  <span
                                    style={{
                                      "text-decoration-line": "line-through",
                                    }}
                                  >
                                    {numeral(child?.product.price).format(
                                      "0,0"
                                    )}
                                    <u>đ</u>
                                  </span>
                                </>
                              )}
                            </div>
                            <br />
                            <span>Màn hình: </span>
                            {child.product?.option.screenName.nameValue}
                            <br />
                            <span>CPU: </span>
                            {child.product?.option.cpuName.nameValue},
                            {child.product?.option.cpuGenName.nameValue}
                            <br />
                            <span className="">
                              Card: {child.product?.option.cardName.nameValue}
                            </span>
                          </div>
                          {child.product?.store.number == 0 ? (
                            <>
                              <h4 className="text-center btn-light">Đã hết</h4>
                            </>
                          ) : (
                            <>
                              <button
                                className="btn btn-success w-100"
                                onClick={() =>
                                  handleAddCart(
                                    child.product.id,
                                    child.product.nameProduct,
                                    child.product.imgData?.link[0],
                                    checkProductSale(
                                      child.product?.sale,
                                      child.product?.sale?.status,
                                      child?.product?.sale?.startDay,
                                      child?.product?.sale?.endDay
                                    ) == false
                                      ? child.product.price
                                      : parseInt(
                                          child.product.price -
                                            child.product.sale.valueSale
                                        ),
                                    child.product.proId,

                                    child.product.store.number
                                  )
                                }
                              >
                                <TiShoppingCart size={30} />
                                MUA NGAY
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
            {/* List */}
            <div className="mt-3">
              {filteredProducts
                .filter((child) => {
                  return child.product != null;
                })
                .map((child) => {
                  return (
                    <div class="card mb-3" style={{ display: list }}>
                      <div class="row g-0 p-2">
                        <div class="col-md-4 p-1">
                          <Link
                            to={`/product/productdetail/${child.product?.slugProduct}`}
                          >
                            <div className="p-2 box-zoom-out">
                              <img
                                src={child.product?.imgData.link[0]}
                                className="card-img-top"
                                alt="..."
                              />
                              {checkProductSale(
                                child.product?.sale,
                                child.product?.sale?.status,
                                child?.product?.sale?.startDay,
                                child?.product?.sale?.endDay
                              ) == false ? (
                                <></>
                              ) : (
                                <>
                                  <span className="sale px-2">
                                    Giảm giá:{" "}
                                    {numeral(
                                      child.product?.sale.valueSale
                                    ).format("0,0")}
                                    đ
                                  </span>
                                </>
                              )}
                            </div>
                          </Link>
                          <div className="mt-1 container overflow-hidden">
                            <div className="row gx-2">
                              <div className="col">
                                <div
                                  className="border bg-light text-center"
                                  style={{
                                    borderRadius: 5,
                                    background: "#fff",
                                    fontSize: "80%",
                                  }}
                                >
                                  Ram {child.product?.option.ramName.nameValue}
                                </div>
                              </div>
                              <div class="col">
                                <div
                                  class="border bg-light text-center"
                                  style={{
                                    borderRadius: 5,
                                    background: "#fff",
                                    fontSize: "80%",
                                  }}
                                >
                                  {child.product?.option.hdriveName.nameValue}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div class="col-md-8">
                          <div class="card-body">
                            <h5 class="card-title">
                              <Link
                                to={`/product/productdetail/${child.product?.slugProduct}`}
                              >
                                <span
                                  className="card-text-home fs-6"
                                  style={{ color: "#000" }}
                                >
                                  {child.product?.nameProduct}
                                </span>
                              </Link>
                            </h5>
                            <div className="card-text">
                              <div className="d-flex justify-content-lg-start ">
                                {checkProductSale(
                                  child.product?.sale,
                                  child.product?.sale?.status,
                                  child?.product?.sale?.startDay,
                                  child?.product?.sale?.endDay
                                ) == false ? (
                                  <>
                                    <span
                                      className="px-2"
                                      style={{
                                        fontWeight: "bold",
                                        color: "blue",
                                        background: "#9370D8",
                                        borderRadius: 10,
                                      }}
                                    >
                                      {numeral(child?.product?.price).format(
                                        "0,0"
                                      )}
                                      <u>đ</u>
                                    </span>
                                  </>
                                ) : (
                                  <>
                                    <span
                                      className="px-2"
                                      style={{
                                        fontWeight: "bold",
                                        color: "blue",
                                        background: "#9370D8",
                                        borderRadius: 10,
                                      }}
                                    >
                                      {numeral(
                                        parseInt(child?.product.price) -
                                          child?.product?.sale?.valueSale
                                      ).format("0,0")}
                                      <u>đ</u>
                                    </span>
                                    <span
                                      className="mx-2"
                                      style={{
                                        "text-decoration-line": "line-through",
                                      }}
                                    >
                                      {numeral(child?.product.price).format(
                                        "0,0"
                                      )}
                                      <u>đ</u>
                                    </span>
                                  </>
                                )}
                              </div>
                              <br />
                              <span>Màn hình: </span>
                              {child.product?.option.screenName.nameValue}
                              <br />
                              <span>CPU: </span>
                              {child.product?.option.cpuName.nameValue},
                              {child.product?.option.cpuGenName.nameValue}
                              <br />
                              <span className="">
                                Card: {child.product?.option.cardName.nameValue}
                              </span>
                            </div>
                            {child.product?.store.number == 0 ? (
                              <>
                                <h4 className="text-center btn-light">
                                  Đã hết
                                </h4>
                              </>
                            ) : (
                              <>
                                <button
                                  className="btn btn-success w-100"
                                  onClick={() =>
                                    handleAddCart(
                                      child.product.id,
                                      child.product.nameProduct,
                                      child.product.imgData?.link[0],
                                      checkProductSale(
                                        child.product?.sale,
                                        child.product?.sale?.status,
                                        child?.product?.sale?.startDay,
                                        child?.product?.sale?.endDay
                                      ) == false
                                        ? child.product.price
                                        : parseInt(
                                            child.product.price -
                                              child.product.sale.valueSale
                                          ),
                                      child.product.proId,

                                      child.product.store.number
                                    )
                                  }
                                >
                                  <TiShoppingCart size={30} />
                                  MUA NGAY
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      </div>
      <ToastContainer
        position="top-center"
        autoClose={500}
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

export default ProductDemand;
