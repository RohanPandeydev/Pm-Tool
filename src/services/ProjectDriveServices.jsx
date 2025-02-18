

import axios from "axios"
import config from "../config"
import HttpHeaders from "../helper/httphelper/HttpHeaders"
const ProjectDriveServices = {}
ProjectDriveServices.create = (data) => {
    return axios.post(`${config.apiUrl}/api/dashboard/team-wise-project/get/${data?.id}`,data, HttpHeaders.getAuthHeader())
}
ProjectDriveServices.DriveFiles = (data) => {
    return axios.get(`${config.apiUrl}/api/drive/get/${data}`, HttpHeaders.getAuthHeader())
}
ProjectDriveServices.MessageBoardList = (data) => {
    return axios.get(`${config.apiUrl}/api/project/notes/list/${data?.id}`, HttpHeaders.getAuthHeader())
}
ProjectDriveServices.MessageBoardCreate = (data) => {
    return axios.post(`${config.apiUrl}/api/project/notes/create/${data?.project}`,data, HttpHeaders.getAuthHeader())
}
ProjectDriveServices.MessageBoardMessageSend = (data) => {
    return axios.post(`${config.apiUrl}/api/project/notes/message-send/${data?.boardId}`,data, HttpHeaders.getAuthHeader())
}
ProjectDriveServices.MessageBoardMessageList = (data) => {
    if(!data?.boardId)return []
    return axios.get(`${config.apiUrl}/api/project/notes/details/${data?.boardId}`, HttpHeaders.getAuthHeader())
}











export default ProjectDriveServices;