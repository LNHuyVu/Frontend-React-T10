import httpClient from "../http-common";
const getAll = (id, Token) => {
  return httpClient.get(`/get-all-user?id=${id}`, {
    headers: { token: `Bearer ${Token.accessToken}` },
  });
};
const create = (data, Token) => {
  return httpClient.post("/create-new-user", data, {
    headers: { token: `Bearer ${Token.accessToken}` },
  });
};
const update = (data, Token) => {
  return httpClient.put("/edit-user", data, {
    headers: { token: `Bearer ${Token.accessToken}` },
  });
};
const changPassword = (data, Token) => {
  return httpClient.post("/change-password-user", data, {
    headers: { token: `Bearer ${Token.accessToken}` },
  });
};
const remove = (userId, Token) => {
  //   console.log("data", userId);
  return httpClient.delete("/delete-user", {
    headers: { token: `Bearer ${Token.accessToken}` },
    data: {
      id: userId,
    },
  });
};
export default { create, getAll, update, remove, changPassword };
