// import axios from "axios";

// const baseURL = (
//   import.meta.env.VITE_API_BASE_URL || "https://appointmentbackend-4wer.onrender.com"
// ).replace(/\/+$/, "");

// const API = axios.create({
//   baseURL,
// });

// export default API;

import axios from "axios";

const API = axios.create({
  baseURL: "https://appointmentbackend-4wer.onrender.com",
});

export default API;