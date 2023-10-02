import httpClient from "../http-common";
const getAll = (id) => {
  return httpClient.get(`/get-all-productvalue?id=${id}`);
};
// Get Product Demand All GroupBy (Gaming, ....)
const getProductValueCustomer = (slug) => {
  return httpClient.get(`/customer/get-all-productvalue?slug=${slug}`);
};
const getDemand = (slug) => {
  return httpClient.get(`/customer/get-demand-productvalue?slug=${slug}`);
};
const create = (data, Token) => {
  return httpClient.post("/create-new-productvalue", data, {
    headers: { token: `Bearer ${Token.accessToken}` },
  });
};
const update = (data, Token) => {
  //   console.log('update', data)
  return httpClient.put("/edit-productvalue", data, {
    headers: { token: `Bearer ${Token.accessToken}` },
  });
};
const remove = (userId, Token) => {
  //   console.log("data", userId);
  return httpClient.delete("/delete-productvalue", {
    headers: { token: `Bearer ${Token.accessToken}` },
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
  getProductValueCustomer,
  getDemand,
};
