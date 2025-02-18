
import axios from "axios"
import config from "../config"
import HttpHeaders from "../helper/httphelper/HttpHeaders"


const TeamServices = {}
TeamServices.create = (formdata) => {
    return axios.post(`${config.apiUrl}/api/team/create`, formdata, HttpHeaders.getAuthHeader())
}
TeamServices.updateTeam = (formdata) => {
    return axios.put(`${config.apiUrl}/api/team/update/${formdata?.id}`, formdata, HttpHeaders.getAuthHeader())
}
TeamServices.getList = (formdata) => {
    return axios.get(`${config.apiUrl}/api/team/get`, HttpHeaders.getAuthHeader())
}
TeamServices.teamListByManager = (formdata) => {
    return axios.get(`${config.apiUrl}/api/team/get-team-for-manager`, HttpHeaders.getAuthHeader())
}
TeamServices.getTeamList = (formdata) => {
    return axios.get(`${config.apiUrl}/api/team/get-for-project`,HttpHeaders.getAuthHeader())
}
TeamServices.getTeamByManagerId = (formdata) => {
    return axios.get(`${config.apiUrl}/api/team/get-team-for-manager`,HttpHeaders.getAuthHeader())
}
TeamServices.getTeamByManagerIdAdmin = (formdata) => {
    return axios.get(`${config.apiUrl}/api/team/get-team-for-manager/${formdata?.id}`,HttpHeaders.getAuthHeader())
}



export default TeamServices;