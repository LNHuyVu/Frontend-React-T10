import React, { useEffect } from "react";
import "./productdetail.scss";
import { useParams } from "react-router-dom";
import productService from "../../../services/product.service";
import { useState } from "react";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";
import "react-quill/dist/quill.snow.css";
import { Link } from "react-router-dom";
import productValueService from "../../../services/productValue.service";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../../../redux/slice/cartSlice";
import Comment from "../facebook/Comment";
import Like from "../facebook/Like";
import Share from "../facebook/Share";
import { TiShoppingCart } from "react-icons/ti";
//
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
//
import ShowMoreText from "react-show-more-text";
import { Helmet } from "react-helmet";

const ProductDetail = () => {
  //Set time
  const date = new Date();
  const formatDate = { year: "numeric", month: "2-digit", day: "2-digit" };
  const dateNow = date.toLocaleDateString("vi-VN", formatDate);
  //
  const userRD = useSelector((state) => state.auth.login?.currentUser);
  const dispatch = useDispatch();

  //
  const param = useParams();
  let slug = param.slug;
  var numeral = require("numeral");
  const [product, setProduct] = useState([]);
  const [productSimilar, setProductSimilar] = useState([]);
  const [img, setImg] = useState([]);
  const [option, setOption] = useState([]);
  useEffect(() => {
    init();
  }, [slug]);
  const init = () => {
    productService
      .getProductId(slug)
      .then((reponse) => {
        setImg(reponse.data.product.imgData.link);
        setProduct(reponse.data.product);
        setOption(reponse.data.product.option);
        if (reponse.data.product.type == "LT") {
          productValueService
            .getProductValueCustomer(
              reponse.data.product.option.demandName.slug
            )
            .then((reponse) => {
              setProductSimilar(reponse.data.productvalue);
            })
            .catch((error) => {
              console.log(error);
            });
        }
        if (reponse.data.product.type == "PK") {
          productService
            .getProductCat(reponse.data.product.catId)
            .then((reponse) => {
              setProductSimilar(reponse.data.product);
            })
            .catch((error) => {
              console.log(error);
            });
        }
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
  //Add Cart
  const handleAddCart = (id, title, image, price, proId, number) => {
    if (!userRD) {
      notifyWarning();
    } else {
      let userid = userRD.user.id;
      dispatch(addToCart({ id, title, image, price, proId, userid, number }));
      notifySuccess();
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
    <div className="container-fluid">
      <div>
        <Helmet>
          <title>{product.nameProduct}</title>
          <meta name="description" content="Helmet application" />
        </Helmet>
      </div>
      <div className="row p-5 product-detail">
        <div className="col-md-6 product-img">
          <h4 className="text-center">{product.nameProduct}</h4>

          <Carousel className="text-center">
            {img.map((item) => {
              return (
                <div className="d-flex justify-content-center">
                  <img src={item} />
                </div>
              );
            })}
          </Carousel>
          <span className="fw-bold">
            Hư gì đổi nấy 12 tháng tại 3125 siêu thị toàn quốc (miễn phí tháng
            đầu)
          </span>
          <br />
          <span className="fw-bold">
            Bảo hành chính hãng laptop 1 năm tại các trung tâm bảo hành hãng
          </span>
          <br />
          <span className="fw-bold">
            Bộ sản phẩm gồm: Sách hướng dẫn, Thùng máy, Cáp ( Type C )
          </span>
          {/* Plugin FACEBOOK */}
          <div>
            <Share link={product.slugProduct} />
            <Comment link={product.slugProduct} />
          </div>
        </div>
        {/*  */}
        <div className="col-md-6 product-data">
          <div className="text-center">
            <Like />
            {checkProductSale(
              product.sale,
              product?.sale?.status,
              product?.sale?.startDay,
              product?.sale?.endDay
            ) == false ? (
              <h3>Giá: {numeral(product.price).format("0,0")}đ</h3>
            ) : (
              <div className="">
                <h3>
                  Giá:{" "}
                  {numeral(
                    parseInt(product.price - product.sale.valueSale)
                  ).format("0,0")}
                  đ
                </h3>
                <h5>
                  <del>{numeral(product.price).format("0,0")}đ</del>
                </h5>
              </div>
            )}
          </div>
          <div className="text-center div-price">Mua online giảm giá sốc</div>
          {checkProductSale(
            product.sale,
            product?.sale?.status,
            product?.sale?.startDay,
            product?.sale?.endDay
          ) == false ? (
            <></>
          ) : (
            <>
              <div className="text-center div-price">
                Chỉ còn:{" "}
                {numeral(
                  parseInt(product.price - product.sale.valueSale)
                ).format("0,0")}
                đ
              </div>
            </>
          )}

          <span>
            Giá khuyến mãi dự kiến áp dụng đến 23:00 15/6, không áp dụng trả góp
            lãi suất đặt biệt(0%, 0.5%, 1%,)
          </span>
          {product?.store?.number == 0 ? (
            <>
              <h4 className="text-center buy-now">Tạm hết hàng</h4>
            </>
          ) : (
            <>
              <button
                onClick={() =>
                  handleAddCart(
                    product.id,
                    product.nameProduct,
                    product?.imgData.link[0],
                    checkProductSale(
                      product.sale,
                      product?.sale?.status,
                      product?.sale?.startDay,
                      product?.sale?.endDay
                    ) == false
                      ? product.price
                      : parseInt(product.price - product.sale.valueSale),
                    product.proId,

                    product.store.number
                  )
                }
                className="buy-now w-100"
              >
                <h3>Mua ngay</h3>
              </button>
            </>
          )}

          <div className="product-info">
            <h4>Thông tin chi tiết</h4>
            <table class="table">
              <thead></thead>
              <tbody>
                {option ? (
                  <>
                    <tr style={{ background: "#DCDCDC" }}>
                      <td>CPU</td>
                      <td>
                        {option?.cpuName?.nameValue},{" "}
                        {option?.cpuGenName?.nameValue}
                      </td>
                    </tr>
                    <tr style={{ background: "#fff" }}>
                      <td>RAM</td>
                      <td>{option?.ramName?.nameValue}</td>
                    </tr>
                    <tr style={{ background: "#DCDCDC" }}>
                      <td>Ổ cứng</td>
                      <td>{option?.hdriveName?.nameValue}</td>
                    </tr>
                    <tr style={{ background: "#fff" }}>
                      <td>Màn hình</td>
                      <td>{option?.screenName?.nameValue}</td>
                    </tr>
                    <tr style={{ background: "#DCDCDC" }}>
                      <td>Card màn hình</td>
                      <td>{option?.cardName?.nameValue}</td>
                    </tr>
                    <tr style={{ background: "#fff" }}>
                      <td>Hệ điều hành</td>
                      <td>{option?.systemName?.nameValue}</td>
                    </tr>
                  </>
                ) : (
                  <>
                    <div className="detail">
                      <h3>Giới thiệu</h3>
                      <div
                        // className="text-center"
                        style={{ background: "#fff" }}
                        dangerouslySetInnerHTML={{ __html: product?.detail }}
                      ></div>
                    </div>
                  </>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {option ? (
        <>
          <div className="detail container">
            <h3>Giới thiệu</h3>
            <div>
              <ShowMoreText
                lines={5}
                more="Xem thêm"
                less="Thu gọn"
                anchorClass=""
                expanded={false}
              >
                <div
                  style={{ background: "#fff" }}
                  dangerouslySetInnerHTML={{ __html: product?.detail }}
                ></div>
              </ShowMoreText>
            </div>
          </div>
        </>
      ) : (
        <></>
      )}
      <div className="similar products">
        <h3>Có thể bạn quan tâm</h3>
        <div className="container-xxl">
          {product.type == "LT" ? (
            <>
              <div className="row row-cols-2 row-cols-lg-4 g-2 g-lg-3">
                {/* Get Product "LT" => Demand */}
                {productSimilar
                  .filter((item) => {
                    return (
                      item?.product?.id !== product?.id && item.product != null
                    );
                  })
                  .map((item) => {
                    return (
                      <div className="col">
                        <div className="card">
                          <Link
                            to={`/product/productdetail/${item.product?.slugProduct}`}
                          >
                            <div className="p-2 box-zoom-out">
                              <img
                                src={item.product?.imgData.link[0]}
                                className="card-img-top"
                                alt="..."
                              />
                              {item.product?.sale == null ? (
                                <></>
                              ) : (
                                <>
                                  <span className="sale px-2">
                                    Giảm giá:{" "}
                                    {numeral(
                                      item.product?.sale.valueSale
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
                                to={`/product/productdetail/${item.product?.slugProduct}`}
                              >
                                <span
                                  className="card-text-home"
                                  style={{ color: "#000" }}
                                >
                                  {item.product?.nameProduct}
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
                                      {item.product?.option.ramName.nameValue}
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
                                        item.product?.option.hdriveName
                                          .nameValue
                                      }
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </h5>
                            <div className="card-text">
                              <div className="d-flex justify-content-lg-between">
                                {item?.product?.sale == null ? (
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
                                      {numeral(item?.product?.price).format(
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
                                        parseInt(item?.product.price) -
                                          item?.product?.sale?.valueSale
                                      ).format("0,0")}
                                      <u>đ</u>
                                    </span>
                                    <span
                                      style={{
                                        "text-decoration-line": "line-through",
                                      }}
                                    >
                                      {numeral(item?.product.price).format(
                                        "0,0"
                                      )}
                                      <u>đ</u>
                                    </span>
                                  </>
                                )}
                              </div>
                              <br />
                              <span>Màng hình: </span>
                              {item.product?.option.screenName.nameValue}
                              <br />
                              <span>CPU: </span>
                              {item.product?.option.cpuName.nameValue},
                              {item.product?.option.cpuGenName.nameValue}
                              <br />
                              <span className="">
                                Card: {item.product?.option.cardName.nameValue}
                              </span>
                            </div>
                            {item.product?.store?.number == 0 ? (
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
                                      item.product.id,
                                      item.product.nameProduct,
                                      item.product.imgData?.link[0],
                                      item.product.sale == null
                                        ? item.product.price
                                        : parseInt(
                                            item.product.price -
                                              item.product.sale.valueSale
                                          ),
                                      item.product.proId,

                                      item.product.store.number
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
            </>
          ) : (
            <>
              <div className="row row-cols-2 row-cols-lg-4 g-2 g-lg-3">
                {/* Get Product "PK" => Category */}
                {productSimilar
                  .filter((item) => {
                    return item?.id !== product.id;
                  })
                  .map((item) => {
                    return (
                      <div className="col">
                        <div className="card">
                          <Link
                            to={`/product/productdetail/${item?.slugProduct}`}
                          >
                            <div className="p-2 box-zoom-out">
                              <img
                                src={item?.imgData.link[0]}
                                className="card-img-top"
                                alt="..."
                              />
                              {item?.sale == null || item?.sale.status == 0 ? (
                                <></>
                              ) : (
                                <>
                                  <span className="sale px-2">
                                    Giảm giá:{" "}
                                    {numeral(item?.sale.valueSale).format(
                                      "0,0"
                                    )}
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
                                {item?.sale == null ||
                                item?.sale.status == 0 ? (
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
                              {item?.option?.screenName ? "Màng hình: " : ""}
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
                                      item.id,
                                      item.nameProduct,
                                      item?.imgData.link[0],
                                      item?.sale == null
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
            </>
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

export default ProductDetail;
