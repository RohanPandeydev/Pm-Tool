import React, { useMemo, useState } from "react";
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
import MainSidebar from '../../layout/sidebarnav/MainSidebar'
import { IoSearchSharp } from "react-icons/io5";
import { useQuery } from "@tanstack/react-query";
import DashboardServices from "../../services/DashboardServices";
import ValidateAuthenticationKey from "../../utils/ValidateAuthenticationKey";
import nodata from '../../assets/nodatafound.png'
import moment from "moment";
import ProjectServices from "../../services/ProjectServices";
import { toast } from "react-toastify";
import DashboardTeamCard from "../../utils/DashboardTeamCard";
import Pagination from "../../utils/Pagination";
import { useLocation, useNavigate } from "react-router-dom";
import getCurrencySymbol from "../../utils/CurrencySymbol";
import FormatNumber from "../../utils/FormatNumber";
const AmDashboard = () => {
    const [toggleStyle, setToggleStyle] = useState(false);
    const [search, setSearch] = useState("")
    let location = useLocation();
    let queryParams = new URLSearchParams(location.search);
    let pageValue = queryParams.get("page");

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
    const [pageid, setPageId] = useState(pageValue || 1);

    const handleToggle = () => {
        setToggleStyle(!toggleStyle);
    };

    const handleSearch = (e) => {
        e.preventDefault()
        setSearch(e.target.value)
    }
    //It Control Page Change
    const handlePageChange = (id) => {
        setPageId(id);
        queryParams.set("page", id ? id : 1);
        queryParams.set("limit", 5);

        // Replace the current history entry with the updated query parameters

    };




    // Team Wise Project Count
    const { data: teamWiseProject, isLoading } = useQuery(
        ["team-wise-project-count-am"],
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
                // console.log(err?.response);
                toast.error(err?.response?.data?.message || err?.message, {
                    delay: 10,
                });
            },
        }
    );

    const { data, isLoading: isLoadProject, isFetched } = useQuery(
        ["projectlist-am", pageid ? pageid : 1, search],
        () => ProjectServices.getList(`page=${pageid}&limit=${10}`),
        {
            refetchOnWindowFocus: false,
            select: (data) => {
                const response = search === ""
                    ? data?.data?.data?.projects
                    : data?.data?.data?.projects?.filter((each) =>
                        each?.name?.toLowerCase().includes(search.toLowerCase())
                    );
                return response;

            },
            onError: (err) => {
                if (err?.response?.status === 401) {
                    ValidateAuthenticationKey(
                        err?.response?.status,
                        "Your login session has expired. Please log in again."
                    );
                    return;
                }
                console.log(err?.message);
                // toast.error(err?.response?.data?.message || err?.message, {
                //     delay: 10,
                // });
            },
        }
    );

    const data_per_pages = useMemo(() => {
        return {
            initial_no:
                parseInt(data?.data?.data?.pagination?.page) *
                parseInt(data?.data?.data?.pagination?.limit) -
                parseInt(data?.data?.data?.pagination?.limit) +
                1,
            final_no:
                parseInt(data?.data?.data?.pagination?.total) >
                    parseInt(data?.data?.data?.pagination?.limit) *
                    parseInt(data?.data?.data?.pagination?.page)
                    ? parseInt(data?.data?.data?.pagination?.limit) *
                    parseInt(data?.data?.data?.pagination?.page)
                    : data?.data?.data?.pagination?.total,
            total_no: data?.data?.data?.pagination?.total,
        };

    }, [data?.data?.pagination, data?.data?.pagination?.total, isLoading, data?.data?.data?.projects?.length]);
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
                                subname={"Account Manager Dashboard"}
                            />
                        </div>

                        {/* <ProjectSidebar
                            toggleStyle={toggleStyle}
                        /> */}

                        <div className={"dashboard-body p-3"}>

                            <div className="lead-bx" style={{ backgroundImage: `url(${background})` }}>
                                <h5>Total Project</h5>
                                <h3>{!isLoading && teamWiseProject?.totalCount || 0}</h3>
                            </div>
                            {/* <DashboardProjectStatus setTotalProjects={setTotalProjects} /> */}
                            <div className="right-nav-content-right mt-4">
                                {
                                    !isLoading && teamWiseProject?.teamWiseProject?.length > 0 && teamWiseProject?.teamWiseProject?.map((team) => {
                                        return <DashboardTeamCard key={team?.id} img={team?.image} name={team?.name} count={team?.count} id={team?.id} />

                                    })
                                }
                            </div>

                            {<div className="overview-bx mt-3">
                                <div className="overview-header">
                                    <h4>Project List</h4>
                                    <div className="search-bx">
                                        <form>
                                            <input type="text" onChange={handleSearch} value={search} placeholder="Search" />
                                            <div className="search-icon"><IoSearchSharp /></div>
                                        </form>
                                    </div>
                                </div>


                                <div className="table-responsive mt-3">
                                    {( !isLoadProject && !!data &&
                                        data?.length == 0) ? (
                                        <div className="no-img">
                                            <img src={nodata} />
                                        </div>
                                    ) : (
                                        <table className="table table-bordered">
                                            <thead>
                                                <tr>
                                                    <th scope="col">
                                                        <div className="form-check">
                                                            {/* <input
                                                                            className="form-check-input"
                                                                            type="checkbox"
                                                                            value=""
                                                                            id="flexCheckDefault"
                                                                        /> */}
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
                                                    <th scope="col">Start  Date</th>
                                                    <th scope="col">End  Date</th>
                                                    {/* <th scope="col">Price Type</th> */}
                                                    <th scope="col">Price </th>
                                                    <th scope="col">EstimatedTime (Hr.) </th>
                                                    {/* <th scope="col">Last Updated</th> */}

                                                </tr>
                                            </thead>

                                            <tbody>
                                                {data?.map((each, ind) => {
                                                    return (
                                                        <tr key={each?._id}>
                                                            <td>
                                                                <div className="form-check">
                                                                    <label
                                                                        className="form-check-label"
                                                                        htmlFor="flexCheckDefault"
                                                                    >
                                                                        {"#"}{each?.projectCode || "SB00000"}
                                                                    </label>
                                                                </div>
                                                            </td>
                                                            <td> {each?.name}</td>
                                                            <td>{each?.customerName || "N/A"}</td>

                                                            <td>
                                                                {each?.assistantManagerId?.userName ||
                                                                    "N/A"}
                                                            </td>
                                                            <td>
                                                                {each?.projectManagerId?.userName ||
                                                                    "N/A"}
                                                            </td>
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
                                                                {each?.startDate && moment(each?.startDate).format("ll") || 'N/A'}
                                                            </td>
                                                            <td>
                                                                {each?.endDate && moment(each?.endDate).format("ll") || 'N/A'}
                                                            </td>

                                                            {/* <td>
                                                                            {" "}
                                                                            {each?.priceType.toUpperCase() || "N/A"}
                                                                        </td> */}
                                                            <td>
                                                                {" "}
                                                                {getCurrencySymbol(each?.currencyType)} &nbsp;{each?.price && FormatNumber(each?.price || 0)}
                                                            </td>
                                                            <td> {each?.estimatedTime || "N/A"}</td>
                                                            {/* <td>
                                                                            {moment(each?.updateAt).format("ll")}
                                                                        </td> */}

                                                        </tr>
                                                    );
                                                })}
                                            </tbody>
                                        </table>
                                    )}
                                    {!isLoadProject &&
                                        data?.data?.data?.projects?.length > 0 && (
                                            <Pagination
                                                handlePageChange={handlePageChange}
                                                pagination={data?.data?.data?.pagination}
                                                pageid={pageid}
                                                data_per_page={data_per_pages}
                                            />
                                        )}
                                </div>
                            </div>}
                        </div>

                    </div>
                </div>
            </div>
        </>
    )
}

export default AmDashboard