import React, { useEffect, useState } from "react";
import orderService from "../../services/order.service";
import userService from "../../services/user.service";
import orderDetailService from "../../services/orderDetail.service";
import { Helmet } from "react-helmet";

import { useSelector } from "react-redux";

const AdminHome = () => {
  const userRD = useSelector((state) => state.auth.login?.currentUser);
  let numeral = require("numeral");
  const [order, setOrder] = useState([]);
  const [user, setUser] = useState([]);
  let numberOrder = 0;
  let numberProduct = 0;
  let totalRevenue = 0;
  let numberAdmin = 0;
  let numberEmployee = 0;
  let numberCustomer = 0;
  useEffect(() => {
    init();
  }, []);
  const init = () => {
    orderDetailService.getAll("ALL").then((res) => {
      setOrder(res.data.orderdetail);
    });
    userService.getAll("ALL", userRD).then((response) => {
      setUser(response.data.users);
    });
  };
  for (let element of order) {
    numberProduct += element.quantity;
    totalRevenue += element.quantity * element.price;
  }
  for (let element of user) {
    if (element.roles == "T1") {
      numberAdmin += 1;
    }
    if (element.roles == "T2") {
      numberEmployee += 1;
    }
    if (element.roles == "T3") {
      numberCustomer += 1;
    }
  }
  numberOrder = order.reduce(function (orderIdList, order) {
    if (orderIdList.indexOf(order.orderId) === -1) {
      orderIdList.push(order.orderId);
    }
    return orderIdList;
  }, []);
  console.log("Number", numberProduct);
  console.log("Total", totalRevenue);
  console.log("NumberOrder", numberOrder.length);
  console.log("User", user.length);
  return (
    <>
      <div>
        <Helmet>
          <title>Admin</title>
          <meta name="description" content="Helmet application" />
        </Helmet>
      </div>
      <div className="col-lg-12">
        <div className="row">
          <div className="col-xxl-4 col-md-6">
            <div className="card info-card sales-card">
              <div className="card-body">
                <h5 className="card-title">Đơn hàng</h5>

                <div className="d-flex align-items-center">
                  <div className="card-icon rounded-circle d-flex align-items-center justify-content-center">
                    <i className="bi bi-cart"></i>
                  </div>
                  <div className="ps-3">
                    <h6>Tổng: {numberOrder.length}</h6>
                    <span className="text-success small pt-1 fw-bold">
                      Sản phẩm đã bán: {numberProduct}
                    </span>{" "}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-xxl-4 col-md-6">
            <div className="card info-card revenue-card">
              <div className="card-body">
                <h5 className="card-title">Doanh thu</h5>
                <div className="d-flex align-items-center">
                  <div className="card-icon rounded-circle d-flex align-items-center justify-content-center">
                    <i className="bi bi-currency-dollar"></i>
                  </div>
                  <div className="ps-3">
                    <h6>Tổng: {numeral(totalRevenue).format("0,0")} VND</h6>
                    <span className="text-success small pt-1 fw-bold">
                      Xinh đẹp tuyệt vời ^ ^
                    </span>{" "}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-xxl-4 col-xl-12">
            <div className="card info-card customers-card">
              <div className="card-body">
                <h5 className="card-title">Tài khoản</h5>
                <div className="d-flex align-items-center">
                  <div className="card-icon rounded-circle d-flex align-items-center justify-content-center">
                    <i className="bi bi-people"></i>
                  </div>
                  <div className="ps-3 w-100">
                    <h6>Tổng: {user.length}</h6>
                    <div className="w-100 d-flex justify-content-start">
                      <div className="text-success small pt-1 fw-bold px-2">
                        {numberAdmin} Admin
                      </div>
                      <div className="text-success small pt-1 fw-bold px-2">
                        {numberEmployee} Nhân viên
                      </div>
                      <div className="text-success small pt-1 fw-bold px-2">
                        {numberCustomer} Khách hàng
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminHome;
