import httpClient from "../http-common";
const getAll = (id) => {
  return httpClient.get(`/get-all-productoption?id=${id}`);
};
const create = (data) => {
  return httpClient.post("/create-new-productoption", data);
};
const update = (data) => {
//   console.log('update', data)
  return httpClient.put("/edit-productoption", data);
};
const remove = (userId) => {
//   console.log("data", userId);
  return httpClient.delete("/delete-productoption", {
    data: {
      id: userId
    }
  });
};
export default { create, getAll, update, remove };
