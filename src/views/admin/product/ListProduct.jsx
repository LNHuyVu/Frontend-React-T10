import React, { useCallback, useEffect, useState } from "react";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import { BsToggleOff, BsToggleOn, BsFillStarFill } from "react-icons/bs";
import { GiStarFormation } from "react-icons/gi";
import { MdOutlineMoreHoriz } from "react-icons/md";
import { AiFillEdit } from "react-icons/ai";
import { FaTrashAlt } from "react-icons/fa";
import "./listproduct.scss";
import productService from "../../../services/product.service";
import productImgService from "../../../services/productImg.service";
import productOptionService from "../../../services/productOption.service";
import productStoreService from "../../../services/productStore.service";
import productValueService from "../../../services/productValue.service";
import { Link } from "react-router-dom";
import { Input, Table } from "antd";
import { FcPlus } from "react-icons/fc";
import { useSelector } from "react-redux";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import ListProductSale from "../productSale/ListProductSale";
import productSaleService from "../../../services/productSale.service";
//
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
//
import { Helmet } from "react-helmet";

const ListProduct = () => {
  const userRD = useSelector((state) => state.auth.login?.currentUser);
  const [arrProduct, setArrProduct] = useState([]);
  const [search, setSearch] = useState("");

  const [key, setKey] = useState("home");
  const [product, setProduct] = useState([]);

  const [deleteId, setDeleteId] = useState("");
  const [deleteProId, setDeleteProId] = useState("");
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  useEffect(() => {
    init();
  }, []);
  //
  function updateProductSale(checked, value) {
    if (checked) setArrProduct([...arrProduct, value]);
    if (!checked)
      setArrProduct(arrProduct.filter((item) => item.id !== value.id));
  }
  //Add list product is saled
  const handleAddListProductSale = (e) => {
    e.preventDefault();
    let ProductSale = arrProduct;
    let Arr = ProductSale.filter((item) => item.sale == null);
    let newArr = Arr.map(function (item) {
      let newItem = {};
      newItem.status = 0;
      newItem.saleId = item.id;
      newItem.createdBy = String(userRD?.user.id);
      return newItem;
    });
    if (newArr.length > 0) {
      productSaleService
        .create(newArr)
        .then((response) => {
          notifySuccess("Đã áp dụng khuyến mãi");
          init();
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      notifyError("Hãy chọn sản phẩm khuyến mãi");
    }
  };
  //
  const init = () => {
    productService
      .getAll("ALL")
      .then((response) => {
        setProduct(response.data.product);
      })
      .catch((error) => {
        console.log("Get Product Failed");
      });
  };
  //handle status
  const handleStatus = (e, id, status) => {
    e.preventDefault();
    const product_update = {
      status: status === 1 ? 0 : 1,
      id,
    };
    productService
      .update(product_update)
      .then((response) => {
        // console.log("data updated successfuly", response.data);
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
      productService
        .remove(deleteId)
        .then((reponse) => {
          init();
        })
        .catch((error) => {
          console.log("Delete Not OK", error);
        });
      productOptionService
        .remove(deleteProId)
        .then((reponse) => {
          init();
        })
        .catch((error) => {
          console.log("Delete Not OK", error);
        });
      productImgService
        .remove(deleteProId)
        .then((reponse) => {
          init();
        })
        .catch((error) => {});
      productStoreService
        .remove(deleteProId)
        .then((reponse) => {
          init();
        })
        .catch((error) => {
          console.log("Delete Not OK", error);
        });
      setDeleteId("");
      setDeleteProId("");
    }
  };
  const handleDeleteOpen = (id, proId) => {
    handleShow();
    setDeleteId(id);
    setDeleteProId(proId);
  };
  //ADD 1 Product Sale
  const handleAddSale = (e, id) => {
    e.preventDefault();
    const sale = {
      saleId: id,
      createdBy: userRD.user.id,
      status: 0,
    };
    productSaleService
      .create(sale)
      .then((response) => {
        notifySuccess("Đã áp dụng khuyến mãi");
        init();
      })
      .catch((error) => {
        console.log(error);
      });
  };
  //Table colums
  const columnsProduct = [
    {
      title: "#",
      dataIndex: "checkBox",
    },
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
  for (const element of product) {
    element.checkBox = (
      <div>
        <input
          type="checkBox"
          onChange={(e) => updateProductSale(e.target.checked, element)}
        />
      </div>
    );
    element.image = (
      <div className="d-flex">
        {element.sale == null ? (
          <>
            <GiStarFormation size="30" />
          </>
        ) : (
          <>
            <GiStarFormation size="30" color="red" />
          </>
        )}
        <img
          style={{ maxWidth: 80 }}
          className=""
          src={element.imgData.link[0]}
          alt=""
        />
      </div>
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
        <Link to={"./edit-product/" + element.id}>
          <button class="btn btn-warning m-1 text-center" type="button">
            <AiFillEdit className="text-white" />
          </button>
        </Link>
        <button
          onClick={(e) => handleDeleteOpen(element.id, element.proId)}
          class="btn btn-danger m-1 text-center"
          type="button"
        >
          <FaTrashAlt className="text-white" />
        </button>
        <div className="product-more">
          <ul className="">
            <li>
              <button class="btn btn-info m-1 text-center" type="button">
                <MdOutlineMoreHoriz className="text-white" />
              </button>
              <ul className="rounded-3 bg-white shadow-lg p-3 mb-5 bg-body rounded">
                <li>Xem chi tiết</li>
                {element.sale == null ? (
                  <>
                    <li onClick={(e) => handleAddSale(e, element.id)}>
                      Tạo khuyến mãi
                    </li>
                  </>
                ) : (
                  <></>
                )}
              </ul>
            </li>
          </ul>
        </div>
      </div>
    );
  }
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
  //Child delete sale=>parent Render
  const handleRenderSale = useCallback(() => {
    init();
  }, []);
  return (
    <>
      <div>
        <Helmet>
          <title>Sản phẩm</title>
          <meta name="description" content="Helmet application" />
        </Helmet>
      </div>
      <div className="card-body">
        <div>
          <h2 className="text-center">Danh Mục Sản Phẩm</h2>
        </div>

        <div className="text-center d-flex justify-content-start align-items-center mb-3">
          <div className="">
            <Link to="./add-product">
              <button className="btn border border-3 border-success d-flex ">
                <FcPlus className="fs-4" />
                <span className="">Thêm mới</span>
              </button>
            </Link>
          </div>
          <div className="px-2">
            <button
              onClick={(e) => handleAddListProductSale(e)}
              className="btn border border-3 border-success d-flex "
            >
              <FcPlus className="fs-4" />
              <span className="">Áp dụng khuyến mãi</span>
            </button>
          </div>
        </div>
        <Tabs
          id="controlled-tab-example"
          activeKey={key}
          onSelect={(k) => setKey(k)}
          className="mb-3"
        >
          <Tab eventKey="home" title="Tất cả sản phẩm">
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
            <Table columns={columnsProduct} dataSource={product}></Table>
          </Tab>
          <Tab eventKey="profile" title="Sản phẩm khuyến mãi">
            <ListProductSale onClick={handleRenderSale} />
          </Tab>
        </Tabs>
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
    </>
  );
};

export default ListProduct;
