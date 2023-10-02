import React from "react";
import "./productcategory.scss";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { useEffect } from "react";
import { useState } from "react";
import categoryService from "../../../services/category.service";
import productService from "../../../services/product.service";
import { TiShoppingCart } from "react-icons/ti";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../../../redux/slice/cartSlice";
//
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
//
import { BsFillGrid3X2GapFill, BsListUl } from "react-icons/bs";
//Panigation
import { Helmet } from "react-helmet";

const ProductCategory = () => {
  //Set time
  const date = new Date();
  const formatDate = { year: "numeric", month: "2-digit", day: "2-digit" };
  const dateNow = date.toLocaleDateString("vi-VN", formatDate);
  //
  let maxB;
  let minA;
  const [filter, setFilter] = useState([]);
  //
  const userRD = useSelector((state) => state.auth.login?.currentUser);

  // Grid-List
  const [grid, setGrid] = useState("block");
  const [list, setList] = useState("none");
  //
  const dispatch = useDispatch();
  const [product, setProduct] = useState([]);
  const [category, setCategory] = useState([]);
  let numeral = require("numeral");
  const param = useParams();
  let slug = param.slug;
  const categories = [
    { name: "Dưới 10 triệu", a: 0, b: 10000000 },
    { name: "Từ 10 đến 15 triệu", a: 10000000, b: 15000000 },
    { name: "Từ 15 đến 20 triệu", a: 15000000, b: 20000000 },
    { name: "Từ 20 đến 25 triệu", a: 20000000, b: 25000000 },
    { name: "Trên 25 triệu", a: 25000000, b: 1000000000 },
  ];
  useEffect(() => {
    init();
    if (grid == "block") {
      document.getElementById("g-view").style.color = "red";
    }
  }, [slug]);
  const init = () => {
    categoryService
      .getIdCat(slug)
      .then((reponse) => {
        console.log("CB", reponse.data);
        setCategory(reponse.data.category);
        productService
          .getProductCat(reponse.data.category.id)
          .then((reponse) => {
            setProduct(reponse.data.product);
          })
          .catch((error) => {
            console.log(error);
          });
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
  //Filter Price
  function updateFilters(checked, categoryFilter) {
    if (checked) {
      setFilter([categoryFilter]);
    }
    if (!checked) {
      setFilter(
        filter.filter(
          (item) =>
            !(item.a === categoryFilter.a && item.b === categoryFilter.b)
        )
      );
    }
  }
  if (filter.length > 0) {
    const max = filter.reduce((prev, current) =>
      prev.b > current.b ? prev : current
    );
    maxB = max.b;
    const min = Math.min(...filter.map((obj) => obj.a));
    minA = min;
  }
  const filteredProducts =
    filter.length === 0
      ? product
      : product.filter((p) => p.price >= minA && p.price <= maxB);
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
  //Panigation
  return (
    <div className="product-category container-xxl">
      <div>
        <Helmet>
          <title>{category?.name}</title>
          <meta name="description" content="Helmet application" />
        </Helmet>
      </div>
      <div className="banner-category text-center">
        <img
          className="w-100"
          style={{ maxHeight: 200 }}
          src={category?.image?.[1]}
          alt=""
        />
      </div>
      <div className="row mt-2">
        <div className="col-md-2">
          <div className="radio-price">
            <h6
              style={{
                fontFamily: "Arial, Helvetica, sans-serif",
                fontWeight: "bolder",
              }}
            >
              Lọc theo giá
            </h6>
            <div className="form-radio-price">
              <div className="w-100">
                <label className="form-check-label label-radio-price">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="radioPrice"
                    onChange={(e) =>
                      updateFilters(e.target.checked, { a: 0, b: 1000000000 })
                    }
                  />
                  <span>Tất cả</span>
                </label>
              </div>
              {categories.map((elm, index) => {
                return (
                  <div className="w-100" key={index}>
                    <label className="form-check-label">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="radioPrice"
                        onChange={(e) =>
                          updateFilters(e.target.checked, {
                            a: elm.a,
                            b: elm.b,
                          })
                        }
                      />
                      <span>{elm.name}</span>
                    </label>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        <div className="col-md-10">
          <div className="container">
            <div className="d-flex justify-content-between">
              <div>
                <h2>{category?.name}</h2>
              </div>
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
            </div>

            {/* List */}
            <div>
              {filteredProducts.map((item) => {
                return (
                  <div class="card mb-3" style={{ display: list }}>
                    <div class="row g-0">
                      <div class="col-md-4 p-1">
                        <Link
                          to={`/product/productdetail/${item?.slugProduct}`}
                        >
                          <div className="p-2 box-zoom-out">
                            <img
                              src={item?.imgData.link[0]}
                              className="card-img-top"
                              alt="..."
                            />
                            {checkProductSale(
                              item?.sale,
                              item?.sale?.status,
                              item?.sale?.startDay,
                              item?.sale?.endDay
                            ) == false ? (
                              <></>
                            ) : (
                              <>
                                <span className="sale px-2">
                                  Giảm giá:{" "}
                                  {numeral(item?.sale.valueSale).format("0,0")}đ
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
                                {item?.option?.ramName ? "Ram" : ""}
                                {item?.option?.ramName.nameValue}
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
                                {item?.option?.hdriveName.nameValue}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div class="col-md-8">
                        <div class="card-body">
                          <h5 class="card-title">
                            <Link
                              to={`/product/productdetail/${item?.slugProduct}`}
                            >
                              <span
                                className="card-text-home fs-6"
                                style={{ color: "#000" }}
                              >
                                {item?.nameProduct}
                              </span>
                            </Link>
                          </h5>
                          <div className="card-text">
                            <div className="d-flex justify-content-lg-start">
                              {checkProductSale(
                                item?.sale,
                                item?.sale?.status,
                                item?.sale?.startDay,
                                item?.sale?.endDay
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
                                    {numeral(item?.price).format("0,0")}
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
                                      parseInt(item?.price) -
                                        item?.sale?.valueSale
                                    ).format("0,0")}
                                    <u>đ</u>
                                  </span>
                                  <span
                                    className="mx-2"
                                    style={{
                                      "text-decoration-line": "line-through",
                                    }}
                                  >
                                    {numeral(item?.price).format("0,0")}
                                    <u>đ</u>
                                  </span>
                                </>
                              )}
                            </div>
                            <br />
                            {item?.option?.screenName ? "Màn hình: " : ""}
                            {item?.option?.screenName.nameValue}
                            <br />
                            {item?.option?.cpuName ? "CPU: " : ""}
                            {item?.option?.cpuName.nameValue}
                            {item?.option?.cpuName ? "," : ""}
                            {item?.option?.cpuGenName.nameValue}
                            <br />
                            <span className="card-text">
                              {item?.option?.cardName ? "Card:" : ""}

                              {item?.option?.cardName.nameValue}
                            </span>
                          </div>
                          {item?.store?.number == 0 ? (
                            <>
                              <h4 className="text-center btn-light">Đã hết</h4>
                            </>
                          ) : (
                            <>
                              <button
                                className="btn btn-success w-100"
                                onClick={() =>
                                  handleAddCart(
                                    item.id,
                                    item.nameProduct,
                                    item?.imgData.link[0],
                                    checkProductSale(
                                      item?.sale,
                                      item?.sale?.status,
                                      item?.sale?.startDay,
                                      item?.sale?.endDay
                                    ) == false
                                      ? item.price
                                      : parseInt(
                                          item.price - item.sale.valueSale
                                        ),
                                    item.proId,
                                    item.store.number
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
            {/* Grid */}
            <div className="row row-cols-2 row-cols-lg-4 g-2 g-lg-3">
              {filteredProducts.map((item) => {
                return (
                  <div className="col" style={{ display: grid }}>
                    <div className="card">
                      <Link to={`/product/productdetail/${item?.slugProduct}`}>
                        <div className="p-2 box-zoom-out">
                          <img
                            src={item?.imgData.link[0]}
                            className="card-img-top"
                            alt="..."
                          />
                          {checkProductSale(
                            item?.sale,
                            item?.sale?.status,
                            item?.sale?.startDay,
                            item?.sale?.endDay
                          ) == false ? (
                            <></>
                          ) : (
                            <>
                              <span className="sale px-2">
                                Giảm giá:{" "}
                                {numeral(item?.sale.valueSale).format("0,0")}đ
                              </span>
                            </>
                          )}
                        </div>
                      </Link>

                      <div className="card-body">
                        <h5 className="card-title" style={{ fontSize: "100%" }}>
                          <Link
                            to={`/product/productdetail/${item?.slugProduct}`}
                          >
                            <span
                              className="card-text-home"
                              style={{ color: "#000" }}
                            >
                              {item?.nameProduct}
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
                                  {item?.option?.ramName ? "Ram" : ""}
                                  {item?.option?.ramName.nameValue}
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
                                  {item?.option?.hdriveName.nameValue}
                                </div>
                              </div>
                            </div>
                          </div>
                        </h5>
                        <div className="card-text">
                          <div className="d-flex justify-content-lg-between">
                            {checkProductSale(
                              item?.sale,
                              item?.sale?.status,
                              item?.sale?.startDay,
                              item?.sale?.endDay
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
                                  {numeral(item?.price).format("0,0")}
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
                                    parseInt(item?.price) -
                                      item?.sale?.valueSale
                                  ).format("0,0")}
                                  <u>đ</u>
                                </span>
                                <span
                                  style={{
                                    "text-decoration-line": "line-through",
                                  }}
                                >
                                  {numeral(item?.price).format("0,0")}
                                  <u>đ</u>
                                </span>
                              </>
                            )}
                          </div>
                          <br />
                          {item?.option?.screenName ? "Màn hình: " : ""}
                          {item?.option?.screenName.nameValue}
                          <br />
                          {item?.option?.cpuName ? "CPU: " : ""}
                          {item?.option?.cpuName.nameValue}
                          {item?.option?.cpuName ? "," : ""}
                          {item?.option?.cpuGenName.nameValue}
                          <br />
                          <span className="card-text">
                            {item?.option?.cardName ? "Card:" : ""}

                            {item?.option?.cardName.nameValue}
                          </span>
                        </div>
                        {item?.store?.number == 0 ? (
                          <>
                            <h4 className="text-center btn-light">Đã hết</h4>
                          </>
                        ) : (
                          <>
                            <button
                              className="btn btn-success w-100"
                              onClick={() =>
                                handleAddCart(
                                  item.id,
                                  item.nameProduct,
                                  item?.imgData.link[0],
                                  checkProductSale(
                                    item?.sale,
                                    item?.sale?.status,
                                    item?.sale?.startDay,
                                    item?.sale?.endDay
                                  ) == false
                                    ? item.price
                                    : parseInt(
                                        item.price - item.sale.valueSale
                                      ),
                                  item.proId,
                                  item.store.number
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

export default ProductCategory;
