import httpClient from "../http-common";
const getAll = (id) => {
  return httpClient.get(`/get-all-contact?id=${id}`);
};
const create = (data) => {
  return httpClient.post("/create-new-contact", data);
};
const update = (data) => {
  return httpClient.put("/edit-contact", data);
};
const remove = (contactId) => {
  return httpClient.delete("/delete-contact", {
    data: {
      id: contactId,
    },
  });
};
export default { create, getAll, update, remove};
