/* eslint-disable react/jsx-key */
import React, { useEffect, useMemo, useState } from "react";
import { IoSettingsOutline } from "react-icons/io5";
import { FaEye } from "react-icons/fa6";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import nodata from "../../assets/nodatafound.png";
import { toast } from "react-toastify";
import ProjectServices from "../../services/ProjectServices";
import { FaEdit, FaTrash } from "react-icons/fa";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Pagination from "../../utils/Pagination";
import moment from "moment";
import BackButton from "../../utils/BackButton";
import StorageData from "../../helper/storagehelper/StorageData";
import AddTeamMember from "./milestone/AddTeamMember";
import ShowTeamMember from "./milestone/ShowTeamMember";
import swal from "sweetalert";

const ProjectDetailsTabs = ({ projectId }) => {
    let navigate = useNavigate();
    let location = useLocation();
    let queryParams = new URLSearchParams(location.search);
    let pageValue = queryParams.get("page");
    const [isLoading, setIsLoading] = useState(false);
    const [teamList, setTeamList] = useState([]);
    const [teamListId, setTeamListId] = useState("");
    const queryClient = useQueryClient();
    const [teamLeaderId, setTeamLeaderId] = useState("");
    const [toggleRefetch, setToggleRefetch] = useState(false);
    const [pageid, setPageId] = useState(pageValue || 1);
    const [page_limit, setPage_Limit] = useState([5, 10, 25, 50, 100]);
    const [data_per_page, setData_Per_Page] = useState({
        final_no: 0,
        initial_no: 1,
        total_no: 0,
    });
    const status = ["in_progress", "paused", "completed"];
    const [activeTab, setActiveTab] = useState(0); // Track the active tab index
    const loggedInUserTeamId = StorageData.getUserData()?.team[0]?._id;
    const loggedInUserTeamName = StorageData.getUserData()?.team[0]?.name;
    const loggedInUserId = StorageData.getUserData()?._id;
    const [togglePlayPause, setTogglePlayPause] = useState(false);
    const loggedInUserRoleId = StorageData.getUserData()?.role?.roleUId;
    const [checkTlnTeam, setCheckTlnTeam] = useState(false);
    const handleTabChange = (teamLeaderId, teamId, index) => {
        // //console.log(teamLeaderId)
        setTeamLeaderId(teamLeaderId);
        setTeamListId(teamId);
        setActiveTab(index); // Update active tab index

        return;
    };
    const [isModel, setIsModel] = useState(false);

    const { data, isLoadingMilestone } = useQuery(
        [
            "projectmilestone",
            pageid ? pageid : 1,
            projectId,
            teamLeaderId ? teamLeaderId : "true",
        ],
        () =>
            ProjectServices.getProjectMilestone({
                teamLeaderId: teamLeaderId ? teamLeaderId : "0",
                projectId: projectId,
                type: `page=${pageid}&limit=${10}`,
            }),
        {
            enabled: !!projectId && !!teamList?.length > 0,
            refetchOnWindowFocus: false,
            onSuccess: (data = {}) => {
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
                toast.error(err?.response?.data?.message || err?.message, {
                    delay: 10,
                });
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
    }, [data?.data?.data?.pagination, , isLoadingMilestone,]);
    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                // Check if the data exists in the cache
                const cachedData = queryClient.getQueryData(["projectdetails"]);
                if (cachedData) {
                    let ind = 0
                    cachedData?.data?.data?.project?.teams?.map((each, index) => {
                        // //console.log("each",each?.team,loggedInUserTeamId)
                        //console.log(" cachedData?.data?.data?.project?.teams", cachedData?.data?.data?.project?.teams)
                        if (each?.team?._id == loggedInUserTeamId) {
                            //console.log("Index==>",index)
                            ind = index;
                            return
                        }
                        return


                    })
                    //console.log("ind",ind)
                    setActiveTab(() =>  ind)

                    setTeamList(cachedData?.data?.data?.project?.teams);
                    setTeamLeaderId(
                        cachedData?.data?.data?.project?.teams[ind]?.teamLeader?._id
                    );
                    setTeamListId(
                        cachedData?.data?.data?.project?.teams[ind]?.team?._id
                    );
                    const checkTeamnTl =
                        cachedData?.data?.data?.project?.teams?.some(
                            (check) =>
                                check.teamLeader?._id === loggedInUserId &&
                                check.team?._id === loggedInUserTeamId
                        ) || false;
                    setCheckTlnTeam(checkTeamnTl);

                    return;
                } else {
                    // If data doesn't exist in cache, fetch it from the API
                    const response = await ProjectServices.getDetails({ id: projectId });
                    if (response) {
                        let ind = 0
                        response?.data?.data?.project?.teams?.map((each, index) => {
                            // //console.log("each",each?.team,loggedInUserTeamId)
                            if (each?.team?._id == loggedInUserTeamId) {
                                //console.log("Index==>",index)
                                ind = index;
                                return
                            }
                            return


                        })
                        // //console.log(" cachedData?.data?.data?.project?.teams", response?.data?.data?.project?.teams,loggedInUserTeamId)

                        setActiveTab(() => ind)

                        setTeamList(response?.data?.data?.project?.teams);
                        setTeamLeaderId(
                            response?.data?.data?.project?.teams[ind]?.teamLeader?._id
                        );
                        setTeamListId(
                            response?.data?.data?.project?.teams[ind]?.team?._id
                        );
                        const checkTeamnTl =
                            response?.data?.data?.project?.teams?.some(
                                (check) =>
                                    check.teamLeader?._id === loggedInUserId &&
                                    check.team?._id === loggedInUserTeamId
                            ) || false;

                        setCheckTlnTeam(checkTeamnTl);
                    }
                }
            } catch (error) {
                // Handle errors
                // toast.error(error?.response?.data?.message || error?.message, {
                //     delay: 10,
                // });
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [projectId, toggleRefetch]);

    // //console.log("data?.data?.data?.projects", data?.data?.data?.pagination)
    const handleOpen = () => {
        setIsModel(!isModel);
    };

    const handleDelete=(id)=>{
        swal({
            title:"Are you sure you want to delete this milestone",
            icon: "warning",
            buttons: true,
            dangerMode: true,
            allowOutsideClick: false,
            closeOnClickOutside: false,
          }).then((willDelete) => {
            if (willDelete) {            
              deleteMilestone.mutate({id:id});
            }
          });
    }
    const deleteMilestone = useMutation(
        (formdata) => {
          return ProjectServices.deleteMilestone(formdata);
        },
        {
          onSuccess: (data) => {
            if (data?.data?.error) {
              toast.error(data?.data?.message, { delay: 10 });
              return;
            }
            toast.success(data?.data?.message, { delay: 10 });
            queryClient.invalidateQueries("projectmilestone");
            queryClient.refetchQueries("projectmilestone");
    
            return;
          },
          onError: (err) => {
            // //console.log("Get", err?.response?.data?.data);
            toast.error(err?.response?.data?.message || err?.message, {
              delay: 10,
            });
          },
        }
      );

    return (
        <>
            {console.log('this is my team list========================================>',teamList)}
            {!isLoading && !isLoadingMilestone && teamList?.length == 0 ? (
                <div className="no-img">
                    <img src={nodata} />
                </div>
            ) : (
                <div className="mt-4">
                    <div className="dash-right-head">
                        <ul className="nav nav-pills" id="pills-tab" role="tablist">
                            {teamList && teamList?.map((team, index) => {
                                return (
                                    <li className="nav-item" role="presentation" key={index}>
                                        <button
                                            className={
                                                activeTab === index ? "nav-link active" : "nav-link"
                                            }
                                            id={`pills-${team?.team?._id || 0}-tab`}
                                            data-bs-toggle="pill"
                                            data-bs-target={`#pills-${team?.team?._id}`}
                                            type="button"
                                            role="tab"
                                            aria-controls={`pills-${team?.team?._id || 0}`}
                                            aria-selected={activeTab === index}
                                            onClick={() =>
                                                handleTabChange(
                                                    team?.teamLeader?._id,
                                                    team?.team?._id,
                                                    index
                                                )
                                            }
                                        >
                                            {team?.team?.name}
                                        </button>
                                    </li>
                                );
                            })}
                        </ul>
                        {/* <BackButton name={"Project "} url={'/projects'} /> */}
                        {checkTlnTeam && (
                            <button onClick={handleOpen} className="ctd-del-btn">
                                {" "}
                                + Add Member{" "}
                            </button>
                        )}
                    </div>

                    {!isLoading && (
                        <ShowTeamMember
                            toggleRefetch={toggleRefetch}
                            teamList={teamList}
                            teamListId={teamListId}
                            teamLeaderId={teamLeaderId}
                        />
                    )}

                    <div className="overview-bx mt-3">
                        <div className="tab-content" id="pills-tabContent">
                            <div
                                className="tab-pane fade show active"
                                id="pills-design"
                                role="tabpanel"
                                aria-labelledby="pills-design-tab"
                            >
                                <div className="d-flex justify-content-end">
                                    {!isLoading &&
                                        teamListId == loggedInUserTeamId &&
                                        checkTlnTeam && (
                                            <Link
                                                to={"/project/milestone/" + btoa(projectId)}
                                                className="ctd-del-btn"
                                            >
                                                + Add Milestone
                                            </Link>
                                        )}
                                </div>

                                {!!data && data?.data?.data?.projects?.length == 0 ? (
                                    <div className="no-img">
                                        <img src={nodata} />
                                    </div>
                                ) : (
                                    <div className="table-responsive">
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
                                                {(!!data && data?.data?.data?.projects?.length > 0) &&
                                                    data?.data?.data?.projects?.map((milestone) => {
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
                                                                <td>
                                                                    {moment(milestone?.startDate).format("ll")}
                                                                </td>
                                                                {/* <td>
                                                                    {moment(milestone?.draftDate).format("ll")}
                                                                </td> */}
                                                                <td>
                                                                    {moment(milestone?.endDate).format("ll")}
                                                                </td>

                                                                <td>{milestone?.tasks?.length || 0}</td>
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
                                                                                btoa(milestone?._id) +
                                                                                "/task"
                                                                            }
                                                                        >
                                                                            <FaEye />
                                                                        </Link>
                                                                        {(checkTlnTeam && teamListId == loggedInUserTeamId && teamLeaderId == loggedInUserId) && (
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
                                                                        )}
                                                                        {(checkTlnTeam && teamListId == loggedInUserTeamId && teamLeaderId == loggedInUserId) && (
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
                                                                        )}
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        );
                                                    })}
                                            </tbody>
                                        </table>
                                    </div>
                                )}

                                {!isLoadingMilestone &&
                                    !!data &&
                                    data?.data?.data?.projects?.length > 0 && (
                                        <Pagination
                                            handlePageChange={handlePageChange}
                                            pagination={data?.data?.data?.pagination || 0}
                                            pageid={pageid}
                                            data_per_page={data_per_page || 0}
                                        />
                                    )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
            <AddTeamMember
                setActiveTab={setActiveTab}
                isModel={isModel}
                setIsModel={setIsModel}
                projectId={projectId}
                setToggleRefetch={setToggleRefetch}
                toggleRefetch={toggleRefetch}
            />
        </>
    );
};

export default ProjectDetailsTabs;
