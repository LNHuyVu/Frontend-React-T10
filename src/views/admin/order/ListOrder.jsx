import React, { useState } from "react";
import { Input, Table } from "antd";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import orderService from "../../../services/order.service";
import { IoIosEye } from "react-icons/io";
//
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
//
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import "./listorder.scss";
import { Helmet } from "react-helmet";
//
// import { XLSX } from "xlsx";
var XLSX = require("xlsx");
const ListOrder = () => {
  let numeral = require("numeral");
  let total_payment = 0;
  const [user, setUser] = useState([]);
  const [order, setOrder] = useState([]);
  const [orderId, setOrderId] = useState([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [show, setShow] = useState(false);
  const [contentModal, setContentModal] = useState([]);
  //Id and Status for Order => use Update Status
  const [id, setId] = useState("");
  //
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  //Arr Status Order
  const arrOrder = [
    { key: 0, name: "Đang xử lí", bg: "transparent" },
    { key: 1, name: "Đã xác nhận", bg: "transparent" },
    { key: 2, name: "Đang giao hàng", bg: "transparent" },
    { key: 3, name: "Hoàn thành", bg: "green" },
  ];
  useEffect(() => {
    init();
  }, []);
  const init = () => {
    orderService
      .getAll("ALL")
      .then((response) => {
        setOrder(response.data.order);
      })
      .catch((error) => {
        console.log("Get Data Failed");
      });
  };
  //
  const showOrderDetail = (element, content, user, status) => {
    total_payment = 0;
    setContentModal(content);
    setOrderId(element);
    setUser(user);
    handleShow();
  };
  //Export Excel
  const handleExportExcel = () => {
    console.log(order);
    var wb = XLSX.utils.book_new(),
      ws = XLSX.utils.json_to_sheet(order);
    XLSX.utils.book_append_sheet(wb, ws, "MyOrder");
    XLSX.writeFile(wb, "MyExcel.xlsx");
  };
  //
  const handleStatus = (e, id, status) => {
    e.preventDefault();
    const update = {
      status,
      id,
    };
    if (status == "" || status == "null") {
      notifyError("Bạn vui lòng chọn trạng thái!");
    } else {
      notifySuccess("Cập nhật thành công");
      orderService
        .update(update)
        .then((response) => {
          init();
        })
        .catch((error) => {
          console.log("Songthing went wrong", error);
        });
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
      title: "Mã đơn hàng",
      dataIndex: "codeOrder",
    },
    {
      title: "Trạng thái",
      dataIndex: "statusOrder",
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
    },
    ,
    {
      title: "Chức năng",
      dataIndex: "action",
    },
    {
      title: "Id",
      dataIndex: "id",
    },
  ];
  for (const element of order) {
    let checkStatus = "";
    element.statusOrder = arrOrder
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
      });
    element.action = (
      <div class="d-flex justify-content-lg-evenly">
        <div className="d-flex justify-content-lg-end">
          <select
            class="form-select form-select-sm"
            aria-label="Default select example"
            onChange={(e) => (checkStatus = e.target.value)}
          >
            <option selected value="null">
              Cập nhật đơn hàng
            </option>
            {arrOrder.map((item) => {
              return <option value={item.key}>{item.name}</option>;
            })}
          </select>

          <button
            className="btn-sm btn-success"
            onClick={(e) => handleStatus(e, element.id, checkStatus)}
          >
            Apply
          </button>
        </div>
        <button
          onClick={() =>
            showOrderDetail(element, element.orderDetail, element.user)
          }
          class="btn text-center border border-primary"
          type="button"
        >
          <IoIosEye size={20} color="blue" />
        </button>
      </div>
    );
  }

  return (
    <div>
      <div>
        <Helmet>
          <title>Đơn hàng</title>
          <meta name="description" content="Helmet application" />
        </Helmet>
      </div>
      <h3 className="text-center">Danh sách đơn hàng</h3>
      <div>
        <div className="row">
          <div className="col-md-2"></div>
          <div className="col-md-8">
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
          </div>
          <div className="col-md-2">
            <button
              onClick={() => handleExportExcel()}
              className="btn-lg"
              style={{ background: "green", color: "white" }}
            >
              Xuất Excel
            </button>
          </div>
        </div>

        <Table columns={columns} dataSource={order}></Table>
      </div>
      <Modal show={show} size="xl" onHide={handleClose} animation={false}>
        <Modal.Header closeButton>
          <Modal.Title>Thông tin chi tiết</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h4 className="text-center">Đơn hàng của tài khoản: {user.email}</h4>
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
              <th>Email người nhận:</th>
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
              <th className="border border-3 text-center">Hình ảnh</th>
              <th className="border border-3 text-center">Tên sản phẩm</th>
              <th className="border border-3 text-center">Số lượng</th>
              <th className="border border-3 text-center">Đơn giá</th>
              <th className="border border-3 text-center">Thành tiền</th>
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
                    {(total_payment += parseInt(item.price * item.quantity))}
                  </td>
                </tr>
              );
            })}
            <tr>
              <td colspan="3">
                <b>Tổng: {numeral(total_payment).format("0,0")} vnd</b>
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

export default ListOrder;
