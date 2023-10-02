import httpClient from "../http-common";
const getAll = (id) => {
  return httpClient.get(`/get-all-product?id=${id}`);
};
const getProductId = (slug) => {
  return httpClient.get(`/customer/get-product?slug=${slug}`);
};
const getProductCat = (catId) => {
  return httpClient.get(`/customer/get-cat-product?catId=${catId}`);
};
const searchProduct = (slug) => {
  return httpClient.get(`/customer/search-product?slug=${slug}`);
};
const create = (data) => {
  console.log("http", httpClient);

  return httpClient.post("/create-new-product", data);
};
const update = (data) => {
//   console.log('update', data)
  return httpClient.put("/edit-product", data);
};
const remove = (userId) => {
//   console.log("data", userId);
  return httpClient.delete("/delete-product", {
    data: {
      id: userId
    }
  });
};
export default { create, getAll, update, remove, getProductId, getProductCat, searchProduct};
