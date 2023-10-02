import httpClient from "../http-common";

const sendEmail = (data) => {
  return httpClient.post("/send-email", data);
};
const sendEmailContact = (data) => {
  return httpClient.post("/send-email-contact", data);
};
export default {sendEmail, sendEmailContact};
