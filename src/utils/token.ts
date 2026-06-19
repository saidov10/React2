import axios from 'axios'

export function saveToken(token:string){
    localStorage.setItem("store_token",token)
}

export const getToken=()=>{
    return localStorage.getItem("store_token") 

}

export const clearToken = () => {
    localStorage.removeItem("store_token")
}

export const axiosRequest = axios.create({
  baseURL: 'https://debt-back-prod.onrender.com/api/',
  headers: {
    'Content-Type': 'application/json',
  },
})


axiosRequest.interceptors.request.use(
     (config)=>{
        const token=getToken()
        if(token){
            config.headers["Authorization"]=`Bearer ${token}`
        
        }
        return config
     },
     (error)=>{
        return Promise.reject(error)
     }
)

axiosRequest.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 502) {
      error.response.data = {
        message: "Backend server is offline. Please make sure your backend is running on http://localhost:4000"
      }
    } else if (!error.response) {
      error.response = {
        status: 500,
        data: {
          message: "Cannot connect to backend. Please check if your backend is running on http://localhost:4000"
        }
      }
    }
    return Promise.reject(error)
  }
)