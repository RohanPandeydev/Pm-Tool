import axios from "axios";
import config from "../config";
import HttpHeaders from "../helper/httphelper/HttpHeaders";

const ReportServices = {};

ReportServices.getUserReportTeamWiseCount = (data) => {
  return axios.get(
    `${config.apiUrl}/api/team/getmembersbyteam`,
    HttpHeaders.getAuthHeader()
  );
};
ReportServices.getProjectReportTeamWiseCount = (data) => {
  return axios.get(
    `${config.apiUrl}/api/project/getprojectsreportcountbyteam`,
    HttpHeaders.getAuthHeader()
  );
};
ReportServices.getProjectReportTeamWiseCountStatus = (data) => {
  if (data?.teamId) {
    return axios.get(
      `${config.apiUrl}/api/project/getprojectsreportstatuscountbyteam?teamId=${data?.teamId}`,
      HttpHeaders.getAuthHeader()
    );
  }
  return axios.get(
    `${config.apiUrl}/api/project/getprojectsreportstatuscountbyteam`,
    HttpHeaders.getAuthHeader()
  );
};
ReportServices.getProjectReportTeamWiseList = (data) => {
  console.log(data, "Data=====================");
  if (!!data?.teamId && !!data?.projectStatus) {
    return axios.get(
      `${config.apiUrl}/api/project/getprojectsreportteam?teamId=${data?.teamId}&projectStatus=${data?.projectStatus}&startDate=${data?.startDate}&endDate=${data?.endDate}&projectName=${data?.projectSearch}&user=${data?.userId}`,
      HttpHeaders.getAuthHeader()
    );
  } else if (!!data?.teamId) {
    return axios.get(
      `${config.apiUrl}/api/project/getprojectsreportteam?teamId=${data?.teamId}&startDate=${data?.startDate}&endDate=${data?.endDate}&projectName=${data?.projectSearch}&user=${data?.userId}`,
      HttpHeaders.getAuthHeader()
    );
  } else if (!!data?.projectStatus) {
    return axios.get(
      `${config.apiUrl}/api/project/getprojectsreportteam?projectStatus=${data?.projectStatus}&startDate=${data?.startDate}&endDate=${data?.endDate}&projectName=${data?.projectSearch}&user=${data?.userId}`,
      HttpHeaders.getAuthHeader()
    );
  }
  return axios.get(
    `${config.apiUrl}/api/project/getprojectsreportteam?startDate=${data?.startDate}&endDate=${data?.endDate}&projectName=${data?.projectSearch}&user=${data?.userId}`,
    HttpHeaders.getAuthHeader()
  );
};
ReportServices.getUserReportTeamWiseList = (data) => {
  if (!!data?.srch && !!data?.teamId) {
    return axios.get(
      `${config.apiUrl}/api/team/getmembersdetailsbyteam/${data?.teamId}?srch=${data?.srch}&${data?.pagination}`,
      HttpHeaders.getAuthHeader()
    );
  } else if (!!data?.teamId) {
    return axios.get(
      `${config.apiUrl}/api/team/getmembersdetailsbyteam/${data?.teamId}?${data?.pagination}`,
      HttpHeaders.getAuthHeader()
    );
  } else if (!!data?.srch) {
    return axios.get(
      `${config.apiUrl}/api/team/getmembersdetailsbyteam?srch=${data?.srch}&${data?.pagination}`,
      HttpHeaders.getAuthHeader()
    );
  }
  return axios.get(
    `${config.apiUrl}/api/team/getmembersdetailsbyteam?${data?.pagination}`,
    HttpHeaders.getAuthHeader()
  );
};
ReportServices.getProjectReportDetails = (data) => {
  return axios.get(
    `${config.apiUrl}/api/project/getprojectreportbyid/${data?.projectId}`,
    HttpHeaders.getAuthHeader()
  );
};
ReportServices.getUserDetails = (data) => {
  if (!!data?.projectStatus && data?.projectName) {
    return axios.get(
      `${config.apiUrl}/api/user/details-by-user/${data?.userId}?projectStatus=${data?.projectStatus}&srch=${data?.projectName}&${data?.pagination}`,
      HttpHeaders.getAuthHeader()
    );
  }
  if (!!data?.projectName) {
    return axios.get(
      `${config.apiUrl}/api/user/details-by-user/${data?.userId}?srch=${data?.projectName}&${data?.pagination}`,
      HttpHeaders.getAuthHeader()
    );
  }
  if (!!data?.projectStatus) {
    return axios.get(
      `${config.apiUrl}/api/user/details-by-user/${data?.userId}?projectStatus=${data?.projectStatus}&${data?.pagination}`,
      HttpHeaders.getAuthHeader()
    );
  }
  return axios.get(
    `${config.apiUrl}/api/user/details-by-user/${data?.userId}?${data?.pagination}`,
    HttpHeaders.getAuthHeader()
  );
};
ReportServices.getUserDetailsCountStatus = (data) => {
  return axios.get(
    `${config.apiUrl}/api/user/details-by-count-user/${data?.userId}`,
    HttpHeaders.getAuthHeader()
  );
};
ReportServices.getUserTimeSpentDetails = (data) => {
  if (data?.startDate && data?.endDate) {
    return axios.get(
      `${config.apiUrl}/api/user/daily-timespent-by-user/${data?.userId}?startDate=${data.startDate}&endDate=${data?.endDate}`,
      HttpHeaders.getAuthHeader()
    );
  }
  return axios.get(
    `${config.apiUrl}/api/user/daily-timespent-by-user/${data?.userId}`,
    HttpHeaders.getAuthHeader()
  );
};
ReportServices.getUserMonthlyTimeSpent = (data) => {
  if (data?.startDate && data?.endDate) {
    return axios.get(
      `${config.apiUrl}/api/report/user-monthly-work-time?startDate=${data.startDate}&endDate=${data?.endDate}`,
      HttpHeaders.getAuthHeader()
    );
  }
  return axios.get(
    `${config.apiUrl}/api/user/daily-timespent-by-user/${data?.userId}`,
    HttpHeaders.getAuthHeader()
  );
};
ReportServices.getUserListByTeam = (data) => {
  return axios.get(
    `${config.apiUrl}/api/user/report-user-by-team/${data?.teamId}`,
    HttpHeaders.getAuthHeader()
  );
};

export default ReportServices;
