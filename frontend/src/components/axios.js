import _axios from "axios";

const instance = _axios.create({
  baseURL:
    process.env.REACT_APP_API_URL || "https://eecamp-monopoly-2024.ntuee.org/api",
  timeout: 2000,
});

export default instance;
