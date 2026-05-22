import axios from "axios";

const API = axios.create({
  baseURL: "https://retailshopapp-backend.onrender.com/api"
});

export default API;