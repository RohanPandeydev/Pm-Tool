import React, { useState } from "react";
import "./dashboard.css";
import Header from "../../layout/header/Header";
import background from '../../assets/bg1.png';
import tp1 from '../../assets/tp1.png';
import tp2 from '../../assets/tp2.png';
import tp3 from '../../assets/tp3.png';
import tp4 from '../../assets/tp4.png';
import tp5 from '../../assets/tp5.png';
import tp6 from '../../assets/tp6.png';
import tp7 from '../../assets/tp7.png';
import tp8 from '../../assets/tp8.png';
import ico1 from "../../assets/ico1.png";
import ico2 from "../../assets/ico2.png";
import ico3 from "../../assets/ico3.png";
import ico4 from "../../assets/ico4.png";
import MainSidebar from '../../layout/sidebarnav/MainSidebar'
import ProjectSidebar from "../../layout/sidebarnav/ProjectSidebar";
import { IoSearchSharp } from "react-icons/io5";
import DashboardTeamCard from "../../utils/DashboardTeamCard";
import DashboardActiveEmployeeTable from "../../utils/DashboardActiveEmployeeTable";
import DashboardIdleEmployee from "../../utils/DashboardIdleEmployee";
import DashboardOngoingList from "../../utils/DashboardOngoingList";
import DashboardServices from "../../services/DashboardServices";
import { useQuery } from "@tanstack/react-query";
import ValidateAuthenticationKey from "../../utils/ValidateAuthenticationKey";
import config from "../../config";
import { toast } from "react-toastify";
import capitalizeAndFormatText from "../../utils/MakeLetterCapital";
import StorageData from "../../helper/storagehelper/StorageData";

const LandingPage = () => {
  const loggedInUserRoleId = StorageData.getUserData()?.role?.roleUId;

  const [toggleStyle, setToggleStyle] = useState(false);
  const arrOfImg = [tp1, tp2, tp3, tp4, tp5, tp6, tp7, tp8]
  const [teamsList] = useState([
    {
      name: "Design",
      target: 10,
      image: tp1,
      id: 1
    },
    {
      name: "React/App",
      target: 0,
      image: tp2,
      id: 2
    },
    {
      name: "Laravel",
      target: 0,
      image: tp3,
      id: 3
    },
    {
      name: "Wordpress",
      target: 0,
      image: tp4,
      id: 4
    },
    {
      name: "Q/A",
      target: 0,
      image: tp5,
      id: 5
    },
    {
      name: "IOT",
      target: 10,
      image: tp6,
      id: 6
    },
    {
      name: "Digital Marketing",
      target: 0,
      image: tp7,
      id: 7
    },
    {
      name: "AI",
      target: 0,
      image: tp8,
      id: 8
    },
  ])
  const [active, setActiveSearch] = useState("")
  const [idle, setIdleSearch] = useState("")

  const handleActiveSearch = (e) => {
    e.preventDefault()
    setActiveSearch(e?.target?.value)
  }
  const handleIdleSearch = (e) => {
    e.preventDefault()
    setIdleSearch(e?.target?.value)

  }

  const handleTab = (tab) => {
    // //console.log("Tab", tab)

  }


  const handleToggle = () => {
    setToggleStyle(!toggleStyle);
  };

  // Team Wise Project Count
  const { data: teamWiseProject, isLoading } = useQuery(
    ["team-wise-project-count"],
    () => DashboardServices.getList(),
    {
      refetchOnWindowFocus: false,
      select: (data) => {
        const teamWiseProject = data?.data?.data?.teamwiseproject?.teamProjectCounts
          ?.filter((team) => !!team?.team?._id)
          .map((team) => {
            const matchingTeam = teamsList.find((t) => t.name.includes(team?.team?.name));

            return {
              id: team?.team?._id,
              name: team?.team?.name,
              image: matchingTeam ? matchingTeam.image : tp1,
              count: team?.projectCount
            };
          });
        return { totalCount: data?.data?.data?.teamwiseproject?.totalProjectCount || 0, teamWiseProject: teamWiseProject };
      },
      onError: (err) => {
        if (err?.response?.status === 401) {

          ValidateAuthenticationKey(err?.response?.status, "Your login session has expired. Please log in again.")
          return
        }
        // //console.log(err?.response);
        toast.error(err?.response?.data?.message || err?.message, {
          delay: 10,
        });
      },
    }
  );
  // Role Wise User Count
  const { data: usercountbyrole, isLoading: isLoad } = useQuery(
    ["role-wise-user-count"],
    () => DashboardServices.getUserCountByRole(),
    {
      refetchOnWindowFocus: false,
      onSuccess: (data) => {
      },
      onError: (err) => {
        if (err?.response?.status === 401) {

          ValidateAuthenticationKey(err?.response?.status, "Your login session has expired. Please log in again.")
          return
        }
        // //console.log(err?.response);
        toast.error(err?.response?.data?.message || err?.message, {
          delay: 10,
        });
      },
    }
  );  
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
            <div className={"dashboard-body p-3"}>
              <div className="row">
                <div className="col-lg-9">
                  <div className="lead-bx" style={{ backgroundImage: `url(${background})` }}>
                    <h5>Total Project</h5>
                    <h3>{!isLoading && teamWiseProject?.totalCount || 0}</h3>
                  </div>

                  <div className="right-nav-content-right mt-4">
                    {
                      !isLoading && teamWiseProject.teamWiseProject?.length > 0 && teamWiseProject?.teamWiseProject?.map((team) => {
                        return <DashboardTeamCard key={team?.id} img={team?.image} name={team?.name} count={team?.count} id={team?.id} />

                      })
                    }
                  </div>
                  {/* Manager List / Team Leader List / Executive List / Account Manager List  */}
                  <div className="right-nav-content-right mt-4 cstm-hovr">
                    {
                      !isLoad && usercountbyrole?.data?.data?.RoleWiseUserCount?.map((each) => {
                        if ((loggedInUserRoleId === config.Manager && (each?.roleName === config.Am || each?.roleName === config.Manager)) ||
                          each?.roleName === config.Admin || each?.roleName === config.salesExecutive) {
                          return null;
                        }
                        return <div className="status-bx2">
                          <a href={"/staffs?role=" + btoa(each?.roleName)}>
                            <div className="d-flex align-items-start justify-content-between">
                              <div>
                                <h5>{capitalizeAndFormatText(each?.roleName) || 'N/A'}</h5>
                                <h3>{each?.count || 0}</h3>
                              </div>
                              <img src={each?.roleName == config.Manager ? `${ico4}` : each?.roleName == config.teamLeader ? `${ico2}` : each?.roleName == config.Executive ? `${ico3}` : `${ico1}`} alt="" />
                            </div>
                          </a>
                        </div>

                      })
                    }


                    {/* <div className="status-bx2">
                      <div className="d-flex align-items-start justify-content-between">
                        <div>
                          <h5>Team Leader List</h5>
                          <h3>06</h3>
                        </div>
                        <img src={ico2} alt="" />
                      </div>
                    </div>

                    <div className="status-bx2">
                      <div className="d-flex align-items-start justify-content-between">
                        <div>
                          <h5>Executive List</h5>
                          <h3>42</h3>
                        </div>
                        <img src={ico3} alt="" />
                      </div>
                    </div>

                    <div className="status-bx2">
                      <div className="d-flex align-items-start justify-content-between">
                        <div>
                          <h5>Account Manage List</h5>
                          <h3>04</h3>
                        </div>
                        <img src={ico4} alt="" />
                      </div>
                    </div> */}
                  </div>

                  <div className="dash-right-head mt-4">
                    <ul className="nav nav-pills" id="pills-tab" role="tablist">
                      <li className="nav-item" role="presentation">
                        <button
                          className="nav-link active"
                          id="pills-active-tab"
                          data-bs-toggle="pill"
                          data-bs-target="#pills-active"
                          type="button"
                          role="tab"
                          aria-controls="pills-active"
                          aria-selected="true"
                          onClick={() => handleTab("active")}
                        >
                          Active
                        </button>
                      </li>
                      <li className="nav-item" role="presentation">
                        <button
                          className="nav-link"
                          id="pills-idle-tab"
                          data-bs-toggle="pill"
                          data-bs-target="#pills-idle"
                          type="button"
                          role="tab"
                          aria-controls="pills-idle"
                          aria-selected="true"
                          onClick={() => handleTab("idle")}
                        >
                          Idle
                        </button>
                      </li>
                    </ul>
                  </div>

                  <div className="tab-content" id="pills-tabContent">
                    <div
                      className="tab-pane fade show active"
                      id="pills-active"
                      role="tabpanel"
                      aria-labelledby="pills-active-tab"
                    >
                      <div className="overview-bx mt-3">

                        <div className="overview-header">
                          <h4>Active Users</h4>
                          <div className="search-bx">
                            <form>
                              <input type="text" placeholder="Search" onChange={handleActiveSearch} value={active} />
                              <div className="search-icon"><IoSearchSharp /></div>
                            </form>
                          </div>
                        </div>
                        {/* Active Table */}
                        <DashboardActiveEmployeeTable  active={active}/>
                      </div>
                    </div>

                    <div
                      className="tab-pane fade"
                      id="pills-idle"
                      role="tabpanel"
                      aria-labelledby="pills-idle-tab"
                    >
                      <div className="overview-bx mt-3">
                        <div className="overview-header">
                          <h4>Idle Users</h4>
                          <div className="search-bx">
                            <form>
                              <input type="text" placeholder="Search" onChange={handleIdleSearch} value={idle} />
                              <div className="search-icon"><IoSearchSharp /></div>
                            </form>
                          </div>
                        </div>
                        {/* Idle Table  */}
                        <DashboardIdleEmployee idle={idle} />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-lg-3">
                  <div className="employee-bx ongoing-bx">
                    <h2>Ongoing</h2>
                    <DashboardOngoingList />

                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
};

export default LandingPage;
