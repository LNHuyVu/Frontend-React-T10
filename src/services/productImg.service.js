import axios from "axios";
import httpClient from "../http-common";
const getAll = (id) => {
  return httpClient.get(`/get-all-productimage?id=${id}`);
};
// const create = (data) => {
//   return httpClient.post("/create-new-productimage", data);
// };
const create = (data) => {
  console.log("data", data.link);
  return httpClient.post("/create-new-productimage", {
    imgId: data.imgId,
    link: data.link,
    status: 1,
  });
};
const update = (data) => {
  return httpClient.put("/edit-productimage", data);
};
const remove = (userId) => {
  //   console.log("data", userId);
  return httpClient.delete("/delete-productimage", {
    data: {
      id: userId,
    },
  });
};
const apiUploadImages = (images) =>
  new Promise(async (resolve, rejeck) => {
    try {
      const reponse = axios.post(
        `https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUD_NAME}/image/upload`,
        images
      );
      resolve(reponse);
      return reponse;
    } catch (error) {
      rejeck(error);
    }
  });
export default { create, getAll, update, remove, apiUploadImages };
