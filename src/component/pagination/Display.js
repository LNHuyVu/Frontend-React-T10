import _ from "lodash";

export const Display = (items, pageNumber, pageSize) => {
  const startIndext = (pageNumber - 1) * pageSize;
  return _(items).slice(startIndext).take(pageSize).value();
};
