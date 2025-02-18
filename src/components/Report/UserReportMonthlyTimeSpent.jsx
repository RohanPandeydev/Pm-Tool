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
import { useParams } from "react-router-dom";
import UserReportDetailsMain from "./UserReportDetailsMain";
import Header from "../../layout/header/Header";
import MainSidebar from "../../layout/sidebarnav/MainSidebar";
import ReportServices from "../../services/ReportServices";
import SideBarNav from "../../layout/sidebarnav/SideBarNav";
const UserMonthlyReportMain = () => {
  const { id } = useParams();
  const [userId, setUserId] = useState("");
  const [toggleStyle, setToggleStyle] = useState(false);
  const [projectList, setProjectList] = useState([]);
  const [status, setStatus] = useState([]);
  const [projectStatus, setProjectStatus] = useState("");
  const [dataFilter, setDateFilter] = useState({});
  const [projectName, setProjectName] = useState("");

  //Pagination
  const [pageid, setPageId] = useState(1);
  const [page_limit, setPage_Limit] = useState([5, 10, 25, 50, 100]);
  const [data_per_page, setData_Per_Page] = useState({
    final_no: 0,
    initial_no: 1,
    total_no: 0,
  });

  //End

  const handleProjectNameSearch = (e) => {
    console.log(e.target.value);
    setPageId(1)
    setProjectName(e?.target?.value);
    return;
  };

  const handleStartDate = (e) => {
    setDateFilter({ ...dataFilter, startDate: e?.target?.value });
  };
  const handleEndDate = (e) => {
    setDateFilter({ ...dataFilter, endDate: e?.target?.value });
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

  const handleProjectStatus = (status) => {
    if (status == "Total Projects") {
      setProjectStatus("");
      setPageId(1)

      return;
    }
    // console.log("onClick={() => handleProjectStatus(each?.status)}",status)
    setProjectStatus(statusMapping[status]);
    setPageId(1)
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

  const { data: projectStatusCount, isLoading: isLoadStatus } = useQuery(
    ["user-report-project-status-count", userId],
    () => ReportServices.getUserDetailsCountStatus({ userId }),
    {
      refetchOnWindowFocus: false,
      enabled: !!userId,
      onSuccess: (data) => {
        if (data?.data?.error) {
          toast.error(data?.data?.message);
          return;
        }

        console.log("projectStatusCount",data?.data)
        const status = [
          "Total Projects",
          "Not Started Projects",
          "Ongoing Projects",
          "Completed Projects",
          "Hold Projects",
          "Waiting For Feedback Projects",
        ];
        const icons = [icon1, icon2, icon3, icon4, icon5, icon6];

        const statusCounts = status.map((each, index) => {
          let count = 0;
          if (each === "Total Projects") {
            count = data?.data?.data?.totalCount || 0;
          } else {
            const statusKey = statusMapping[each];
            count = data?.data?.data?.statusCount[statusKey] || 0;
          }
          return {
            status: each,
            count: count,
            icon: icons[index],
          };
        });
        setStatus(() => statusCounts);
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
  const { data: userReport, isLoading } = useQuery(
    [
      "user-report-details",
      userId,
      projectStatus,
      projectName,
      pageid ? pageid : 1,
    ],
    () =>
      ReportServices.getUserDetails({
        userId,
        projectStatus,
        projectName,
        pagination: `page=${pageid}&limit=${5}`,
      }),
    {
      refetchOnWindowFocus: false,
      enabled: !!userId,
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

// console.log("data_per_pages",data_per_pages)

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
          {
            <UserReportDetailsMain
              handleProjectNameSearch={handleProjectNameSearch}
              projectName={projectName}
              handlePageChange={handlePageChange}
              data_per_pages={data_per_pages}
              pageid={pageid}
              isLoadStatus={isLoadStatus}
              isLoading={isLoading}
              projectStatus={projectStatus}
              statusMapping={statusMapping}
              handleProjectStatus={handleProjectStatus}
              userReport={userReport?.data?.data || []}
              userId={userId}
              status={status || []}
            />
          }
        </div>
      </div>
    </>
  );
};

export default UserMonthlyReportMain;
