import axios from "axios";

const baseURL = (
  import.meta.env.VITE_API_BASE_URL || "https://care-connect-phi-gules.vercel.app"
).replace(/\/+$/, "");

const API = axios.create({
  baseURL,
});

export default API;

