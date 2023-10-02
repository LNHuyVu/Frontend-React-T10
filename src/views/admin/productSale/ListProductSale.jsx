import React, { useEffect, useState } from "react";
import productSaleService from "../../../services/productSale.service";
import { Link } from "react-router-dom";
import { Input, Table } from "antd";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { BsToggleOff, BsToggleOn } from "react-icons/bs";
import { AiFillEdit } from "react-icons/ai";
import { FaTrashAlt } from "react-icons/fa";
import postService from "../../../services/post.service";
const ListProductSale = (props, onClick) => {
  const [productSale, setProductSale] = useState([]);
  const [search, setSearch] = useState("");
  const [deleteId, setDeleteId] = useState("");
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  useEffect(() => {
    init();
  }, [props]);
  const init = () => {
    productSaleService
      .getAll("ALL")
      .then((reponse) => {
        setProductSale(reponse.data.productsale);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleStatus = (e, id, status) => {
    e.preventDefault();
    const status_update = {
      status: status === 1 ? 0 : 1,
      id,
    };
    productSaleService
      .update(status_update)
      .then((response) => {
        init();
      })
      .catch((error) => {
        console.log("Songthing went wrong", error);
      });
  };
  //Handle Delete
  const handleDeleteClose = (value) => {
    handleClose();
    if (value == true) {
      productSaleService
        .remove(deleteId)
        .then((reponse) => {
          //Render sale CPN Parent
          props.onClick();
          //
          init();
        })
        .catch((error) => {
          console.log("Delete Not OK", error);
        });
      setDeleteId("");
    }
  };
  const handleDeleteOpen = (id) => {
    handleShow();
    setDeleteId(id);
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
      filteredValue: [search],
      onFilter: (value, record) => {
        return String(record.nameProduct)
          .toLowerCase()
          .includes(value.toLowerCase());
      },
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
  for (const element of productSale) {
    element.nameProduct = (
      <div onClick={() => test(element.id)} style={{ maxWidth: 150 }}>
        {element.productSale.nameProduct}
      </div>
    );
    element.image = (
      <img
        style={{ maxWidth: 80 }}
        className=""
        src={element.productSale.imgData.link[0]}
        alt=""
      />
    );
    element.action = (
      <div class="d-grid gap-2 d-md-block">
        {element.status === 1 ? (
          <button
            class="btn btn-success m-1 text-center"
            type="button"
            onClick={(e) => handleStatus(e, element.id, element.status)}
          >
            <BsToggleOn className="text-white" />
          </button>
        ) : (
          <button
            class="btn btn-danger m-1 text-center"
            type="button"
            onClick={(e) => handleStatus(e, element.id, element.status)}
          >
            <BsToggleOff className="text-white" />
          </button>
        )}
        <Link to={"./edit-productsale/" + element.id}>
          <button class="btn btn-warning m-1 text-center" type="button">
            <AiFillEdit className="text-white" />
          </button>
        </Link>
        <button
          onClick={(e) => handleDeleteOpen(element.id)}
          class="btn btn-danger m-1 text-center"
          type="button"
        >
          <FaTrashAlt className="text-white" />
        </button>
      </div>
    );
  }
  return (
    <div className="listproductsale">
      <div className="main-content">
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
        <Table columns={columns} dataSource={productSale}></Table>
        <Modal show={show} onHide={handleClose} animation={false}>
          <Modal.Header closeButton>
            <Modal.Title>Thông báo</Modal.Title>
          </Modal.Header>
          <Modal.Body>Bạn có chắc chắn xóa phần tử này!</Modal.Body>
          <Modal.Footer>
            <Button variant="success" onClick={() => handleDeleteClose(true)}>
              Đồng ý
            </Button>
            <Button variant="danger" onClick={() => handleDeleteClose(false)}>
              Cancel
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
};

export default ListProductSale;
