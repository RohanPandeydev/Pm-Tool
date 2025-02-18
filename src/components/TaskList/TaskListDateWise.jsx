import React, { useEffect, useRef, useState } from 'react'
import { IoSettingsOutline } from 'react-icons/io5'
import SideBarNav from '../../layout/sidebarnav/SideBarNav'
import Header from '../../layout/header/Header'
import MainSidebar from '../../layout/sidebarnav/MainSidebar'
import { IoMdEye } from 'react-icons/io'
import StorageData from '../../helper/storagehelper/StorageData'
import config from '../../config'
import AdminFilterCard from '../../utils/AdminFilterCard'
import TeamLeaderFilterCard from '../../utils/TeamLeaderFilterCard'
import ExecutiveFilterCard from '../../utils/ExecutiveFilterCard'
import ManagerFilterCard from '../../utils/ManagerFilterCard'
import Loader from '../../utils/Loader/Loader'
import nodata from "../../assets/nodatafound.png";
import TaskListing from '../../utils/TaskListing'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import ProjectServices from '../../services/ProjectServices'
import { toast } from 'react-toastify'
import swal from 'sweetalert'
import getCurrentDateTimeIST from '../../utils/CurrentTime'
import ViewTaskDetails from '../project/milestone/ViewTaskDetails'

const TaskListDateWise = () => {
    const [toggleStyle, setToggleStyle] = useState(false);
    const loggedInUserRoleId = StorageData.getUserData()?.role?.roleUId;
    const loggedInUserId = StorageData.getUserData()?._id;
    const [filteredData, setFilteredData] = useState([])
    const [isLoading, setIsLoading] = useState(null)
    const queryClient = useQueryClient()
    const [prefillData, setPrefillData] = useState({})
    const [isModel, setIsModel] = useState(false);
    const [isRunning, setIsRunning] = useState(false);
    const [elapsedTime, setElapsedTime] = useState(0);
    const intervalRef = useRef(null);
    const startTimeRef = useRef(0);
    const [initialOffsetInSeconds, setInitialTime] = useState(0)

    const handleToggle = () => {
        setToggleStyle((v) => !v);
    };
    const handleOpen = (data) => {
        setPrefillData(data)
        setIsModel(!isModel);
    };
    const changeTaskStatus = (taskstatus, taskId, milestoneId,type=true) => {
        // //console.log("Data",data)
        swal({
            title: type==false ? "Are you sure you want to restart this task?" : taskstatus == config.inProgress ? "Are you sure you want to start this task?" : taskstatus == config.paused ? "Are you sure you want to pause this task?" : "Are you sure you want to mark this task as complete?",
            icon: "warning",
            buttons: true,
            dangerMode: true,
            allowOutsideClick: false ,
            closeOnClickOutside: false
        }).then((willDelete) => {
            if (willDelete) {
                const currentTimenDate = getCurrentDateTimeIST()

                const sendData = {
                    milestoneId: milestoneId,
                    taskId: taskId,
                    status: taskstatus,
                    date: currentTimenDate?.date,
                    time: currentTimenDate?.time
                }
                updateTask.mutate(sendData);
            }
        });
    }
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


    // Timer

    function startTimer() {
        setIsRunning(true);
        // startTimeRef.current = Date.now() - elapsedTime - initialOffsetInMs;
    }
    const formatTime = (seconds) => {
        const h = String(Math.floor(seconds / 3600)).padStart(2, '0');
        const m = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0');
        const s = String(seconds % 60).padStart(2, '0');
        return `${h}:${m}:${s}`;
    };
    useEffect(() => {
        if (isRunning) {
            intervalRef.current = setInterval(() => {
                //setElapsedTime(Date.now() - startTimeRef.current);
                setElapsedTime(prev => prev + 1);
            }, 1000);
        }
        return () => {
            clearInterval(intervalRef.current);
        };
    }, [isRunning]);


    function resetTimer() {
        setIsRunning(false)
        setElapsedTime(0)
        setInitialTime(0)
    }



    useEffect(() => {
        // Flatten the tasks list and find the task in progress
        const tasksList = filteredData.map((each) => each?.tasks).flat(2);
        const timeInProgress = tasksList?.find((each) => each.status === config.inProgress);
        

        resetTimer();

        if (timeInProgress) {
            // Retrieve the last entry from the history array
            const lastTimeHistory = timeInProgress.history[timeInProgress.history.length - 1];
            const dateTimeString = `${lastTimeHistory.date} ${lastTimeHistory.time}`;
            const dateTime = new Date(dateTimeString);
            const timeInMs = dateTime.getTime() || Date.now();

            const totalWorkingTime = timeInProgress.totalWorkingTime || 0;
            const initialElapsedTime = totalWorkingTime + Math.ceil((Date.now() - timeInMs) / 1000);

            startTimeRef.current = initialElapsedTime;
            setElapsedTime(initialElapsedTime);

            // Start the timer to update the elapsed time every second
            intervalRef.current = setInterval(() => {
                setElapsedTime((prev) => prev + 1);
            }, 1000);

            return () => clearInterval(intervalRef.current);
        }
    }, [filteredData]);




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
        queryClient.invalidateQueries("findTask");
        queryClient.refetchQueries("findTask");

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
                            name={"Task"}
                            subname={"Task List"}
                        />
                    </div>

                    <div>
                        {/* <SideBarNav
                            toggleStyle={toggleStyle}
                            livechat={"User View"}
                            chatbot={"Chatbot"}
                            webforms={" Web Forms"}
                            prospector={"Prospector"}
                            booster={"Leads Booster"}
                        /> */}


                        <div className="dashboard-body p-3">

                            {
                                loggedInUserRoleId == config.superAdmin ? <AdminFilterCard setFilteredData={setFilteredData} setIsLoading={setIsLoading} /> : loggedInUserRoleId == config.Manager ? <ManagerFilterCard setFilteredData={setFilteredData} setIsLoading={setIsLoading} /> : loggedInUserRoleId == config.teamLeader ? <TeamLeaderFilterCard setFilteredData={setFilteredData} setIsLoading={setIsLoading} /> : loggedInUserRoleId == config.Executive ? <ExecutiveFilterCard setFilteredData={setFilteredData} setIsLoading={setIsLoading} /> : null
                            }

                            {isLoading != null && isLoading ? <Loader /> :
                                isLoading == false && filteredData?.length == 0 ? <div
                                    className="no-img"
                                >
                                    <img src={nodata} />
                                </div> : filteredData?.map((task, index) => {
                                    return <TaskListing handleDelete={handleDelete} formatTime={formatTime} elapsedTime={elapsedTime} key={index} task={task} handleOpen={handleOpen}
                                        changeTaskStatus={changeTaskStatus} loggedInUserRoleId={loggedInUserRoleId} loggedInUserId={loggedInUserId} queryClient={queryClient} />


                                })


                            }

                        </div>

                    </div>
                </div>
            </div>
            {!!prefillData && <ViewTaskDetails isModel={isModel} setIsModel={setIsModel} data={prefillData} setPrefillData={setPrefillData} />}

        </div>




    )
}

export default TaskListDateWise