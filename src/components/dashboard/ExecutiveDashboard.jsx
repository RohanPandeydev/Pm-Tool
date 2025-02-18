/* eslint-disable no-unused-vars */
import React, { useRef, useState } from "react";
import "./dashboard.css";
import Header from "../../layout/header/Header";
import background from "../../assets/bg3.png";
import MainSidebar from "../../layout/sidebarnav/MainSidebar";
import {
  IoCheckmarkSharp,
  IoSearchSharp,
  IoSettingsOutline,
  IoStop,
} from "react-icons/io5";
import { IoIosPause, IoIosPlay } from "react-icons/io";
import DashboardProjectStatus from "./DashboardProjectStatus";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import DashboardServices from "../../services/DashboardServices";
import ValidateAuthenticationKey from "../../utils/ValidateAuthenticationKey";
import nodata from "../../assets/nodatafound.png";
import convertSecondsToHHMMSS, {
  TimeConversion,
  convertHHMMSS_HM,
} from "../../utils/TotalWorkingTime";
import moment from "moment";
import capitalizeAndFormatText from "../../utils/MakeLetterCapital";
import StorageData from "../../helper/storagehelper/StorageData";
import config from "../../config";
import swal from "sweetalert";
import getCurrentDateTimeIST from "../../utils/CurrentTime";
import ProjectServices from "../../services/ProjectServices";
import { toast } from "react-toastify";
import RemoveUnderscore from "../../utils/RemoveUnderScoreAndMakeCapital";
import { useEffect } from "react";
import ViewTaskDetails from "../project/milestone/ViewTaskDetails";
const ExecutiveDashboard = () => {
  const [toggleStyle, setToggleStyle] = useState(false);
  const [totalProjects, setTotalProjects] = useState("");
  const loggedInUserRoleId = StorageData.getUserData()?.role?.roleUId;
  const loggedInUserId = StorageData.getUserData()?._id;
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const intervalRef = useRef(null);
  const startTimeRef = useRef(0);
  const [initialOffsetInSeconds, setInitialTime] = useState(0);

  const [isModel, setIsModel] = useState(false);
  const [prefillData, setPrefillData] = useState({});

  const handleToggle = () => {
    setToggleStyle(!toggleStyle);
  };
  const changeTaskStatus = (taskstatus, task) => {
    swal({
      title:
        taskstatus == config.inProgress
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
        const currentTimenDate = getCurrentDateTimeIST();

        const sendData = {
          milestoneId: task?.milestoneId,
          taskId: task?.taskId,
          status: taskstatus,
          date: currentTimenDate?.date,
          time: currentTimenDate?.time,
        };
        updateTask.mutate(sendData);
      }
    });
  };
  const { data: executiveList, isLoading } = useQuery(
    ["executive-task-list", search],
    () => DashboardServices.getExecutiveTaskList(),
    {
      refetchOnWindowFocus: false,
      select: (data) => {
        const response =
          search === ""
            ? data?.data?.data?.result
            : data?.data?.data?.result?.filter((each) =>
                each?.taskName?.toLowerCase().includes(search.toLowerCase())
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
        // console.log(err?.response);
        // toast.error(err?.response?.data?.message || err?.message, {
        //     delay: 10,
        // });
      },
    }
  );

  const handleSearch = (e) => {
    e.preventDefault();
    setSearch(e.target.value);
  };

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
        queryClient.invalidateQueries("executive-task-list");
        queryClient.refetchQueries("executive-task-list");

        return;
      },
      onError: (err) => {
        // console.log("Get", err?.response?.data?.data);
        toast.error(err?.response?.data?.message || err?.message, {
          delay: 10,
        });
      },
    }
  );
  const formatTime = (seconds) => {
    const h = String(Math.floor(seconds / 3600)).padStart(2, "0");
    const m = String(Math.floor((seconds % 3600) / 60)).padStart(2, "0");
    const s = String(seconds % 60).padStart(2, "0");
    return `${h}:${m}:${s}`;
  };
  // console.log("executiveList",executiveList)

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
  function resetTimer() {
    setIsRunning(false);
    setElapsedTime(0);
    setInitialTime(0);
  }
  const handleOpen = (data) => {
    setPrefillData(data);
    setIsModel(!isModel);
  };

  useEffect(() => {
    if (isLoading) return;

    // Find the task in progress
    const timeInProgress = executiveList?.find(
      (each) => each.status === config.inProgress
    );
    console.log("timeInProgress", timeInProgress);

    resetTimer();

    if (timeInProgress) {
      // Retrieve the last entry from the history object
      const lastTimeHistory = timeInProgress.history;
      const dateTimeString = `${lastTimeHistory.date} ${lastTimeHistory.time}`;
      const dateTime = new Date(dateTimeString);
      const timeInMs = dateTime.getTime() || Date.now();

      const totalWorkingTime = timeInProgress.totalWorkingTime || 0;
      const initialElapsedTime =
        totalWorkingTime + Math.ceil((Date.now() - timeInMs) / 1000);

      startTimeRef.current = initialElapsedTime;
      setElapsedTime(initialElapsedTime);

      // Start the timer to update the elapsed time every second
      intervalRef.current = setInterval(() => {
        setElapsedTime((prev) => prev + 1);
      }, 1000);

      // Clear interval on component unmount
      return () => clearInterval(intervalRef.current);
    }
  }, [executiveList, isLoading]);

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
                subname={"Executive Dashboard"}
              />
            </div>

            {/* <ProjectSidebar
                            toggleStyle={toggleStyle}
                        /> */}

            <div className={"dashboard-body p-3"}>
              <div
                className="lead-bx"
                style={{ backgroundImage: `url(${background})` }}
              >
                <h5>Total Project</h5>
                <h3>{totalProjects && totalProjects}</h3>
              </div>
              <DashboardProjectStatus setTotalProjects={setTotalProjects} />
              <div className="overview-bx mt-3">
                <div className="overview-header">
                  <h4>Latest Task List</h4>
                  <div className="search-bx">
                    <form>
                      <input
                        type="text"
                        onChange={handleSearch}
                        value={search}
                        placeholder="Search"
                      />
                      <div className="search-icon">
                        <IoSearchSharp />
                      </div>
                    </form>
                  </div>
                </div>

                <div className="table-responsive">
                  {!isLoading && executiveList?.length == 0 ? (
                    <div className="no-img">
                      <img src={nodata} />
                    </div>
                  ) : (
                    <table className="table table-bordered">
                      <thead>
                        <tr>
                          <th scope="col">Task name</th>
                          <th scope="col">Project Name</th>
                          {/* <th scope="col">Next Activity</th> */}
                          {/* <th scope="col">Labels</th> */}
                          <th scope="col">Task Start</th>
                          <th scope="col">Task Status</th>
                          <th scope="col">Task Priority</th>
                          <th scope="col">Total Time</th>
                          <th scope="col">Worked Time</th>
                        </tr>
                      </thead>

                      <tbody>
                        {executiveList?.map((task, ind) => {
                          return (
                            <tr key={task?._id}>
                              <td onClick={() => handleOpen(task)}>
                                <label
                                  className="form-check-label"
                                  htmlFor="flexCheckDefault"
                                >
                                  {task?.taskName || "N/A"}
                                </label>
                              </td>
                              <td>{task?.projectName || 'N/A'}</td>

                              <td>
                                {(task?.startDate &&
                                  moment(task?.startDate).format("ll")) ||
                                  "N/A"}
                              </td>
                              <td>
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
                                {capitalizeAndFormatText(
                                  task?.priority || "N/A"
                                )}
                              </td>
                              <td>
                                {convertHHMMSS_HM(task?.hours, task?.timeType)}
                              </td>
                              {task.status == config.inProgress ? (
                                <td>{formatTime(elapsedTime)}</td>
                              ) : (
                                <td>
                                  {convertSecondsToHHMMSS(
                                    task?.totalWorkingTime || 0
                                  )}
                                </td>
                              )}
                              {
                                <td className="settings-icon">
                                  {task?.status == config.completed ? (
                                    <button className="btn bg-green">
                                      {" "}
                                      <IoCheckmarkSharp />
                                    </button>
                                  ) : (
                                    <>
                                      {task?.assignedId == loggedInUserId &&
                                        (task?.status == config.inProgress ? (
                                          <button
                                            className="btn"
                                            onClick={() =>
                                              changeTaskStatus(
                                                config.paused,
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
                                                task
                                              )
                                            }
                                          >
                                            <IoIosPlay />
                                          </button>
                                        ))}
                                      {task?.assignedId == loggedInUserId &&
                                        task?.status == config.inProgress &&
                                        task?.status != config.completed && (
                                          <button
                                            onClick={() =>
                                              changeTaskStatus(
                                                config.completed,
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
                              }
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  )}
                </div>

                {/* <div className="table-responsive">
                                    <table className="table table-bordered">
                                        <thead>
                                            <tr>
                                                <th scope="col">Project Name</th>
                                                <th scope="col">Phase</th>
                                                <th scope="col">Task</th>
                                                <th scope="col">Start Date</th>
                                                <th scope="col">Total Time</th>
                                                <th scope="col">Consumed Time</th>
                                                <th scope="col" className="text-center">Status</th>
                                                <th scope="col" className="text-center">Action</th>
                                            </tr>
                                        </thead>

                                        <tbody>
                                            <tr>
                                                <td>Hawaiiluxurytour</td>
                                                <td>2 Phase</td>
                                                <td>Contact Form Design</td>
                                                <td>24 May, 2024</td>
                                                <td>16 Hrs</td>
                                                <td>10 Hrs</td>
                                                <td className="text-center">
                                                    <span className="badge text-bg-success">Started</span>
                                                </td>
                                                <td className="text-center settings-icon">
                                                    <a href="/"><IoIosPause /></a>
                                                    <a href="/" className="bg-red"><IoStop /></a>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>Hawaiiluxurytour</td>
                                                <td>2 Phase</td>
                                                <td>Contact Form Design</td>
                                                <td>24 May, 2024</td>
                                                <td>16 Hrs</td>
                                                <td>10 Hrs</td>
                                                <td className="text-center">
                                                    <span className="badge text-bg-warning">Pause</span>
                                                </td>
                                                <td className="text-center settings-icon">
                                                    <a href="/"><IoIosPlay /></a>
                                                    <a href="/" className="bg-red"><IoStop /></a>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>Hawaiiluxurytour</td>
                                                <td>2 Phase</td>
                                                <td>Contact Form Design</td>
                                                <td>24 May, 2024</td>
                                                <td>16 Hrs</td>
                                                <td>10 Hrs</td>
                                                <td className="text-center">
                                                    <span className="badge text-bg-success">Started</span>
                                                </td>
                                                <td className="text-center settings-icon">
                                                    <a href="/"><IoIosPlay /></a>
                                                    <a href="/" className="bg-red"><IoStop /></a>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>Hawaiiluxurytour</td>
                                                <td>2 Phase</td>
                                                <td>Contact Form Design</td>
                                                <td>24 May, 2024</td>
                                                <td>16 Hrs</td>
                                                <td>10 Hrs</td>
                                                <td className="text-center">
                                                    <span className="badge text-bg-warning">Pause</span>
                                                </td>
                                                <td className="text-center settings-icon">
                                                    <a href="/"><IoIosPlay /></a>
                                                    <a href="/" className="bg-red"><IoStop /></a>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>Hawaiiluxurytour</td>
                                                <td>2 Phase</td>
                                                <td>Contact Form Design</td>
                                                <td>24 May, 2024</td>
                                                <td>16 Hrs</td>
                                                <td>10 Hrs</td>
                                                <td className="text-center">
                                                    <span className="badge text-bg-success">Started</span>
                                                </td>
                                                <td className="text-center settings-icon">
                                                    <a href="/"><IoIosPlay /></a>
                                                    <a href="/" className="bg-red"><IoStop /></a>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>Hawaiiluxurytour</td>
                                                <td>2 Phase</td>
                                                <td>Contact Form Design</td>
                                                <td>24 May, 2024</td>
                                                <td>16 Hrs</td>
                                                <td>10 Hrs</td>
                                                <td className="text-center">
                                                    <span className="badge text-bg-warning">Pause</span>
                                                </td>
                                                <td className="text-center settings-icon">
                                                    <a href="/"><IoIosPlay /></a>
                                                    <a href="/" className="bg-red"><IoStop /></a>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div> */}
              </div>
            </div>
          </div>
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
    </>
  );
};

export default ExecutiveDashboard;
