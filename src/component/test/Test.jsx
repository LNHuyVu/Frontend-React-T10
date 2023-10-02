import React from "react";
import { useState, lazy } from "react";
import "./test.scss";
import Slider from "react-slick";
import LazyLoad from "react-lazyload";
import ProductSale from "../../template/customer/model-slick/ProductSale";
// const ProductSale = lazy(() => import("../../template/customer/model-slick/ProductSale"));

const Test = () => {
  return (
    <div className="test">
      <h2>Test</h2>
      <div className="list">
        <LazyLoad height={200}>
          <img
            className="w-100"
            src="https://res.cloudinary.com/duhwcwwyo/image/upload/v1683775596/website-laptop/tt0k9996frxmxjozogb7.webp"
          />
          /* Lazy loading images is supported out of box, no extra config
          needed, set `height` for better experience */
        </LazyLoad>

        <LazyLoad height={200} once>
          /* Once this component is loaded, LazyLoad will not care about it
          anymore, set this to `true` if you're concerned about improving
          performance */
          <ProductSale />
        </LazyLoad>
        <LazyLoad height={200} offset={100}>
          /* This component will be loaded when it's top edge is 100px from
          viewport. It's useful to make user ignorant about lazy load effect. */
          <ProductSale />
        </LazyLoad>
        <LazyLoad>
          <ProductSale />
        </LazyLoad>
      </div>
    </div>
  );
};

export default Test;
