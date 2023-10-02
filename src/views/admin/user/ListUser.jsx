import React, { useEffect, useState } from "react";
import { BsToggleOff, BsToggleOn } from "react-icons/bs";
import { AiFillEdit } from "react-icons/ai";
import { FaTrashAlt } from "react-icons/fa";
import "./listuser.scss";
import { Link } from "react-router-dom";
import userService from "../../../services/user.service";
import { useDispatch, useSelector } from "react-redux";
import { Input, Table } from "antd";
import { FcPlus } from "react-icons/fc";
//Modal
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
//RefreshToken
import { createAxiosRefreshJWT } from "../../../services/createRefreshJWT.service";
import axios from "axios";
import jwt_decode from "jwt-decode";
import { loginSuccess } from "../../../redux/slice/authSlice";
//
import { Helmet } from "react-helmet";

const ListUser = () => {
  const [search, setSearch] = useState("");
  const [deleteId, setDeleteId] = useState("");
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  //RefreshToken
  const dispatch = useDispatch();
  //
  const userRD = useSelector((state) => state.auth.login?.currentUser);
  // let axiosJWT=createAxiosRefreshJWT(userRD, dispatch, loginSuccess)

  const [user, setUser] = useState([]);
  useEffect(() => {
    init();
  }, []);
  const init = () => {
    userService
      .getAll("ALL", userRD)
      .then((response) => {
        setUser(response.data.users);
      })
      .catch((error) => {
        console.log("Get Data Failed", error);
      });
  };
  //handle status
  const handleStatus = (e, id, status) => {
    e.preventDefault();
    const user_update = {
      status: status === 1 ? 0 : 1,
      id,
    };
    userService
      .update(user_update, userRD)
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
      userService
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
  //Table colums
  const columns = [
    {
      title: "Hình ảnh",
      dataIndex: "image",
    },
    {
      title: "Tên tài khoản",
      dataIndex: "name",
      filteredValue: [search],
      onFilter: (value, record) => {
        return (
          String(record.name).toLowerCase().includes(value.toLowerCase()) ||
          String(record.email).toLowerCase().includes(value.toLowerCase())
        );
      },
    },
    {
      title: "Email",
      dataIndex: "email",
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
    },
    {
      title: userRD?.user?.roles == "T1" ? "Chức năng" : "",
      dataIndex: userRD?.user?.roles == "T1" ? "action" : "",
    },
    {
      title: "Id",
      dataIndex: "id",
    },
  ];
  for (const element of user) {
    element.image = (
      <img style={{ maxWidth: 80 }} className="" src={element.img} alt="" />
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
        <Link to={"./edit-user/" + element.id}>
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
    <div className="card-body">
      <div>
        <Helmet>
          <title>Tài khoản</title>
          <meta name="description" content="Helmet application" />
        </Helmet>
      </div>
      <div className="text-center d-flex justify-content-between align-items-center mb-3">
        <div></div>

        <div>
          <h2>Tài Khoản</h2>
        </div>
        <div>
          {userRD?.user?.roles == "T1" ? (
            <Link to="./add-user">
              <button className="btn border border-3 border-success d-flex ">
                <FcPlus className="fs-4" />
                <span className="">Thêm mới</span>
              </button>
            </Link>
          ) : (
            <></>
          )}
        </div>
      </div>
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
      <Table columns={columns} dataSource={user}></Table>
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
  );
};

export default ListUser;
