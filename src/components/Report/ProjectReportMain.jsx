/* eslint-disable react/jsx-key */
import React, { useState } from "react";

import background from "../../assets/bg3.png";
import tp1 from "../../assets/tp1.png";
import tp2 from "../../assets/tp2.png";
import tp3 from "../../assets/tp3.png";
import tp4 from "../../assets/tp4.png";
import tp5 from "../../assets/tp5.png";
import tp6 from "../../assets/tp6.png";
import tp7 from "../../assets/tp7.png";
import tp8 from "../../assets/tp8.png";
import icon1 from "../../assets/icon1.png";
import icon2 from "../../assets/icon2.png";
import icon3 from "../../assets/icon3.png";
import icon4 from "../../assets/icon4.png";
import icon5 from "../../assets/icon5.png";
import icon6 from "../../assets/icon6.png";
import DashboardTeamCard from "../../utils/DashboardTeamCard";
import { useQuery } from "@tanstack/react-query";
import DashboardServices from "../../services/DashboardServices";
import ValidateAuthenticationKey from "../../utils/ValidateAuthenticationKey";
import { toast } from "react-toastify";
import { IoSearchSharp, IoSettingsOutline } from "react-icons/io5";
import { FaEye, FaGoogleDrive } from "react-icons/fa6";
import ProjectReportTeamCard from "./ProjectReportTeamCard";
import ReportServices from "../../services/ReportServices";
import { Link } from "react-router-dom";
import { IoIosAddCircle } from "react-icons/io";
import convertSecondsToHHMMSS, {
  convertHHMMSS_HM,
} from "../../utils/TotalWorkingTime";
import RemoveUnderscore from "../../utils/RemoveUnderScoreAndMakeCapital";
import moment from "moment";
import nodata from "../../assets/nodatafound.png";
import StorageData from "../../helper/storagehelper/StorageData";
import config from "../../config";
import Loader from "../../utils/Loader/Loader";
import { GrPowerReset } from "react-icons/gr";
const ProjectReportMain = () => {
  const roleUId = StorageData?.getUserData()?.role?.roleUId;
  const loggedUserId = StorageData?.getUserData()?._id;
  // const loggedUserData = StorageData?.getUserData();
  const [statusMappingList, setstatusMappingList] = useState({});
  const [teamId, setTeamId] = useState("");
  const [projectStatus, setProjectStatus] = useState("");
  const statusMappingListing = {
    "Not Started Projects": "not_started",
    "Ongoing Projects": "ongoing",
    "Completed Projects": "complete",
    "Hold Projects": "hold",
    "Waiting For Feedback Projects": "waiting_for_feedback",
  };
  const currentDate=moment(new Date()).format("YYYY-MM-DD")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("");
  const [projectSearch,setProjectSearch]=useState("")
  const [userId,setUserId]=useState("")


  const handleResetDateFilter=()=>{
    setStartDate("")
    setEndDate("")
    setUserId("")
  }

  const [teamsList] = useState([
    {
      name: "Design",
      target: 10,
      image: tp1,
      id: 1,
    },
    {
      name: "React/App",
      target: 0,
      image: tp2,
      id: 2,
    },
    {
      name: "Laravel",
      target: 0,
      image: tp3,
      id: 3,
    },
    {
      name: "Wordpress",
      target: 0,
      image: tp4,
      id: 4,
    },
    {
      name: "Q/A",
      target: 0,
      image: tp5,
      id: 5,
    },
    {
      name: "IOT",
      target: 10,
      image: tp6,
      id: 6,
    },
    {
      name: "Digital Marketing",
      target: 0,
      image: tp7,
      id: 7,
    },
    {
      name: "AI",
      target: 0,
      image: tp8,
      id: 8,
    },
  ]);
  // Team Wise Project Count
  const { data: teamWiseProject, isLoading } = useQuery(
    ["project-report-team-wise-member-count"],
    () => ReportServices.getProjectReportTeamWiseCount(),
    {
      refetchOnWindowFocus: false,
      select: (data) => {
        const status = [
          "Not Started Projects",
          "Ongoing Projects",
          "Completed Projects",
          "Hold Projects",
          "Waiting For Feedback Projects",
        ];
        const icons = [icon1, icon2, icon3, icon4, icon6, icon5];
        const statusMapping = {
          "Not Started Projects": "not_started",
          "Ongoing Projects": "ongoing",
          "Completed Projects": "complete",
          "Hold Projects": "hold",
          "Waiting For Feedback Projects": "waiting_for_feedback",
        };
        // setstatusMappingList(()=>statusMapping)
        const statusCounts = status.map((each, index) => {
          let count = 0;
          if (each === "Total Projects") {
            count = data?.data?.data?.totalProjects || 0;
          } else {
            const statusKey = statusMapping[each];
            count = data?.data?.data?.overallStatusCounts[statusKey] || 0;
          }
          return {
            status: each,
            count: count,
            icon: icons[index],
          };
        });
        // setStatus(()=>statusCounts)
        console.log("status Count", statusCounts);

        // console.log("========Team",data?.data,"=======")
        const teamWiseProject = data?.data?.data?.teamProjects
          ?.filter((team) => !!team?.teamId)
          .map((team) => {
            const matchingTeam = teamsList.find((t) =>
              t.name.includes(team?.teamName)
            );

            return {
              id: team?.teamId,
              name: team?.teamName,
              image: matchingTeam ? matchingTeam.image : tp1,
              count: team?.projectCount,
            };
          });
        return {
          totalCount: data?.data?.data?.totalProjects || 0,
          teamWiseProject: teamWiseProject,
          statusCounts: statusCounts,
          statusMapping: statusMapping,
        };
      },
      onError: (err) => {
        if (err?.response?.status === 401) {
          ValidateAuthenticationKey(
            err?.response?.status,
            "Your login session has expired. Please log in again."
          );
          return;
        }
        // console.log(err?.response);
        toast.error(err?.response?.data?.message || err?.message, {
          delay: 10,
        });
      },
    }
  );
  const { data: teamWiseStatus, isLoading: isStatus } = useQuery(
    ["project-report-status", teamId],
    () =>
      ReportServices.getProjectReportTeamWiseCountStatus({ teamId: teamId }),
    {
      refetchOnWindowFocus: false,
      select: (data) => {
        console.log("========Team Status", data?.data, "=======");

        const status = [
          "Not Started Projects",
          "Ongoing Projects",
          "Completed Projects",
          "Hold Projects",
          "Waiting For Feedback Projects",
        ];
        const icons = [icon1, icon2, icon3, icon4, icon6, icon5];
        const statusMapping = {
          "Not Started Projects": "not_started",
          "Ongoing Projects": "ongoing",
          "Completed Projects": "complete",
          "Hold Projects": "hold",
          "Waiting For Feedback Projects": "waiting_for_feedback",
        };
        // setstatusMappingList(()=>statusMapping)
        const statusCounts = status.map((each, index) => {
          let count = 0;

          const statusKey = statusMapping[each];
          count = data?.data?.data?.overallStatusCounts[statusKey] || 0;

          return {
            status: each,
            count: count,
            icon: icons[index],
          };
        });
        // setStatus(()=>statusCounts)
        console.log("status Count===?", statusCounts);

        return {
          statusCounts: statusCounts,
          statusMapping: statusMapping,
        };
      },
      onError: (err) => {
        if (err?.response?.status === 401) {
          ValidateAuthenticationKey(
            err?.response?.status,
            "Your login session has expired. Please log in again."
          );
          return;
        }
        // console.log(err?.response);
        toast.error(err?.response?.data?.message || err?.message, {
          delay: 10,
        });
      },
    }
  );
  const { data: teamWiseList, isLoading: TeamWiseListLoad } = useQuery(
    ["project-report-team-memeber", teamId, projectStatus,startDate,endDate,projectSearch,userId],
    () =>
      ReportServices.getProjectReportTeamWiseList({
        teamId: teamId,
        projectStatus: projectStatus,
        projectSearch:projectSearch,
        startDate:startDate,
        endDate:endDate,
        userId:userId
      }),
    {
      refetchOnWindowFocus: false,
      select: (data) => {
        // const status = [
        //   "Not Started Projects",
        //   "Ongoing Projects",
        //   "Completed Projects",
        //   "Hold Projects",
        //   "Waiting For Feedback Projects",
        // ];
        // const icons = [icon1, icon2, icon3, icon4, icon6, icon5];
        // const statusMapping = {
        //   "Not Started Projects": "not_started",
        //   "Ongoing Projects": "ongoing",
        //   "Completed Projects": "complete",
        //   "Hold Projects": "hold",
        //   "Waiting For Feedback Projects": "waiting_for_feedback",
        // };
        // // setstatusMappingList(()=>statusMapping)
        // const statusCounts = status.map((each, index) => {
        //   let count = 0;
        //   if (each === "Total Projects") {
        //     count = data?.data?.data?.totalProjects || 0;
        //   } else {
        //     const statusKey = statusMapping[each];
        //     count = data?.data?.data?.overallStatusCounts[statusKey] || 0;
        //   }
        //   return {
        //     status: each,
        //     count: count,
        //     icon: icons[index],
        //   };
        // });

        // console.log("========Report", data?.data, "=======");
        return {
          // statusCounts,
          teamProjects: data?.data?.data?.teamProjects,
        };
      },
      onError: (err) => {
        if (err?.response?.status === 401) {
          ValidateAuthenticationKey(
            err?.response?.status,
            "Your login session has expired. Please log in again."
          );
          return;
        }
        // console.log(err?.response);
        toast.error(err?.response?.data?.message || err?.message, {
          delay: 10,
        });
      },
    }
  );
  // User By Team
  const { data: userList, isLoading: isUserListLoaded } = useQuery(
    ["project-report-user-list-team-id", teamId],
    () =>
      ReportServices.getUserListByTeam({
        teamId: teamId,
      }),
    {
      enabled: !!teamId,
      refetchOnWindowFocus: false,
      select: (data) => {
        return data?.data?.data?.users;
        // statusCounts,
      },
      onError: (err) => {
        if (err?.response?.status === 401) {
          ValidateAuthenticationKey(
            err?.response?.status,
            "Your login session has expired. Please log in again."
          );
          return;
        }
        // console.log(err?.response);
        toast.error(err?.response?.data?.message || err?.message, {
          delay: 10,
        });
      },
    }
  );

  // console.log("userList", userList);
  const handleTeamChange = (teamId) => {
    setTeamId(teamId);
  };

  const handleProjectStatus = (status) => {
    setProjectStatus(teamWiseProject.statusMapping[status]);
  };



  // console.log(startDate, endDate);
  const handleStartDate = (e) => {
    setStartDate(e?.target?.value);
  };
  const handleEndDate = (e) => {
    if(startDate>e.target.value){
      toast.error("End date can't be lower than start date ")
      return
    }

    setEndDate(e?.target?.value);
  };

  const handleProjectNameSearch=(e)=>{
    setProjectSearch(e?.target?.value)
  }

  const handleReset = () => {

    setProjectStatus("");
    setTeamId("");
    setStartDate("")
    setEndDate("")
    setUserId("")
    setProjectSearch("")
  };

  const handleUserDropdown=(e)=>{
    setUserId(e.target.value)

  }

  return (
    <>
      <div className="dash-right-info cstm-wdth2 bg-transparent">
        <div
          className="lead-bx"
          style={{ backgroundImage: `url(${background})` }}
        >
          <button
            className="dropdown-toggle refresh-btn"
            type="button"
            id="dropdownMenuButton1"
            aria-expanded="false"
            data-bs-toggle="tooltip"
            data-bs-placement="top"
            onClick={handleReset}
          >
            <GrPowerReset title="Reset" />
          </button>
          <h5>Total Project</h5>
          <h3>{(!isLoading && teamWiseProject?.totalCount) || 0}</h3>
        </div>

        <div className="right-nav-content-right mt-4 report-page">
          {roleUId != config?.teamLeader &&
            !isLoading &&
            teamWiseProject?.teamWiseProject?.length > 0 &&
            teamWiseProject?.teamWiseProject?.map((team) => {
              return (
                <ProjectReportTeamCard
                  handleTeamChange={handleTeamChange}
                  key={team?.id}
                  img={team?.image}
                  name={team?.name}
                  count={team?.count}
                  id={team?.id}
                  teamId={teamId}
                />
              );
            })}
        </div>

        <div className="right-nav-content-right mt-4 cstm-hovr report-page">
          <div
            className="status-bx2"
            style={{
              cursor: "pointer",
              border: `${projectStatus == "" ? "2px solid #eac92c" : ""}`,
            }}
          >
            {/* <a href="#"> */}
            <div className="d-flex align-items-start justify-content-between">
              <div onClick={() => setProjectStatus("")}>
                <h5>Total Projects</h5>
                <h3>
                  {(!isStatus &&
                    teamWiseStatus.statusCounts.reduce((sum, item) => {
                      return sum + (item.count || 0);
                    }, 0)) ||
                    0}
                </h3>
              </div>
              <img src={icon1} alt="" />
            </div>
            {/* </a> */}
          </div>
          {!isStatus &&
            teamWiseStatus?.statusCounts?.length > 0 &&
            teamWiseStatus?.statusCounts?.map((each) => {
              return (
                <div
                  onClick={() => handleProjectStatus(each?.status)}
                  className="status-bx2"
                  style={{
                    cursor: "pointer",
                    border: `${
                      projectStatus == statusMappingListing[each?.status]
                        ? "2px solid #eac92c"
                        : ""
                    }`,
                  }}
                >
                  {/* <a href='#'> */}
                  <div className="d-flex align-items-start justify-content-between">
                    <div>
                      <h5>{each?.status || "N/A"}</h5>
                      <h3>{each?.count || 0}</h3>
                    </div>
                    <img src={each?.icon || icon1} alt="" />
                  </div>
                  {/* </a> */}
                </div>
              );
            })}
        </div>

        <div className="overview-bx mt-3">
          <div className="overview-header cstm-add">
            <div className="right-nav-content-right">
              <input
                className="form-control"
                type="date"
                placeholder="Start Date"
                value={startDate}
                onChange={handleStartDate}
              />
              <input
                className="form-control"
                type="date"
                placeholder="End Date"
                value={endDate}
                onChange={handleEndDate}
              />
              {!isUserListLoaded && (
                <select className="form-select" onChange={handleUserDropdown} value={userId} >
                  <option value={""}>Select User</option>
                  {userList?.length > 0 &&
                    userList?.map((each) => {
                      return (
                        <option value={each?._id}>{each?.userName}</option>
                      );
                    })}
                </select>
              )}

              <button
                className="refresh-btn"
                type="button"
                id="dropdownMenuButton1"
                aria-expanded="false"
                data-bs-toggle="tooltip"
                data-bs-placement="top"
                onClick={handleResetDateFilter}
              >
                <GrPowerReset title="Reset" />
              </button>
            </div>

            <div className="search-bx">
              {/* <form> */}
                <input type="text" placeholder="Search" onChange={handleProjectNameSearch} value={projectSearch} />
                <div className="search-icon" >
                  <IoSearchSharp />
                </div>
              {/* </form> */}
            </div>
          </div>

          <div className="table-responsive mt-3">
            {TeamWiseListLoad ? (
              <Loader />
            ) : teamWiseList?.teamProjects?.length == 0 ? (
              <div className="no-img">
                <img src={nodata} />
              </div>
            ) : (
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th scope="col">
                      <div className="form-check">
                        <label
                          className="form-check-label"
                          htmlFor="flexCheckDefault"
                        >
                          Code
                        </label>
                      </div>
                    </th>
                    <th scope="col">Name</th>
                    <th scope="col">Customer Details</th>
                    <th scope="col">Account Manager</th>
                    <th scope="col">Project Manager</th>
                    <th scope="col">Start Date</th>
                    <th scope="col">End Date</th>
                    <th scope="col">Project Status</th>
                    <th scope="col">EstimatedTime </th>

                    <th scope="col" className="settings-icon">
                      <IoSettingsOutline />
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {teamWiseList?.teamProjects?.length > 0 &&
                    teamWiseList?.teamProjects?.map((each, ind) => {
                      return (
                        <tr key={each?._id}>
                          <td
                          // onClick={() =>
                          //   OffCanvastoggle(each?._id, each?.name)
                          // }
                          >
                            <div className="form-check">
                              <label
                                className="form-check-label"
                                htmlFor="flexCheckDefault"
                              >
                                {"#"}
                                {each?.projectCode || "SB00000"}
                              </label>
                            </div>
                          </td>
                          <td
                          // onClick={() =>
                          //   OffCanvastoggle(each?._id, each?.name)
                          // }
                          >
                            {" "}
                            {each?.name}
                          </td>
                          <td>{each?.customerName || "N/A"}</td>

                          <td>{each?.assistantManagerId?.userName || "N/A"}</td>
                          <td>{each?.projectManagerId?.userName || "N/A"}</td>
                          {/* <td>
                                                                            <div>
                                                                                {each?.teams?.map((elem) => (
                                                                                    <p key={elem?._id}>
                                                                                        {elem?.team?.name}(
                                                                                        {elem?.teamLeader?.userName ||
                                                                                            "N/A"}
                                                                                        )
                                                                                    </p>
                                                                                ))}
                                                                            </div>
                                                                        </td> */}
                          <td>
                            {(each?.startDate &&
                              moment(each?.startDate).format("ll")) ||
                              "N/A"}
                          </td>
                          <td>
                            {(each?.endDate &&
                              moment(each?.endDate).format("ll")) ||
                              "N/A"}
                          </td>
                          {/* <td>
                                                                            {" "}
                                                                            {each?.priceType.toUpperCase() || "N/A"}
                                                                        </td> */}
                          {/* <td>
                                                                            {" "}
                                                                            {getCurrencySymbol(each?.currencyType)} &nbsp;{each?.price && FormatNumber(each?.price || 0)}
                                                                        </td> */}
                          <td> {RemoveUnderscore(each?.status || "N/A")}</td>
                          <td> {convertHHMMSS_HM(each?.estimatedTime || 0)}</td>

                          {/* <td>
                                                                            {moment(each?.updateAt).format("ll")}
                                                                        </td> */}
                          {
                            <td className="settings-icon">
                              {/* <div className="dropdown triple-dot"> */}
                              {/* <button
                                                                                        className="btn btn-secondary dropdown-toggle"
                                                                                        type="button"
                                                                                        id="dropdownMenuButton1"
                                                                                        data-bs-toggle="dropdown"
                                                                                        aria-expanded="false"
                                                                                    >
                                                                                        <CiMenuKebab />
                                                                                    </button> */}
                              {/* <ul
                                                                                        className="dropdown-menu"
                                                                                        aria-labelledby="dropdownMenuButton1"
                                                                                    > */}
                              {
                                <>
                                  {/* {
                                                                                            (loggedUserId==each?.projectManagerId?._id && roleUId==config.Manager)&&  <li>
                                                                                            <a
                                                                                                className="dropdown-item"
                                                                                                href="#"
                                                                                                
                                                                                            onClick={() =>
                                                                                                handleUpdate(each)
                                                                                            }
                                                                                            >
                                                                                            Update
                                                                                            </a>
                                                                                        </li>

                                                                                            } */}

                                  {roleUId != config.teamLeader ||
                                  each?.isMilestoneAdded ? (
                                    <Link
                                      className="mx-2"
                                      to={"/report/project/" + btoa(each?._id)}
                                      // onClick={() =>
                                      //     handleUpdate(each)
                                      // }
                                    >
                                      <FaEye />
                                    </Link>
                                  ) : (
                                    roleUId == config.teamLeader &&
                                    !each?.isMilestoneAdded && (
                                      <Link
                                        className="mx-2"
                                        to={
                                          "/project/milestone/" +
                                          btoa(each?._id)
                                        }
                                        // onClick={() =>
                                        //     handleUpdate(each)
                                        // }
                                      >
                                        <IoIosAddCircle />
                                      </Link>
                                    )
                                  )}

                                  <Link
                                    className=""
                                    to={"/drive/" + btoa(each?._id)}
                                  >
                                    <FaGoogleDrive />
                                  </Link>
                                </>
                              }
                              {/* </ul> */}
                              {/* </div> */}
                            </td>
                          }
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ProjectReportMain;
