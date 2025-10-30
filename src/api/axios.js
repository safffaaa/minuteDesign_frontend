import axios from "axios";

const API = axios.create({
  baseURL: "https://minutedesign-backend.onrender.com/api/",
});

export default API;