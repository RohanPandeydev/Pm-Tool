import React, { useEffect, useMemo, useRef, useState } from "react";
import { IoCheckmarkSharp, IoSettingsOutline, IoStop } from "react-icons/io5";
import SideBarNav from "../../../layout/sidebarnav/SideBarNav";
import Header from "../../../layout/header/Header";
import MainSidebar from "../../../layout/sidebarnav/MainSidebar";
import { FaEdit, FaTrash } from "react-icons/fa";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import ProjectDetailsPage from "../ProjectDetailsPage";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import ProjectServices from "../../../services/ProjectServices";
import ValidateAuthenticationKey from "../../../utils/ValidateAuthenticationKey";
import Pagination from "../../../utils/Pagination";
import nodata from "../../../assets/nodatafound.png";
import moment from "moment";
import ButtonLoader from "../../../utils/Loader/ButtonLoader";
import BackButton from "../../../utils/BackButton";
import StorageData from "../../../helper/storagehelper/StorageData";
import config from "../../../config";
import getCurrentDateTimeIST from "../../../utils/CurrentTime";
import { toast } from "react-toastify";
import swal from "sweetalert";
import convertMinutesToHHMMSS, {
  TimeConversion,
  convertHHMMSS_HM,
} from "../../../utils/TotalWorkingTime";
import MilestoneDetailsPage from "./MilestoneDetailsPage";
import { IoIosPause, IoIosPlay } from "react-icons/io";
import customContext from "../../../contexts/Context";
import convertSecondsToHHMMSS from "../../../utils/TotalWorkingTime";
import RemoveUnderscore from "../../../utils/RemoveUnderScoreAndMakeCapital";
import capitalizeAndFormatText from "../../../utils/MakeLetterCapital";
import ViewTaskDetails from "./ViewTaskDetails";
import TimeDiff from "../../../utils/TimeLapse";
import { GrRevert } from "react-icons/gr";

const ViewTaskList = () => {
  const params = useParams();
  const [toggleStyle, setToggleStyle] = useState(false);
  const [projectId, setProjectId] = useState("");
  const [isUserTeamLeader, setTIsUserTeamLeader] = useState(false);
  const [milestoneId, setMilestoneId] = useState("");
  const loggedInUserId = StorageData.getUserData()?._id;
  const queryClient = useQueryClient();
  const loggedInUserRoleId = StorageData.getUserData()?.role?.roleUId;
  let navigate = useNavigate();
  let location = useLocation();
  let queryParams = new URLSearchParams(location.search);
  let pageValue = queryParams.get("page");
  let teamId = queryParams.get("team");
  const [team , setTeam] = useState("");
  const { setRedirectUrl } = customContext();
  const [pageid, setPageId] = useState(pageValue || 1);
  const [page_limit, setPage_Limit] = useState([5, 10, 25, 50, 100]);
  const [data_per_page, setData_Per_Page] = useState({
    final_no: 0,
    initial_no: 1,
    total_no: 0,
  });
  const [isModel, setIsModel] = useState(false);
  const [prefillData, setPrefillData] = useState({});
  const [isRunning, setIsRunning] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const intervalRef = useRef(null);
  const startTimeRef = useRef(0);
  const [initialOffsetInSeconds, setInitialTime] = useState(0);
  const [taskStatus, setTaskStatus] = useState(0);

  const handleOpen = (data) => {
    setPrefillData(data);
    setIsModel(!isModel);
  };

  const handleToggle = () => {
    setToggleStyle(!toggleStyle);
  };
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

  const changeTaskStatus = (taskstatus, taskId, task, type = true) => {
    // const lastStatus = task.history.pop()
    // //console.log("Last Status=>", lastStatus, task)
    swal({
      title:
        type == false
          ? "Are you sure you want to restart this task?"
          : taskstatus == config.inProgress
          ? "Are you sure you want to start this task?"
          : taskstatus == config.paused
          ? "Are you sure you want to pause this task?"
          : "Are you sure you want to mark this task as complete?",
      icon: "warning",
      buttons: true,
      dangerMode: true,
      allowOutsideClick: false,
      closeOnClickOutside: false,
    }).then((willDelete) => {
      if (willDelete) {
        // resetTimer()
        const currentTimenDate = getCurrentDateTimeIST();
        //console.log("currentTimenDate", currentTimenDate)

        const sendData = {
          milestoneId: milestoneId,
          taskId: taskId,
          status: taskstatus,
          date: currentTimenDate?.date,
          time: currentTimenDate?.time,
        };
        updateTask.mutate(sendData);
      }
    });
  };
  const { data, isLoading, isError, error } = useQuery(
    ["tasklist", milestoneId, pageid ? pageid : 1],
    () =>
      ProjectServices.getProjectMilestoneTask({
        milestoneId: milestoneId,
        type: `page=${pageid}&limit=${10}`,
      }),
    {
      enabled: !!milestoneId,
      refetchOnWindowFocus: false,
      onSuccess: (data = {}) => {
        resetTimer();

        const timeInProgress = data?.data?.data?.milestonetask?.find((each) => {
          return each.status === config.inProgress;
        });

        if (timeInProgress) {
          const lastTimeHistory = timeInProgress.history.pop();
          const dateTimeString = `${lastTimeHistory.date} ${lastTimeHistory.time}`;
          const dateTime = new Date(dateTimeString);
          const timeInMs = dateTime.getTime() || Date.now();

          const totalWorkingTime = timeInProgress.totalWorkingTime || 0;
          const initialElapsedTime =
            totalWorkingTime + Math.ceil((Date.now() - timeInMs) / 1000);

          // setTaskStatus(totalWorkingTime);
          startTimeRef.current = initialElapsedTime;
          setElapsedTime(initialElapsedTime);
          startTimer();
          return;
        }

        // resetTimer() can be called here if no task is in progress
        // resetTimer();

        return true;
      },
      onError: (err) => {
        if (err?.response?.status === 401) {
          ValidateAuthenticationKey(
            err?.response?.status,
            "Your login session has expired. Please log in again."
          );
        } else {
          // Handle other errors
          return false;
        }
      },
    }
  );

  const updateTask = useMutation(
    (formdata) => {
      return ProjectServices.updateTask(formdata);
    },
    {
      onSuccess: (data) => {
        if (data?.data?.error) {
          toast.error(data?.data?.message, { delay: 10 });
          return;
        }
        toast.success(data?.data?.message, { delay: 10 });
        queryClient.invalidateQueries("tasklist");
        queryClient.refetchQueries("tasklist");

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
  useEffect(() => {
    try {
      const decodedProjectId = atob(params?.projectId);
      const decodedMilestoneId = atob(params?.milestoneId);
      // //console.log("Decode Ids",decodedProjectId,decodedMilestoneId)
      setProjectId(() => decodedProjectId);
      setMilestoneId(() => decodedMilestoneId);
      setRedirectUrl(window.location.pathname);
      setTeam(()=>atob(teamId))
    } catch (error) {
      // console.error("Error decoding user ID:", error.message);
      // Handle the error gracefully, e.g., display an error message to the user
    }
  }, [projectId, isLoading,teamId]);

  const data_per_pages = useMemo(() => {
    // setData_Per_Page((prev) => {
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
    // });
  }, [
    data?.data?.pagination,
    isLoading,
    data?.data?.data?.milestonetask?.length,
  ]);

  function resetTimer() {
    setIsRunning(false);
    setElapsedTime(0);
    setInitialTime(0);
  }
  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        //setElapsedTime(Date.now() - startTimeRef.current);
        setElapsedTime((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      clearInterval(intervalRef.current);
    };
  }, [isRunning]);

  function startTimer() {
    setIsRunning(true);
    const initialOffsetInMs = initialOffsetInSeconds * 1000; // Convert seconds to milliseconds
    // startTimeRef.current = Date.now() - elapsedTime - initialOffsetInMs;
  }
  const formatTime = (seconds) => {
    const h = String(Math.floor(seconds / 3600)).padStart(2, "0");
    const m = String(Math.floor((seconds % 3600) / 60)).padStart(2, "0");
    const s = String(seconds % 60).padStart(2, "0");
    return `${h}:${m}:${s}`;
  };

  const handleDelete = (id) => {
    swal({
      title: "Are you sure you want to delete this task",
      icon: "warning",
      buttons: true,
      dangerMode: true,
      allowOutsideClick: false,
      closeOnClickOutside: false,
    }).then((willDelete) => {
      if (willDelete) {
        deleteMilestoneTask.mutate({ id: id });
      }
    });
  };
  const deleteMilestoneTask = useMutation(
    (formdata) => {
      return ProjectServices.deleteMilestoneTask(formdata);
    },
    {
      onSuccess: (data) => {
        if (data?.data?.error) {
          toast.error(data?.data?.message, { delay: 10 });
          return;
        }
        toast.success(data?.data?.message, { delay: 10 });
        queryClient.invalidateQueries("tasklist");
        queryClient.refetchQueries("tasklist");

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
    <div className="container-fluid">
      <div className="dashboard-wrapper">
        <MainSidebar />

        <div className="dash-right">
          <div className="inner-wrapper">
            <Header
              handleToggle={handleToggle}
              name={"Project Milestone"}
              subname={"Add"}
            />
          </div>

          <SideBarNav toggleStyle={toggleStyle} />

          {
            <div
              className={
                toggleStyle ? "dash-right-info" : "dash-right-info cstm-wdth2"
              }
            >
              <div className="d-flex justify-content-end mb-3">
                <BackButton
                  name={"Milestone "}
                  url={"/project/" + btoa(projectId)   }
                />
              </div>

              {milestoneId && projectId && (
                <MilestoneDetailsPage
                  setTIsUserTeamLeader={setTIsUserTeamLeader}
                  milestoneId={milestoneId && milestoneId}
                  projectId={projectId}
                />
              )}

              <div className="d-flex align-items-center justify-content-end mb-3">
                {/* <BackButton
                                    name={"Milestone "}
                                    url={"/project/" + btoa(projectId)}
                                /> */}

                {isUserTeamLeader && (
                  <Link
                    className="ctd-del-btn"
                    to={
                      "/project/milestone/task/" +
                      btoa(projectId) +
                      "/" +
                      btoa(milestoneId)+`?team=${ btoa(team)}`
                    }
                  >
                    + Add
                  </Link>
                )}
              </div>

              {isLoading ? (
                <ButtonLoader />
              ) : data?.data?.data?.milestonetask?.length == 0 ? (
                <div className="no-img">
                  <img src={nodata} />
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-bordered">
                    <thead>
                      <tr>
                        <th scope="col">Task name</th>
                        <th scope="col">Created By </th>
                        {/* <th scope="col">Next Activity</th> */}
                        {/* <th scope="col">Labels</th> */}
                        <th scope="col">Assigned To </th>
                        <th scope="col">Task Start</th>
                        <th scope="col">Task Status</th>
                        <th scope="col">Task Priority</th>
                        <th scope="col">Total Time</th>
                        <th scope="col">Worked Time</th>
                        {loggedInUserRoleId != config.superAdmin &&
                          loggedInUserRoleId != config.Manager &&
                          loggedInUserRoleId != config.Am && (
                            <th scope="col" className="text-center">
                              <IoSettingsOutline />
                            </th>
                          )}
                      </tr>
                    </thead>

                    <tbody>
                      {data?.data?.data?.milestonetask?.map((task) => {
                        return (
                          <tr key={task?._id}>
                            <td onClick={() => handleOpen(task)}>
                              <label
                                className="form-check-label"
                                htmlFor="flexCheckDefault"
                              >
                                {task?.name || "N/A"}
                              </label>
                            </td>
                            <td>
                              <p>{task?.createdBy?.userName || "N/A"}</p>
                              <p>({task?.createdBy?.email || "N/A"})</p>
                            </td>
                            <td>
                              <p>{task?.assignedId?.userName || "N/A"}</p>
                              <p>({task?.assignedId?.email || "N/A"})</p>
                            </td>
                            <td>
                              {(task?.startDate &&
                                moment(task?.startDate).format("ll")) ||
                                "N/A"}
                            </td>
                            <td>
                              {" "}
                              <span
                                className={`badge text-bg-${
                                  task?.status == config.paused
                                    ? "paused"
                                    : task?.status == config.inProgress
                                    ? "in-progress"
                                    : task?.status == config?.completed
                                    ? "complete"
                                    : "not-started"
                                } mt-3`}
                              >
                                {RemoveUnderscore(task?.status || "N/A")}
                              </span>
                            </td>
                            <td>
                              {capitalizeAndFormatText(task?.priority || "N/A")}
                            </td>
                            <td>
                              {convertHHMMSS_HM(task?.hours, task?.timeType)}
                            </td>
                            {loggedInUserId !== task?.assignedId?._id ? (
                              <td>
                                {convertSecondsToHHMMSS(
                                  task?.totalWorkingTime || 0
                                )}
                              </td>
                            ) : (
                              <>
                                {task.status == config.inProgress ? (
                                  <td>{formatTime(elapsedTime)}</td>
                                ) : (
                                  <td>
                                    {convertSecondsToHHMMSS(
                                      task?.totalWorkingTime || 0
                                    )}
                                  </td>
                                )}
                              </>
                            )}

                            {loggedInUserRoleId != config.superAdmin &&
                              loggedInUserRoleId != config.Am && (
                                <td className="settings-icon">
                                  {loggedInUserRoleId != config.superAdmin &&
                                    loggedInUserId ==
                                    task?.createdBy?._id &&
                                    loggedInUserRoleId != config.Executive && (
                                      <a
                                        href={
                                          "/project/milestone/task/" +
                                          btoa(projectId) +
                                          "/" +
                                          btoa(milestoneId) +
                                          "/" +
                                          btoa(task?._id)+`?team=${ btoa(team)}`
                                        }
                                      >
                                        <FaEdit />
                                      </a>
                                    )}
                                  {loggedInUserRoleId != config.superAdmin &&
                                    loggedInUserId ==
                                    task?.createdBy?._id &&
                                    loggedInUserRoleId != config.Executive && (
                                      <button
                                        type="button"
                                        onClick={() => handleDelete(task?._id)}
                                      >
                                        <FaTrash />
                                      </button>
                                    )}
                                  {loggedInUserRoleId != config.superAdmin &&
                                  task?.status == config.completed ? (
                                    <>
                                      <button className="btn bg-green">
                                        {" "}
                                        <IoCheckmarkSharp />
                                      </button>
                                      {loggedInUserRoleId !=
                                        config.superAdmin &&
                                        loggedInUserId ==
                                        task?.createdBy?._id &&
                                        loggedInUserRoleId !=
                                          config.Executive && (
                                          <button
                                            className="btn"
                                            onClick={() =>
                                              changeTaskStatus(
                                                config.paused,
                                                task?._id,
                                                task,
                                                false
                                              )
                                            }
                                          >
                                            {" "}
                                            <GrRevert />
                                          </button>
                                        )}
                                    </>
                                  ) : (
                                    <>
                                      {loggedInUserRoleId !=
                                        config.superAdmin &&
                                        loggedInUserRoleId != config.Manager &&
                                        task?.assignedId?._id ==
                                          loggedInUserId &&
                                        (task?.status == config.inProgress ? (
                                          <button
                                            className="btn"
                                            onClick={() =>
                                              changeTaskStatus(
                                                config.paused,
                                                task?._id,
                                                task
                                              )
                                            }
                                          >
                                            <IoIosPause />
                                          </button>
                                        ) : (
                                          <button
                                            className="btn"
                                            onClick={() =>
                                              changeTaskStatus(
                                                config.inProgress,
                                                task?._id,
                                                task
                                              )
                                            }
                                          >
                                            <IoIosPlay />
                                          </button>
                                        ))}
                                      {loggedInUserRoleId !=
                                        config.superAdmin &&
                                        loggedInUserRoleId != config.Manager &&
                                        task?.assignedId?._id ==
                                          loggedInUserId &&
                                        task?.status == config.inProgress &&
                                        task?.status != config.completed && (
                                          <button
                                            onClick={() =>
                                              changeTaskStatus(
                                                config.completed,
                                                task?._id,
                                                task
                                              )
                                            }
                                            className="bg-red"
                                          >
                                            <IoStop />
                                          </button>
                                        )}
                                    </>
                                  )}{" "}
                                </td>
                              )}
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}

              {!isLoading && data?.data?.data?.milestonetask?.length > 0 && (
                <Pagination
                  handlePageChange={handlePageChange}
                  pagination={data?.data?.data?.pagination || 0}
                  pageid={pageid}
                  data_per_page={data_per_pages || 0}
                />
              )}
            </div>
          }
        </div>
      </div>

      {!!prefillData && (
        <ViewTaskDetails
          isModel={isModel}
          setIsModel={setIsModel}
          data={prefillData}
          setPrefillData={setPrefillData}
        />
      )}
    </div>
  );
};

export default ViewTaskList;
