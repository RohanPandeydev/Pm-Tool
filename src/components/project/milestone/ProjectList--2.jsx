import React, { useEffect, useMemo, useRef, useState } from "react";

import { CiMenuKebab } from "react-icons/ci";
import { IoSettingsOutline } from "react-icons/io5";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import moment from "moment/moment";
import UserServices from "../../services/UserServices";
import { useLocation, useNavigate } from "react-router-dom";
import nodata from "../../assets/nodatafound.png";
import Loader from "../../utils/Loader/Loader";
import Header from "../../layout/header/Header";
import MainSidebar from "../../layout/sidebarnav/MainSidebar";
import SideBarNav from "../../layout/sidebarnav/SideBarNav";
import Pagination from "../../utils/Pagination";
import ValidateAuthenticationKey from "../../utils/ValidateAuthenticationKey";
import { toast } from "react-toastify";
import { CheckPageIsAccessable, IsAccessable } from "../../guard/AcessControl";
import config from "../../config";
import ProjectServices from "../../services/ProjectServices";
import AddProjectModal from "./AddProjectModal";
import StorageData from "../../helper/storagehelper/StorageData";
import ProjectDetailsPage from "./ProjectDetailsPage";
import ButtonLoader from "../../utils/Loader/ButtonLoader";
import { GrPowerReset } from "react-icons/gr";
import getCurrencySymbol from "../../utils/CurrencySymbol";
import FormatNumber from "../../utils/FormatNumber";
import CanvasMain from "../../utils/Canvas/CanvasMain";
import { FaEye } from "react-icons/fa";
import { IoIosAddCircle } from "react-icons/io";

const ProjectList = () => {
    let navigate = useNavigate();
    let location = useLocation();
    let queryParams = new URLSearchParams(location.search);
    const roleUId = StorageData?.getUserData()?.role?.roleUId;
    const loggedUserId = StorageData?.getUserData()?._id;
    const [toggleDetailsPage, setToggleDetailsPage] = useState(false);
    let pageValue = queryParams.get("page");
    const [toggleRole, setToggleRole] = useState(false);
    const [isModel, setIsModel] = useState(false);
    const [toggleStyle, setToggleStyle] = useState(false);
    const [pageid, setPageId] = useState(pageValue || 1);
    const [page_limit, setPage_Limit] = useState([5, 10, 25, 50, 100]);
    const [prefill, setPrefill] = useState(null);
    const [filterValue, setFilterValue] = useState("")
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [userSuggestion, setUserSuggestion] = useState([]);
    const inputRef = useRef();
    const [userSuggestionLoader, setUserSuggestionLoader] = useState(false);
    const [triggerUserSuggestion, setTriggerUserSuggestion] = useState("");
    const [toggleDrop, setToggleDrop] = useState(false)
    const [id, setId] = useState("")
    const [isOpenOff, setIsOpenOff] = useState(false);
    const [toggleQuery, setToggleQuery] = useState(false);
    const [canvasProjectId, setCanvasProjectId] = useState("")
    const [canvasProjectName, setCanvasProjectName] = useState("")



    const OffCanvastoggle = (id,name) => {
        setCanvasProjectId(id)
        setCanvasProjectName(name)


        setIsOpenOff(!isOpenOff)

    };
    const handleStartDateChange = (e) => {
        setStartDate(e?.target?.value)
    }
    const handleEndDateChange = (e) => {
        setEndDate(e?.target?.value)
    };
    const [data_per_page, setData_Per_Page] = useState({
        final_no: 0,
        initial_no: 1,
        total_no: 0,
    });
    // Get the 'page' parameter value
    const handleOpen = () => {
        setIsModel(!isModel);
    };
    const handleToggle = () => {
        setToggleStyle(!toggleStyle);
    };
    const { data, isLoading } = useQuery(
        ["projectlist", pageid ? pageid : 1, toggleQuery],
        () => ProjectServices.getList(`page=${pageid}&limit=${10}&assignedUserId=${id || ""}&startDate=${startDate || ""}&endDate=${endDate || ""}`),
        {
            refetchOnWindowFocus: false,
            onSuccess: (data) => {
                // //console.log("Data",data)
                return;
            },
            onError: (err) => {
                if (err?.response?.status === 401) {
                    ValidateAuthenticationKey(
                        err?.response?.status,
                        "Your login session has expired. Please log in again."
                    );
                    return;
                }
                // //console.log(err?.message);
                // toast.error(err?.response?.data?.message || err?.message, {
                //     delay: 10,
                // });
            },
        }
    );
    //It Control Page Change
    const handlePageChange = (id) => {
        setPageId(id);
        queryParams.set("page", id ? id : 1);
        queryParams.set("limit", 5);

        // Replace the current history entry with the updated query parameters
        navigate({
            pathname: location.pathname,
            search: queryParams.toString(),
        });
    };
    const handleUpdate = (data) => {
        handleOpen()
        setPrefill(data);
        return;
    };
    const data_per_pages = useMemo(() => {
        setData_Per_Page((prev) => {
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
        });
    }, [data?.data?.pagination, isLoading,]);


    const handleFilter = (e) => {
        setFilterValue(e?.target?.value)
        setId("")
        // getUserSuggestion(e?.target?.value)

    }
    const handleReset = () => {
        setFilterValue("")
        setStartDate("")
        setEndDate("")
        setId("")
        setToggleQuery(!toggleQuery)
    }

    const handleSubmit = () => {
        if (startDate && startDate > endDate && endDate) {
            toast.error("Start date can't be greater than end date")
            return false
        }
        setToggleQuery(!toggleQuery)

    }
    const getPrefillUser = (id, name) => {
        setToggleDrop(false);
        setFilterValue(name || "N/A")
        setId(id)
    }


    //  List 
    const { data: listOfExecutive, isLoading: isExecutiveLoaded } = useQuery(
        ["userlist-all-project-filter"],
        () => UserServices.getTaskUserList(),
        {
            refetchOnWindowFocus: false,
            onSuccess: (data) => {
                // //console.log("getTaskUserList", data?.data?.data?.users)
                return;
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
        if (filterValue.length > 2 && !!!id) {
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
        <CheckPageIsAccessable
            modulename={window.location.pathname}
            permission={"read"}
        >
            {isLoading ? (
                <Loader />
            ) : (
                <div className="container-fluid">
                    <div className="dashboard-wrapper">
                        <MainSidebar />

                        <div className="dash-right">
                            <div className="inner-wrapper">
                                <Header
                                    handleToggle={handleToggle}
                                    name={"Project"}
                                    subname={"Project List"}
                                />
                            </div>

                            <div>
                                <SideBarNav
                                    toggleRole={toggleRole}
                                    setToggleRole={setToggleRole}
                                    toggleStyle={toggleStyle}
                                />

                                <div
                                    className={
                                        toggleStyle
                                            ? "dash-right-info"
                                            : "dash-right-info cstm-wdth2"
                                    }
                                >
                                    <div className="dash-right-head">
                                        <div className="right-nav-content-left">
                                            {
                                                <IsAccessable
                                                    modulename={window.location.pathname}
                                                    permission={"create"}
                                                >
                                                    {roleUId != config?.superAdmin && (
                                                        <button
                                                            type="button"
                                                            className="btn triggle-modal-btn"
                                                            onClick={handleOpen}
                                                        >
                                                            + Project
                                                        </button>
                                                    )}
                                                </IsAccessable>
                                            }
                                        </div>
                                    </div>
                                    {toggleDetailsPage ? (
                                        <ProjectDetailsPage />
                                    ) : (
                                        <div className="dash-right-bottom">
                                            <div className="d-flex align-items-center justify-content-between">
                                                <div className="row search-prt">
                                                    <div className="col-md-4">
                                                        <input className="form-control" type="date" placeholder="Start Date" value={startDate} onChange={handleStartDateChange} />
                                                    </div>
                                                    <div className="col-md-4">
                                                        <input className="form-control" type="date" placeholder="End Date" value={endDate} onChange={handleEndDateChange} />
                                                    </div>
                                                    <div className="col-md-4 position-relative">
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

                                                <div className="srch-btn-prt">
                                                    <button type="button" className="btn modal-save-btn me-2" onClick={handleSubmit} >Search</button>

                                                    <button
                                                        className="btn btn-secondary dropdown-toggle"
                                                        type="button"
                                                        id="dropdownMenuButton1"
                                                        aria-expanded="false"
                                                        data-bs-toggle="tooltip"
                                                        data-bs-placement="top"
                                                        onClick={handleReset}
                                                    >
                                                        <GrPowerReset title="Reset" />
                                                    </button>
                                                </div>
                                            </div>

                                            <div className="table-responsive mt-3">
                                                {!isLoading &&
                                                    data?.data?.data?.projects?.length == 0 ? (
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
                                                                            SL
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
                                                                <th scope="col">Price Type</th>
                                                                <th scope="col">Price </th>
                                                                <th scope="col">EstimatedTime (Hr.) </th>
                                                                <th scope="col">Last Updated</th>
                                                                <IsAccessable
                                                                    modulename={window.location.pathname}
                                                                    permission={"update"}
                                                                >
                                                                    {
                                                                        <th scope="col" className="settings-icon">
                                                                            <IoSettingsOutline />
                                                                        </th>
                                                                    }
                                                                </IsAccessable>
                                                            </tr>
                                                        </thead>

                                                        <tbody>
                                                            {data?.data?.data?.projects?.map((each, ind) => {
                                                                return (
                                                                    <tr key={each?._id}>
                                                                        <td>
                                                                            <div className="form-check">
                                                                                <label
                                                                                    className="form-check-label"
                                                                                    htmlFor="flexCheckDefault"
                                                                                >
                                                                                    {ind + 1}
                                                                                </label>
                                                                            </div>
                                                                        </td>
                                                                        <td onClick={() => OffCanvastoggle(each?._id,each?.name)}> {each?.name}</td>
                                                                        <td>{each?.customerName || "N/A"}</td>

                                                                        <td>
                                                                            {each?.assistantManagerId?.userName ||
                                                                                "N/A"}
                                                                        </td>
                                                                        <td>
                                                                            {each?.projectManagerId?.userName ||
                                                                                "N/A"}
                                                                        </td>
                                                                        <td>
                                                                            {each?.startDate && moment(each?.startDate).format("ll") || 'N/A'}
                                                                        </td>
                                                                        <td>
                                                                            {each?.endDate && moment(each?.endDate).format("ll") || 'N/A'}
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
                                                                            {" "}
                                                                            {each?.priceType.toUpperCase() || "N/A"}
                                                                        </td>
                                                                        <td>
                                                                            {" "}
                                                                            {getCurrencySymbol(each?.currencyType)} &nbsp;{each?.price && FormatNumber(each?.price || 0)}
                                                                        </td>
                                                                        <td> {each?.estimatedTime || "N/A"}</td>
                                                                        <td>
                                                                            {moment(each?.updateAt).format("ll")}
                                                                        </td>
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
                                                                                                    <li>
                                                                                                        <a
                                                                                                            className="dropdown-item"
                                                                                                            href={
                                                                                                                "/project/" +
                                                                                                                btoa(each?._id)
                                                                                                            }
                                                                                                        // onClick={() =>
                                                                                                        //     handleUpdate(each)
                                                                                                        // }
                                                                                                        >
                                                                                                           <FaEye/>
                                                                                                        </a>
                                                                                                    </li>
                                                                                                ) : (
                                                                                                    roleUId ==
                                                                                                    config.teamLeader &&
                                                                                                    !each?.isMilestoneAdded && (
                                                                                                        <li>
                                                                                                            <a
                                                                                                                className="dropdown-item"
                                                                                                                href={
                                                                                                                    "/project/milestone/" +
                                                                                                                    btoa(each?._id)
                                                                                                                }
                                                                                                            // onClick={() =>
                                                                                                            //     handleUpdate(each)
                                                                                                            // }
                                                                                                            >
                                                                                                                <IoIosAddCircle />

                                                                                                            </a>
                                                                                                        </li>
                                                                                                    )
                                                                                                )}
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
                                                    data?.data?.data?.projects?.length > 0 && (
                                                        <Pagination
                                                            handlePageChange={handlePageChange}
                                                            pagination={data?.data?.data?.pagination}
                                                            pageid={pageid}
                                                            data_per_page={data_per_page}
                                                        />
                                                    )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal */}
            <AddProjectModal
                isModel={isModel}
                prefill={prefill}
                setPrefill={setPrefill}
                setIsModel={setIsModel}
            />
            {canvasProjectId && <CanvasMain setCanvasProjectId={setCanvasProjectId} canvasProjectId={canvasProjectId} isOpenOff={isOpenOff} OffCanvastoggle={OffCanvastoggle} canvasProjectName ={canvasProjectName} setCanvasProjectName={setCanvasProjectName} />
            }
            {/* <AddStaff formik={formik} roleData={roleData} roleLoading={roleLoading}/> */}
        </CheckPageIsAccessable>

    );
};

export default ProjectList;
