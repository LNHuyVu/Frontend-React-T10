import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import productSaleService from "../../../services/productSale.service";
import { NumericFormat } from "react-number-format";
import { Helmet } from "react-helmet";

const EditProductSale = () => {
  let numeral = require("numeral");
  const param = useParams();
  let id = param.id;
  const navigate = useNavigate();
  const [endDay, setEndDay] = useState("");
  const [startDay, setStartDay] = useState("");
  const [valueSale, setValueSale] = useState("");
  const [status, setStatus] = useState("");
  const [product, setProduct] = useState([]);
  useEffect(() => {
    init();
  }, []);
  const init = () => {
    productSaleService
      .getAll(id)
      .then((response) => {
        setProduct(response.data.productsale.productSale);
        setEndDay(response.data.productsale.endDay);
        setStartDay(response.data.productsale.startDay);
        setValueSale(response.data.productsale.valueSale);
        setStatus(response.data.productsale.status);
        console.log(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const handleSale = () => {
    const sale = {
      id,
      valueSale: parseInt(valueSale.replace(/,/g, "")),
      endDay,
      startDay,
      status: 1,
    };
    if (checkValue()) {
      productSaleService
        .update(sale)
        .then((reponse) => {
          navigate("../product");
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };
  const checkValue = () => {
    let isValue = true;
    const check = {
      "Ngày bắt đầu khuyến mãi": startDay,
      "Ngày kết thúc khuyến mãi": endDay,
      "Giá trị khuyến mãi": valueSale,
    };
    for (const item in check) {
      if (!check[item] || check[item] == "") {
        alert("Vui lòng nhập: " + item);
        isValue = false;
        break;
      }
    }
    if (endDay < startDay) {
      alert("Thời gian khuyến mãi không hợp lệ");
      isValue = false;
    }
    if (valueSale < 100000) {
      alert("Giá trị khuyến mãi phải lớn hơn 100,000VND");
      isValue = false;
    }
    return isValue;
  };
  return (
    <div>
      <div>
        <Helmet>
          <title>Chỉnh sửa thông tin khuyến mãi</title>
          <meta name="description" content="Helmet application" />
        </Helmet>
      </div>
      <h3 className="text-center">Khuyến mãi</h3>
      <div className="row">
        <div className="card mb-3" style={{ maxHeight: 300 }}>
          <div className="row g-0">
            <div className="col-md-3">
              <img
                src={product.imgData?.link[0]}
                className="img-fluid rounded-start w-100"
                alt="..."
              />
            </div>

            <div className="col-md-9">
              <div className="card-body">
                <h5 className="card-title">{product.nameProduct}</h5>
                <h6 className="fw-bolder">
                  Giá hiện tại: {numeral(product.price).format("0,0")}đ
                </h6>
                {product.option == null ? (
                  <></>
                ) : (
                  <div className="d-flex justify-content-evenly">
                    <ul className="list-group list-group-flush w-50">
                      <li className="list-group-item">
                        CPU: {product.option?.cpuName?.nameValue}{" "}
                        {product.option?.genName?.nameValue}
                      </li>
                      <li className="list-group-item">
                        RAM: {product.option?.ramName?.nameValue}
                      </li>
                      <li className="list-group-item">
                        Màn hình: {product.option?.screenName?.nameValue}
                      </li>
                    </ul>
                    <ul className="list-group list-group-flush w-50">
                      <li className="list-group-item">
                        Ổ cứng: {product.option?.hdriveName?.nameValue}
                      </li>
                      <li className="list-group-item">
                        Hệ thống: {product.option?.systemName?.nameValue}
                      </li>
                      <li className="list-group-item">
                        Card: {product.option?.cardName?.nameValue}
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <label for="startDay" className="form-label">
            Ngày bắt đầu
          </label>
          <input
            id="startDay"
            type="date"
            className="form-control"
            placeholder="Vui lòng chọn ngày"
            value={startDay}
            onChange={(e) => setStartDay(e.target.value)}
          />
        </div>
        <div className="col-md-6">
          <label for="endDay" className="form-label">
            Ngày kết thúc
          </label>
          <input
            id="endDay"
            type="date"
            className="form-control"
            placeholder="Vui lòng chọn ngày"
            value={endDay}
            onChange={(e) => setEndDay(e.target.value)}
          />
        </div>
        <div className="col-md-12">
          <label for="valueSale" className="form-label">
            Giảm giá
          </label>
          <NumericFormat
            className="form-control"
            thousandSeparator={true}
            value={valueSale}
            onChange={(e) => setValueSale(e.target.value)}
          />
          <div className="form-text">Vui lòng nhập số tiền cụ thể( vnd)</div>
        </div>
        <button
          onClick={() => handleSale()}
          className="btn btn-success text-center w-100"
        >
          Apply
        </button>
      </div>
    </div>
  );
};

export default EditProductSale;
