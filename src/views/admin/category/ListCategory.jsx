import React, { useEffect, useState } from "react";
import { BsToggleOff, BsToggleOn } from "react-icons/bs";
import { AiFillEdit } from "react-icons/ai";
import { FaTrashAlt } from "react-icons/fa";
import "./listcategory.scss";
import categoryService from "../../../services/category.service";
import { Link } from "react-router-dom";
import { FcPlus } from "react-icons/fc";
import { Input, Table } from "antd";
import { useSelector } from "react-redux";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { Helmet } from "react-helmet";

const ListCategory = () => {
  const userRD = useSelector((state) => state.auth.login?.currentUser);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState([]);
  //
  const [show, setShow] = useState(false);
  const [deleteId, setDeleteId] = useState("");

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  //
  useEffect(() => {
    init();
  }, []);
  const init = () => {
    categoryService
      .getAll("ALL", userRD)
      .then((response) => {
        setCategory(response.data.category);
      })
      .catch((error) => {
        console.log("Get Data Failed");
      });
  };
  // console.log("category", category);
  //handle status
  const handleStatus = (e, id, status) => {
    e.preventDefault();
    const category_update = {
      status: status === 1 ? 0 : 1,
      id,
    };
    categoryService
      .update(category_update, userRD)
      .then((response) => {
        // console.log("data updated successfully", response.data);
        // navigate("/", { replace: true });
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
      categoryService
        .remove(deleteId, userRD)
        .then((reponse) => {
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
  const columns = [
    {
      title: "Hình ảnh",
      dataIndex: "img",
    },
    {
      title: "Tên danh mục",
      dataIndex: "name",
      filteredValue: [search],
      onFilter: (value, record) => {
        return String(record.name).toLowerCase().includes(value.toLowerCase());
      },
    },
    {
      title: "Slug",
      dataIndex: "slug",
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
  for (const element of category) {
    element.img = (
      <img
        style={{ maxWidth: 80 }}
        className=""
        src={element.image[0]}
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
        <Link to={"./edit-category/" + element.id}>
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
    <>
      <div>
        <Helmet>
          <title>Danh mục sản phẩm</title>
          <meta name="description" content="Helmet application" />
        </Helmet>
      </div>
      <div className="text-center d-flex justify-content-between align-items-center mb-3">
        <div></div>

        <div>
          <h2>Danh Mục Sản Phẩm</h2>
        </div>
        <div>
          <Link to="./add-category">
            <button className="btn border border-3 border-success d-flex ">
              <FcPlus className="fs-4" />
              <span className="">Thêm mới</span>
            </button>
          </Link>
        </div>
      </div>
      <Input.Search
        style={{ paddingLeft: "20%", paddingRight: "20%", marginBottom: 10 }}
        onSearch={(value) => {
          setSearch(value);
        }}
        onChange={(e) => {
          setSearch(e.target.value);
        }}
        placehoder="Search here..."
      />
      <Table columns={columns} dataSource={category}></Table>
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
    </>
  );
};

export default ListCategory;
