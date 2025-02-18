import React, { useRef, useState } from "react";
import MainSidebar from "../../layout/sidebarnav/MainSidebar";
import Header from "../../layout/header/Header";
import SideBarNav1 from "../../layout/sidebarnav/SideBarNav1";
import email from "../../assets/contact-ico1.png";
import client2 from "../../assets/contact-ico8.png";
import client from "../../assets/contact-ico3.png";
import phone from "../../assets/contact-ico4.png";
import calendar from "../../assets/contact-ico7.png";
import { MdKeyboardArrowDown } from "react-icons/md";
import icon1 from "../../assets/icon1.png";
import { IoSearchSharp, IoSettingsOutline } from "react-icons/io5";
import { FaEye, FaGoogleDrive } from "react-icons/fa6";
import moment from "moment";
import { IsAccessable } from "../../guard/AcessControl";
import { FaEdit } from "react-icons/fa";
import config from "../../config";
import convertSecondsToHHMMSS, {
  convertHHMMSS_HM,
  convertMillisecondsToTime,
} from "../../utils/TotalWorkingTime";
import RemoveUnderscore from "../../utils/RemoveUnderScoreAndMakeCapital";
import AddProjectModal from "../project/AddProjectModal";
import StorageData from "../../helper/storagehelper/StorageData";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import ReportServices from "../../services/ReportServices";
import { toast } from "react-toastify";
import ValidateAuthenticationKey from "../../utils/ValidateAuthenticationKey";
import UserReportDetailsTimeSpent from "./UserReportDetailsTimeSpent";
import nodata from "../../assets/nodatafound.png";
import { IoIosAddCircle } from "react-icons/io";
import { useEffect } from "react";
import getMonthStartEnd from "../../utils/ReportUserDetailsMonthFilter";
import Pagination from "../../utils/Pagination";

const UserReportDetailsMain = ({
  status = [],
  userReport,
  projectStatus,
  userId,
  handleProjectStatus,
  statusMapping,
  isLoadStatus,
  isLoading,
  data_per_pages,
  pageid,
  handlePageChange,
  projectName,
  handleProjectNameSearch,
}) => {
  const roleUId = StorageData?.getUserData()?.role?.roleUId;
  const loggedUserId = StorageData?.getUserData()?._id;
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const [isModel, setIsModel] = useState(false);
  const [prefill, setPrefill] = useState(null);
  const formatDate = getMonthStartEnd(monthNames[new Date().getMonth()]);
  const [monthValue, setMonthValue] = useState(
    monthNames[new Date().getMonth()]
  );
  const [monthRange, setMonthRange] = useState(formatDate || {});
  const sectionRef = useRef(null);

  const scrollToSection = () => {
    if (sectionRef.current) {
      console.log("Focusing on timeSpentRef");
      sectionRef.current.scrollIntoView({ behavior: "smooth" });
    } else {
      console.error("timeSpentRef.current is null");
    }
  };
  const handleOpen = () => {
    setIsModel(!isModel);
  };
  // console.log(userReport)

  // //console.log("isFetched",isFetched)
  const handleUpdate = (data) => {
    handleOpen();
    setPrefill(data);
    return;
  };

  const { data: userTimeSpent, isLoading: isLoadTimeSpent } = useQuery(
    [
      "user-time-spent-details",
      userId,
      monthRange.startDate,
      monthRange.endDate,
    ],
    () => ReportServices.getUserTimeSpentDetails({ userId, ...monthRange }),
    {
      refetchOnWindowFocus: false,
      enabled: !!userId,
      select: (data) => {
        if (data?.data?.error) {
          toast.error(data?.data?.message);
          return;
        }
        //   console.log("userTimeSpent",data?.data)

        return data?.data?.dailyTimeSpent;
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

  const handleMonthFilter = (e) => {
    scrollToSection();
    // console.log(month)
    if (e.target.value == "") {
      const formatDate = getMonthStartEnd(
        monthNames[new Date().getMonth() + 2]
      );
      setMonthRange(formatDate);
      setMonthRange({});
      setMonthValue("");
      return;
    }
    const formatDate = getMonthStartEnd(e?.target?.value);
    setMonthRange(formatDate);

    // console.log("formatDate", formatDate);

    setMonthValue(e.target.value);
  };

  // useEffect(()=>{
  //   scrollToSection()

  //   },[])
  // console.log("userTimeSpent?.monthlyWorkTime", userReport?.projectsWithTime?.projects);

  return (
    <>
      <div className="dash-right-info cstm-wdth2 bg-transparent">
        <div className="row">
          <div className="col-md-9">
            {!isLoading && (
              <div className="staff-info">
                <h4>{userReport?.user?.userName || "N/A"}</h4>
                <ul>
                  <li>
                    <img src={calendar} alt="" />{" "}
                    {moment(userReport?.user?.createdAt).format("ll")}
                  </li>
                  <li>
                    <img src={client2} alt="" />{" "}
                    {userReport?.user?.role?.roleName || "N/A"}
                  </li>
                  <li>
                    <img src={client} alt="" />{" "}
                    {userReport?.user?.reportingTo?.userName || "N/A"}
                  </li>
                  <li>
                    <img src={email} alt="" />{" "}
                    {userReport?.user?.email || "N/A"}
                  </li>
                  <li>
                    <img src={phone} alt="" />{" "}
                    {userReport?.user?.phoneNumber || "N/A"}
                  </li>
                </ul>
              </div>
            )}
          </div>
          <div className="col-md-3">
            <div className="team-time-bx">
              <div>
                <h5>Monthly Hrs.</h5>
                <h3>
                  {(!isLoadTimeSpent &&
                    convertMillisecondsToTime(
                      userTimeSpent?.monthlyWorkTime
                    )) ||
                    0}
                  /160
                </h3>
              </div>
              <div className="btn-group">
                {/* <button
                  type="button"
                  className="btn btn-outline-warning dropdown-toggle"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  Select Month <MdKeyboardArrowDown />
                </button> */}
                <select value={monthValue} onChange={handleMonthFilter}>
                  {/* <option value={""}>Select a Month</option> */}
                  {monthNames?.map((each) => {
                    return (
                      <option value={each}>
                        {/* <a className="dropdown-item" href="#"> */}
                        {each}
                        {/* </a> */}
                      </option>
                    );
                  })}
                </select>
                {/* <ul className="dropdown-menu">
                 
                 
                </ul> */}
              </div>
            </div>
          </div>
        </div>

        <div className="right-nav-content-right mt-4 cstm-hovr report-page">
          {!isLoadStatus &&
            status.length > 0 &&
            status?.map((each) => {
              return (
                <div
                  className="status-bx2"
                  style={{
                    cursor: "pointer",
                    border: `${
                      projectStatus == "" && each?.status == "Total Projects"
                        ? "2px solid #eac92c"
                        : projectStatus == statusMapping[each?.status]
                        ? "2px solid #eac92c"
                        : ""
                    }`,
                  }}
                  onClick={() => handleProjectStatus(each?.status)}
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

          {/* <div className="status-bx2">
                <a href='#'>
                    <div className='d-flex align-items-start justify-content-between'>
                        <div>
                            <h5>Not Started Projects</h5>
                            <h3>46</h3>
                        </div>
                        <img src={icon2} alt='' />
                    </div>
                </a>
            </div>
            <div className="status-bx2">
                <a href='#'>
                    <div className='d-flex align-items-start justify-content-between'>
                        <div>
                            <h5>Ongoing Projects</h5>
                            <h3>134</h3>
                        </div>
                        <img src={icon3} alt='' />
                    </div>
                </a>
            </div>
            <div className="status-bx2">
                <a href='#'>
                    <div className='d-flex align-items-start justify-content-between'>
                        <div>
                            <h5>Completed Projects</h5>
                            <h3>30</h3>
                        </div>
                        <img src={icon4} alt='' />
                    </div>
                </a>
            </div>
            <div className="status-bx2">
                <a href='#'>
                    <div className='d-flex align-items-start justify-content-between'>
                        <div>
                            <h5>Hold Projects</h5>
                            <h3>22</h3>
                        </div>
                        <img src={icon5} alt='' />
                    </div>
                </a>
            </div>
            <div className="status-bx2">
                <a href='#'>
                    <div className='d-flex align-items-start justify-content-between'>
                        <div>
                            <h5>Waiting For Feedback Projects</h5>
                            <h3>18</h3>
                        </div>
                        <img src={icon6} alt='' />
                    </div>
                </a>
            </div> */}
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
              /> */}
              {/* <select className="form-select">
                <option>Select Search Type</option>
                <option>Self</option>
                <option>TL</option>
              </select> */}
            </div>

            <div className="search-bx">
              {/* <form> */}
              <input
                type="text"
                placeholder="Search"
                value={projectName}
                onChange={handleProjectNameSearch}
              />
              <div className="search-icon">
                <IoSearchSharp />
              </div>
              {/* </form> */}
            </div>
          </div>
          {/* <button type="button" class="btn btn-primary">
            Total Projects{" "}
            <span class="badge badge-light">
              {(!isLoading &&
                userReport?.projectsWithTime?.totalProjects) ||
                0}
            </span>
          </button> */}
          {/* <button type="button" class="btn btn-primary">
            Total Hours{" "}
            <span class="badge badge-light">
              {convertSecondsToHHMMSS(
                (!isLoading &&
                  userReport?.projectsWithTime?.
                    totalTimeSpent) ||
                  0
              )}
            </span>
          </button> */}
          <div className="table-responsive mt-3">
            {!isLoading &&
            userReport?.projectsWithTime &&
            userReport?.projectsWithTime?.projects?.length == 0 ? (
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
                    {/* <th scope="col">Teams</th> */}
                    <th scope="col">Start Date</th>
                    <th scope="col">End Date</th>
                    <th scope="col">Project Status</th>
                    {/* <th scope="col">Price Type</th> */}
                    {/* <th scope="col">Price </th> */}
                    <th scope="col">EstimatedTime </th>
                    <th scope="col">Time Assigned </th>
                    <th scope="col">Time Spent </th>
                    <th scope="col" className="settings-icon">
                      <IoSettingsOutline />
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {!isLoading &&
                    userReport?.projectsWithTime?.projects?.length > 0 &&
                    userReport?.projectsWithTime?.projects?.map((each, ind) => {
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
                            {each?.name || "N/A"}
                          </td>
                          <td>{each?.customerName || "N/A"}</td>

                          <td>
                            {each?.assistantManager[0]?.userName || "N/A"}
                          </td>
                          <td>{each?.projectManager[0]?.userName || "N/A"}</td>
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
                          <td>
                            {" "}
                            {convertHHMMSS_HM(each?.totalAssignedTime || 0)}
                          </td>
                          <td>
                            {" "}
                            {convertSecondsToHHMMSS(each?.totalTimeSpent || 0)}
                          </td>
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

                                  {
                                    <Link
                                      className="mx-2"
                                      to={"/project/" + btoa(each?._id)}
                                      // onClick={() =>
                                      //     handleUpdate(each)
                                      // }
                                    >
                                      <FaEye />
                                    </Link>
                                   }

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
            {!isLoading &&
              userReport?.projectsWithTime?.projects?.length > 0 && (
                <Pagination
                  handlePageChange={handlePageChange}
                  pagination={userReport?.pagination}
                  pageid={pageid}
                  data_per_page={data_per_pages}
                />
              )}

            <h4>Monthly Report</h4>
            {
              <UserReportDetailsTimeSpent
                isLoadTimeSpent={isLoadTimeSpent}
                sectionRef={sectionRef}
                userTimeSpent={userTimeSpent?.userTimeSpent || {}}
              />
            }
          </div>
        </div>
      </div>
    </>
  );
};

export default UserReportDetailsMain;
