import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import menuService from "../../services/menu.service";
import "./footer.scss";
const FooterCustomer = () => {
  const [menu, setMenu] = useState([]);
  useEffect(() => {
    init();
  }, []);
  const init = () => {
    menuService
      .getAll("ALL")
      .then((res) => {
        console.log(res.data.menu);
        setMenu(res.data.menu);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  return (
    <div className="my-2">
      <div className="footer-customer container-xxl my-3">
        <div className="row">
          <div className="col-md-4">
            <h3>Về chúng tôi</h3>
            <ul className="ul-footer">
              {menu
                ?.filter((item) => {
                  return item.parentId == 176;
                })
                .map((item) => {
                  return (
                    <li>
                      <Link to={item.link}>{item.name}</Link>
                    </li>
                  );
                })}
            </ul>
          </div>
          <div className="col-md-4">
            <h3>Thông tin hay</h3>
            <ul className="ul-footer">
              {menu
                ?.filter((item) => {
                  return item.parentId == 177;
                })
                .map((item) => {
                  return (
                    <li>
                      <Link to={item.link}>{item.name}</Link>
                    </li>
                  );
                })}
            </ul>
          </div>
          <div className="col-md-4">
            <h3>Địa chỉ</h3>
            <span>
              Số 27,đường 22, phường Phước Long B, TP.Thủ Đức, TP.Hồ Chí Minh
              <br /> Số điện thoại: 0949 9999 xxx
              <br />
              Email: lenguyenhuyvu.htn@gmail.com
            </span>
            <br />
            <i className="fa-brands fa-facebook"></i>
            <i className="fa-brands fa-twitter"></i>
            <i className="fa-solid fa-envelope"></i>
          </div>
        </div>
      </div>
      <section className="copyright bg-black">
        <div className="container text-center ">
          <Link to="/" className="a-color">
            Thiết kế bởi: Lê Nguyễn Huy Vũ
          </Link>
        </div>
      </section>
    </div>
  );
};

export default FooterCustomer;
