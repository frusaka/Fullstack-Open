import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null

function setToken(newToken) {
  token = `Bearer ${newToken}`
}

async function getAll() {
  return (await axios.get(baseUrl)).data
}

async function create(data) {
  const config = {
    headers: {
      Authorization: token,
    },
  }
  return (await axios.post(baseUrl, data, config)).data
}

export default { getAll, setToken, create }
