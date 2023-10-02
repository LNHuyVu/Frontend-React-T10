import React, { useState } from "react";
import "./contact.scss";
import { Link, useNavigate } from "react-router-dom";
import contactService from "../../../services/contact.service";
import { useSelector } from "react-redux";
//
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
//
import { Helmet } from "react-helmet";

const Contact = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [content, setContent] = useState("");
  const userRD = useSelector((state) => state.auth.login?.currentUser);
  const handleSubmit = async (e) => {
    e.preventDefault();
    const contact = {
      name,
      phone,
      email,
      content,
      status: 0,
      userId: userRD?.user?.id,
    };
    let validate = validateSubmit(contact);

    if (validate.isValue == true) {
      notifySuccess();
      contactService
        .create(contact)
        .then((reponse) => {
          setName("");
          setContent("");
          setEmail("");
          setPhone("");
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      notifyError(validate.message);
    }
  };
  const validateSubmit = (contact) => {
    let isValue = true;
    let message = "";
    let check = {};
    const value = {
      "Vui lòng nhập tên": contact.name,

      "Vui lòng nhập email": contact.email,

      "Vui lòng nhập số điện thoại": contact.phone,

      "Vui lòng nhập nội dung": contact.content,
    };

    for (const item in value) {
      if (!value[item] || value[item] == "") {
        isValue = false;
        message = item;
        break;
      }
    }
    if (isValue == true) {
      if (validateEmail(contact.email) != true) {
        isValue = false;
        message = "Email không hợp lệ";
        return (check = { isValue, message });
      }
      if (validatePhoneNumber(contact.phone) != true) {
        isValue = false;
        message = "Số điện thoại không hợp lệ";
        return (check = { isValue, message });
      }
    }
    return (check = { isValue, message });
  };
  function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  }
  function validatePhoneNumber(phoneNumber) {
    if (phoneNumber.charAt(0) != 0) return false;
    if (isNaN(phoneNumber) || phoneNumber.length !== 10) {
      return false;
    }
    return true;
  }
  //Toastify
  const notifySuccess = () =>
    toast.success("Thành công!", {
      position: "top-center",
      autoClose: 300,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
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
  return (
    <>
      <div className="contact">
        <div>
          <Helmet>
            <title>Liên hệ</title>
            <meta name="description" content="Helmet application" />
          </Helmet>
        </div>
        <div class="container">
          <form id="contact">
            <h3 className="text-center">
              Mọi thắc mắc xin liên hệ với chúng tôi
            </h3>
            <fieldset>
              <input
                placeholder="Tên người liên hệ"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </fieldset>
            <fieldset>
              <input
                placeholder="Địa chỉ Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </fieldset>
            <fieldset>
              <input
                placeholder="Số điện thoại"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </fieldset>
            <fieldset>
              <textarea
                placeholder="Nội dung..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
              ></textarea>
            </fieldset>
            <fieldset>
              <button
                name="submit"
                type="submit"
                id="contact-submit"
                data-submit="...Sending"
                onClick={(e) => handleSubmit(e)}
              >
                Gửi
              </button>
            </fieldset>
            <p class="copyright">
              <Link to="https://lnhuyvu.github.io/Police_Light/">Vu Store</Link>
            </p>
          </form>
        </div>
      </div>
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

export default Contact;
