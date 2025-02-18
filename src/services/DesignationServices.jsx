
import axios from "axios"
import config from "../config"
import HttpHeaders from "../helper/httphelper/HttpHeaders"


const DesignationServices = {}

DesignationServices.get = () => {
    
    return axios.get(`${config.apiUrl}/api/designation/get`,HttpHeaders.getAuthHeader())
}
DesignationServices.create = (data) => {
    
    return axios.post(`${config.apiUrl}/api/designation/create`,data,HttpHeaders.getAuthHeader())
}
DesignationServices.update = (data) => {
    
    return axios.put(`${config.apiUrl}/api/designation/update/${data?.id}`,data,HttpHeaders.getAuthHeader())
}
DesignationServices.delete = (data) => {
    
    return axios.delete(`${config.apiUrl}/api/designation/delete/${data?.id}`,HttpHeaders.getAuthHeader())
}
export default DesignationServices;