import React, { useEffect, useState } from "react";
import { MdEmail, MdMarkEmailRead } from "react-icons/md";
import { AiFillEdit } from "react-icons/ai";
import { FaTrashAlt } from "react-icons/fa";
import "./listcontact.scss";
import contactService from "../../../services/contact.service";
import { Link } from "react-router-dom";
import { FcPlus } from "react-icons/fc";
import { Input, Table } from "antd";
import { useSelector } from "react-redux";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { Helmet } from "react-helmet";

const ListContact = () => {
  const userRD = useSelector((state) => state.auth.login?.currentUser);
  const [search, setSearch] = useState("");
  const [contact, setContact] = useState([]);
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
    contactService
      .getAll("ALL")
      .then((response) => {
        setContact(response.data.contact);
        // console.log(response.data);
      })
      .catch((error) => {
        console.log("Get Data Failed");
      });
  };
  // console.log("category", category);
  //handle status
  const handleStatus = (e, id, status) => {
    e.preventDefault();
    const contact_update = {
      status: status === 1 ? 0 : 1,
      id,
    };
    contactService
      .update(contact_update)
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
      contactService
        .remove(deleteId)
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
      title: "Tên",
      dataIndex: "name",
      filteredValue: [search],
      onFilter: (value, record) => {
        return String(record.name).toLowerCase().includes(value.toLowerCase());
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
  for (const element of contact) {
    element.action = (
      <div class="d-grid gap-2 d-md-block">
        {element.status === 1 ? (
          <button
            class="btn btn-success m-1 text-center"
            type="button"
            // onClick={(e) => handleStatus(e, element.id, element.status)}
          >
            <MdMarkEmailRead className="text-white" />
          </button>
        ) : (
          <button
            class="btn btn-danger m-1 text-center"
            type="button"
            // onClick={(e) => handleStatus(e, element.id, element.status)}
          >
            <MdEmail className="text-white" />
          </button>
        )}
        <Link to={"./reply-contact/" + element.id}>
          <button class="btn btn-info m-1 text-center" type="button">
            <AiFillEdit className="text-white" />
          </button>
        </Link>
        <button
          hidden
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
          <title>Liên hệ</title>
          <meta name="description" content="Helmet application" />
        </Helmet>
      </div>
      <div className="text-center d-flex justify-content-between align-items-center mb-3">
        <div></div>
        <div>
          <h2>Liên hệ</h2>
        </div>
        <div></div>
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
      <Table columns={columns} dataSource={contact}></Table>
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

export default ListContact;
