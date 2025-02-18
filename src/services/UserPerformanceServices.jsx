
import axios from "axios"
import config from "../config"
import HttpHeaders from "../helper/httphelper/HttpHeaders"
const UserPerformancesServices = {}

UserPerformancesServices.getUserDetails = (formdata) => {
    // ////console.log("====>", formdata)
    return axios.get(`${config.apiUrl}/api/stats/getbyuser/${formdata?.id}`, HttpHeaders.getAuthHeader())
}
UserPerformancesServices.getUserDataByRange = (formdata) => {
    return axios.get(`${config.apiUrl}/api/stats/getbydaterange/${formdata?.id}/${formdata?.fromDate}/${formdata?.toDate}`, formdata, HttpHeaders.getAuthHeader())
}
UserPerformancesServices.getUserDataByMonth = (formdata) => {
    return axios.get(`${config.apiUrl}/api/stats/getbymonth/${formdata?.id}/${formdata?.month}/${formdata?.year}`, HttpHeaders.getAuthHeader())
}
UserPerformancesServices.getOverAllUserDataByMonth = (formdata) => {
    return axios.get(`${config.apiUrl}/api/stats/getoverallstatsbymonth/${formdata?.month}/${formdata?.year}`, HttpHeaders.getAuthHeader())
}
UserPerformancesServices.getOverAllUserDataByRange = (formdata) => {
    return axios.get(`${config.apiUrl}/api/stats/getoverallstatsbydaterange/${formdata?.fromDate}/${formdata?.toDate}`, HttpHeaders.getAuthHeader())
}
UserPerformancesServices.getOverAllUserDetails = (formdata) => {
    return axios.get(`${config.apiUrl}/api/stats/getoverallstats`, HttpHeaders.getAuthHeader())
}
UserPerformancesServices.getOverAllPerformance = (formdata) => {
    if (Object.keys(formdata?.filterQuery).length > 0 && formdata?.filterQuery.hasOwnProperty('fromDate') && formdata?.filterQuery.hasOwnProperty('toDate')) {

        return axios.get(`${config.apiUrl}/api/stats/getperformancebyall?fromDate=${formdata?.filterQuery?.fromDate}&toDate=${formdata?.filterQuery?.toDate}`, HttpHeaders.getAuthHeader())
    }
    else if (Object.keys(formdata?.filterQuery).length > 0 && formdata?.filterQuery.hasOwnProperty('month') && formdata?.filterQuery.hasOwnProperty('year')) {
        return axios.get(`${config.apiUrl}/api/stats/getperformancebyall?month=${formdata?.filterQuery?.month}&year=${formdata?.filterQuery?.year}`, HttpHeaders.getAuthHeader())


    }
    return axios.get(`${config.apiUrl}/api/stats/getperformancebyall`, HttpHeaders.getAuthHeader())

}
UserPerformancesServices.getOverAllPerformancebyUserId = (formdata) => {
    if (Object.keys(formdata?.filterQuery).length > 0 && formdata?.filterQuery.hasOwnProperty('fromDate') && formdata?.filterQuery.hasOwnProperty('toDate')) {

        return axios.get(`${config.apiUrl}/api/stats/getperformancebyall?id=${formdata?.id}&fromDate=${formdata?.filterQuery?.fromDate}&toDate=${formdata?.filterQuery?.toDate}`, HttpHeaders.getAuthHeader())
    }
    else if (Object.keys(formdata?.filterQuery).length > 0 && formdata?.filterQuery.hasOwnProperty('month') && formdata?.filterQuery.hasOwnProperty('year')) {
        return axios.get(`${config.apiUrl}/api/stats/getperformancebyall?id=${formdata?.id}&month=${formdata?.filterQuery?.month}&year=${formdata?.filterQuery?.year}`, HttpHeaders.getAuthHeader())


    }
    return axios.get(`${config.apiUrl}/api/stats/getperformancebyall?id=${formdata?.id}`, HttpHeaders.getAuthHeader())

}

export default UserPerformancesServices;