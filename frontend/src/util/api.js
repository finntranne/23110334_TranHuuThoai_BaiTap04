import axios from "./axios.customize";

const createUserApi = (data) => {
  return axios.post("/api/register", data);
};

const verifyOTPApi = (data) => {
  return axios.post("/api/verify-otp", data);
};

const loginApi = (email, password) => {
  const URL_API = "/api/login";
  const data = {
    email,
    password,
  };

  return axios.post(URL_API, data);
};

const getUserApi = () => {
  const URL_API = "/api/user";
  return axios.get(URL_API);
};

export { createUserApi, loginApi, getUserApi, verifyOTPApi };
