import axios from 'axios'

const instance = axios.create({
  baseURL: 'http://localhost:3000/api/inversiones',
  /* baseURL: 'https://045lwdkf-3000.brs.devtunnels.ms/api/inversiones', */
  withCredentials: true
})

export default instance