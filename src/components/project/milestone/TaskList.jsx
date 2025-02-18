import React, { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import Select from "react-select";
import MainSidebar from "../../../layout/sidebarnav/MainSidebar";
import Header from "../../../layout/header/Header";
import SideBarNav from "../../../layout/sidebarnav/SideBarNav";
import { useMutation, useQuery } from "@tanstack/react-query";
import ProjectServices from "../../../services/ProjectServices";
import UserServices from "../../../services/UserServices";
import StorageData from "../../../helper/storagehelper/StorageData";
import ButtonLoader from "../../../utils/Loader/ButtonLoader";
import { toast } from "react-toastify";
import moment from "moment";
import customContext from "../../../contexts/Context";
import Loader from "../../../utils/Loader/Loader";
import { customRound } from "../../../utils/TotalWorkingTime";
import Editor from "../../../utils/Notes/Editor";
import MultiEditor from "../../../utils/Notes/MultiEditor";
import deepCopy from "../../../utils/DeepCopyArray";
import config from "../../../config";
const TaskList = () => {
  const { milestoneId, taskId, projectId } = useParams();
  const [projectMilestoneDecodeId, setProjectMilestoneDecodeId] = useState("");
  const [projectDecodeId, setProjectDecodeId] = useState("");
  const [isLoadingTask, setIsLoadingTask] = useState(false);
  const [taskIds, setTaskIds] = useState("");
  const [toggleStyle, setToggleStyle] = useState(false);
  const [errors, setErrors] = useState({}); // State to hold errors
  const id = StorageData?.getUserData()?._id;
  const priorities = ["high", "medium", "low"];
  const [type, setType] = useState("hours");
  const [text, setText] = useState([{ id: 1, text: "" }]);
  let location = useLocation();
  let queryParams = new URLSearchParams(location.search);
  let teamId = queryParams.get("team");
  const [team , setTeam] = useState("");
  const loggedInUserRoleId = StorageData.getUserData()?.role?.roleUId;

  const [projectTaskList, setProjectTaskList] = useState([
    {
      name: "",
      notes: "",
      hours: "",
      assignedId: "",
      priority: "low",
      startDate: "",
      timeType: "hours",
    },
  ]);
  const { redirectUrl } = customContext();
  const navigate = useNavigate();

  const RemoveTask = (index) => {
    const afterRemove = projectTaskList.filter((phase, ind) => ind != index);
    setProjectTaskList(() => afterRemove);
    text.splice(index,1)
    return;
  };
  const handleToggle = () => {
    setToggleStyle(!toggleStyle);
  };
  function validateTasks(tasks) {
    const newErrors = {};
    projectTaskList.forEach((task, index) => {
      const error = {};
      if (!task.name.trim()) {
        error.name = `Task Name is required for TaskList ${index + 1} `;
      }
      if (!task.assignedId) {
        error.assignedId = `Executive is required for TaskList ${index + 1}`;
      }
      if (!task.hours) {
        error.hours = `Hours is required for TaskList ${index + 1}`;
      }
      if (isNaN(Number(task.hours.trim()))) {
        error.hours = `Hours must be a numeric value`;
      }
      if (!task.startDate) {
        error.startDate = `Start Date is required`;
      }
      if (Object.keys(error).length > 0) {
        newErrors[index] = error;
      }
    });

    setErrors(newErrors);
    // If there are no errors, proceed with submission
    if (Object.keys(newErrors).length === 0) {
      // Your submission logic here
      return true;
    }
    return false;
  }
  const handleProjectChange = (index, fieldName, value) => {
    const updatedTaskList = [...projectTaskList];
    updatedTaskList[index][fieldName] = value;
    setProjectTaskList(updatedTaskList);
  };
  const AddTaskMore = () => {
    if(projectTaskList?.length <5){

    
    const copyText=[...text];
    const lastIndexEditor=copyText.pop()
    // console.log("LastInde≈x",lastIndexEditor)
    setProjectTaskList([
      ...projectTaskList,
      {
        name: "",
        notes: "",
        hours: "",
        assignedId: "",
        priority: "low",
        startDate: "",
        timeType: "hours",
      },
    ]);
    setText([...text,{id:lastIndexEditor?.id+1,text:""}])
  }
  };
  const handleSubmit = () => {
    //const sendData = [...projectTaskList];
    const sendData = deepCopy(projectTaskList);
    console.log("projectTaskList",projectTaskList)
    if (!validateTasks()) {
      return false;
    } else {
      if (!!taskIds) {
        const updateData = { ...projectTaskList[0] };

        updateData.id = taskIds;
        if (updateData?.timeType == "mins") {
          const hours = Number(updateData?.hours) / 60;
          updateData.hours = hours;
        }
        // //console.log("Updated ", updateData)

        updateMutation.mutate(updateData);
        return;
      }
      console.log('test calling====>', sendData)
      sendData?.map((each) => {
        if (each?.timeType == "mins") {
          const hours = Number(each?.hours) / 60;
          each.hours = hours;
        }
      });
      // //console.log(" (Number(each?.hours) / 60)",sendData)

        createMutation.mutate({
          projectTaskList: sendData,
          milestoneId: projectMilestoneDecodeId,
        });
    }
  };
  const handleOnClose = () => {
    setProjectTaskList([
      {
        name: "",
        notes: "",
        hours: "",
        assignedId: "",
        priority: "",
        startDate: "",
        timeType: "hours",
      },
    ]);
    setProjectMilestoneDecodeId("");
  };
  const { data, isLoading, isError, error } = useQuery(
    ["tlslist", id, projectDecodeId],
    () =>
      UserServices.getProjectExecutiveList1({
        tlId: id,
        projectId: projectDecodeId,
        team: atob(team)
      }),
    {
      enabled: !!id && !!projectDecodeId,
      refetchOnWindowFocus: false,
      onSuccess: (data = {}) => {
        // //console.log("Tl List", data?.data?.data)
        // setUserData(data?.data?.data?.users);

        return true;
      },
      onError: (err) => {
        if (err?.response?.status === 401) {
          ValidateAuthenticationKey(
            err?.response?.status,
            "Your login session has expired. Please log in again."
          );
        } else {
          // console.err(err?.response);
          return false;
          // toast.error(err?.response?.data?.message || err?.message, {
          //     delay: 10,
          // });
        }
      },
    }
  );


  const handleEditor = (data, index) => {

    setText((prevText) => {
        const updatedText = [...prevText];
        updatedText[index].text = data;
        updatedText[index].id = index;
        return updatedText;
      });
      setProjectTaskList((prevText) => {
        const updatedText = [...prevText];
        updatedText[index].notes = data;
        return updatedText;
      });
    
    };
  const createMutation = useMutation(
    (formdata) => {
      return ProjectServices.createMilestoneTask(formdata);
    },
    {
      onSuccess: (data) => {
        if (data?.data?.error) {
          toast.error(data?.data?.message, { delay: 10 });
          return;
        }
        toast.success(data?.data?.message, { delay: 10 });
        const redirectUrlToTask =
          "/project/" +
          btoa(data?.data?.data?.Projectmilestone?.projectId?._id) +
          "/milestone/" +
          btoa(projectMilestoneDecodeId) +
          "/task?team="+team;
        navigate(
          (!!redirectUrlToTask && redirectUrlToTask) ||
            "/project/" + btoa(projectDecodeId)
        );
        // return;
      },
      onError: (err) => {
        if (err?.response?.status === 401) {
          ValidateAuthenticationKey(
            err?.response?.status,
            "Your login session has expired. Please log in again."
          );
        }
        // //console.log("Get", err?.response?.data?.data);
        toast.error(err?.response?.data?.message || err?.message, {
          delay: 10,
        });
      },
    }
  );
  const updateMutation = useMutation(
    (formdata) => {
      return ProjectServices.updateMilestoneTask(formdata);
    },
    {
      onSuccess: (data) => {
        if (data?.data?.error) {
          toast.error(data?.data?.message, { delay: 10 });
          return;
        }
        toast.success(data?.data?.message, { delay: 10 });
        // //console.log("data?.data?.data",data?.data?.data?.updatedProjectTask?.projectId)
        const redirectUrlToTask =
          "/project/" +
          btoa(data?.data?.data?.updatedProjectTask?.projectId) +
          "/milestone/" +
          btoa(projectMilestoneDecodeId) +
          "/task?team="+team;
        navigate(
          (!!redirectUrlToTask && redirectUrlToTask) ||
            "/project/" + btoa(data?.data?.data?.updatedProjectTask?.projectId)
        );
        // return;
      },
      onError: (err) => {
        if (err?.response?.status === 401) {
          ValidateAuthenticationKey(
            err?.response?.status,
            "Your login session has expired. Please log in again."
          );
        }
        // //console.log("Get", err?.response?.data?.data);
        toast.error(err?.response?.data?.message || err?.message, {
          delay: 10,
        });
      },
    }
  );

  useEffect(() => {
    try {
      const decodedMilestoneId = atob(milestoneId);
      const decodedTaskId = taskId && atob(taskId);
      const decodedProjectId = projectId && atob(projectId);
      setProjectMilestoneDecodeId(() => decodedMilestoneId);
      setProjectDecodeId(() => decodedProjectId);
      setTaskIds(() => decodedTaskId);
      setTeam(() => teamId);
    } catch (error) {
      // console.error("Error decoding user ID:", error.message);
      // Handle the error gracefully, e.g., display an error message to the user
    }
  }, [milestoneId, taskId, projectId,teamId]);
  useEffect(() => {
    if (!!taskIds) {
      const fetchData = async () => {
        setIsLoadingTask(true);
        try {
          // If data doesn't exist in cache, fetch it from the API
          const response = await ProjectServices.getProjectMilestoneTaskDetails(
            { taskId: taskIds, milestoneId: projectMilestoneDecodeId }
          );
          const prefill = response?.data?.data?.milestonetask;
          let startDate = "";
          if (moment(prefill?.startDate).isValid()) {
            startDate = moment(prefill?.startDate).format("YYYY-MM-DD");
          }
          //console.log("Time", prefill)
          setProjectTaskList([
            {
              name: prefill?.name || "",
              notes: prefill?.notes || "",
              hours:
                prefill?.timeType == "mins"
                  ? String(Math.round(Number(prefill?.hours) * 60))
                  : String(prefill?.hours) || "",
              timeType: prefill?.timeType,
              assignedId: prefill?.assignedId?._id || "",
              priority: prefill?.priority || "",
              startDate: startDate,
            },
          ]);
        } catch (error) {
          // Handle errors
          toast.error(error?.response?.data?.message || error?.message, {
            delay: 10,
          });
        } finally {
          setIsLoadingTask(false);
        }
      };
      fetchData();
    }
  }, [taskIds]);

  const handleGoBack = (e) => {
    e.preventDefault();
    // Navigate back to the previous location
    navigate(-1);
  };

  return (
    <>
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

            <div
              className={
                toggleStyle
                  ? "dashboard-body p-3"
                  : "dashboard-body p-3 cstm-wdth2"
              }
            >
              <div className="DealsRight-section">
                {isLoadingTask ? (
                  <Loader />
                ) : (
                  projectTaskList?.map((task, index) => {
                    return (
                      <div key={index} className="mb-3">
                        <h3 className="title1">
                          Task List {!!!taskIds && index + 1}
                        </h3>
                        <form className="rd-mailform mt-4">
                          <div className="row">
                            <div className="col-md-12">
                              <div className="form-group">
                                <input
                                  className="form-control"
                                  type="text"
                                  placeholder="Task Name"
                                  name="name"
                                  value={task?.name}
                                  onChange={(e) =>
                                    handleProjectChange(
                                      index,
                                      "name",
                                      e.target.value
                                    )
                                  }
                                />
                                {errors[index] && errors[index]?.name && (
                                  <p className="text-danger position-static">
                                    {errors[index]?.name}
                                  </p>
                                )}
                              </div>
                            </div>
                            <div className="col-md-12">
                              <div className="form-group">
                                {/* <textarea
                                                                        className="form-control"
                                                                        placeholder="Notes"
                                                                        name="notes"
                                                                        value={task?.notes}
                                                                        onChange={(e) =>
                                                                            handleProjectChange(
                                                                                index,
                                                                                "notes",
                                                                                e.target.value
                                                                            )
                                                                        }
                                                                    ></textarea> */}
                                <MultiEditor
                                  text={projectTaskList}
                                  handleEditor={handleEditor}
                                  index={index}
                                />
                              </div>
                              {errors[index] && errors[index].notes && (
                                <p className="text-danger  position-static">
                                  {errors[index].notes}
                                </p>
                              )}
                            </div>
                            <div className={"col-md-12"}>
                              <div className="row">
                                <div className="col-md">
                                  <div className="form-group">
                                    {/* <label className='' style={{textTransform:"capitalize"}}>{task?.timeType}</label> */}
                                    <input
                                      className="form-control mb-3"
                                      type="number"
                                      min={1}
                                      placeholder={
                                        task?.timeType == "hours"
                                          ? "Hours"
                                          : "Mins"
                                      }
                                      name="hours"
                                      value={task?.hours}
                                      onChange={(e) =>
                                        handleProjectChange(
                                          index,
                                          "hours",
                                          e.target.value
                                        )
                                      }
                                    />
                                    {errors[index] && errors[index].hours && (
                                      <p className="text-danger  position-static">
                                        {errors[index].hours}
                                      </p>
                                    )}
                                    <select
                                      className="form-select"
                                      name="timeType"
                                      onChange={(e) =>
                                        handleProjectChange(
                                          index,
                                          "timeType",
                                          e.target.value
                                        )
                                      }
                                      value={task?.timeType}
                                      defaultValue={"hours"}
                                      aria-label="Default select example"
                                    >
                                      <option value={"mins"}>Mins</option>
                                      <option value={"hours"}>Hours</option>
                                    </select>
                                    {errors[index] &&
                                      errors[index].timeType && (
                                        <p className="text-danger  position-static">
                                          {errors[index].timeType}
                                        </p>
                                      )}
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="col-md-6">
                              <div
                                className="modal-form-box mb-3"
                                style={{
                                  display: "flex",
                                  alignItems: "flex-start",
                                  justifyContent: "centeflex-start",
                                  flexDirection: "column",
                                  width: "100%",
                                }}
                              >
                                <select
                                  className="form-select"
                                  name="assignedId"
                                  placeholder="Add Member"
                                  value={task?.assignedId}
                                  onChange={(e) =>
                                    handleProjectChange(
                                      index,
                                      "assignedId",
                                      e.target.value
                                    )
                                  }
                                  aria-label="Default select example"
                                >
                                  <option value="">Select Executive</option>
                                 {loggedInUserRoleId !== config.Manager && <option value={id}>Self assign</option> }
                                  {isLoading ? (
                                    <ButtonLoader />
                                  ) : (
                                    data?.data?.data?.user?.members?.map(
                                      (executive) => {
                                        return (
                                          <option
                                            value={executive?._id}
                                            key={executive?._id}
                                          >
                                            {executive?.userName || "N/A"}
                                          </option>
                                        );
                                      }
                                    )
                                  )}
                                </select>
                                {errors[index] && errors[index].assignedId && (
                                  <p className="text-danger  position-static">
                                    {errors[index].assignedId}
                                  </p>
                                )}
                              </div>
                            </div>
                            <div className="col-md-6">
                              <div
                                className="modal-form-box mb-3"
                                style={{
                                  display: "flex",
                                  alignItems: "flex-start",
                                  justifyContent: "centeflex-start",
                                  flexDirection: "column",
                                  width: "100%",
                                }}
                              >
                                <select
                                  className="form-select"
                                  name="priority"
                                  placeholder="Add Priority"
                                  value={task?.priority}
                                  onChange={(e) =>
                                    handleProjectChange(
                                      index,
                                      "priority",
                                      e.target.value
                                    )
                                  }
                                  aria-label="Default select example"
                                >
                                  <option value="">Select Priority</option>
                                  {priorities?.map((priority) => {
                                    return (
                                      <option key={priority} value={priority}>
                                        {priority}
                                      </option>
                                    );
                                  })}
                                </select>
                                {errors[index] && errors[index].priority && (
                                  <p className="text-danger  position-static">
                                    {errors[index].priority}
                                  </p>
                                )}
                              </div>
                              <div
                                className="modal-form-box"
                                style={{
                                  display: "flex",
                                  alignItems: "flex-start",
                                  justifyContent: "centeflex-start",
                                  flexDirection: "column",
                                  width: "100%",
                                }}
                              >
                                {/* <select
                                                                    className="form-select"
                                                                    name="status"
                                                                    value={task?.status}
                                                                    onChange={(e) =>
                                                                        handleProjectChange(
                                                                            index,
                                                                            "status",
                                                                            e.target.value
                                                                        )
                                                                    }
                                                                    aria-label="Default select example"
                                                                >
                                                                    <option value="volvo">Volvo</option>
                                                                    <option value="saab">Saab</option>
                                                                    <option value="mercedes">Mercedes</option>
                                                                    <option value="audi">Audi</option>
                                                                </select> */}
                              </div>
                            </div>
                            <div className={"col-md-12"}>
                              <div className="row">
                                <div className="col-md">
                                  <div className="form-group">
                                    <label>Start Date</label>
                                    <input
                                      className="form-control"
                                      type="date"
                                      placeholder="Start Date"
                                      name="startDate"
                                      value={task?.startDate}
                                      onChange={(e) =>
                                        handleProjectChange(
                                          index,
                                          "startDate",
                                          e.target.value
                                        )
                                      }
                                      min={
                                        new Date().toISOString().split("T")[0]
                                      }
                                    />
                                    {errors[index] &&
                                      errors[index].startDate && (
                                        <p className="text-danger  position-static">
                                          {errors[index].startDate}
                                        </p>
                                      )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </form>
                        <div className="btn-grp mt-4">
                          {/* <div className='btn-grp mt-4'> */}
                          {projectTaskList?.length > 1 && (
                            <button
                              className="btn btn-danger"
                              type="button"
                              onClick={() => RemoveTask(index)}
                            >
                              Delete
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}

                <div className="btn-grp mt-4">
                  {/* {!!!taskIds && projectTaskList?.length < 5 && (
                    <button
                      className="btn btn-outline-warning me-3"
                      type="button"
                      onClick={() => AddTaskMore()}
                    >
                      +Add Task
                    </button>
                  )} */}
                  <div>
                    <button
                      className="btn modal-save-btn me-2"
                      type="button"
                      onClick={handleSubmit}
                    >
                      {createMutation?.isLoading ||
                      updateMutation?.isLoading ? (
                        <ButtonLoader />
                      ) : (
                        "Save"
                      )}
                    </button>

                    <button
                      type="button"
                      className="btn modal-close-btn"
                      onClick={handleGoBack}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
                {/* </div> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TaskList;
