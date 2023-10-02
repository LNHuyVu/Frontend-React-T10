import httpClient from "../http-common";
const getAll = (id) => {
  return httpClient.get(`/get-all-category?id=${id}`);
};
const getAllCus = (id) => {
  return httpClient.get(`/customer/get-all-category?id=${id}`);
};
const getIdCat = (slug) => {
  return httpClient.get(`/customer/get-id-category?slug=${slug}`);
};
const create = (data, Token) => {
  return httpClient.post("/create-new-category", data, {
    headers: { token: `Bearer ${Token.accessToken}` },
  });
};
const update = (data, Token) => {
  //   console.log('update', data)
  return httpClient.put("/edit-category", data, {
    headers: { token: `Bearer ${Token.accessToken}` },
  });
};
const remove = (userId, Token) => {
  //   console.log("data", userId);
  return httpClient.delete("/delete-category", {
    headers: { token: `Bearer ${Token.accessToken}` },
    data: {
      id: userId,
    },
  });
};
export default { create, getAll, update, remove, getIdCat, getAllCus };
