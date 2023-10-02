import React from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import AdminHome from "./AdminHome";
import AdminHeader from "./AdminHeader";
import ListUser from "../../views/admin/user/ListUser";
import ListProduct from "../../views/admin/product/ListProduct";
import ProductDetail from "../../views/admin/product/ProductDetail";
import "./admin.scss";
import AddProduct from "../../views/admin/product/AddProduct";
import ListCategory from "../../views/admin/category/ListCategory";
import AddCategory from "../../views/admin/category/AddCategory";
import EditCategory from "../../views/admin/category/EditCategory";
import EditProduct from "../../views/admin/product/EditProduct";
import EditProductSale from "../../views/admin/productSale/EditProductSale";
import ListproductValue from "../../views/admin/productValue/ListproductValue";
import AddProductValue from "../../views/admin/productValue/AddProductValue";
import EditProductValue from "../../views/admin/productValue/EditProductValue";
import AddUser from "../../views/admin/user/AddUser";
import EditUser from "../../views/admin/user/EditUser";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import ListTopic from "../../views/admin/topic/ListTopic";
import AddTopic from "../../views/admin/topic/AddTopic";
import EditTopic from "../../views/admin/topic/EditTopic";
import ListPost from "../../views/admin/post/ListPost";
import AddPost from "../../views/admin/post/AddPost";
import EditPost from "../../views/admin/post/EditPost";
import ListSlider from "../../views/admin/slider/ListSlider";
import AddSlider from "../../views/admin/slider/AddSlider";
import EditSlider from "../../views/admin/slider/EditSlider";
import ListContact from "../../views/admin/contact/ListContact";
import EditContact from "../../views/admin/contact/EditContact";
import ListOrder from "../../views/admin/order/ListOrder";
import ListMenu from "../../views/admin/menu/ListMenu";
import EditMenu from "../../views/admin/menu/EditMenu";
import PageNotFound from "../../component/pageNotFound/PageNotFound";
import InfoUser from "../../views/admin/info-user/InfoUser";
import ListOrderDetail from "../../views/admin/order/ListOrderDetail";

const AdminRoute = () => {
  const userRD = useSelector((state) => state.auth.login?.currentUser);
  const navigate = useNavigate();
  useEffect(() => {
    if (!userRD) {
      navigate("/login");
    }
    if (userRD?.user.roles == "T3") {
      navigate("../");
    }
  }, []);
  return (
    <div className="px-2">
      <AdminHeader />
      <main id="main" className="main mt-0 px-2 py-1">
        {/* <div className="pagetitle">
  <h1>Dashboard</h1>
  <nav>
    <ol className="breadcrumb">
      <li className="breadcrumb-item"><a href="index.html">Home</a></li>
      <li className="breadcrumb-item active">Dashboard</li>
    </ol>
  </nav>
</div> */}

        <section className="section dashboard">
          <div className="row">
            <Routes>
              <Route path="/" element={<AdminHome />} />
              <Route path="/info-user" element={<InfoUser />} />
              <Route path="/category" element={<ListCategory />} />
              <Route path="/contact" element={<ListContact />} />
              <Route
                path="/contact/reply-contact/:id"
                element={<EditContact />}
              />
              <Route path="/category/add-category" element={<AddCategory />} />
              <Route
                path="/category/edit-category/:id"
                element={<EditCategory />}
              />
              {/* User */}
              <Route path="/user/*" element={<ListUser />} />
              <Route path="/user/add-user" element={<AddUser />} />
              <Route path="/user/edit-user/:id" element={<EditUser />} />
              {/* Product */}
              <Route path="/product" element={<ListProduct />} />
              <Route path="/product/add-product" element={<AddProduct />} />
              <Route
                path="/product/edit-product/:id"
                element={<EditProduct />}
              />
              <Route
                path="/product/edit-productsale/:id"
                element={<EditProductSale />}
              />
              <Route
                path="/product/productdetail"
                element={<ProductDetail />}
              />
              {/* ProductValue */}
              <Route
                path="/product-configuration"
                element={<ListproductValue />}
              />
              <Route
                path="/product-configuration/add-product-configuration"
                element={<AddProductValue />}
              />
              <Route
                path="/product-configuration/edit-product/:id"
                element={<EditProductValue />}
              />
              {/* Topic */}
              <Route path="/topic" element={<ListTopic />} />
              <Route path="/topic/add-topic" element={<AddTopic />} />
              <Route path="/topic/edit-topic/:id" element={<EditTopic />} />
              {/* Post */}
              <Route path="/post" element={<ListPost />} />
              <Route path="/post/add-post" element={<AddPost />} />
              <Route path="/post/edit-post/:id" element={<EditPost />} />
              {/* Slider */}
              <Route path="/slider" element={<ListSlider />} />
              <Route path="/slider/add-slider" element={<AddSlider />} />
              <Route path="/slider/edit-slider/:id" element={<EditSlider />} />
              {/* Order */}
              <Route path="/order" element={<ListOrder />} />
              <Route path="/order-detail" element={<ListOrderDetail />} />
              {/* Menu */}
              <Route path="/menu" element={<ListMenu />} />
              <Route path="/menu/edit-menu/:id" element={<EditMenu />} />
              <Route path="/*" element={<PageNotFound />} />
            </Routes>
          </div>
        </section>
      </main>
    </div>
  );
};

export default AdminRoute;
