import React, { useEffect, useState } from "react";
import productValueService from "../../../services/productValue.service";
import { TiShoppingCart } from "react-icons/ti";
import { useDispatch } from "react-redux";
import { addToCart } from "../../../redux/slice/cartSlice";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
//
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const ProductDemand = () => {
  //Set time
  const date = new Date();
  const formatDate = { year: "numeric", month: "2-digit", day: "2-digit" };
  const dateNow = date.toLocaleDateString("vi-VN", formatDate);
  //
  const userRD = useSelector((state) => state.auth.login?.currentUser);
  var numeral = require("numeral");
  const dispatch = useDispatch();
  const [demandProduct, setDemandProduct] = useState([]);
  useEffect(() => {
    init();
  }, []);
  const init = () => {
    productValueService
      .getDemand("demand")
      .then((reponse) => {
        setDemandProduct(reponse.data.productvalue);
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
  //Handle Add Cart
  const handleAddCart = (id, title, image, price, proId, number) => {
    if (!userRD) {
      notifyWarning();
    } else {
      notifySuccess();
      let userid = userRD.user.id;
      dispatch(addToCart({ id, title, image, price, proId, userid, number }));
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
    <div>
      {demandProduct.map((item) => {
        return (
          <>
            <div className="product-by-category">
              <div className="product-type">
                <div className="title-demand d-flex justify-content-between mb-1">
                  <h3 className="fw-bold">
                    {item[0].product.option.demandName.nameValue}
                  </h3>
                  <Link
                    className="link fs-5"
                    to={`./demand/${item[0].product.option.demandName.slug}`}
                  >
                    Xem thêm
                  </Link>
                </div>
                <div className="row row-cols-2 row-cols-lg-5 g-2 g-lg-3">
                  {item?.map((child) => {
                    return (
                      <>
                        <div className="col">
                          <div className="p-0">
                            <div className="card">
                              <Link
                                to={`/product/productdetail/${child?.product.slugProduct}`}
                              >
                                <div className="p-2 box-zoom-out">
                                  <img
                                    src={child?.product.imgData.link[0]}
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
                                          child?.product.sale.valueSale
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
                                    style={{ color: "#000" }}
                                    to={`product/productdetail/${child.product.slugProduct}`}
                                  >
                                    <span
                                      className="card-text-home"
                                      style={{ color: "#000" }}
                                    >
                                      {child.product.nameProduct}
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
                                          {
                                            child.product.option.ramName
                                              ?.nameValue
                                          }
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
                                          {
                                            child.product.option.hdriveName
                                              ?.nameValue
                                          }
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </h5>
                                <p className="card-text">
                                  <span>
                                    {checkProductSale(
                                      child?.product?.sale,
                                      child?.product?.sale?.status,
                                      child?.product?.sale?.startDay,
                                      child?.product?.sale?.endDay
                                    ) == false ? (
                                      <>
                                        <span
                                          className="px-2"
                                          style={{
                                            fontWeight: "bold",
                                            color: "white",
                                            background: "#005eff",
                                            borderRadius: 10,
                                          }}
                                        >
                                          {numeral(child?.product.price).format(
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
                                            color: "white",
                                            background: "#005eff",
                                            borderRadius: 10,
                                          }}
                                        >
                                          {numeral(
                                            parseInt(child?.product.price) -
                                              child?.product.sale?.valueSale
                                          ).format("0,0")}
                                          <u>đ</u>
                                        </span>
                                        <span
                                          style={{
                                            "text-decoration-line":
                                              "line-through",
                                            fontSize: "90%",
                                          }}
                                        >
                                          {numeral(child?.product.price).format(
                                            "0,0"
                                          )}
                                          <u>đ</u>
                                        </span>
                                      </>
                                    )}
                                  </span>
                                  <br />
                                  <span>Màng hình: </span>
                                  {child.product.option.screenName?.nameValue}
                                  <br />
                                  <span>CPU: </span>
                                  {child.product.option.cpuName?.nameValue},
                                  {child.product.option.cpuGenName?.nameValue}
                                  <br />
                                  <span className="text-graphics-card">
                                    Card:{" "}
                                    {child.product.option.cardName?.nameValue}
                                  </span>
                                </p>
                                {child.product.store.number == 0 ? (
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
                                            child?.product?.sale,
                                            child?.product?.sale?.status,
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
                      </>
                    );
                  })}
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
          </>
        );
      })}
    </div>
  );
};

export default ProductDemand;
