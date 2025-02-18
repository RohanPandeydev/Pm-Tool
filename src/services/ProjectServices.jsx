

import axios from "axios"
import config from "../config"
import HttpHeaders from "../helper/httphelper/HttpHeaders"
const ProjectServices = {}
ProjectServices.getList = (type) => {
    return axios.get(`${config.apiUrl}/api/project/get?${type}`, HttpHeaders.getAuthHeader())
}
// ProjectServices.getTeamProejctList = (type) => {
//     return axios.get(`${config.apiUrl}/api/project/get?${type}`, HttpHeaders.getAuthHeader())
// }
ProjectServices.getDetails = (data) => {

    return axios.get(`${config.apiUrl}/api/project/get/${data?.id}`, HttpHeaders.getAuthHeader())

}
ProjectServices.getProjectWiseTime = (data) => {

    return axios.get(`${config.apiUrl}/api/project/project-wise-time/${data?.id}`, HttpHeaders.getAuthHeader())

}
ProjectServices.checkExecutivePresent = (data) => {

    return axios.put(`${config.apiUrl}/api/project/check-executive/${data?.projectId}`, { executiveId: data?.executiveId , team: data?.team}, HttpHeaders.getAuthHeader())

}
ProjectServices.getProjectMilestone = (data) => {
    return axios.get(`${config.apiUrl}/api/projectmilestone-get/${data?.projectId}/${data?.teamLeaderId}?${data?.type}`, HttpHeaders.getAuthHeader())
}
ProjectServices.getProjectMilestoneTask = (data) => {
    return axios.get(`${config.apiUrl}/api/projectmilestone-task/get/${data?.milestoneId}?${data?.type}`, HttpHeaders.getAuthHeader())
}
ProjectServices.getProjectMilestoneTaskDetails = (data) => {
    return axios.get(`${config.apiUrl}/api/projectmilestone-task/get/${data?.milestoneId}/${data?.taskId}`, HttpHeaders.getAuthHeader())
}
ProjectServices.getProjectMilestoneDetails = (data) => {
    return axios.get(`${config.apiUrl}/api/projectmilestone-get-by-id/${data?.projectId}/${data?.milestoneId}`, HttpHeaders.getAuthHeader())
}
ProjectServices.getProjectNameSuggestion = (data) => {
    return axios.get(`${config.apiUrl}/api/project/suggestionbyinitials?keyword=${data?.keyword}`, HttpHeaders.getAuthHeader())
}



ProjectServices.create = (data) => {
    return axios.post(`${config.apiUrl}/api/project/create`, data, HttpHeaders.getAuthHeader())
}

ProjectServices.updateTeamMember = (data) => {
    return axios.put(`${config.apiUrl}/api/project/add-executive/${data?.projectId}`, data, HttpHeaders.getAuthHeader())
}
ProjectServices.checkTeamHasMilestone = (data) => {
    return axios.post(`${config.apiUrl}/api/project/check-team-milestone-in-project/${data?.projectId}`, data, HttpHeaders.getAuthHeader())
}
ProjectServices.update = (data) => {
    return axios.put(`${config.apiUrl}/api/project/update/${data?.id}`, data, HttpHeaders.getAuthHeader())
}
ProjectServices.createMilestone = (data) => {
    return axios.post(`${config.apiUrl}/api/projectmilestone/create`, data, HttpHeaders.getAuthHeader())
}

ProjectServices.milestoneUpdate = (data) => {
    return axios.put(`${config.apiUrl}/api/projectmilestone-update/${data?.id}`, data, HttpHeaders.getAuthHeader())
}
ProjectServices.deleteMilestone= (data) => {

    return axios.delete(`${config.apiUrl}/api/projectmilestone-delete/${data?.id}`, HttpHeaders.getAuthHeader())
}
ProjectServices.createMilestoneTask = (data) => {

    return axios.post(`${config.apiUrl}/api/projectmilestone-task/create/${data?.milestoneId}`, { projectTaskList: data?.projectTaskList }, HttpHeaders.getAuthHeader())
}
ProjectServices.updateMilestoneTask = (data) => {

    return axios.put(`${config.apiUrl}/api/projectmilestone-task-update/${data?.id}`,data, HttpHeaders.getAuthHeader())
}
ProjectServices.deleteMilestoneTask= (data) => {

    return axios.delete(`${config.apiUrl}/api/projectmilestone-task-delete/${data?.id}`, HttpHeaders.getAuthHeader())
}



// Task Add 
ProjectServices.updateTask = (data) => {
    return axios.put(`${config.apiUrl}/api/projectmilestone-task/change-status/${data?.milestoneId}/${data?.taskId}`, data, HttpHeaders.getAuthHeader())
}
// Drive Upload 
ProjectServices.activityDriveFilesupload = (data) => {
    return axios.post(`${config.apiUrl}/api/drive/upload`, data, HttpHeaders.getAuthHeader())
}
ProjectServices.activityDriveFiles = (data) => {
    return axios.get(`${config.apiUrl}/api/drive/get/${data}`, HttpHeaders.getAuthHeader())
}
ProjectServices.notesProject = (data) => {
    //console.log("data====================",data)
    if(data.hasOwnProperty('id') ){
        
        return axios.get(`${config.apiUrl}/api/project/project-by-id-for-notes/${data?.id}`, HttpHeaders.getAuthHeader())
    }
}
ProjectServices.driveProjectDetails = (data) => {
    //console.log("data====================",data)
    if(data.hasOwnProperty('id') ){
        
        return axios.get(`${config.apiUrl}/api/project/project-by-id-for-notes/${data?.id}`, HttpHeaders.getAuthHeader())
    }
}





export default ProjectServices;