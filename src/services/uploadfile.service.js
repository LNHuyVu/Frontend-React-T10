import axios from "axios";
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
export default { apiUploadImages };
