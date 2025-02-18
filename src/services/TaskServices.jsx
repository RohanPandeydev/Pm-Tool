
import axios from "axios"
import config from "../config"
import HttpHeaders from "../helper/httphelper/HttpHeaders"


const TaskServices = {}


TaskServices.findTask = (type) => {

    return axios.get(`${config.apiUrl}/api/projectmilestone-task-by-startdate?${type}`, HttpHeaders.getAuthHeader())
}



export default TaskServices;