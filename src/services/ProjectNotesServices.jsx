

import axios from "axios"
import config from "../config"
import HttpHeaders from "../helper/httphelper/HttpHeaders"
const ProjectNotesServices = {}
ProjectNotesServices.create = (data) => {
    return axios.post(`${config.apiUrl}/api/dashboard/team-wise-project/get/${data?.id}`,data, HttpHeaders.getAuthHeader())
}









export default ProjectNotesServices;