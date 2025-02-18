import React, { useMemo, useState } from "react";
import background from "../../assets/bg3.png";
import tp1 from "../../assets/tp1.png";
import tp2 from "../../assets/tp2.png";
import tp3 from "../../assets/tp3.png";
import tp4 from "../../assets/tp4.png";
import tp5 from "../../assets/tp5.png";
import tp6 from "../../assets/tp6.png";
import tp7 from "../../assets/tp7.png";
import tp8 from "../../assets/tp8.png";
import DashboardTeamCard from "../../utils/DashboardTeamCard";
import { useQuery } from "@tanstack/react-query";
import DashboardServices from "../../services/DashboardServices";
import ValidateAuthenticationKey from "../../utils/ValidateAuthenticationKey";
import { toast } from "react-toastify";
import { IoSearchSharp, IoSettingsOutline } from "react-icons/io5";
import { FaEye } from "react-icons/fa6";
import ProjectTeamCard from "./ProjectReportTeamCard";
import UserReportTeamCard from "./UserReportTeamCard";
import { Link } from "react-router-dom";
import ReportServices from "../../services/ReportServices";
import Loader from "../../utils/Loader/Loader";
import nodata from "../../assets/nodatafound.png";
import moment from "moment";
import config from "../../config";
import { GrPowerReset } from "react-icons/gr";
import StorageData from "../../helper/storagehelper/StorageData";
import Pagination from "../../utils/Pagination";
const UserReportMain = () => {
  const [teamId, setTeamId] = useState("");
  const [status, setStatus] = useState([]);
  const [userSearch, setUserSearch] = useState("");
  const loggedInUserRoleId = StorageData.getUserData()?.role?.roleUId;

  //Pagination
  const [pageid, setPageId] = useState(1);
  const [page_limit, setPage_Limit] = useState([5, 10, 25, 50, 100]);
  const [data_per_page, setData_Per_Page] = useState({
    final_no: 0,
    initial_no: 1,
    total_no: 0,
  });
  //End

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
  // Team Wise User Count
  const { data: teamWiseProject, isLoading } = useQuery(
    ["user-report-team-wise-member-count"],
    () => ReportServices.getUserReportTeamWiseCount(),
    {
      refetchOnWindowFocus: false,
      select: (data) => {
        console.log("========", data?.data?.data?.teams, "=======");
        const teamWiseProject = data?.data?.data?.teams?.teamUserCounts
          ?.filter((team) => !!team?.team?._id)
          .map((team) => {
            const matchingTeam = teamsList.find((t) =>
              t.name.includes(team?.team?.name)
            );

            return {
              id: team?.team?._id,
              name: team?.team?.name,
              image: matchingTeam ? matchingTeam.image : tp1,
              count: team?.userCount,
            };
          });
        return {
          totalCount: data?.data?.data?.teams?.totalUserCount || 0,
          teamWiseProject: teamWiseProject,
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
    ["user-report-team-memeber", teamId, userSearch, pageid ? pageid : 1],
    () =>
      ReportServices.getUserReportTeamWiseList({
        teamId: teamId || "",
        srch: userSearch,
        pagination:`page=${pageid}&limit=${5}`
      }),
    {
      refetchOnWindowFocus: false,
      select: (data) => {
        // console.log("========",data?.data,"=======")
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
        // console.log(err?.response);
        toast.error(err?.response?.data?.message || err?.message, {
          delay: 10,
        });
      },
    }
  );

  const handleTeamChange = (teamId) => {
    // console.log("teamId",teamId)
    setTeamId(() => teamId);
    setPageId(1)
    return;
  };

  const handleChange = (e) => {
    setPageId(1)
    setUserSearch(e?.target?.value);
  };

  const handleReset = () => {
    setTeamId("");
    setUserSearch("");
  };
  // console.log("teamWiseList",teamWiseList)
  //It Control Page Change
  const handlePageChange = (id) => {
    setPageId(id);
  };

  const data_per_pages = useMemo(() => {
    return {
      initial_no:
        parseInt(teamWiseList?.pagination?.page) *
          parseInt(teamWiseList?.pagination?.limit) -
        parseInt(teamWiseList?.pagination?.limit) +
        1,
      final_no:
        parseInt(teamWiseList?.pagination?.total) >
        parseInt(teamWiseList?.pagination?.limit) *
          parseInt(teamWiseList?.pagination?.page)
          ? parseInt(teamWiseList?.pagination?.limit) *
            parseInt(teamWiseList?.pagination?.page)
          : teamWiseList?.pagination?.total,
      total_no: teamWiseList?.pagination?.total,
    };
  }, [teamWiseList?.pagination, TeamWiseListLoad]);
  return (
    <>
      {" "}
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
          <h5>Total Staff</h5>

          <h3>{teamWiseProject?.totalCount || 0}</h3>
        </div>

        <div className="right-nav-content-right mt-4 report-page">
          {loggedInUserRoleId != config?.teamLeader &&
            !isLoading &&
            teamWiseProject?.teamWiseProject?.length > 0 &&
            teamWiseProject?.teamWiseProject?.map((team) => {
              return (
                <UserReportTeamCard
                  key={team?.id}
                  img={team?.image}
                  handleTeamChange={handleTeamChange}
                  name={team?.name}
                  count={team?.count}
                  id={team?.id}
                  teamId={teamId}
                />
              );
            })}
        </div>

        <div className="overview-bx mt-3">
          <div className="overview-header cstm-add">
            <div className="right-nav-content-right">
              {/* <input
                className="form-control"
                type="date"
                placeholder="Start Date"
                value=""
              />
              <input
                className="form-control"
                type="date"
                placeholder="End Date"
                value=""
              />
              <select className="form-select">
                <option>Select Search Type</option>
                <option>Self</option>
                <option>TL</option>
              </select> */}
            </div>

            <div className="search-bx">
              {/* <form > */}
              <input
                type="text"
                onChange={handleChange}
                value={userSearch}
                placeholder="Search"
              />
              <div className="search-icon">
                <IoSearchSharp />
              </div>
              {/* </form> */}
            </div>
          </div>

          <div className="table-responsive mt-3">
            {TeamWiseListLoad ? (
              <Loader />
            ) : teamWiseList?.members?.length == 0 ? (
              <div className="no-img">
                <img src={nodata} />
              </div>
            ) : (
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th>
                      <div className="form-check">
                        <label>SL</label>
                      </div>
                    </th>
                    <th>Name</th>
                    <th>Role</th>
                    <th>Reporting</th>
                    <th>Team</th>
                    <th>Email</th>
                    <th>Contact</th>
                    <th>Last Update On</th>
                    <th className="settings-icon">
                      <IoSettingsOutline />
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {teamWiseList?.members?.map((each, ind) => {
                    // if (each.role.roleUId == config.superAdmin) return;
                    return (
                      <tr>
                        <td>{ind + 1}</td>
                        <td>{each?.userName || "N/A"}</td>
                        <td>{each?.role?.roleName || "N/A"}</td>
                        <td>{each?.reportingTo?.userName || "N/A"}</td>
                        <td>
                          {each?.team?.map((each) => each?.name || "N/A")}
                        </td>
                        <td>{each?.email || "N/A"}</td>
                        <td>{each?.phoneNumber || "N/A"}</td>
                        <td>{moment(each?.updatedAt).format("ll")}</td>
                        <td className="settings-icon">
                          {each?.role?.roleUId != config.Manager && (
                            <Link
                              to={"/report/user/" + btoa(each?._id)}
                              className="mx-2"
                            >
                              <FaEye />
                            </Link>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
            {!TeamWiseListLoad && teamWiseList?.members?.length > 0 && (
              <Pagination
                handlePageChange={handlePageChange}
                pagination={teamWiseList?.pagination}
                pageid={pageid}
                data_per_page={data_per_pages}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default UserReportMain;
