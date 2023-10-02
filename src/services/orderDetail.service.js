import httpClient from "../http-common";
const getAll = (id) => {
  return httpClient.get(`/get-all-orderdetail?id=${id}`);
};
const getProductHot = (id) => {
  return httpClient.get(`/get-all-producthot?id=${id}`);
};
const create = (data) => {
  return httpClient.post("/create-new-orderdetail", data);
};
const update = (data) => {
  //   console.log('update', data)
  return httpClient.put("/edit-orderdetail", data);
};
const remove = (orderId) => {
  //   console.log("data", userId);
  return httpClient.delete("/delete-orderdetail", {
    data: {
      id: orderId,
    },
  });
};
export default { create, getAll, getProductHot,update, remove };
