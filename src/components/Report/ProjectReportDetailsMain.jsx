import React, { useState } from "react";
import MainSidebar from "../../layout/sidebarnav/MainSidebar";
import Header from "../../layout/header/Header";
import SideBarNav1 from "../../layout/sidebarnav/SideBarNav1";
import download from "../../assets/download.png";
import { IoSettingsOutline } from "react-icons/io5";
import { FaEye, FaTrash } from "react-icons/fa6";
import { useQuery } from "@tanstack/react-query";
import ReportServices from "../../services/ReportServices";
import { toast } from "react-toastify";
import ValidateAuthenticationKey from "../../utils/ValidateAuthenticationKey";
import { Link, useParams } from "react-router-dom";
import { useEffect } from "react";
import Loader from "../../utils/Loader/Loader";
import female from "../../assets/female.png";
import male from "../../assets/male.png";
import logo from "../../assets/logo.png";
import nodata from "../../assets/nodatafound.png";
import { convertToHoursOrMinutes } from "../../utils/CurrentTime";
import moment from "moment";
import { FaEdit } from "react-icons/fa";

const ProjectReportDetailsMain = () => {
  const [toggleStyle, setToggleStyle] = useState(true);
  const [projectId, setProjectId] = useState("");
  const { id } = useParams();

  const { data: userTimeSpent, isLoading: isLoadTimeSpent } = useQuery(
    ["project-report-details", projectId],
    () => ReportServices.getProjectReportDetails({ projectId }),
    {
      refetchOnWindowFocus: false,
      enabled: !!projectId,
      select: (data) => {
        if (data?.data?.error) {
          toast.error(data?.data?.message);
          return;
        }
        // console.log("project-report-details",data?.data)

        return data?.data?.data;
      },
      onError: (err) => {
        if (err?.response?.status === 401) {
          ValidateAuthenticationKey(
            err?.response?.status,
            "Your login session has expired. Please log in again."
          );
          return;
        }
      },
    }
  );

  console.log("userTimeSpent", userTimeSpent);
  useEffect(() => {
    try {
      const decodedUserId = atob(id);
      setProjectId(() => decodedUserId);
    } catch (error) {
      // console.error("Error decoding user ID:", error.message);
      // Handle the error gracefully, e.g., display an error message to the user
    }
  }, [id]);

  return (
    <>
      {isLoadTimeSpent ? (
        <Loader />
      ) : (
        <div className="dash-right-info cstm-wdth2 bg-transparent">
          <div className="row">
            <div className="col-md-8">
              <div className="team-time-bx">
                <div className="team-estimate-time">
                  <h5>Total PM Time</h5>
                  <h3>{userTimeSpent?.totalAllocatedTime || "0"} Hrs.</h3>
                </div>
                {userTimeSpent?.teamDetails?.length > 0 &&
                  userTimeSpent?.teamDetails?.map((each) => {
                    return (
                      <div className="team-estimate-time">
                        <h5>{each?.teamName || "N/A"} Team Time</h5>
                        <h3>{each?.allocatedTime || "0"} Hrs.</h3>
                      </div>
                    );
                  })}

                {/* <div className="team-estimate-time">
                  <h5>WordPress Team Time</h5>
                  <h3>120 Hrs.</h3>
                </div>
                <div className="team-estimate-time">
                  <h5>QA Team Time</h5>
                  <h3>20 Hrs.</h3>
                </div> */}
              </div>
            </div>
            <div className="col-md-4">
              <div className="d-flex justify-content-between">
                <div className="manpower-bx">
                  <h5>Total Manpower</h5>
                  <h3>{userTimeSpent?.totalManpower || "0"} </h3>
                </div>
                <div className="download-report">
                  <img src={download} alt="" />
                  <h5>Download Report</h5>
                </div>
              </div>
            </div>
          </div>

          <div className="teamwise-time-prt mt-4">
            {userTimeSpent?.teamDetails?.length > 0 &&
              userTimeSpent?.teamDetails?.map((each) => {
                return (
                  <div className="teamwise-time-bx">
                    <h3>{each?.teamName || "N/A"} Team Time</h3>
                    <ul>
                      {each?.members?.length > 0 &&
                        each?.members?.map((member) => {
                          return (
                            <li>
                              <h5>
                                <span>
                                  {
                                    <img
                                      src={
                                        member.profileImage
                                          ? member.profileImage
                                          : member?.gender === "female"
                                          ? female
                                          : member?.gender === "male"
                                          ? male
                                          : logo
                                      }
                                      alt={member.userName}
                                      style={{
                                        width: "32px",
                                        borderRadius: "50%",
                                      }}
                                    />
                                  }
                                </span>{" "}
                                {member.userName || "N/A"}
                              </h5>
                              <span className="used-time">
                                {convertToHoursOrMinutes(member?.usedTime)}/
                                {(member?.allocatedTime ||0).toFixed(1)} Hrs.
                              </span>
                            </li>
                          );
                        })}

                      {/* <li>
                    <h5>
                      <span>SK</span> Sk Mukaddar
                    </h5>
                    <span className="used-time">08/20 Hrs.</span>
                  </li> */}
                    </ul>
                  </div>
                );
              })}

            {/*             
            <div className="teamwise-time-bx">
              <h3>WordPress Team Time</h3>
              <ul>
                <li>
                  <h5>
                    <span>NY</span> Nafisa Yasmin
                  </h5>
                  <span className="used-time">12/20 Hrs.</span>
                </li>
                <li>
                  <h5>
                    <span>AD</span> Anup Das
                  </h5>
                  <span className="used-time">20/40 Hrs.</span>
                </li>
              </ul>
            </div>
            <div className="teamwise-time-bx">
              <h3>Design Team Time</h3>
              <ul>
                <li>
                  <h5>
                    <span>SS</span> Sumit Singh
                  </h5>
                  <span className="used-time">02/8 Hrs.</span>
                </li>
                <li>
                  <h5>
                    <span>SD</span> Sayani Dasgupta
                  </h5>
                  <span className="used-time">06/12 Hrs.</span>
                </li>
              </ul>
            </div> */}
          </div>

          <div className="overview-bx mt-4">
            {/* <div className="d-flex justify-content-end">
              <button className="ctd-del-btn">+ Add Milestone</button>
            </div> */}

            <div className="table-responsive mt-2">
              {userTimeSpent?.milestones?.length == 0 ? (
                <div className="no-img">
                  <img src={nodata} />
                </div>
              ) : (
                <table className="table table-bordered">
                  <thead>
                    <tr>
                      <th scope="col">
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            value=""
                            id="flexCheckDefault"
                          />
                          <label
                            className="form-check-label"
                            htmlFor="flexCheckDefault"
                          >
                            Milestone
                          </label>
                        </div>
                      </th>
                      <th scope="col">Start Date</th>
                      {/* <th scope="col">Draft Date</th> */}
                      <th scope="col">End Date</th>
                      <th scope="col">No of Task</th>
                      <th scope="col" className="text-center">
                        <IoSettingsOutline />
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {!!userTimeSpent?.milestones?.length > 0 &&
                      userTimeSpent?.milestones?.map((milestone) => {
                        return (
                          <tr>
                            <td>
                              <div className="form-check">
                                <input
                                  className="form-check-input"
                                  type="checkbox"
                                  value=""
                                  id="flexCheckDefault"
                                />
                                <label
                                  className="form-check-label"
                                  htmlFor="flexCheckDefault"
                                >
                                  {milestone?.title || "N/A"}
                                </label>
                              </div>
                            </td>
                            <td>{moment(milestone?.startDate).format("ll")}</td>
                            {/* <td>
                                         {moment(milestone?.draftDate).format("ll")}
                                     </td> */}
                            <td>{moment(milestone?.endDate).format("ll")}</td>

                            <td>{milestone?.tasksCount || 0}</td>
                            {/* <td className="settings-icon"></td> */}
                            <td className="settings-icon">
                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                  alignItems: "center",
                                }}
                              >
                                <Link
                                  className="mx-2"
                                  to={
                                    "/project/" +
                                    btoa(projectId) +
                                    "/milestone/" +
                                    btoa(milestone?.milestoneId) +
                                    "/task"
                                  }
                                >
                                  <FaEye />
                                </Link>
                                {/* {(checkTlnTeam && teamListId == loggedInUserTeamId) && (
                                                 <Link
                                                     to={
                                                         "/project/milestone/" +
                                                         btoa(projectId) +
                                                         "/" +
                                                         btoa(milestone?._id)
                                                     }
                                                 >
                                                     <FaEdit />
                                                 </Link>
                                             )} */}
                                {/* {(checkTlnTeam && teamListId == loggedInUserTeamId) && (
                                                 <button type="button" onClick={()=>handleDelete(milestone?._id)}>
                                                     <FaTrash />

                                                 </button>
                                                 // <Link
                                                 //     to={
                                                 //         "/project/milestone/" +
                                                 //         btoa(projectId) +
                                                 //         "/" +
                                                 //         btoa(milestone?._id)
                                                 //     }
                                                 // >
                                                 // </Link>
                                             )} */}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProjectReportDetailsMain;
