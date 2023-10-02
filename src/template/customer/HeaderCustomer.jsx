import React, { useState } from "react";
import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BsSearch } from "react-icons/bs";
import { FaShoppingCart, FaUserAlt } from "react-icons/fa";
import { HiOutlineMail } from "react-icons/hi";
import { TbLogout } from "react-icons/tb";
import { FiUserPlus } from "react-icons/fi";

import menuService from "../../services/menu.service";

import "./headercustomer.scss";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../../redux/apiRequest";
import { removeToCart } from "../../redux/slice/cartSlice";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";

const HeaderCustomer = () => {
  const slugName = require("slug");
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cartRD = useSelector((state) => state.cart?.cart);
  const handleLogout = () => {
    dispatch(removeToCart());
    logoutUser(dispatch, navigate);
  };
  const userRD = useSelector((state) => state.auth.login?.currentUser);
  // console.log(userRD);
  const [user, setUser] = useState("");
  const [menu, setMenu] = useState([]);
  useEffect(() => {
    init();
  }, []);
  const init = () => {
    menuService
      .getAll("ALL")
      .then((res) => {
        setMenu(res.data.menu);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  //Search
  const handleSubmit = (event) => {
    event.preventDefault();
    if (searchTerm != "") {
      navigate(`/search/${slugName(searchTerm)}`);
    } else {
      notifyError();
      navigate("/");
    }
  };
  const notifyError = () =>
    toast.error("Vui lòng nhập thông tin!", {
      position: "top-center",
      autoClose: 600,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  let number = 0;
  cartRD?.forEach((item) => {
    number += 1;
  });
  return (
    <div className="header1">
      <div className="container-xxl">
        <div className="row py-1">
          <div className="col-md-2 text-center">
            <Link to="/">
              <img className="w-50" src="image/logo/LOGOLTW.png" alt="" />
            </Link>
          </div>
          <div className="col-md-4">
            <form onSubmit={handleSubmit} class="d-flex">
              <div className="search row w-100">
                <button className="col-2 text-center">
                  <BsSearch className="icon-search" color="black" />
                </button>
                <div className="col-10">
                  <input
                    name=""
                    onChange={(e) => setSearchTerm(e.target.value)}
                    type="text"
                    placeholder="Xinh đẹp tuyệt vời"
                  />
                </div>
              </div>
            </form>
          </div>
          <div className="col-md-2 ">
            <Link to="/contact" className="link text-white">
              <span>
                <HiOutlineMail className="mx-1" />
                Liên hệ
              </span>
            </Link>
          </div>
          <div className="col-md-2 account-cart px-2">
            {!userRD ? (
              <>
                <Link to="./login" className="link text-white">
                  <span>
                    <FaUserAlt className="mx-1" />
                    Đăng nhập
                  </span>
                </Link>
                <Link to="./register" className="link text-white">
                  <span>
                    <FiUserPlus className="mx-1" />
                    Đăng ký
                  </span>
                </Link>
              </>
            ) : (
              <>
                <Link to="./user">
                  <span className="w-100" style={{ display: "inline-block" }}>
                    <FaUserAlt className="mx-1" />
                    {userRD?.user.name}
                  </span>
                </Link>
                <span onClick={handleLogout}>
                  <TbLogout className="mx-1" />
                  Đăng xuất
                </span>
              </>
            )}
          </div>
          <div className="col-md-2 ">
            <Link to="/cart" className="link text-white">
              {userRD ? (
                <>
                  <span className="cart">
                    <FaShoppingCart className="mx-1" />
                    Giỏ hàng
                    <span className="cart-number">{number}</span>
                  </span>
                </>
              ) : (
                <>
                  <span className="">
                    <FaShoppingCart className="mx-1" />
                    Giỏ hàng
                  </span>
                </>
              )}
            </Link>
          </div>
        </div>
        {/* Navbar */}
      </div>
      <Navbar className="py-0" bg="dark" expand="lg">
        <Container>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse
            id="basic-navbar-nav"
            className="d-flex justify-content-evenly"
          >
            <Nav.Link as={Link} to="/">
              Trang chủ
            </Nav.Link>
            {menu
              .filter((item) => {
                return item.parentId === 0 && item.status == 1;
              })
              .map((item, index) => {
                return (
                  <Nav className="me-auto">
                    <NavDropdown
                      title={item.name}
                      className="m-0"
                      id="basic-nav-dropdown"
                    >
                      {menu
                        .filter((child) => {
                          return (
                            child.parentId === item.id && child.status === 1
                          );
                        })
                        .map((child, index) => {
                          return (
                            <NavDropdown.Item as={Link} to={child?.link}>
                              {child.name}
                            </NavDropdown.Item>
                          );
                        })}
                    </NavDropdown>
                  </Nav>
                );
              })}
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <ToastContainer
        position="top-center"
        autoClose={5000}
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

export default HeaderCustomer;
