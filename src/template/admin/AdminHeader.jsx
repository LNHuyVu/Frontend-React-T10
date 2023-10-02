import React, { useEffect } from "react";
import { useState } from "react";
import { Accordion, AccordionItem } from "@szhsin/react-accordion";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../../redux/apiRequest";

const AdminHeader = () => {
  const userRD = useSelector((state) => state.auth.login?.currentUser);
  //Logout
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleLogout = () => {
    logoutUser(dispatch, navigate);
  };
  //
  var [togglesidebar, setTogglesidebart] = useState("toggle-sidebar-btn");
  const handletogglesidebar = () => {
    if (togglesidebar === "toggle-sidebar-btn") {
      setTogglesidebart("toggle-sidebar");
    }
    if (togglesidebar === "toggle-sidebar") {
      setTogglesidebart("toggle-sidebar-btn");
    }
  };
  return (
    <section className={togglesidebar + " header"}>
      <header
        id="header"
        className="header fixed-top d-flex align-items-center"
      >
        <div className="d-flex align-items-center justify-content-between">
          <Link
            to="/dashboard/info-user"
            className="logo d-flex align-items-center"
          >
            <img src={userRD?.user?.img} alt="" />
            <span className="d-none d-lg-block">{userRD?.user.name}</span>
          </Link>
          <i
            className="bi bi-list toggle-sidebar-btn"
            onClick={() => handletogglesidebar()}
          ></i>
        </div>

        <div className="search-bar">
          <form
            className="search-form d-flex align-items-center"
            method="POST"
            action="#"
          >
            <input
              type="text"
              name="query"
              placeholder="Search"
              title="Enter search keyword"
            />
            <button type="submit" title="Search">
              <i className="bi bi-search"></i>
            </button>
          </form>
        </div>
      </header>

      {/* <!-- ======= Sidebar ======= --> */}
      <aside id="sidebar" className="sidebar">
        <ul className="sidebar-nav" id="sidebar-nav">
          <li className="nav-item">
            <Link className="nav-link " to="/dashboard">
              <i className="bi bi-grid"></i>
              <span>Trang chủ</span>
            </Link>
          </li>
          <Accordion>
            <AccordionItem header="Danh mục sản phẩm" className="nav-item ">
              <ul>
                <Link to="./category">
                  <li className="nav-link ">Tất cả danh mục sản phẩm</li>
                </Link>
                <Link to="./category/add-category">
                  <li className="nav-link ">Thêm danh mục sản phẩm</li>
                </Link>
              </ul>
            </AccordionItem>
            <AccordionItem header="Sản phẩm" className="nav-item ">
              <ul>
                <Link to="./product">
                  <li className="nav-link ">Tất cả sản phẩm</li>
                </Link>
                <Link to="./product/add-product">
                  <li className="nav-link ">Thêm sản phẩm</li>
                </Link>
              </ul>
            </AccordionItem>

            <AccordionItem header="Quản lí tài khoản" className="nav-item ">
              <ul>
                <Link to="./user">
                  <li className="nav-link ">Tất cả tài khoản</li>
                </Link>
                {userRD?.user?.roles === "T1" ? (
                  <Link to="./user/add-user">
                    <li className="nav-link ">Thêm tài khoản</li>
                  </Link>
                ) : (
                  <></>
                )}
              </ul>
            </AccordionItem>
            <AccordionItem header="Quản lí cấu hình" className="nav-item ">
              <ul>
                <Link to="./product-configuration">
                  <li className="nav-link ">Tất cả cấu hình</li>
                </Link>
                <Link to="./product-configuration/add-product-configuration">
                  <li className="nav-link ">Thêm cấu hình</li>
                </Link>
              </ul>
            </AccordionItem>
            <AccordionItem header="Danh mục bài viết" className="nav-item ">
              <ul>
                <Link to="./topic">
                  <li className="nav-link ">Tất cả danh mục</li>
                </Link>
                <Link to="./topic/add-topic">
                  <li className="nav-link ">Thêm danh mục</li>
                </Link>
              </ul>
            </AccordionItem>
            <AccordionItem header="Bài viết" className="nav-item ">
              <ul>
                <Link to="./post">
                  <li className="nav-link ">Tất cả bài viết</li>
                </Link>
                <Link to="./post/add-post">
                  <li className="nav-link ">Thêm bài viết</li>
                </Link>
              </ul>
            </AccordionItem>
            <AccordionItem header="Menu" className="nav-item ">
              <ul>
                <Link to="./menu">
                  <li className="nav-link ">Tất cả Menu</li>
                </Link>
              </ul>
            </AccordionItem>
            <AccordionItem header="Slider" className="nav-item ">
              <ul>
                <Link to="./slider">
                  <li className="nav-link ">Tất cả Slider</li>
                </Link>
                <Link to="./slider/add-slider">
                  <li className="nav-link ">Thêm Slider</li>
                </Link>
              </ul>
            </AccordionItem>
            <AccordionItem header="Đơn hàng" className="nav-item ">
              <ul>
                <Link to="./order">
                  <li className="nav-link ">Tổng quan đơn hàng</li>
                </Link>
                <Link to="./order-detail">
                  <li className="nav-link ">Danh sách chi tiết đơn hàng</li>
                </Link>
              </ul>
            </AccordionItem>
          </Accordion>

          <li className="nav-heading">Pages</li>

          <Link to="./contact">
            <li className="nav-item">
              <a className="nav-link collapsed">
                <i className="bi bi-envelope"></i>
                <span>Liên hệ</span>
              </a>
            </li>
          </Link>
          <li className="nav-item" onClick={handleLogout}>
            <ul className="nav-link collapsed">
              <i className="bi bi-box-arrow-in-right"></i>
              <span>Đăng xuất</span>
            </ul>
          </li>
        </ul>
      </aside>
    </section>
  );
};

export default AdminHeader;
