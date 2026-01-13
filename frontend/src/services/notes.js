import axios from 'axios'
const baseUrl = '/api/notes'

let token = null

function setToken(newToken) {
  token = `Bearer ${newToken}`
}

async function getAll() {
  const request = axios.get(baseUrl)
  const response = await request
  return response.data
}

async function create(newObject) {
  const config = {
    headers: {
      Authorization: token,
    },
  }
  return (await axios.post(baseUrl, newObject, config)).data
}

async function update(id, newObject) {
  const config = {
    headers: {
      Authorization: token,
    },
  }
  return (await axios.put(`${baseUrl}/${id}`, newObject, config)).data
}

export default {
  getAll,
  create,
  update,
  setToken,
}
