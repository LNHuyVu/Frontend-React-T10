import React from "react";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import { BsToggleOff, BsToggleOn } from "react-icons/bs";
import { AiFillEdit } from "react-icons/ai";
import { FaTrashAlt } from "react-icons/fa";
import { Link } from "react-router-dom";
import productValueService from "../../../services/productValue.service";
import { useEffect, useState } from "react";
import { Input, Table } from "antd";
import { FcPlus } from "react-icons/fc";
import { useSelector } from "react-redux";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { Helmet } from "react-helmet";

const ListproductValue = () => {
  const userRD = useSelector((state) => state.auth.login?.currentUser);

  const [search, setSearch] = useState("");

  const [key, setKey] = useState("home");
  const [productValue, setProductValue] = useState([]);

  const [deleteId, setDeleteId] = useState("");
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  useEffect(() => {
    initValue();
  }, []);
  const initValue = () => {
    productValueService
      .getAll("ALL", userRD)
      .then((response) => {
        setProductValue(response.data.productvalue);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  //Handle Status
  const handleStatus = (e, id, statusValue) => {
    e.preventDefault();
    const product_update = {
      statusValue: statusValue === 1 ? 0 : 1,
      id,
    };
    productValueService
      .update(product_update, userRD)
      .then((response) => {
        console.log("data updated successfuly", response.data);
        // navigate("/", { replace: true });
        initValue();
      })
      .catch((error) => {
        console.log("Songthing went wrong", error);
      });
  };
  //Handle Delete
  const handleDeleteClose = (value) => {
    handleClose();
    if (value == true) {
      productValueService
        .remove(deleteId, userRD)
        .then((reponse) => {
          initValue();
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
      title: "Tên",
      dataIndex: "nameValue",
      filteredValue: [search],
      onFilter: (value, record) => {
        return String(record.nameValue)
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
  for (const element of productValue) {
    element.action = (
      <div class="d-grid gap-2 d-md-block">
        {element.statusValue === 1 ? (
          <button
            class="btn btn-success m-1 text-center"
            type="button"
            onClick={(e) => handleStatus(e, element.id, element.statusValue)}
          >
            <BsToggleOn className="text-white" />
          </button>
        ) : (
          <button
            class="btn btn-danger m-1 text-center"
            type="button"
            onClick={(e) => handleStatus(e, element.id, element.statusValue)}
          >
            <BsToggleOff className="text-white" />
          </button>
        )}
        <Link to={"./edit-product/" + element.id}>
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
  let test = "";
  return (
    <div>
      <div>
        <Helmet>
          <title>Cấu hình</title>
          <meta name="description" content="Helmet application" />
        </Helmet>
      </div>
      <div className="text-center d-flex justify-content-between align-items-center mb-3">
        <div></div>

        <div>
          <h2>Cấu hình</h2>
        </div>
        <div>
          <Link to="./add-product-configuration">
            <button className="btn border border-3 border-success d-flex ">
              <FcPlus className="fs-4" />
              <span className="">Thêm mới</span>
            </button>
          </Link>
        </div>
      </div>
      <Tabs
        defaultActiveKey="profile"
        id="uncontrolled-tab-example"
        className="mb-3"
        activeKey={key}
        onSelect={(k) => setKey(k)}
      >
        <Tab eventKey="home" title="Chung">
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
          <Table columns={columns} dataSource={productValue}></Table>
        </Tab>
        {productValue
          .filter((child) => {
            return child.parentIdValue == "0";
          })
          .map((child, index) => {
            return (
              <Tab eventKey={child.nameValue} title={child.nameValue}>
                <table class="table table-bordered" id="myTable">
                  <thead>
                    <th class="text-center" style={{ width: 20 }}>
                      #
                    </th>
                    <th>Tên cấu hình</th>
                    <th>Slug</th>
                    <th>Chức năng</th>
                    <th>ID</th>
                  </thead>
                  <tbody>
                    {(test = child.id)}
                    {productValue
                      .filter((item) => {
                        return item.parentIdValue == test;
                      })
                      .map((item, index) => {
                        return (
                          <tr>
                            <td class="text-center">
                              <input name="checkid" type="checkbox" />
                            </td>
                            <td>{item.nameValue}</td>
                            <td>{item.slug}</td>
                            <td className="text-center action">
                              <div class="d-grid gap-2 d-md-block">
                                {item.statusValue == 1 ? (
                                  <button
                                    class="btn btn-success m-1 text-center"
                                    type="button"
                                    onClick={(e) =>
                                      handleStatus(e, item.id, item.statusValue)
                                    }
                                  >
                                    <BsToggleOn className="text-white" />
                                  </button>
                                ) : (
                                  <button
                                    class="btn btn-danger m-1 text-center"
                                    type="button"
                                    onClick={(e) =>
                                      handleStatus(e, item.id, item.statusValue)
                                    }
                                  >
                                    <BsToggleOff className="text-white" />
                                  </button>
                                )}
                                <Link to={"./edit-product/" + item.id}>
                                  <button
                                    class="btn btn-warning m-1 text-center"
                                    type="button"
                                  >
                                    <AiFillEdit className="text-white" />
                                  </button>
                                </Link>
                                <button
                                  onClick={(e) => handleDeleteOpen(item.id)}
                                  class="btn btn-danger m-1 text-center"
                                  type="button"
                                >
                                  <FaTrashAlt className="text-white" />
                                </button>
                              </div>
                            </td>
                            <td class="text-center">
                              {item.id}--{item.parentIdValue}
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </Tab>
            );
          })}
      </Tabs>
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

export default ListproductValue;
