import axios from 'axios'

async function login(username, password) {
  return (await axios.post('/api/login', { username, password })).data
}

export default { login }
