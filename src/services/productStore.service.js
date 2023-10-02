import httpClient from "../http-common";
const getAll = (id) => {
  return httpClient.get(`/get-all-productstore?id=${id}`);
};
const create = (data) => {
  // return httpClient.post("/create-new-productstore", data);
  return httpClient.post("/create-new-productstore", {
    storeId: data.storeId,
    importPrices: data.importPrices,
    number: data.number,
  });
};
const update = (data) => {
  return httpClient.put("/edit-productstore", data);
};
//Handle number
const updateQuantity = (data) => {
  return httpClient.put("/quantity-productstore", data);
};
const remove = (userId) => {
  return httpClient.delete("/delete-productstore", {
    data: {
      id: userId,
    },
  });
};
export default { create, getAll, update, updateQuantity, remove };
