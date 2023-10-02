import React, { useEffect, useState } from "react";
import { TiShoppingCart } from "react-icons/ti";
import productService from "../../../services/product.service";
import { useDispatch } from "react-redux";
import { addToCart } from "../../../redux/slice/cartSlice";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
//
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
//
import "./productsuggested.scss";
const ProductSuggested = () => {
  //Set time
  const date = new Date();
  const formatDate = { year: "numeric", month: "2-digit", day: "2-digit" };
  const dateNow = date.toLocaleDateString("vi-VN", formatDate);
  //
  const userRD = useSelector((state) => state.auth.login?.currentUser);

  const [productCount, setProductCount] = useState(10);
  var numeral = require("numeral");
  const dispatch = useDispatch();

  const [product, setProduct] = useState([]);
  useEffect(() => {
    init();
  }, []);
  const init = () => {
    productService
      .getAll("ALL")
      .then((reponse) => {
        setProduct(reponse.data.product);
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
  const handleShowMoreClick = () => {
    setProductCount(productCount + 10);
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
      <div className="product-type">
        <h3>Gợi ý hôm nay</h3>
        <div className="px-2 row row-cols-3 row-cols-lg-5 g-2 g-lg-3">
          {product.slice(0, productCount).map((child) => {
            return (
              <div className="col">
                <div className="p-0">
                  <div className="card">
                    <Link to={`/product/productdetail/${child?.slugProduct}`}>
                      <div className="p-2 box-zoom-out">
                        <img
                          src={child?.imgData.link[0]}
                          className="card-img-top"
                          alt="..."
                        />
                        {checkProductSale(
                          child?.sale,
                          child?.sale?.status,
                          child?.sale?.startDay,
                          child?.sale?.endDay
                        ) == false ? (
                          <></>
                        ) : (
                          <>
                            <span className="sale px-2">
                              Giảm giá:{" "}
                              {numeral(child?.sale.valueSale).format("0,0")}đ
                            </span>
                          </>
                        )}
                      </div>
                    </Link>
                    <div className="card-body">
                      <h5 className="card-title" style={{ fontSize: "100%" }}>
                        <Link
                          style={{ color: "#000" }}
                          to={`product/productdetail/${child.slugProduct}`}
                        >
                          <span
                            className="card-text-home"
                            style={{ color: "#000" }}
                          >
                            {child.nameProduct}
                          </span>
                        </Link>
                        <div
                          className="mt-1 container overflow-hidden"
                          style={{ height: 32 }}
                        >
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
                                {child.option ? (
                                  <>Ram {child.option?.ramName?.nameValue}</>
                                ) : (
                                  <></>
                                )}
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
                                {child.option?.hdriveName?.nameValue}
                              </div>
                            </div>
                          </div>
                        </div>
                      </h5>
                      <p className="card-text">
                        <span>
                          {checkProductSale(
                            child?.sale,
                            child?.sale?.status,
                            child?.sale?.startDay,
                            child?.sale?.endDay
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
                                {numeral(child?.price).format("0,0")}
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
                                  parseInt(child?.price) -
                                    child?.sale?.valueSale
                                ).format("0,0")}
                                <u>đ</u>
                              </span>
                              <span
                                style={{
                                  "text-decoration-line": "line-through",
                                  fontSize: "85%",
                                }}
                              >
                                {numeral(child?.price).format("0,0")}
                                <u>đ</u>
                              </span>
                            </>
                          )}
                        </span>
                        <br />

                        {child.option ? (
                          <>
                            <span>Màng hình: </span>
                            {child.option?.screenName?.nameValue}
                            <br />
                            <span>CPU: </span>
                            {child.option?.cpuName?.nameValue},
                            {child.option?.cpuGenName?.nameValue}
                            <br />
                            <span className="text-graphics-card">
                              Card: {child.option?.cardName?.nameValue}
                            </span>
                          </>
                        ) : (
                          <></>
                        )}
                      </p>
                      <button
                        className="btn btn-success w-100"
                        onClick={() =>
                          handleAddCart(
                            child.id,
                            child.nameProduct,
                            child.imgData?.link[0],
                            checkProductSale(
                              child?.sale,
                              child?.sale?.status,
                              child?.sale?.startDay,
                              child?.sale?.endDay
                            ) == false
                              ? child.price
                              : parseInt(child.price - child.sale.valueSale),
                            child.proId,
                            child.store.number
                          )
                        }
                      >
                        <TiShoppingCart size={30} />
                        MUA NGAY
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <div className="text-center">
          {productCount < product.length && (
            <button
              className="border rounded bg-white fs-5 w-50"
              onClick={handleShowMoreClick}
            >
              Xem thêm
            </button>
          )}
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

export default ProductSuggested;
