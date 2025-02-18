
import axios from "axios"
import config from "../config"
import HttpHeaders from "../helper/httphelper/HttpHeaders"
const UserServices = {}

UserServices.getList = (type) => {
    return axios.get(`${config.apiUrl}/api/user/get?${type}`, HttpHeaders.getAuthHeader())
}
UserServices.getTaskUserList = (type) => {
   
    return axios.get(`${config.apiUrl}/api/user/get-child-user-parent-id-wise`, HttpHeaders.getAuthHeader())

}
UserServices.getTaskUserListbyId = (data) => {
   
    return axios.get(`${config.apiUrl}/api/user/get-child-user-parent-id-wise/${data?.id}`, HttpHeaders.getAuthHeader())

}
UserServices.getManagerByTeamId = (data) => {
   
    return axios.get(`${config.apiUrl}/api/user/get-child-user-parent-id-wise/${data?.id}?teamId=${data?.teamId}`, HttpHeaders.getAuthHeader())

}
UserServices.getManagerByTeamIdAdmin= (data) => {
   
    return axios.get(`${config.apiUrl}/api/user/get-child-user-parent-id-wise/${data?.id}`, HttpHeaders.getAuthHeader())

}
UserServices.getTeamLeadersByTeam = (teamId) => {
   
    return axios.get(`${config.apiUrl}/api/user/get-child-user-parent-id-wise/${teamId}`, HttpHeaders.getAuthHeader())

}
UserServices.getExecutivesByTeamLeader = (teamLeaderId) => {
   
    return axios.get(`${config.apiUrl}/api/user/get-child-user-parent-id-wise/${teamLeaderId}`, HttpHeaders.getAuthHeader())

}
UserServices.getTeamsByManager = (managerId) => {
   
    return axios.get(`${config.apiUrl}/api/user/get-child-user-parent-id-wise/${managerId}`, HttpHeaders.getAuthHeader())

}

UserServices.getReportingManagerList = (formdata) => {
    return axios.get(`${config.apiUrl}/api/user/get-list/${formdata?.roleId}/${formdata?.teamId}`, HttpHeaders.getAuthHeader())
}


UserServices.getDetails = (data) => {
    // //console.log("ff",data)
    if(!!data?.id){

        return axios.get(`${config.apiUrl}/api/user/get/${data?.id}`, HttpHeaders.getAuthHeader())
    }
}
UserServices.getProfile = (data) => {
    return axios.get(`${config.apiUrl}/api/user/get/profile/${data?.id}`, HttpHeaders.getAuthHeader())
}
UserServices.getAmsList = (data) => {
    return axios.get(`${config.apiUrl}/api/user/get/ams`, HttpHeaders.getAuthHeader())
}
UserServices.getPmList = (data) => {
    return axios.get(`${config.apiUrl}/api/user/manager-list`, HttpHeaders.getAuthHeader())
}
UserServices.getTlsList = (data) => {
    return axios.get(`${config.apiUrl}/api/user/get/tls/${data?.teamId}`, HttpHeaders.getAuthHeader())
}
UserServices.getTlsExecutiveList = (data) => {
    return axios.get(`${config.apiUrl}/api/user/get-executive-list/${data?.tlId}`, HttpHeaders.getAuthHeader())
}
UserServices.getTlsExecutiveList1 = (data) => {
    return axios.get(`${config.apiUrl}/api/user/get-executive-list/${data?.tlId}?team=${data?.team}`, HttpHeaders.getAuthHeader())
}
UserServices.getProjectExecutiveList = (data) => {
    return axios.get(`${config.apiUrl}/api/user/get-projectmember-list/${data?.projectId}/${data?.tlId}`, HttpHeaders.getAuthHeader())
}
UserServices.getProjectExecutiveList1 = (data) => {
    return axios.get(`${config.apiUrl}/api/user/get-projectmember-list/${data?.projectId}/${data?.tlId}?team=${data?.team}`, HttpHeaders.getAuthHeader())
}

UserServices.getActivityDetails = (data) => {
    return axios.get(`${config.apiUrl}/api/user/get/details/${data?.id}`, HttpHeaders.getAuthHeader())
}
UserServices.updateStaff = (data) => {
    return axios.put(`${config.apiUrl}/api/user/update/${data?.id}`, data, HttpHeaders.getAuthHeader())
}
UserServices.deleteUser = (data) => {
    return axios.delete(`${config.apiUrl}/api/user/delete/${data?.id}`, HttpHeaders.getAuthHeader())
}
UserServices.uploadImage = (data) => {
    return axios.put(`${config.apiUrl}/api/user/update-profile-image`, data, HttpHeaders.getAuthHeader())
}
UserServices.createStaffWithRole = (data) => {
    return axios.post(`${config.apiUrl}/api/user/create`, data, HttpHeaders.getAuthHeader())
}
UserServices.getUserByKeyword = (data) => {
    return axios.get(`${config.apiUrl}/api/user/get-child-user-by-keyword?${data?.keyword}`, HttpHeaders.getAuthHeader())
}

export default UserServices;