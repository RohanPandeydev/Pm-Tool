

import axios from "axios"
import config from "../config"
import HttpHeaders from "../helper/httphelper/HttpHeaders"
const DashboardServices = {}
// Admin and Mananger Dashboard
DashboardServices.getList = () => {
    return axios.get(`${config.apiUrl}/api/dashboard/team-wise-project/get`, HttpHeaders.getAuthHeader())
}
DashboardServices.getUserCountByRole = () => {
    return axios.get(`${config.apiUrl}/api/dashboard/role-wise-user-count/get`, HttpHeaders.getAuthHeader())
}
DashboardServices.getUserCountByRole = (data) => {
    return axios.get(`${config.apiUrl}/api/dashboard/role-wise-user-count/get`, HttpHeaders.getAuthHeader())
}
DashboardServices.getUserActiveList = (type) => {
    return axios.get(`${config.apiUrl}/api/dashboard/active-user-list/get${type}`, HttpHeaders.getAuthHeader())
}
DashboardServices.getUserIdleList = (type) => {
    return axios.get(`${config.apiUrl}/api/dashboard/idle-user-list/get${type}`, HttpHeaders.getAuthHeader())
}
DashboardServices.getTimeWiseTaskHistory = (type) => {
    return axios.get(`${config.apiUrl}/api/dashboard/time-wise-task-list/get`, HttpHeaders.getAuthHeader())
}
DashboardServices.getTeamWiseProjectStats = (type) => {
    return axios.get(`${config.apiUrl}/api/project-total/get?${type}`, HttpHeaders.getAuthHeader())
}
DashboardServices.getExecutiveTaskList = (type) => {
    return axios.get(`${config.apiUrl}/api/dashboard/executive-last-task/get`, HttpHeaders.getAuthHeader())
}








export default DashboardServices;