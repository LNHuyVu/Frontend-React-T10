import React from "react";
import _ from "lodash";

const Panigate = ({ items, pageSize, currentPage, onPageChange }) => {
  const pageCount = items / pageSize;
  if (Math.ceil(pageCount) === 1) return null;
  const pages = _.range(1, pageCount + 1);
  return (
    <div className="text-center">
      <nav>
        <ul className="pagination pagination-lg text-center">
          {pages.map((page) => (
            <li
              key={page}
              className={
                page === currentPage ? "page-item-active" : "page-item"
              }
            >
              <a
                style={{ cursor: "pointer" }}
                onClick={() => onPageChange(page)}
                className="page-link"
              >
                {page}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default Panigate;
