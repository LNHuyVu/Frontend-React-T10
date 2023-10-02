import httpClient from "../http-common";
const getAll = (id) => {
  return httpClient.get(`/get-all-menu?id=${id}`);
};
const create = (data) => {
  return httpClient.post("/create-new-menu", data);
};
const update = (data) => {
  //   console.log('update', data)
  return httpClient.put("/edit-menu", data);
};
const remove = (userId) => {
  //   console.log("data", userId);
  return httpClient.delete("/delete-menu", {
    data: {
      id: userId,
    },
  });
};
export default { create, getAll, update, remove };
