import React, { useEffect, useState } from "react";
import "./search.scss";
import { useParams } from "react-router-dom";
import productService from "../../../services/product.service";
import { Link } from "react-router-dom";
import { TiShoppingCart } from "react-icons/ti";
import { addToCart } from "../../../redux/slice/cartSlice";
import { useDispatch, useSelector } from "react-redux";
import { Blocks } from "react-loader-spinner";
import { Helmet } from "react-helmet";

const Search = () => {
  //Set time
  const date = new Date();
  const formatDate = { year: "numeric", month: "2-digit", day: "2-digit" };
  const dateNow = date.toLocaleDateString("vi-VN", formatDate);
  //is Loading
  const [isLoading, setIsLoading] = useState(true);
  //
  const userRD = useSelector((state) => state.auth.login?.currentUser);
  const dispatch = useDispatch();
  var numeral = require("numeral");
  const param = useParams();
  let slug = param.slug;
  const [product, setProduct] = useState([]);
  useEffect(() => {
    init();
  }, [slug]);
  const init = () => {
    setIsLoading(true);
    productService
      .searchProduct(slug)
      .then((reponse) => {
        setProduct(reponse.data.product);
        setIsLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setIsLoading(false);
      });
  };
  const handleAddCart = (id, title, image, price) => {
    if (!userRD) {
      alert("vui lòng đăng nhập");
    } else {
      let userid = userRD.user.id;
      dispatch(addToCart({ id, title, image, price, userid }));
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
  return (
    <div className="search mt-2">
      <div>
        <Helmet>
          <title>Search {slug}</title>
          <meta name="description" content="Helmet application" />
        </Helmet>
      </div>
      <div className="container">
        <h3 style={{ fontFamily: '"Times New Roman", Times, serif' }}>
          Kết quả tìm kiếm cho từ khóa: "{slug}"
        </h3>
        {isLoading ? (
          <div className="text-center">
            <Blocks
              visible={true}
              height="200"
              width="200"
              ariaLabel="blocks-loading"
              wrapperStyle={{}}
              wrapperClass="blocks-wrapper"
            />
          </div>
        ) : (
          <>
            {product.length == 0 ? (
              <div className="text-center">
                <h3 className="text-center">Không tìm thấy sản phẩm phù hợp</h3>
                <img src="../image/search/giphy.gif" alt="" />
              </div>
            ) : (
              <>
                <div className="row row-cols-2 row-cols-lg-4 g-2 g-lg-3">
                  {product.map((item) => {
                    return (
                      <div className="col">
                        <div className="card">
                          <Link
                            to={`/product/productdetail/${item?.slugProduct}`}
                          >
                            <div className="p-2 box-zoom-out">
                              <img
                                style={{ maxHeight: 208 }}
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
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Search;
