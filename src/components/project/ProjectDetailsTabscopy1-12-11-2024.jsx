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
    const [manager, setManager] = useState([]);
    const [teamListNew, setTeamListNew] = useState([]);
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
    const [activeTabSub, setActiveTabSub] = useState(0); // Track the active tab index
    const [activeTeam, setActiveTeam] = useState({}); // Track the active tab index
    const loggedInUserTeamId = StorageData.getUserData()?.team[0]?._id;
    const loggedInUserTeam = StorageData.getUserData()?.team;
    const loggedInUserTeamName = StorageData.getUserData()?.team[0]?.name;
    const loggedInUserId = StorageData.getUserData()?._id;
    const reportingToId = StorageData.getUserData()?.reportingTo;
    const [togglePlayPause, setTogglePlayPause] = useState(false);
    const loggedInUserRoleId = StorageData.getUserData()?.role?.roleUId;
    const [checkTlnTeam, setCheckTlnTeam] = useState(false);
    const handleTabChange = (teamLeaderId, teamId, index, team) => {
        console.log('this is my team===========================> new',team)
        setTeamLeaderId(teamLeaderId);
        setTeamListId(teamId);
        setActiveTab(index); // Update active tab index
        setActiveTabSub(index+'-sub-0');
        setActiveTeam(team)  
        return;
    };
    const handleTabChange1 = (teamLeaderId, teamId, index,i) => {
        console.log('this is my team===========================> new',teamLeaderId)
        setTeamLeaderId(teamLeaderId);
        setTeamListId(teamId);
        setActiveTabSub(i); // Update active tab index
        setActiveTab(index);

        return;
    };
    const [isModel, setIsModel] = useState(false);

    const { data, isLoadingMilestone } = useQuery(
        [
            "projectmilestone",
            pageid ? pageid : 1,
            projectId,
            teamLeaderId ? teamLeaderId : "true",
            teamListId
        ],
        () =>
            ProjectServices.getProjectMilestone({
                teamLeaderId: teamLeaderId ? teamLeaderId : "0",
                projectId: projectId,
                type: `team=${teamListId}&page=${pageid}&limit=${10}`,
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
                    let indSub = '0-sub-0'
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
                    let teamArray = [];   
                    let teamArray1 = [];  
                    let activeTeamz = '';     
                    cachedData?.data?.data?.project?.teams?.map((each, index) => {
                        if(teamArray1.includes(each.team._id)){
                             const index = teamArray.findIndex(data => data._id === each.team._id);
  
                            if (index !== -1) {
                                const teamInfo = {teamLeader: each.teamLeader, members: each.members, time: each.time}
                                // Rectangle exists, update it
                                teamArray[index].details.push(teamInfo);
                            } else {
                                const teamInfo = {
                                    _id: each.team._id,
                                    name: each.team.name,
                                    userId: each.team.userId,
                                    details:[
                                       {teamLeader: each.teamLeader, members: each.members, time: each.time} 
                                    ]
                                }
                                // Rectangle does not exist, add it
                                teamArray.push(teamInfo)
                            }
                        }else{
                            const teamInfo = {
                                _id: each.team._id,
                                name: each.team.name,
                                userId: each.team.userId,
                                details:[
                                   {teamLeader: each.teamLeader, members: each.members, time: each.time} 
                                ]
                            }
                            teamArray1.push(each.team._id)
                            teamArray.push(teamInfo)
                        }
                       
                    }) 
                    setTeamListNew(teamArray)
                   
                    setTeamList(cachedData?.data?.data?.project?.teams);
                    setTeamLeaderId(
                        cachedData?.data?.data?.project?.teams[ind]?.teamLeader?._id
                    );
                    setTeamListId(
                        cachedData?.data?.data?.project?.teams[ind]?.team?._id
                    );
                    activeTeamz = teamArray[0]
                    teamArray?.map((each, index) => {
                        if(each?._id == loggedInUserTeamId) {
                            ind = index
                            indSub = index+'-sub-0';  
                           
                            setTeamListId(
                                each?._id
                            );
                            each?.details.map((teamLead, i) => {
                                if (teamLead?.teamLeader?._id == loggedInUserId) {
                                    activeTeamz = teamArray[index]
                                    setTeamListId(each?._id);
                                    //console.log("Index==>",index)
                                    indSub = index+'-sub-'+i;
                                    return
                                }else if(teamLead?.teamLeader?._id == reportingToId?._id){
                                    activeTeamz = teamArray[index]
                                    setTeamListId(each?._id);
                                    indSub = index+'-sub-'+i;        
                                }
                                return

                            })
                        }

                    })
                    setActiveTeam(()=>activeTeamz)
                    setActiveTab(() => ind)
                    setActiveTabSub(() =>indSub)
                    setManager( cachedData?.data?.data?.project?.projectManagerId)
                    const checkTeamnTl =
                        cachedData?.data?.data?.project?.teams?.some(
                            (check) =>
                                (check.teamLeader?._id === loggedInUserId &&
                                check.team?._id === loggedInUserTeamId) ||
                                (cachedData?.data?.data?.project?.projectManagerId._id === loggedInUserId)
                        ) || false;
                    setCheckTlnTeam(checkTeamnTl);
                    return;
                } else {
                    // If data doesn't exist in cache, fetch it from the API
                    const response = await ProjectServices.getDetails({ id: projectId });
                    if (response) {
                        let ind = 0
                        let indSub = '0-sub-0'
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
                       
                        let teamArray = [];   
                        let teamArray1 = [];   
                        let  activeTeamz = ''; 
                        response?.data?.data?.project?.teams?.map((each, index) => {
                            if(teamArray1.includes(each.team._id)){
                                 const index = teamArray.findIndex(data => data._id === each.team._id);
      
                                if (index !== -1) {
                                    const teamInfo = {teamLeader: each.teamLeader, members: each.members, time: each.time}
                                    // Rectangle exists, update it
                                    teamArray[index].details.push(teamInfo);
                                } else {
                                    const teamInfo = {
                                        _id: each.team._id,
                                        name: each.team.name,
                                        userId: each.team.userId,
                                        details:[
                                           {teamLeader: each.teamLeader, members: each.members, time: each.time} 
                                        ]
                                    }
                                    // Rectangle does not exist, add it
                                    rectanglesArray.push(teamInfo);
                                }
                            }else{
                                const teamInfo = {
                                    _id: each.team._id,
                                    name: each.team.name,
                                    userId: each.team.userId,
                                    details:[
                                       {teamLeader: each.teamLeader, members: each.members, time: each.time} 
                                    ]
                                }
                                teamArray1.push(each.team._id)
                                teamArray.push(teamInfo)
                            }
                           
                        }) 
                        setTeamListNew(teamArray)
                       
                        setTeamList(response?.data?.data?.project?.teams);
                        setTeamLeaderId(
                            response?.data?.data?.project?.teams[ind]?.teamLeader?._id
                        );
                        setTeamListId(
                            response?.data?.data?.project?.teams[ind]?.team?._id
                        );
                        activeTeamz = teamArray[0]
                        teamArray?.map((each, index) => {
                            if(each?._id == loggedInUserTeamId) {
                                setTeamListId(
                                    each?._id
                                );
                           
                                ind = index
                                indSub = index+'-sub-0';  
                                each?.details.map((teamLead, i) => {
                                    if (teamLead?.teamLeader?._id == loggedInUserId) {
                                        activeTeamz = teamArray[index]
                                        setTeamListId(each?._id);
                                        //console.log("Index==>",index)
                                        indSub = index+'-sub-'+i;
                                        return
                                    }else if(teamLead?.teamLeader?._id == reportingToId?._id){
                                        activeTeamz = teamArray[index]
                                        setTeamListId(each?._id);
                                        indSub = index+'-sub-'+i;        
                                    }
                                    return

                                })
                            }

                        })
                        setActiveTeam(()=>activeTeamz)
                        setActiveTab(() => ind)
                        setActiveTabSub(() =>indSub)
                        setManager( response?.data?.data?.project?.projectManagerId)
                        const checkTeamnTl = 
                            response?.data?.data?.project?.teams?.some(
                                (check) =>
                                    (check.teamLeader?._id === loggedInUserId &&
                                    check.team?._id === loggedInUserTeamId) ||
                                    (response?.data?.data?.project?.projectManagerId._id === loggedInUserId)
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
      console.warn(activeTeam)
    return (
        <>
            {!isLoading && !isLoadingMilestone && teamListNew?.length == 0 ? (
                <div className="no-img">
                    <img src={nodata} />
                </div>
            ) : (
                <div className="mt-4">
                    <div className="dash-right-head project-details-tab-wrap">
                        <ul className="nav nav-pills" id="pills-tab" role="tablist">
                            {teamListNew && teamListNew?.map((team, index) => {
                              
                                return (
                                    <li className="nav-item" role="presentation" key={index}>
                                        <button
                                            className={
                                                activeTab === index ? "nav-link active" : "nav-link"
                                            }
                                            id={`pills-${team?._id || 0}-tab`}
                                            data-bs-toggle="pill"
                                            data-bs-target={`#pills-${team?._id}`}
                                            type="button"
                                            role="tab"
                                            aria-controls={`pills-${team?._id || 0}`}
                                            aria-selected={activeTab === index}
                                            onClick={() =>
                                                handleTabChange(
                                                    team?.details[0]?.teamLeader ? team?.details[0]?.teamLeader?._id : null,
                                                    team?._id,
                                                    index,
                                                    team
                                                )
                                            }
                                        >
                                            {team?.name}
                                        </button>
                                      
                                    </li>
                                );
                            })}
                        </ul>
                        {console.log(activeTeam.hasOwnProperty('_id'),teamLeaderId,loggedInUserId,activeTeam?._id,loggedInUserTeam.find(item => item._id == activeTeam?._id),checkTlnTeam )}
                        { activeTeam && 
                        <ul className="nav nav-pills" id="pillsz-tab" role="tablist">{console.log(activeTeam?._id,teamListId)}
                            {teamListId==activeTeam?._id && activeTeam?.details.map((teamLead, i) => {
                                    return ( <li className="nav-item" role="presentation" key={activeTab+'-sub-'+i}>
                                        <button
                                            className={
                                                activeTabSub === activeTab+'-sub-'+i ? "nav-link active" : "nav-link"
                                            }
                                            id={`pillsz-${activeTab+'-sub-'+i || activeTab+'-sub-'+i}-tab`}
                                            data-bs-toggle="pill"
                                            data-bs-target={`#pillsz-${activeTab+'-sub-'+i}`}
                                            type="button"
                                            role="tab"
                                            aria-controls={`pillsz-${activeTab+'-sub-'+i || activeTab+'-sub-'+i}`}
                                            aria-selected={activeTabSub === activeTab+'-sub-'+i}
                                            onClick={() =>
                                                handleTabChange1(
                                                    teamLead?.teamLeader?._id,
                                                    activeTeam?._id,
                                                    activeTab,
                                                    activeTab+'-sub-'+i
                                                )
                                            }
                                        >
                                            
                                            { !!teamLead?.teamLeader?.userName  ? teamLead?.teamLeader?.userName : manager?.userName}
                                        </button>
                                    </li>
                                ); 
                            })
                            
                            }
                         </ul>}
                        
                        
                        {!isLoading && activeTeam.hasOwnProperty('_id') && (loggedInUserTeam.find(item => item._id == activeTeam?._id) && teamLeaderId == loggedInUserId) &&
                            checkTlnTeam && (
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
                                    {!isLoading &&  activeTeam.hasOwnProperty('_id') && 
                                        (loggedInUserTeam.find(item => item._id == activeTeam?._id) && teamLeaderId == loggedInUserId) &&
                                        checkTlnTeam && (
                                            <Link
                                                to={"/project/milestone/" + btoa(projectId)+`?team=${btoa(activeTeam?._id)}`}
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
                                                                                "/task?team="+btoa(activeTeam?._id)
                                                                            }
                                                                        >
                                                                            <FaEye />
                                                                        </Link>
                                                                      
                                                                        {(checkTlnTeam && activeTeam.hasOwnProperty('_id') && loggedInUserTeam.find(item => item._id == activeTeam?._id) && teamLeaderId == loggedInUserId) && (
                                                                            <Link
                                                                                to={
                                                                                    "/project/milestone/" +
                                                                                    btoa(projectId) +
                                                                                    "/" +
                                                                                    btoa(milestone?._id)+`?team=${btoa(activeTeam?._id)}`
                                                                                }
                                                                            >
                                                                                <FaEdit />
                                                                            </Link>
                                                                        )}
                                                                        {(checkTlnTeam && activeTeam.hasOwnProperty('_id') && loggedInUserTeam.find(item => item._id == activeTeam?._id) && teamLeaderId == loggedInUserId) && (
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
            { activeTeam.hasOwnProperty('_id') && (<AddTeamMember
                setActiveTab={setActiveTab}
                activeTeam={activeTeam}
                isModel={isModel}
                setIsModel={setIsModel}
                projectId={projectId}
                setToggleRefetch={setToggleRefetch}
                toggleRefetch={toggleRefetch}
                
            />)}
        </>
    );
};

export default ProjectDetailsTabs;
