import React, { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import icon1 from "../../assets/icon1.png";
import icon2 from "../../assets/icon2.png";
import icon3 from "../../assets/icon3.png";
import icon4 from "../../assets/icon4.png";
import icon5 from "../../assets/icon5.png";
import icon6 from "../../assets/icon6.png";
import Loader from "../../utils/Loader/Loader";
import nodata from "../../assets/nodatafound.png";
import convertToPDF from "../../utils/pdf/convertToPDF";
import { BsDownload } from "react-icons/bs";
import { IoMdCloudDownload } from "react-icons/io";
import { FaDownload } from "react-icons/fa6";
import { useParams } from "react-router-dom";
import UserReportDetailsMain from "./UserReportDetailsMain";
import Header from "../../layout/header/Header";
import MainSidebar from "../../layout/sidebarnav/MainSidebar";
import ReportServices from "../../services/ReportServices";
import SideBarNav from "../../layout/sidebarnav/SideBarNav";
import { IoSettingsOutline } from "react-icons/io5";
import ValidateAuthenticationKey from "../../utils/ValidateAuthenticationKey";
import getMonthStartEnd from "../../utils/ReportUserDetailsMonthFilter";
import convertSecondsToHHMMSS, {
  convertHHMMSS_HM,
  convertMillisecondsToTime,
} from "../../utils/TotalWorkingTime";
import ButtonLoader from "../../utils/Loader/ButtonLoader";

const UserMonthlyReportMain = () => {
  const { id } = useParams();
  const [userId, setUserId] = useState("");
  const [toggleStyle, setToggleStyle] = useState(false);
  const [projectList, setProjectList] = useState([]);
  const [status, setStatus] = useState([]);
  const [projectStatus, setProjectStatus] = useState("");
  const [dataFilter, setDateFilter] = useState({});
  const [projectName, setProjectName] = useState("");
  const [loader, setLoader] = useState(false);
  //Pagination
  const [pageid, setPageId] = useState(1);
  const [page_limit, setPage_Limit] = useState([5, 10, 25, 50, 100]);
  const [data_per_page, setData_Per_Page] = useState({
    final_no: 0,
    initial_no: 1,
    total_no: 0,
  });
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


  const formatDate = getMonthStartEnd(monthNames[new Date().getMonth()]);
  const [monthRange, setMonthRange] = useState(formatDate || {});

  const [monthValue, setMonthValue] = useState(
    monthNames[new Date().getMonth()]
  );

  //End

  const handleExportToPDF = () => {
    setLoader(true);
    convertToPDF(monthRange.startDate,monthRange.endDate,setLoader,  userReport?.data?.monthlyTimeSpent);
    
    setLoader(false);
  };


 
  //It Control Page Change
  const handlePageChange = (id) => {
    setPageId(id);
  };

  // let userId='664ee393b3a044ca8cdeb851'
  const statusMapping = {
    "Total Projects": "totalCount",
    "Not Started Projects": "not_started",
    "Ongoing Projects": "ongoing",
    "Completed Projects": "complete",
    "Hold Projects": "hold",
    "Waiting For Feedback Projects": "waiting_for_feedback",
  };
  const handleToggle = () => {
    setToggleStyle(!toggleStyle);
  };


  useEffect(() => {
    try {
      const decodedUserId = atob(id);
      setUserId(() => decodedUserId);
    } catch (error) {
      // console.error("Error decoding user ID:", error.message);
      // Handle the error gracefully, e.g., display an error message to the user
    }
  }, [id]);


  const { data: userReport, isLoading } = useQuery(
    [
      "user-report-monthly",monthValue
    ],
    () =>
      ReportServices.getUserMonthlyTimeSpent({startDate:monthRange.startDate,endDate:monthRange.endDate}),
    {
      refetchOnWindowFocus: false,
      onSuccess: (data) => {
        if (data?.data?.error) {
          toast.error(data?.data?.message);
          return;
        }
        // console.log("===>", data?.data?.data);
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
        // toast.error(err?.response?.data?.message || err?.message, {
        //     delay: 10,
        // });
      },
    }
  );

  const data_per_pages = useMemo(() => {
    return {
      initial_no:
        parseInt(userReport?.data?.data?.pagination?.page) *
        parseInt(userReport?.data?.data?.pagination?.limit) -
        parseInt(userReport?.data?.data?.pagination?.limit) +
        1,
      final_no:
        parseInt(userReport?.data?.data?.pagination?.total) >
          parseInt(userReport?.data?.data?.pagination?.limit) *
          parseInt(userReport?.data?.data?.pagination?.page)
          ? parseInt(userReport?.data?.data?.pagination?.limit) *
          parseInt(userReport?.data?.data?.pagination?.page)
          : userReport?.data?.data?.pagination?.total,
      total_no: userReport?.data?.data?.pagination?.total,
    };
  }, [userReport?.data?.data?.pagination, isLoading]);

  const handleMonthFilter = (e) => {
     console.log(e.target.value)
    if (e.target.value == "") {
      const formatDate = getMonthStartEnd(
        monthNames[new Date().getMonth() + 2]
      );
      setMonthRange(formatDate);

      return;
    }

    const formatDate = getMonthStartEnd(e?.target?.value);
    setMonthRange(formatDate);

    // console.log("formatDate", formatDate);

    setMonthValue(e.target.value);
    // console.log("formatDate", formatDate);

  };
  console.log("data_per_pages",monthRange)
  return (
    <>
      <div className="dashboard-wrapper">
        <MainSidebar />

        <div className="dash-right">
          <Header
            handleToggle={handleToggle}
            name={"Report"}
            subname={"Project Report Details"}
          />

          <SideBarNav
            setToggleStyle={setToggleStyle}
            toggleStyle={toggleStyle}
          />
          <div className="dash-right-info cstm-wdth2 bg-transparent">
            <select value={monthValue} onChange={handleMonthFilter} className="p-1">
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

            <button
                  className="download-pdf-btn ms-2"
                  onClick={handleExportToPDF}
                  disabled={
                    loader 
                  }
                >
                  {loader ? (
                    <ButtonLoader />

                  ) : (
                    <>
                      <FaDownload />
                    </>
                  )}  
                </button>

            {isLoading ? <Loader /> : <div className="table-responsive mt-3">

                {!isLoading &&
                 userReport?.data?.monthlyTimeSpent &&
                 userReport?.data?.monthlyTimeSpent == 0 ? (
                  <div className="no-img">
                    <img src={nodata} />
                  </div>
                ) : (
                  
                  <table className="table table-bordered">
                    <thead>
                      <tr>
                        <th scope="col">Name</th>
                        <th scope="col">Target Time</th>
                        <th scope="col">Time Spent </th>
                      </tr>
                    </thead>

                    <tbody>
                      {!isLoading &&
                        userReport?.data?.monthlyTimeSpent?.length > 0 &&
                        userReport?.data?.monthlyTimeSpent?.map((each, ind) => {
                          return (
                            <tr key={each?._id}>
                              <td>
                                {" "}
                                {each?.username || "N/A"}
                              </td>
                              <td>160</td>
                              <td> {   convertMillisecondsToTime( each?.totalWorkedTime || 0 )}</td>
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


              </div>
            }
          </div>
        </div>
      </div>
    </>
  );
};

export default UserMonthlyReportMain;
