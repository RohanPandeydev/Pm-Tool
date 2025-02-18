
import axios from "axios"
import config from "../config"
import HttpHeaders from "../helper/httphelper/HttpHeaders"


const RoleServices = {}

RoleServices.getList = (formdata) => {

    return axios.get(`${config.apiUrl}/api/role/get`, HttpHeaders.getAuthHeader())
}
RoleServices.getDetails = (formdata) => {

    return axios.get(`${config.apiUrl}/api/role/get/${formdata?.id}`, HttpHeaders.getAuthHeader())
}
RoleServices.getRoleCode = (formdata) => {

    return axios.get(`${config.apiUrl}/api/rolecode/get`, HttpHeaders.getAuthHeader())
}
RoleServices.getPermissionList = () => {
    return axios.get(`${config.apiUrl}/api/rolepermission/get`, HttpHeaders.getAuthHeader())
}
RoleServices.getPermissionDetails = (formdata) => {
    return axios.get(`${config.apiUrl}/api/rolepermission/get/${formdata?.id}`, HttpHeaders.getAuthHeader())
}
RoleServices.create = (formdata) => {

    return axios.post(`${config.apiUrl}/api/role/create`, formdata, HttpHeaders.getAuthHeader())
}
RoleServices.createPermission = (formdata) => {

    return axios.post(`${config.apiUrl}/api/rolepermission/create`, formdata, HttpHeaders.getAuthHeader())
}
RoleServices.updteRole = (formdata) => {

    return axios.put(`${config.apiUrl}/api/role/update/${formdata?.id}`, formdata, HttpHeaders.getAuthHeader())
}
RoleServices.updteRolePermission = (formdata) => {

    return axios.put(`${config.apiUrl}/api/rolepermission/update/${formdata?.id}`, formdata, HttpHeaders.getAuthHeader())
}
RoleServices.deleteRole = (formdata) => {

    return axios.put(`${config.apiUrl}/api/role/update/${formdata?.id}`, formdata, HttpHeaders.getAuthHeader())
}



export default RoleServices;