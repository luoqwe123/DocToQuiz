

import axios from "axios";

import { GET_TOKEN, } from "./token";

export const request  = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    timeout: 5000
})
request.interceptors.request.use((config)=>{
    const token = GET_TOKEN()
    if(token){
        config.headers.Authorization = token
    }
    return config
})

request.interceptors.response.use((Response)=>{

    return Response
},(error)=>{
    //失败的回调
  
    //响应状态
   
    return Promise.reject(error)
})
