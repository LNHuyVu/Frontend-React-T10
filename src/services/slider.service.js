import httpClient from "../http-common";
const getAll = (id) => {
  return httpClient.get(`/get-all-slider?id=${id}`);
};
const create = (data) => {
  return httpClient.post("/create-new-slider", data);
};
const update = (data) => {
  //   console.log('update', data)
  return httpClient.put("/edit-slider", data);
};
const remove = (userId) => {
  //   console.log("data", userId);
  return httpClient.delete("/delete-slider", {
    data: {
      id: userId,
    },
  });
};
export default { create, getAll, update, remove };
