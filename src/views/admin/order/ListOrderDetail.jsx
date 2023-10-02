import React, { useState } from "react";
import { Input, Table } from "antd";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import orderService from "../../../services/order.service";
import orderDetailService from "../../../services/orderDetail.service";
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
var XLSX = require("xlsx");
const ListOrderDetail = () => {
  let numeral = require("numeral");
  const [order, setOrder] = useState([]);
  const [search, setSearch] = useState("");
  const [show, setShow] = useState(false);
  //Id and Status for Order => use Update Status
  const [id, setId] = useState("");
  //
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  //Modal
  const [orderModal, setOrderModal] = useState([]);
  const [productModal, setProductModal] = useState([]);
  const [quantity, setQuantity] = useState("");
  //Status Export Excel
  const [statusExcel, setStatusExcel] = useState("");
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
    orderDetailService
      .getAll("ALL")
      .then((response) => {
        console.log(response.data.orderdetail);
        setOrder(response.data.orderdetail);
      })
      .catch((error) => {
        console.log("Get Data Failed");
      });
  };
  //
  const showOrderDetail = (orderDetail, orderProduct, quantity) => {
    setOrderModal(orderDetail);
    setProductModal(orderProduct);
    setQuantity(quantity);
    handleShow();
  };
  //Export Excel
  const handleExportExcel = () => {
    let test = order;
    let newArr = order
      .filter((item) => {
        return statusExcel == -1
          ? item.orderDetail.status != statusExcel
          : item.orderDetail.status == statusExcel;
      })
      .map((item) => ({
        ...item,
        productName: item.product.nameProduct,
        status: item.orderDetail.status,
      }));

    newArr.forEach((item) => {
      // delete item.id;
      delete item.image;
      delete item.action;
      delete item.nameProduct;
      delete item.orderDetail;
      delete item.statusOrder;
      delete item.productId;
      delete item.orderId;
      delete item.product;
      delete item.OrderId;
    });
    newArr.unshift(
      newArr.splice(
        newArr.findIndex((item) => item.name),
        1
      )[0]
    );
    console.log(newArr);
    var wb = XLSX.utils.book_new(),
      ws = XLSX.utils.json_to_sheet(newArr);
    XLSX.utils.book_append_sheet(wb, ws, "MyOrder");
    XLSX.writeFile(wb, "MyExcel.xlsx");
  };
  //
  const columns = [
    {
      title: "Hình ảnh",
      dataIndex: "image",
    },
    {
      title: "Tên sản phẩm",
      dataIndex: "nameProduct",
    },
    {
      title: "Người nhận",
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
      title: "Giá",
      dataIndex: "price",
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
    },
    {
      title: "Mã đơn hàng",
      dataIndex: "codeOrder",
    },
    {
      title: "Trạng thái",
      dataIndex: "statusOrder",
    },
    // {
    //   title: "Ngày tạo",
    //   dataIndex: "createdAt",
    // },
    {
      title: "Chức năng",
      dataIndex: "action",
    },
  ];
  for (const element of order) {
    let checkStatus = "";
    element.image = (
      <div>
        <img
          style={{ maxWidth: 100 }}
          src={element?.product?.imgData?.link[0]}
          alt=""
        />
      </div>
    );
    element.nameProduct = (
      <div style={{ maxWidth: 200 }}>{element.product.nameProduct}</div>
    );
    element.codeOrder = element.orderDetail.codeOrder;
    element.name = element.orderDetail.name;
    element.statusOrder = arrOrder
      .filter((item) => {
        return item.key == element.orderDetail.status;
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
        <button
          onClick={() =>
            showOrderDetail(
              element.orderDetail,
              element.product,
              element.quantity
            )
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
        <div className="">
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
        <div className="row">
          <div className="d-flex justify-content-center">
            <div className="">
              <button
                onClick={() => handleExportExcel()}
                className="btn-sm"
                style={{ background: "green", color: "white" }}
              >
                Xuất Excel
              </button>
            </div>
            <div className="">
              <select
                onChange={(e) => setStatusExcel(e.target.value)}
                className="form-select"
              >
                <option value="-1">All</option>
                {arrOrder?.map((item) => {
                  return <option value={item.key}>{item.name}</option>;
                })}
              </select>
            </div>
          </div>
        </div>

        <Table columns={columns} dataSource={order}></Table>
      </div>
      <Modal show={show} size="xl" onHide={handleClose} animation={false}>
        <Modal.Header closeButton>
          <Modal.Title>Thông tin chi tiết</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* <h4 className="text-center">Đơn hàng của tài khoản: {user.email}</h4> */}
          <table className="w-100">
            <tr>
              <th>Tên người nhận:</th>
              <td>{orderModal.name}</td>
            </tr>
            <tr>
              <th>Số điện thoại:</th>
              <td>{orderModal.phone}</td>
            </tr>
            <tr>
              <th>Email người nhận:</th>
              <td>{orderModal.email}</td>
            </tr>
            <tr>
              <th>Địa chỉ:</th>
              <td>{orderModal.address}</td>
            </tr>
            <tr>
              <th>Mã đơn hàng:</th>
              <td>{orderModal.codeOrder}</td>
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

            <tr>
              <td
                className="border border-3 text-center"
                style={{ maxWidth: 100 }}
              >
                <img
                  className="w-100"
                  src={productModal?.imgData?.link[0]}
                  alt=""
                />
              </td>
              <td className="border border-3 ">{productModal?.nameProduct}</td>
              <td className="border border-3 text-center">{quantity}</td>
              <td className="border border-3 text-center">
                {numeral(productModal?.price).format("0,0")}
              </td>
              <td className="border border-3 text-center">
                {numeral(productModal?.price * quantity).format("0,0")}
              </td>
            </tr>

            <tr>
              <td colspan="3">
                <b>
                  Tổng: {numeral(productModal?.price * quantity).format("0,0")}{" "}
                  vnd
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

export default ListOrderDetail;
