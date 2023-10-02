import httpClient from "../http-common";
const getAll = (id) => {
  return httpClient.get(`/get-all-order?id=${id}`);
};
const create = (data) => {
  return httpClient.post("/create-new-order", data);
};
const update = (data) => {
  return httpClient.put("/edit-order", data);
};
const remove = (orderId) => {
  return httpClient.delete("/delete-order", {
    data: {
      id: orderId,
    },
  });
};
export default { create, getAll, update, remove };
