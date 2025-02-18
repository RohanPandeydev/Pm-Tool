import React, { useState,useRef } from "react";
import "./dashboard.css";
import Header from "../../layout/header/Header";
import icon1 from "../../assets/icon1.png";
import icon2 from "../../assets/icon2.png";
import icon3 from "../../assets/icon3.png";
import icon4 from "../../assets/icon4.png";
import icon5 from "../../assets/icon5.png";
import icon6 from "../../assets/icon6.png";
import design from "../../assets/design.png";
import wp from "../../assets/wp.png";
import qa from "../../assets/qa.png";
import MainSidebar from '../../layout/sidebarnav/MainSidebar'
import ProjectSidebar from "../../layout/sidebarnav/ProjectSidebar";
import { IoSearchSharp } from "react-icons/io5";
import DashboardProjectDetailsList from "../../utils/DashboardProjectDetailsList";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import DashboardServices from "../../services/DashboardServices";
import { useQuery } from "@tanstack/react-query";
import ValidateAuthenticationKey from "../../utils/ValidateAuthenticationKey";
import UserServices from "../../services/UserServices";
import ButtonLoader from "../../utils/Loader/ButtonLoader";
const DashboardTeamProjectDetails = () => {
  const { id } = useParams()
  const [myId, setMyId] = useState("")
  const [toggleStyle, setToggleStyle] = useState(false);
  const [toggleQuery, setToggleQuery] = useState(false);
  const [toggleDrop, setToggleDrop] = useState(false)
  const [userSuggestionLoader, setUserSuggestionLoader] = useState(false);
  const inputRef = useRef();
  const [userSuggestion, setUserSuggestion] = useState([]);
  const [myFilterId, setFilterId] = useState("")
  const [filterValue, setFilterValue] = useState("")

  const handleToggle = () => {
    setToggleStyle(!toggleStyle);
  };

  const { data: projectstats, isLoading } = useQuery(
    ["project-stats", myId],
    () => DashboardServices.getTeamWiseProjectStats(`team=${myId}`),
    {
      refetchOnWindowFocus: false,
      enabled: !!myId,
      select: (data) => {

        const statusCounts = [
          { status: 'Total Projects', count: data?.data?.data?.projectDetails?.totalCount || 0, icon: icon1 },
          { status: 'Not Started Projects', count: data?.data?.data?.projectDetails?.statusCounts[0]?.count || 0, icon: icon2 },
          { status: 'Ongoing Projects', count: data?.data?.data?.projectDetails?.statusCounts[1]?.count || 0, icon: icon3 },
          { status: 'Completed Projects', count: data?.data?.data?.projectDetails?.statusCounts[2]?.count || 0, icon: icon4 },
          { status: 'Hold Projects', count: data?.data?.data?.projectDetails?.statusCounts[3]?.count || 0, icon: icon5 },
          { status: 'Waiting For Feedback Projects', count: data?.data?.data?.projectDetails?.statusCounts[4]?.count || 0, icon: icon6 }
        ];
        return statusCounts;
        //   console.log("MY Time Wise History List", data?.data?.data?.projectDetails?.statusCounts
        // )




      },
      onError: (err) => {
        if (err?.response?.status === 401) {

          ValidateAuthenticationKey(err?.response?.status, "Your login session has expired. Please log in again.")
          return
        }
        // console.log(err?.response);
        // toast.error(err?.response?.data?.message || err?.message, {
        //     delay: 10,
        // });
      },
    }
  );
  const handleFilter = (e) => {
    setFilterValue(e?.target?.value)
    setFilterId("")
    // getUserSuggestion(e?.target?.value)

}
const getPrefillUser = (id, name) => {
  setToggleDrop(false);
  setFilterValue(name || "N/A")
  setFilterId(id)
}


  useEffect(() => {
    try {
      const decodedUserId = atob(id);
      setMyId(() => decodedUserId)
    } catch (error) {
      // console.error("Error decoding user ID:", error.message);
      // Handle the error gracefully, e.g., display an error message to the user
    }
  }, [id]);

  // User Suggestion
  const getUserSuggestion = async (key = "") => {
    setUserSuggestionLoader(true);

    const data = await UserServices.getUserByKeyword({
      keyword: `keyword=${filterValue}`,
    });
    setUserSuggestion(data?.data?.data?.users);
    setUserSuggestionLoader(false);
  };
  useEffect(() => {
    let timeoutId = null;

    const delayedFetch = () => {
      setToggleDrop(true);
      timeoutId = setTimeout(getUserSuggestion, 1000);
    };
    if (filterValue.length > 2 && !!!myFilterId) {
      delayedFetch();
    } else {
      setUserSuggestion([]);
      setToggleDrop(false);
    }

    return () => clearTimeout(timeoutId);
  }, [filterValue.length]);
  const handleBodyClick = (event) => {
    if (
      !event.target.closest("#exampleDataList") &&
      !event.target.closest(".searchable-list")
    ) {
      setToggleDrop(false);
    }
  };

  useEffect(() => {
    document.body.addEventListener("click", handleBodyClick);
    return () => {
      document.body.removeEventListener("click", handleBodyClick);
    };
  }, []);



  return (
    <>
      <div className="container-fluid">
        <div className="dashboard-wrapper">
          <MainSidebar />

          <div className="dash-right">
            <div className="inner-wrapper">
              <Header
                handleToggle={handleToggle}
                name={"Home"}
                subname={"Dashboard"}
              />
            </div>
            {/* <ProjectSidebar
              toggleStyle={toggleStyle}
            /> */}
            <div className={"dashboard-body p-3"}>

              <div className="overview-header">
                <h4> Project Status</h4>
              </div>

              <div className="pro-status-bx cstm-hovr">
                {
                  !isLoading && projectstats?.map((each) => {
                    return <div className="status-bx2">
                      <div className="d-flex align-items-start justify-content-between">
                        <div>
                          <h5>{each?.status || "N/A"}</h5>
                          <h3>{each?.count || 0}</h3 >
                        </div>
                        <img src={each?.icon || icon1} alt="" />
                      </div>
                    </div>

                  })
                }


              </div>

              <div className="overview-bx mt-3">
                <div className="overview-header">
                  <h4>Project List</h4>
                  <div className="search-bx">
                    
                      <input
                        type="text"
                        placeholder="Search "
                        className="form-control"
                        ref={inputRef}
                        id="exampleDataList"
                        list="datalistOptions"
                        value={filterValue}
                        // onKeyUp={handleInputChange}
                        onChange={handleFilter} 
                      />
                       <div className="search-icon"><IoSearchSharp /></div>

                      {toggleDrop && (
                        <ul className="suggestion-lst">
                          {userSuggestionLoader ? (
                            <ButtonLoader />
                          ) : (
                            userSuggestion?.map((user) => (
                              <li
                                key={user?._id}
                                onClick={() => getPrefillUser(user?._id, user?.userName)}
                              >
                                {user?.userName || "N/A"} (
                                {user?.role?.roleName || "N/A"})
                              </li>
                            ))
                          )}
                        </ul>
                      )}
                    
                  </div>
                </div>

                {myId && <DashboardProjectDetailsList myFilterId={myFilterId}  wp={wp} design={design} qa={qa} teamId={myId} />}
              </div>

            </div>

          </div>
        </div>
      </div>
    </>
  );
};

export default DashboardTeamProjectDetails;
