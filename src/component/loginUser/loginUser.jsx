import React, { useState } from "react";
import { useDispatch } from "react-redux";
import "./login.scss";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../../redux/apiRequest";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const handleLogin = (e) => {
    e.preventDefault();
    const user = {
      email,
      password,
    };
    let valueLogin;
    let myPromise = new Promise((resolve, reject) => {
      valueLogin = loginUser(user, dispatch, navigate);
      resolve(valueLogin);
    });
    myPromise
      .then((result) => {
        if (result.value == 0) {
          console.log(result);
          navigate("../");
        } else {
          setMessage(result.value);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };
  return (
    <div className="login-form-user">
      <div>
        <Helmet>
          <title>Đăng nhập</title>
          <meta name="description" content="Helmet application" />
        </Helmet>
      </div>
      <div className="login-form">
        <form onSubmit={handleLogin}>
          <h1 className="title-login" style={{ textAlign: "center" }}>
            VuStore
          </h1>
          <label>Tài khoản </label>
          <div className="flex-row">
            <input
              name="username"
              className="lf--input"
              placeholder="Nhập email"
              type="text"
              // value={this.state.username}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <label>Mật khẩu</label>
          <div className="flex-row">
            <input
              name="password"
              type="password"
              className="lf--input"
              placeholder="Nhập mật khẩu"
              // type={this.state.isShowPassword?'text':'password'}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button className="lf--submit" type="submit">
            Đăng nhập
          </button>
        </form>
        <div
          className="col-12 rounded-pill my-1 text-center"
          style={{ backgroundColor: "red" }}
        >
          {message}
        </div>
        <div className="d-flex justify-content-around">
          <Link className="lf--forgot" to="../" style={{ color: "white" }}>
            Quay lại
          </Link>
          <Link className="lf--forgot" to="#" style={{ color: "white" }}>
            Quên mật khẩu?
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
