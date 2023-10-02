import React, { useEffect, useState } from "react";
import "./featuredcategory.scss";
import categoryService from "../../../services/category.service";
import { Link } from "react-router-dom";
const Featuredcategory = () => {
  const [category, setCategory] = useState([]);
  useEffect(() => {
    init();
  }, []);
  const init = () => {
    categoryService
      .getAllCus("ALL")
      .then((reponse) => {
        setCategory(reponse.data.category);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  return (
    <div className="featuredcategory row text-center mb-3 p-3 mx-0">
      <div className="container">
        <h3>Danh mục nổi bật</h3>
        <div className="row row-cols-4 row-cols-lg-6 g-2 g-lg-3">
          {category
            .filter((item) => {
              return item.parentId != "0";
            })
            .map((item) => {
              return (
                <div class="col">
                  <Link style={{color: "#000"}} to={"category/" + `${item.slug}`}>
                    <div class="p-3 item-category">
                      <img
                        className="w-100"
                        style={{ maxHeight: 100 }}
                        src={item.image[0]}
                        alt=""
                      />
                    </div>
                    <span>{item.name}</span>
                  </Link>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
};

export default Featuredcategory;
