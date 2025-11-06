import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:3001",
  headers: { "Content-Type": "application/json" },
});

export const get = (url, params) =>
  api.get(url, { params }).then((r) => r.data);

export const post = (url, data) => api.post(url, data).then((r) => r.data);

export const put = (url, data) => api.put(url, data).then((r) => r.data);

export const patch = (url, data) => api.patch(url, data).then((r) => r.data);
