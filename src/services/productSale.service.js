import httpClient from "../http-common";
const getAll = (id) => {
  return httpClient.get(`/get-all-productsale?id=${id}`);
};
const create = (data) => {
  return httpClient.post("/create-new-productsale", data);
};
const update = (data) => {
  return httpClient.put("/edit-productsale", data);
};
const remove = (userId) => {
  return httpClient.delete("/delete-productsale", {
    data: {
      id: userId,
    },
  });
};
export default {
  create,
  getAll,
  update,
  remove,
};
