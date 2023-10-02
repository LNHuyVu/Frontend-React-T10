import React, { useEffect, useState } from "react";
import menuService from "../../../services/menu.service";
import { Input, Table } from "antd";
import { AiFillEdit } from "react-icons/ai";
import { FaTrashAlt } from "react-icons/fa";
import { Link } from "react-router-dom";
import { BsToggleOff, BsToggleOn } from "react-icons/bs";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Accordion from "react-bootstrap/Accordion";
import { useSelector } from "react-redux";
import productValueService from "../../../services/productValue.service";
import categoryService from "../../../services/category.service";
import topicService from "../../../services/topic.service";
import postService from "../../../services/post.service";
import "./listmenu.scss";
import { Helmet } from "react-helmet";

const ListMenu = () => {
  const [menu, setMenu] = useState([]);
  const [demand, setDemand] = useState([]);
  const [category, setCategory] = useState([]);
  const [post, setPost] = useState([]);
  const [topic, setTopic] = useState([]);
  const [arrDemand, setArrDemand] = useState([]);
  const [arrLaptop, setArrLaptop] = useState([]);
  const [arrAccessory, setArrAccessory] = useState([]);
  const [arrTopic, setArrTopic] = useState([]);
  const [arrPost, setArrPost] = useState([]);

  const userRD = useSelector((state) => state.auth.login?.currentUser);
  //
  const [search, setSearch] = useState("");
  const [show, setShow] = useState(false);
  const [deleteId, setDeleteId] = useState("");
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  //Add menu
  const [menuId, setMenuId] = useState("1");
  const [link, setLink] = useState("");
  const [name, setName] = useState("");
  const [parentId, setParentId] = useState("");
  //Handle Demand
  function updateFiltersDemand(checked, value) {
    if (checked) setArrDemand([...arrDemand, value]);
    if (!checked)
      setArrDemand(arrDemand.filter((item) => item.id !== value.id));
  }
  //Handle Laptop
  function updateFiltersLaptop(checked, value) {
    if (checked) setArrLaptop([...arrLaptop, value]);
    if (!checked)
      setArrLaptop(arrLaptop.filter((item) => item.id !== value.id));
  }
  //Handle Accessory
  function updateFiltersAccessory(checked, value) {
    if (checked) setArrAccessory([...arrAccessory, value]);
    if (!checked)
      setArrLaptop(arrAccessory.filter((item) => item.id !== value.id));
  }
  //Handle Topic
  function updateFiltersTopic(checked, value) {
    if (checked) setArrTopic([...arrTopic, value]);
    if (!checked) setArrTopic(arrTopic.filter((item) => item.id !== value.id));
  }
  //Handle Post
  function updateFiltersPost(checked, value) {
    if (checked) setArrPost([...arrPost, value]);
    if (!checked) setArrPost(arrPost.filter((item) => item.id !== value.id));
  }
  useEffect(() => {
    initList();
    init();
  }, []);
  const initList = () => {
    menuService
      .getAll("ALL")
      .then((response) => {
        setMenu(response.data.menu);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const init = () => {
    categoryService
      .getAll("ALL", userRD)
      .then((res) => {
        console.log(res.data);
        setCategory(res.data.category);
      })
      .catch((error) => {
        console.log(error);
      });
    productValueService
      .getAll("ALL")
      .then((res) => {
        setDemand(res.data.productvalue);
      })
      .catch((error) => {
        console.log(error);
      });
    topicService
      .getAll("ALL")
      .then((res) => {
        console.log("Topic", res.data);
        setTopic(res.data.topic);
      })
      .catch((error) => {
        console.log(error);
      });
    postService
      .getAll("ALL")
      .then((res) => {
        setPost(res.data.post);
        console.log(res.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  //Handle Add List Demand
  const handleAddListDemand = (e) => {
    e.preventDefault();
    let Demand = arrDemand;
    let Arr = Demand;
    let newArr = Arr.map(function (item) {
      let newItem = {};
      newItem.parentId = 181;
      newItem.link = "demand/" + item.slug;
      newItem.createdBy = String(userRD?.user.id);
      newItem.menuId = 0;
      newItem.name = item.nameValue;
      newItem.status = 0;
      return newItem;
    });

    menuService
      .create(newArr)
      .then((response) => {
        initList();
      })
      .catch((error) => {
        console.log(error);
      });
  };
  //Handle Add List Laptop
  const handleAddListLaptop = (e) => {
    e.preventDefault();
    let Laptop = arrLaptop;
    let Arr = Laptop;
    let newArr = Arr.map(function (item) {
      let newItem = {};
      newItem.parentId = 180;
      newItem.link = "category/" + item.slug;
      newItem.createdBy = String(userRD?.user.id);
      newItem.menuId = 0;
      newItem.name = item.name;
      newItem.status = 0;
      return newItem;
    });
    menuService
      .create(newArr)
      .then((response) => {
        initList();
      })
      .catch((error) => {
        console.log(error);
      });
  };
  //Handle Add List Accessory
  const handleAddListAccessory = (e) => {
    e.preventDefault();
    let Accessory = arrAccessory;
    let Arr = Accessory;
    let newArr = Arr.map(function (item) {
      let newItem = {};
      newItem.parentId = 179;
      newItem.link = "category/" + item.slug;
      newItem.createdBy = String(userRD?.user.id);
      newItem.menuId = 0;
      newItem.name = item.name;
      newItem.status = 0;
      return newItem;
    });
    menuService
      .create(newArr)
      .then((response) => {
        initList();
      })
      .catch((error) => {
        console.log(error);
      });
  };
  //Handle Add List Topic
  const handleAddListTopic = (e) => {
    e.preventDefault();
    let TopicNew = arrTopic;
    let Arr = TopicNew;
    let newArr = Arr.map(function (item) {
      let newItem = {};
      newItem.parentId = 177;
      newItem.link = "post/" + item.slug;
      newItem.createdBy = String(userRD?.user.id);
      newItem.menuId = 0;
      newItem.name = item.name;
      newItem.status = 0;
      return newItem;
    });
    menuService
      .create(newArr)
      .then((response) => {
        initList();
      })
      .catch((error) => {
        console.log(error);
      });
  };
  //Handle Add List Post
  const handleAddListPost = (e) => {
    e.preventDefault();
    let PostNew = arrPost;
    let Arr = PostNew;
    let newArr = Arr.map(function (item) {
      let newItem = {};
      newItem.parentId = 176;
      newItem.link = "page/" + item.slug;
      newItem.createdBy = item.createdBy;
      newItem.menuId = 0;
      newItem.name = item.title;
      newItem.status = 0;
      return newItem;
    });
    menuService
      .create(newArr)
      .then((response) => {
        initList();
      })
      .catch((error) => {
        console.log(error);
      });
  };
  //Handle Add Main Menu
  const handleAddMainMenu = (e) => {
    e.preventDefault();
    const mainMenu = {
      name,
      link,
      menuId,
      parentId: 0,
      status: 0,
      createdBy: String(userRD?.user.id),
    };
    console.log("Check main", mainMenu);
    menuService
      .create(mainMenu)
      .then((response) => {
        console.log("OK");
        setName("");
        setLink("");
        initList();
      })
      .catch((error) => {
        console.log(error);
      });
  };
  //
  const handleStatus = (e, id, status) => {
    e.preventDefault();
    const menu_update = {
      status: status === 1 ? 0 : 1,
      id,
    };
    menuService
      .update(menu_update)
      .then((response) => {
        // console.log("data updated successfully", response.data);
        // navigate("/", { replace: true });
        initList();
      })
      .catch((error) => {
        console.log("Songthing went wrong", error);
      });
  };
  //Handle Delete
  const handleDeleteClose = (value) => {
    handleClose();
    if (value == true) {
      menuService
        .remove(deleteId)
        .then((reponse) => {
          initList();
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
  //Show List Menu
  const columns = [
    {
      title: "Tên danh mục",
      dataIndex: "name",
      filteredValue: [search],
      onFilter: (value, record) => {
        return String(record.name).toLowerCase().includes(value.toLowerCase());
      },
    },
    {
      title: "Link",
      dataIndex: "link",
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
  for (const element of menu) {
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
        {/* <Link to={"./edit-category/" + element.id}>
          <button class="btn btn-warning m-1 text-center" type="button">
            <AiFillEdit className="text-white" />
          </button>
        </Link> */}
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
    <div className="menu-admin">
      <div>
        <Helmet>
          <title>Menu</title>
          <meta name="description" content="Helmet application" />
        </Helmet>
      </div>
      ListMenu
      <div className="row">
        <div className="col-md-3">
          {/* Position */}
          <div className="p-2 my-2 shadow-sm p-3 mb-5 bg-body rounded">
            Vị trí
            <select class="form-select" aria-label="Default select example">
              <option value="1">Main</option>
              <option value="2">Minor</option>
            </select>
          </div>
          {/* Add Menu */}
          <Accordion defaultActiveKey="">
            <Accordion.Item eventKey="1">
              <Accordion.Header>Nhu cầu</Accordion.Header>
              <Accordion.Body>
                <div>
                  {demand
                    .filter((elm) => {
                      return elm.parentIdValue == 7;
                    })
                    .map((elm, index) => {
                      return (
                        <div className="form-check ms-2" key={index}>
                          <label className="form-check-label">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              onChange={(e) =>
                                updateFiltersDemand(e.target.checked, elm)
                              }
                            />
                            {elm.nameValue}
                          </label>
                        </div>
                      );
                    })}
                  <div className="p-2">
                    <button
                      className="btn-primary btn-sm w-100"
                      onClick={(e) => handleAddListDemand(e)}
                    >
                      Thêm
                    </button>
                  </div>
                </div>
              </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="2">
              <Accordion.Header>Laptop</Accordion.Header>
              <Accordion.Body>
                <div>
                  {category
                    .filter((elm) => {
                      return elm.id == 1 || elm.parentId == 1;
                    })
                    .map((elm, index) => {
                      return (
                        <div className="form-check ms-2" key={index}>
                          <label className="form-check-label">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              onChange={(e) =>
                                updateFiltersLaptop(e.target.checked, elm)
                              }
                            />
                            {elm.name}
                          </label>
                        </div>
                      );
                    })}
                  <div className="p-2">
                    <button
                      className="btn-primary btn-sm w-100"
                      onClick={(e) => handleAddListLaptop(e)}
                    >
                      Thêm
                    </button>
                  </div>
                </div>
              </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="3">
              <Accordion.Header>Phụ kiện</Accordion.Header>
              <Accordion.Body>
                <div>
                  {category
                    .filter((elm) => {
                      return elm.id == 2 || elm.parentId == 2;
                    })
                    .map((elm, index) => {
                      return (
                        <div className="form-check ms-2" key={index}>
                          <label className="form-check-label">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              onChange={(e) =>
                                updateFiltersAccessory(e.target.checked, elm)
                              }
                            />
                            {elm.name}
                          </label>
                        </div>
                      );
                    })}
                  <div className="p-2">
                    <button
                      className="btn-primary btn-sm w-100"
                      onClick={(e) => handleAddListAccessory(e)}
                    >
                      Thêm
                    </button>
                  </div>
                </div>
              </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="4">
              <Accordion.Header>Bài viết</Accordion.Header>
              <Accordion.Body>
                <div>
                  {topic
                    .filter((elm) => {
                      return elm.id == 1 || elm.parentId == 1;
                    })
                    .map((elm, index) => {
                      return (
                        <div className="form-check ms-2" key={index}>
                          <label className="form-check-label">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              onChange={(e) =>
                                updateFiltersTopic(e.target.checked, elm)
                              }
                            />
                            {elm.name}
                          </label>
                        </div>
                      );
                    })}
                  <div className="p-2">
                    <button
                      className="btn-primary btn-sm w-100"
                      onClick={(e) => handleAddListTopic(e)}
                    >
                      Thêm
                    </button>
                  </div>
                </div>
              </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="5">
              <Accordion.Header>Trang đơn</Accordion.Header>
              <Accordion.Body>
                <div>
                  {post
                    .filter((elm) => {
                      return elm.topId == 2;
                    })
                    .map((elm, index) => {
                      return (
                        <div className="form-check ms-2" key={index}>
                          <label className="form-check-label">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              onChange={(e) =>
                                updateFiltersPost(e.target.checked, elm)
                              }
                            />
                            {elm.title}
                          </label>
                        </div>
                      );
                    })}
                  <div className="p-2">
                    <button
                      className="btn-primary btn-sm w-100"
                      onClick={(e) => handleAddListPost(e)}
                    >
                      Thêm
                    </button>
                  </div>
                </div>
              </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="0">
              <Accordion.Header>Tùy chỉnh</Accordion.Header>
              <Accordion.Body>
                <div>
                  <label htmlFor="">Tên Menu</label>
                  <input
                    className="form-control"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor="">Liên kết</label>
                  <input
                    className="form-control"
                    type="text"
                    value={link}
                    onChange={(e) => setLink(e.target.value)}
                  />
                </div>
                <div className="py-2">
                  <button
                    className="btn-primary btn-sm w-100"
                    onClick={(e) => handleAddMainMenu(e)}
                  >
                    Thêm
                  </button>
                </div>
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
        </div>
        <div className="col-md-9">
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
          <Table columns={columns} dataSource={menu}></Table>
        </div>
      </div>
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

export default ListMenu;
