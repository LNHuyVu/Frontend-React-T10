import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { FaCcAmazonPay } from "react-icons/fa";
import orderService from "../../../services/order.service";
import orderDetailService from "../../../services/orderDetail.service";
import { removeToCart } from "../../../redux/slice/cartSlice";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { TbConfetti } from "react-icons/tb";
import { FcApproval } from "react-icons/fc";
import emailService from "../../../services/email.service";
import productStoreService from "../../../services/productStore.service";
//
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
//
import { Helmet } from "react-helmet";

const Order = () => {
  const d = new Date();
  let code = d.getTime();
  const navigate = useNavigate();
  var numeral = require("numeral");
  const dispatch = useDispatch();
  const cartRD = useSelector((state) => state.cart?.cart);
  const userRD = useSelector((state) => state.auth.login?.currentUser);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [show, setShow] = useState(false);

  const handleClose = () => {
    setShow(false);
    dispatch(removeToCart());
    navigate("../");
  };
  const handleShow = () => {
    setShow(true);
  };
  useEffect(() => {
    if (!userRD) {
      navigate("/login");
    }
  }, []);
  let totalQuantity = 0;
  let totalPrice = 0;
  cartRD?.forEach((item) => {
    totalQuantity += item.quantity;
    totalPrice += item.price * item.quantity;
  });
  const validateSubmit = (order) => {
    let isValue = true;
    let message = "";
    let check = {};
    const value = {
      "Nhập tên người nhận": order.name,
      "Nhập địa chỉ": order.address,
      "Nhập số điện thoại": order.phone,
      "Nhập Email": order.email,
    };

    for (const item in value) {
      if (!value[item] || value[item] == "") {
        isValue = false;
        message = item;
        break;
      }
    }
    if (isValue == true) {
      if (validateEmail(order.email) != true) {
        isValue = false;
        message = "Email không hợp lệ";
        return (check = { isValue, message });
      }
      if (validatePhoneNumber(order.phone) != true) {
        isValue = false;
        message = "Số điện thoại không hợp lệ";
        return (check = { isValue, message });
      }
    }
    return (check = { isValue, message });
  };
  function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  }
  function validatePhoneNumber(phoneNumber) {
    if (phoneNumber.charAt(0) != 0) return false;
    if (isNaN(phoneNumber) || phoneNumber.length !== 10) {
      return false;
    }
    return true;
  }
  const submitOrder = async () => {
    const order = {
      name,
      email,
      phone,
      address,
      userId: userRD.user.id,
      codeOrder: d.getTime(),
      status: 0,
    };
    let validate = validateSubmit(order);
    if (validate.isValue == true) {
      await orderService
        .create(order)
        .then((reponse) => {
          for (const item of cartRD) {
            //ADD CART DETAIL
            const cart = {
              productId: item.id,
              orderId: reponse.data.order.id,
              price: item.price,
              quantity: item.quantity,
              amount: parseInt(item.quantity * item.price),
            };
            orderDetailService
              .create(cart)
              .then((reponse) => {})
              .catch((error) => {
                console.log(error);
              });
            //HANDLE NUMBER IN STORE
            const numberStore = {
              id: item.proId,
              number: item.quantity,
            };
            productStoreService
              .updateQuantity(numberStore)
              .then((reponse) => {})
              .catch((error) => {
                console.log(error);
              });
          }
          emailService
            .sendEmail({ order: order, cart: cartRD, total: totalPrice })
            .then((reponse) => {})
            .catch((error) => {
              console.log(error);
            });
          handleShow();
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      notifyError(validate.message);
    }
  };
  const notifyError = (name) => {
    toast.error(name, {
      position: "top-center",
      autoClose: 300,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  };
  return (
    <div className="container-xxl">
        <div>
        <Helmet>
          <title>Thanh toán</title>
          <meta name="description" content="Helmet application" />
        </Helmet>
      </div>
      <div className="row">
        <div className="col-md-6">
          <h3 className="text-center ">Thông tin người nhận</h3>
          <div>
            <div class="mb-3">
              <label for="" class="form-label">
                Tên người nhận
              </label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                type="text"
                class="form-control"
                aria-describedby="emailHelp"
              />
            </div>
            <div class="mb-3">
              <label for="" class="form-label">
                Địa chỉ
              </label>
              <input
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                type="text"
                class="form-control"
                aria-describedby="emailHelp"
              />
            </div>
            <div class="mb-3">
              <label for="" class="form-label">
                Số điện thoại
              </label>
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                type="text"
                class="form-control"
                aria-describedby="emailHelp"
              />
            </div>
            <div class="mb-3">
              <label for="" class="form-label">
                Email
              </label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                class="form-control"
                aria-describedby="emailHelp"
              />
            </div>
            <div class="mb-3">
              <button
                onClick={() => submitOrder()}
                className="w-100 btn"
                style={{ background: "orange" }}
              >
                Đặt hàng
              </button>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <h3 className="text-center">Thông tin sản phẩm</h3>
          <div>
            <h3>Tổng: {numeral(totalPrice).format("0,0")} đ</h3>
            <h3>Số lượng: {totalQuantity}</h3>
            <h3>
              Thanh toán:{" "}
              <span
                className="border border-success rounded-5 px-1 fs-5"
                style={{ background: "#98FB98" }}
              >
                Thanh toán khi nhận hàng <FaCcAmazonPay color="green" />
              </span>{" "}
            </h3>
          </div>
          <table class="table">
            <thead>
              <tr>
                <th scope="col">Hình ảnh</th>
                <th scope="col">Tên sản phẩm</th>
                <th scope="col">Số lượng</th>
              </tr>
            </thead>
            <tbody>
              {/* item.product.nameProduct */}
              {cartRD
                ?.filter((item) => {
                  return item.userid === userRD?.user.id;
                })
                .map((item) => (
                  <tr style={{ justifyItems: "center" }}>
                    <td style={{ maxWidth: 100 }}>
                      <img className="w-100" src={item.image} alt="" />
                    </td>
                    <td style={{ maxWidth: 200 }}>{item.title}</td>
                    <td style={{ maxWidth: 130 }}>
                      <div className="d-flex justify-content-center">
                        <input
                          readOnly
                          style={{ maxWidth: 100 }}
                          type="text"
                          value={item.quantity}
                          className="mx-1 form-control text-center"
                        />
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Thông báo</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="text-center">
            <h4>Chúc mừng bạn đã đặt hàng thành công</h4>
            <div>
              <FcApproval size={100} />
            </div>
            <div>
              <TbConfetti size={50} color="orange" />
              <TbConfetti size={50} color="orange" />
              <TbConfetti size={50} color="orange" />
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="info" onClick={handleClose}>
            Đóng
          </Button>
        </Modal.Footer>
      </Modal>
      <ToastContainer
        position="top-center"
        autoClose={300}
        limit={1}
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

export default Order;
