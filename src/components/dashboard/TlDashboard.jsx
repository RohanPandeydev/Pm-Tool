/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import "./dashboard.css";
import Header from "../../layout/header/Header";
import background from '../../assets/bg3.png';
import MainSidebar from '../../layout/sidebarnav/MainSidebar'
import { IoSearchSharp, IoStop } from "react-icons/io5";
import { IoIosPause, IoIosPlay } from "react-icons/io";
import Dashboard from "../../pages/Dashboard";
import DashboardProjectStatus from "./DashboardProjectStatus";
import ExecutiveOngoingList from "./ExecutiveOngoingList";
import DashboardOngoingList from "../../utils/DashboardOngoingList";
import DashboardIdleEmployee from "../../utils/DashboardIdleEmployee";
import DashboardActiveEmployeeTable from "../../utils/DashboardActiveEmployeeTable";
const TlDashboard = () => {
    const [toggleStyle, setToggleStyle] = useState(false);
    const [totalProjects, setTotalProjects] = useState("")
    const [active, setActiveSearch] = useState("")
    const [idle, setIdleSearch] = useState("")
    const handleToggle = () => {
        setToggleStyle(!toggleStyle);
    };
    const handleActiveSearch = (e) => {
        e.preventDefault()
        setActiveSearch(e?.target?.value)
    }
    const handleIdleSearch = (e) => {
        e.preventDefault()
        setIdleSearch(e?.target?.value)

    }

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
                                subname={"TL Dashboard"}
                            />
                        </div>
                        {/* <ProjectSidebar
                            toggleStyle={toggleStyle}
                        /> */}
                        <div className={"dashboard-body p-3"}>

                            <div className="lead-bx" style={{ backgroundImage: `url(${background})` }}>
                                <h5>Total Project</h5>
                                <h3>{totalProjects && totalProjects}</h3>
                            </div>

                            <DashboardProjectStatus setTotalProjects={setTotalProjects} />

                            <div className="row mt-3">
                                <div className="col-md-9">
                                    <div className="overview-bx">
                                        <div className="overview-header">
                                            <h4>Executive List</h4>
                                            {/* <div className="search-bx">
                                                <form>
                                                    <input type="text" placeholder="Search" />
                                                    <div className="search-icon"><IoSearchSharp /></div>
                                                </form>
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
                                                    <DashboardActiveEmployeeTable active={active} />
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
                                                    <DashboardIdleEmployee idle={idle}  />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-3">
                                    <div className="employee-bx ongoing-bx">
                                        <h2>Ongoing Task</h2>
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

export default TlDashboard;
