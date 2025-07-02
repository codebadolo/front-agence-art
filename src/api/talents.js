import axios from "axios";

const API_URL = "http://localhost:8000/api/talents/";

export async function getTalents(token) {
  const res = await axios.get(API_URL, {
    headers: { Authorization: `Token ${token}` }
  });
  return res.data;
}

export async function getTalent(id, token) {
  const res = await axios.get(`${API_URL}${id}/`, {
    headers: { Authorization: `Token ${token}` }
  });
  return res.data;
}

export async function createTalent(data, token) {
  const res = await axios.post(API_URL, data, {
    headers: { Authorization: `Token ${token}` }
  });
  return res.data;
}

export async function updateTalent(id, data, token) {
  const res = await axios.put(`${API_URL}${id}/`, data, {
    headers: { Authorization: `Token ${token}` }
  });
  return res.data;
}

export async function deleteTalent(id, token) {
  await axios.delete(`${API_URL}${id}/`, {
    headers: { Authorization: `Token ${token}` }
  });
}
