import React, { useEffect, useState } from "react";
import { BsToggleOff, BsToggleOn } from "react-icons/bs";
import { AiFillEdit } from "react-icons/ai";
import { FaTrashAlt } from "react-icons/fa";
// import "./listcategory.scss";
import sliderService from "../../../services/slider.service";
import { Link } from "react-router-dom";
import { Input, Table } from "antd";
import { FcPlus } from "react-icons/fc";
import { Helmet } from "react-helmet";

const ListSlider = () => {
  const [search, setSearch] = useState("");

  const [slider, setSlider] = useState([]);
  //Array Position
  const arrPosition = [
    { name: "Banner", position: 1 },
    { name: "Slider", position: 2 },
    { name: "Main", position: 3 },
    { name: "Post", position: 4 },
    { name: "Accessory", position: 5 },
  ];
  useEffect(() => {
    init();
  }, []);
  const init = () => {
    sliderService
      .getAll("ALL")
      .then((response) => {
        setSlider(response.data.slider);
      })
      .catch((error) => {
        console.log("Get Data Failed", error);
      });
  };
  //handle status
  const handleStatus = (e, id, status) => {
    e.preventDefault();
    const slider_update = {
      status: status === 1 ? 0 : 1,
      id,
    };
    sliderService
      .update(slider_update)
      .then((response) => {
        init();
      })
      .catch((error) => {
        console.log("Songthing went wrong", error);
      });
  };
  //Handle Delete
  const handleDelete = (id) => {
    sliderService
      .remove(id)
      .then((reponse) => {
        init();
      })
      .catch((error) => {
        console.log("Delete Not OK", error);
      });
  };
  //Table colums
  const columns = [
    {
      title: "Hình ảnh",
      dataIndex: "img",
    },
    {
      title: "Tên ",
      dataIndex: "name",
      filteredValue: [search],
      onFilter: (value, record) => {
        return String(record.name).toLowerCase().includes(value.toLowerCase());
      },
    },
    {
      title: "Vị trí",
      dataIndex: "positionExtra",
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
  for (const element of slider) {
    element.positionExtra = (
      <div>
        {arrPosition
          .filter((item) => {
            return element.position == item.position;
          })
          .map((item) => {
            return <span>{item.name}</span>;
          })}
      </div>
    );
    element.img = (
      <img
        style={{ maxWidth: 80 }}
        className=""
        src={element.image[0]}
        alt=""
      />
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
        <Link to={"./edit-slider/" + element.id}>
          <button class="btn btn-warning m-1 text-center" type="button">
            <AiFillEdit className="text-white" />
          </button>
        </Link>
        <button
          onClick={(e) => handleDelete(element.id)}
          class="btn btn-danger m-1 text-center"
          type="button"
        >
          <FaTrashAlt className="text-white" />
        </button>
      </div>
    );
  }
  return (
    <div className="card-body">
      <div>
        <Helmet>
          <title>Slider</title>
          <meta name="description" content="Helmet application" />
        </Helmet>
      </div>
      <div className="text-center d-flex justify-content-between align-items-center mb-3">
        <div></div>
        <div>
          <h2>Slider</h2>
        </div>
        <div>
          <Link to="./add-slider">
            <button className="btn border border-3 border-success d-flex ">
              <FcPlus className="fs-4" />
              <span className="">Thêm mới</span>
            </button>
          </Link>
        </div>
      </div>
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
      <Table columns={columns} dataSource={slider}></Table>
    </div>
  );
};

export default ListSlider;
