import httpClient from "../http-common";
const getAll = (id) => {
  return httpClient.get(`/get-all-topic?id=${id}`);
};
const create = (data) => {
  return httpClient.post("/create-new-topic", data);
};
const update = (data) => {
  //   console.log('update', data)
  return httpClient.put("/edit-topic", data);
};
const remove = (userId) => {
  //   console.log("data", userId);
  return httpClient.delete("/delete-topic", {
    data: {
      id: userId,
    },
  });
};
export default { create, getAll, update, remove };
