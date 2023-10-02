import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Input, Table } from "antd";
import { IoIosEye } from "react-icons/io";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Col from "react-bootstrap/Col";
import Nav from "react-bootstrap/Nav";
import Row from "react-bootstrap/Row";
import Tab from "react-bootstrap/Tab";
import userService from "../../../services/user.service";
//
import { ToastContainer, toast } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";
import { Helmet } from "react-helmet";

//
const InfoUser = () => {
  const userRD = useSelector((state) => state.auth.login?.currentUser);
  const [user, setUser] = useState([]);
  //Order
  let numeral = require("numeral");
  let total_payment = 0;
  const [order, setOrder] = useState([]);
  const [orderId, setOrderId] = useState([]);
  const [search, setSearch] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [gender, setGender] = useState("");
  const [passwordNew, setPasswordNew] = useState("");
  const [password, setPassword] = useState("");
  const arrOrder = [
    { key: 0, name: "Đang xử lí", bg: "transparent" },
    { key: 1, name: "Đã xác nhận", bg: "transparent" },
    { key: 2, name: "Đang giao hàng", bg: "transparent" },
    { key: 3, name: "Hoàn thành", bg: "green" },
  ];
  const [show, setShow] = useState(false);
  const [contentModal, setContentModal] = useState([]);
  //
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  //
  useEffect(() => {
    init();
  }, []);
  const init = () => {
    userService
      .getAll(userRD.user.id, userRD)
      .then((response) => {
        setName(response.data.users.name);
        setPhone(response.data.users.phone);
        setAddress(response.data.users.address);
        setGender(response.data.users.gender);
        setUser(response.data.users);
        setOrder(response.data.users.cart);
        console.log("User", response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  //Order Handle
  const showOrderDetail = (element, content) => {
    total_payment = 0;
    setContentModal(content);
    setOrderId(element);
    handleShow();
  };
  //
  const columns = [
    {
      title: "Tên",
      dataIndex: "name",
      filteredValue: [search],
      onFilter: (value, record) => {
        return (
          String(record.name).toLowerCase().includes(value.toLowerCase()) ||
          String(record.codeOrder).toLowerCase().includes(value.toLowerCase())
        );
      },
    },
    {
      title: "Email",
      dataIndex: "email",
    },
    {
      title: "Mã đơn hàng",
      dataIndex: "codeOrder",
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
    },
    {
      title: "Trạng thái",
      dataIndex: "statusOrder",
    },
    {
      title: "Chức năng",
      dataIndex: "action",
    },
  ];
  for (const element of order) {
    element.statusOrder = (
      <div>
        {arrOrder
          .filter((item) => {
            return item.key == element.status;
          })
          .map((item) => {
            return (
              <span
                style={{ background: item.bg }}
                className="py-1 px-3 rounded-pill shadow-sm p-3 mb-5 rounded"
              >
                {item.name}
              </span>
            );
          })}
      </div>
    );
    element.action = (
      <div class="d-grid gap-2 d-md-block">
        <button
          onClick={() =>
            showOrderDetail(
              element,
              element.orderDetail,
              element.id,
              element.status
            )
          }
          class="btn m-1 text-center border border-primary"
          type="button"
        >
          Xem
          <IoIosEye size={20} color="blue" />
        </button>
      </div>
    );
  }

  //Check Password
  const checkPassword = async () => {
    let value;
    let userEmail = user.email;
    let account = {
      email: userEmail,
      password,
    };
    await userService
      .changPassword(account, userRD)
      .then((res) => {
        value = res.data;
      })
      .catch((error) => {
        console.log(error);
      });
    return value;
  };
  //Update info user
  const updateInfoUser = async (e) => {
    e.preventDefault();
    let id = user.id;
    let checkPass = await checkPassword();
    if (checkPass.errCode == 0) {
      if (passwordNew == "") {
        let update = {
          id,
          name,
          address,
          gender,
          phone,
        };
        let validate = CheckValidate(update);
        if (validate.isValue == false) {
          notifyError(validate.message);
        } else {
          userService
            .update(update, userRD)
            .then((res) => {
              console.log(res.data);
              notifySuccess("Thành công");
              init();
              setPassword("");
              setPasswordNew("");
            })
            .catch((error) => {
              console.log(error);
            });
        }
      } else {
        let update = {
          id,
          name,
          address,
          gender,
          phone,
          password: passwordNew,
        };
        let validate = CheckValidate(update);
        if (validate.isValue == false) {
          notifyError(validate.message);
        } else {
          userService
            .update(update, userRD)
            .then((res) => {
              console.log(res.data);
              notifySuccess("Thành công");
              init();
              setPassword("");
              setPasswordNew("");
            })
            .catch((error) => {
              console.log(error);
            });
        }
      }
    } else {
      notifyError(checkPass.message);
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
  const notifySuccess = (name) => {
    toast.success(name, {
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
  // Check Validate Form
  const CheckValidate = (data) => {
    let isValue = true;
    let message = "";
    let checkUser = {};
    const check = {
      "Nhập tên người dùng": data.name,
      "Nhập địa chỉ": data.address,
      "Nhập số điện thoại": data.phone,
    };
    for (const item in check) {
      if (!check[item] || check[item] == "") {
        isValue = false;
        message = item;
        break;
      }
    }
    if (isValue == true) {
      if (validatePhoneNumber(data.phone) != true) {
        isValue = false;
        message = "Số điện thoại không hợp lệ";
        return (checkUser = { isValue, message });
      }
      if (data.password) {
        if (validatePassword(data.password) != true) {
          isValue = false;
          message = "Mật khẩu 5 kí tự trở lên";
          return (checkUser = { isValue, message });
        }
      }
    }
    return (checkUser = { isValue, message });
  };
  //Validate
  function validatePhoneNumber(phoneNumber) {
    if (phoneNumber.charAt(0) != 0) return false;
    if (isNaN(phoneNumber) || phoneNumber.length !== 10) {
      return false;
    }
    return true;
  }
  function validatePassword(password) {
    if (isNaN(password) || password.length < 5) {
      return false;
    }
    return true;
  }
  //Order is pending
  const ordersPending = order.filter((order) => order.status != 3);
  //Order is purchased
  const ordersPurchased = order.filter((order) => order.status == 3);
  return (
    <div className="user container mt-2">
      <div>
        <Helmet>
          <title>Thông tin</title>
          <meta name="description" content="Helmet application" />
        </Helmet>
      </div>
      <div>
        <Tab.Container id="left-tabs-example" defaultActiveKey="first">
          <Row>
            <Col sm={3} className="bg-light">
              <Nav variant="pills" className="flex-column">
                <Nav.Item>
                  <Nav.Link eventKey="first">Tài khoản của tôi</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="second">Đơn hàng</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="third">Đã mua</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="fourth">Thông báo</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="five">Kho Voucher</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="six">
                    Chỉnh sửa thông tin cá nhân
                  </Nav.Link>
                </Nav.Item>
              </Nav>
            </Col>
            <Col sm={9}>
              <Tab.Content>
                <Tab.Pane eventKey="first">
                  <div class="row">
                    <div class="col-8">
                      <div className="shadow-lg p-3 mb-5 bg-body rounded rounded-3">
                        <div style={{ borderBottom: "2px solid  black" }}>
                          <h4>Hồ sơ của tôi</h4>
                          <h6>Quản lí thông tin hồ sơ để bảo mật tài khoản</h6>
                        </div>
                        <table style={{ width: "100%" }}>
                          <tr>
                            <th>Tên:</th>
                            <td>{user.name}</td>
                          </tr>
                          <tr>
                            <th>Email:</th>
                            <td>{user.email}</td>
                          </tr>
                          <tr>
                            <th>Số điện thoại:</th>
                            <td>{user.phone}</td>
                          </tr>
                          <tr>
                            <th>Địa chỉ:</th>
                            <td>{user.address}</td>
                          </tr>
                          <tr>
                            <th>Giới tính:</th>
                            {user.gender == 0 ? <td>Nam</td> : <td>Nữ</td>}
                          </tr>
                        </table>
                      </div>
                    </div>
                    <div class="col-4">
                      <div className="shadow-lg p-3 mb-5 bg-body rounded rounded-3">
                        <img
                          className="w-100 rounded rounded-3"
                          src={user.img}
                          alt=""
                        />
                        <h5 className="text-center">
                          <b>{user.name}</b>
                        </h5>
                        <h5 className="text-center">
                          <b>{user.address}</b>
                        </h5>
                      </div>
                    </div>
                  </div>
                </Tab.Pane>
                <Tab.Pane eventKey="second">
                  <div>
                    <Input.Search
                      style={{
                        paddingLeft: "20%",
                        paddingRight: "20%",
                        marginBottom: 10,
                      }}
                      onSearch={(value) => {
                        setSearch(value);
                      }}
                      onChange={(e) => {
                        setSearch(e.target.value);
                      }}
                      placehoder="Search here..."
                    />
                    <Table columns={columns} dataSource={ordersPending}></Table>
                  </div>
                  <Modal
                    show={show}
                    size="xl"
                    onHide={handleClose}
                    animation={false}
                  >
                    <Modal.Header closeButton>
                      <Modal.Title>Thông tin chi tiết</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                      <table className="w-100">
                        <tr>
                          <th>Tên người nhận:</th>
                          <td>{orderId.name}</td>
                        </tr>
                        <tr>
                          <th>Số điện thoại:</th>
                          <td>{orderId.phone}</td>
                        </tr>
                        <tr>
                          <th>Email:</th>
                          <td>{orderId.email}</td>
                        </tr>
                        <tr>
                          <th>Địa chỉ:</th>
                          <td>{orderId.address}</td>
                        </tr>
                        <tr>
                          <th>Mã đơn hàng:</th>
                          <td>{orderId.codeOrder}</td>
                        </tr>
                      </table>
                      <table className="w-100">
                        <tr>
                          <th className="border border-3 text-center">
                            Hình ảnh
                          </th>
                          <th className="border border-3 text-center">
                            Tên sản phẩm
                          </th>
                          <th className="border border-3 text-center">
                            Số lượng
                          </th>
                          <th className="border border-3 text-center">
                            Đơn giá
                          </th>
                          <th className="border border-3 text-center">
                            Thành tiền
                          </th>
                        </tr>
                        {contentModal?.map((item) => {
                          return (
                            <tr>
                              <td
                                className="border border-3 text-center"
                                style={{ maxWidth: 100 }}
                              >
                                <img
                                  className="w-100"
                                  src={item.product.imgData.link[0]}
                                  alt=""
                                />
                              </td>
                              <td className="border border-3 ">
                                {item.product.nameProduct}
                              </td>
                              <td className="border border-3 text-center">
                                {item.quantity}
                              </td>
                              <td className="border border-3 text-center">
                                {numeral(item.price).format("0,0")}
                              </td>
                              <td className="border border-3 text-center">
                                {numeral(item.amount).format("0,0")}
                              </td>
                              <td hidden>
                                {
                                  (total_payment += parseInt(
                                    item.price * item.quantity
                                  ))
                                }
                              </td>
                            </tr>
                          );
                        })}
                        <tr>
                          <td colspan="3">
                            <b>
                              Tổng: {numeral(total_payment).format("0,0")} vnd
                            </b>
                          </td>
                        </tr>
                      </table>
                    </Modal.Body>
                    <Modal.Footer>
                      <Button variant="danger" onClick={() => handleClose()}>
                        Cancel
                      </Button>
                    </Modal.Footer>
                  </Modal>
                </Tab.Pane>
                <Tab.Pane eventKey="third">
                  <div>
                    <Input.Search
                      style={{
                        paddingLeft: "20%",
                        paddingRight: "20%",
                        marginBottom: 10,
                      }}
                      onSearch={(value) => {
                        setSearch(value);
                      }}
                      onChange={(e) => {
                        setSearch(e.target.value);
                      }}
                      placehoder="Search here..."
                    />
                    <Table
                      columns={columns}
                      dataSource={ordersPurchased}
                    ></Table>
                  </div>
                </Tab.Pane>
                <Tab.Pane eventKey="fourth">Chưa có thông báo mới</Tab.Pane>
                <Tab.Pane eventKey="five">Chưa có voucher mới</Tab.Pane>
                <Tab.Pane eventKey="six">
                  <h3 className="text-center">Chỉnh sửa thông tin tài khoản</h3>
                  <div>
                    <div>
                      <label for="name" class="form-label">
                        Tên
                      </label>
                      <input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        type="text"
                        id="name"
                        class="form-control"
                      />
                    </div>
                    <div>
                      <label for="email" class="form-label">
                        Email
                      </label>
                      <input
                        value={user.email}
                        type="text"
                        id="email"
                        class="form-control"
                        readOnly
                      />
                    </div>
                    <div>
                      <label for="phone" class="form-label">
                        Số điện thoại
                      </label>
                      <input
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        type="text"
                        id="phone"
                        class="form-control"
                      />
                    </div>
                    <div>
                      <label for="address" class="form-label">
                        Địa chỉ
                      </label>
                      <input
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        type="text"
                        id="address"
                        class="form-control"
                      />
                    </div>
                    <div>
                      <label for="gender" class="form-label">
                        Giới tính
                      </label>
                      <select
                        className="form-select"
                        aria-label="Default select example"
                        name="status"
                        onChange={(e) => setGender(e.target.value)}
                      >
                        {gender == 0 ? (
                          <>
                            <option value="0">Nam</option>
                            <option value="1">Nữ</option>
                          </>
                        ) : (
                          <>
                            <option value="1">Nữ</option>
                            <option value="0">Nam</option>
                          </>
                        )}
                      </select>
                    </div>
                    <div>
                      <label for="inputPassword5" class="form-label">
                        Mật khẩu mới(nêu có)
                      </label>
                      <input
                        onChange={(e) => setPasswordNew(e.target.value)}
                        type="password"
                        id="inputPassword5"
                        class="form-control"
                        value={passwordNew}
                      />
                      <div id="passwordHelpBlock" class="form-text">
                        Mật khẩu phải chứa ít nhất 5 kí từ trở lên
                      </div>
                    </div>
                    <div>
                      <label for="inputPassword5" class="form-label">
                        Nhập lại mật khẩu cũ
                      </label>
                      <input
                        onChange={(e) => setPassword(e.target.value)}
                        type="password"
                        id="inputPassword5"
                        class="form-control"
                        value={password}
                      />
                    </div>
                    <button
                      onClick={(e) => updateInfoUser(e)}
                      className="btn-info btn-sm w-100 mt-2"
                    >
                      Lưu
                    </button>
                  </div>
                </Tab.Pane>
              </Tab.Content>
            </Col>
          </Row>
        </Tab.Container>
      </div>
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

export default InfoUser;
