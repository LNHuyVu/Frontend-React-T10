import axios from "axios";
import LinkContainer from "react-bootstrap";
import {
  loginFailed,
  loginStart,
  loginSuccess,
  registerFailed,
  registerStart,
  registerSuccess,
  logoutSuccess,
  logoutFailed,
  logoutStart,
} from "./slice/authSlice";
export const loginUser = async (user, dispatch, navigate) => {
  dispatch(loginStart());
  try {
    const res = await axios.post("http://localhost:8080/api/login", user);
    if (res.data.errCode == 0) {
      dispatch(loginSuccess(res.data));
      return { value: res.data.errCode };
    } else {
      dispatch(loginFailed());
      return { value: res.data.message };
    }
  } catch (err) {
    console.log(err);
  }
};
export const loginAdmin = async (user, dispatch, navigate) => {
  dispatch(loginStart());
  try {
    const res = await axios.post("http://localhost:8080/api/login", user);
    if (res.data.errCode == 0) {
      dispatch(loginSuccess(res.data));
      if (res.data.user.roles != "T3") {
        return { value: res.data.errCode };
      } else {
        return { value: "Tài khoản không có quyền truy cập!" };
      }
    } else {
      dispatch(loginFailed());
      return { value: res.data.message };
    }
  } catch (err) {
    console.log(err);
  }
};
export const registerUser = async (user, dispatch, navigate) => {
  dispatch(registerStart());
  try {
    const res = await axios.post("http://localhost:8080/api/register", user);
    console.log(res);
    if (res.data.errCode == 0) {
      dispatch(registerSuccess(res.data));
      return { value: res.data.message, errCode: res.data.errCode };
    } else {
      return { value: res.data.message, errCode: res.data.errCode };
    }
  } catch (err) {
    dispatch(registerFailed());
  }
};
export const logoutUser = async (dispatch, navigate) => {
  dispatch(logoutStart());
  try {
    const res = await axios.post("http://localhost:8080/api/logout");
    dispatch(logoutSuccess(res.data));
    navigate("../");
  } catch (err) {
    dispatch(logoutFailed());
  }
};
