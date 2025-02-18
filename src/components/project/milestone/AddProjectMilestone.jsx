import React, { useEffect, useState } from "react";
import "./milestone.css";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import MainSidebar from "../../../layout/sidebarnav/MainSidebar";
import Header from "../../../layout/header/Header";
import SideBarNav from "../../../layout/sidebarnav/SideBarNav";
import TaskList from "./TaskList";
import ValidateAuthenticationKey from "../../../utils/ValidateAuthenticationKey";
import ProjectServices from "../../../services/ProjectServices";
import ProjectDetailsPage from "../ProjectDetailsPage";
import ButtonLoader from "../../../utils/Loader/ButtonLoader";
import { toast } from "react-toastify";
import moment from "moment";
import Editor from "../../../utils/Notes/Editor";
import parse from 'html-react-parser';

export default function AddProjectMilestone() {
    const [text, setText] = useState('');
    const { id, milestoneId } = useParams();
    const [milesStoneIds, setMilesStoneIds] = useState("")
    const [errors, setErrors] = useState({}); // State to hold errors
    const [toggleStyle, setToggleStyle] = useState(false);
    const [isLoadingMilestone, setIsLoadingMilestone] = useState(false)
    const [myId, setMyId] = useState("")
    const [myTeamId, setMyTeamId] = useState("")
    const queryClient = useQueryClient()
    let location = useLocation();
    let queryParams = new URLSearchParams(location.search);
    const teamId = queryParams.get('team'); 
    const nav = useNavigate();
    const handleToggle = () => {
        setToggleStyle(!toggleStyle);
    };
    const [phases, setPhases] = useState([
        {
            title: "",
            notes: "",
            startDate: "",
            draftDate: "",
            endDate: "",
        },
    ]);
    const handlePhaseChange = (index, fieldName, value) => {
        const updatedPhases = [...phases];
        updatedPhases[index][fieldName] = value;
        setPhases(updatedPhases);
    };
    function validateTasks(tasks) {
        const newErrors = {};
        // //console.log("phases<><><>", phases);
        phases.forEach((phase, index) => {
            const error = {};
            if (!phase.title.trim()) {
                error.title = `Title is required for Milestone`;
            }
            if (!phase.startDate) {
                error.startDate = `Start Date is required for Milestone`;
            }

            if (!phase.endDate) {
                error.endDate = `End Date is required for Milestone`;
            }
            if (new Date(phase.startDate) > new Date(phase.endDate)) {
                error.startDate = `Start Date cannot be greater than End Date for Milestone `;
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
    const handleSubmit = () => {
        if (!validateTasks()) {
            return false;
        }
        phases[0].projectId = myId
        phases[0].notes=text || "" 
        phases[0].team= myTeamId
        // console.log("Send Data", phases[0],text)
        if (!!milesStoneIds) {
            phases[0].id = milesStoneIds
            // //console.log("MIletone",phases[0])
            updateMutation.mutate(phases[0])
            return
        }
        createMutation.mutate(phases[0])
    }
    const createMutation = useMutation(
        (formdata) => {
            return ProjectServices.createMilestone(formdata);
        },
        {
            onSuccess: (data) => {
                if (data?.data?.error) {
                    toast.error(data?.data?.message, { delay: 10 });
                    return;
                }
                toast.success(data?.data?.message, { delay: 10 });
                queryClient.invalidateQueries("projectdetails");
                queryClient.refetchQueries("projectdetails");
                // window.location.replace("/project/milestone/task/"+ btoa(myId)+ "/"+ btoa(data?.data?.data?.createdProjectMilestone?._id))
                nav("/project/" + btoa(myId))
                return;
            },
            onError: (err) => {
                if (err?.response?.status === 401) {
                    ValidateAuthenticationKey(err?.response?.status, "Your login session has expired. Please log in again.");
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
            return ProjectServices.milestoneUpdate(formdata);
        },
        {
            onSuccess: (data) => {
                if (data?.data?.error) {
                    toast.error(data?.data?.message, { delay: 10 });
                    return;
                }
                toast.success(data?.data?.message, { delay: 10 });
                queryClient.invalidateQueries("projectdetails");
                queryClient.refetchQueries("projectdetails");
                // window.location.replace("/project/milestone/task/"+ btoa(myId)+ "/"+ btoa(data?.data?.data?.createdProjectMilestone?._id))
                nav("/project/" + btoa(myId))
                return;
            },
            onError: (err) => {
                if (err?.response?.status === 401) {
                    ValidateAuthenticationKey(err?.response?.status, "Your login session has expired. Please log in again.");
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
            const decodedUserId = atob(id);
            const teamId = queryParams.get('team'); 
          //  const teamId = atob(id);
            const teamDataId = atob(teamId);
            const decodeMilestoneId = milestoneId && atob(milestoneId)
            // //console.log("Decoded user ID:==>", decodeMilestoneId);
            setMyId(() => decodedUserId)
            setMilesStoneIds(() => decodeMilestoneId)
            setMyTeamId(()=>teamDataId)
        } catch (error) {

            console.error("Error decoding user ID:", error.message);
            // Handle the error gracefully, e.g., display an error message to the user
        }
    }, [id, milestoneId,teamId]);





    useEffect(() => {
        if (!!milesStoneIds) {
            const fetchData = async () => {
                setIsLoadingMilestone(true);
                try {
                    // If data doesn't exist in cache, fetch it from the API
                    const response = await ProjectServices.getProjectMilestoneDetails({ projectId: myId, milestoneId: milesStoneIds });
                    const prefill = response?.data?.data?.projectmilestoneOne
                    // //console.log('prefill', prefill)
                    let startDate = ""
                    let draftDate = ""
                    let endDate = ""
                    if (moment(prefill?.startDate).isValid()) {
                        startDate = moment(prefill?.startDate).format("YYYY-MM-DD");
                    }
                    if (moment(prefill?.draftDate).isValid()) {
                        draftDate = moment(prefill?.draftDate).format("YYYY-MM-DD");
                    }
                    if (moment(prefill?.endDate).isValid()) {
                        endDate = moment(prefill?.endDate).format("YYYY-MM-DD");
                    }
               

                        setPhases([
                            {
                                title: prefill?.title || "",
                                notes:prefill?.notes,
                                startDate: startDate || "",
                                draftDate: draftDate || "",
                                endDate: endDate || "",
                            },
                        ])
                        setText(prefill?.notes || "")
                } catch (error) {
                    // Handle errors
                    toast.error(error?.response?.data?.message || error?.message, {
                        delay: 10,
                    });
                } finally {
                    setIsLoadingMilestone(false);
                }
            };
            fetchData();



        }


    }, [milesStoneIds])
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


                        <SideBarNav
                            toggleStyle={toggleStyle}
                        />

                        {


                            <div className={
                                toggleStyle ? "dash-right-info" : "dash-right-info cstm-wdth2"
                            }
                            >

                                {
                                    isLoadingMilestone ? <ButtonLoader /> :
                                        phases?.map((phase, index) => {
                                            return (
                                                <div key={index}>
                                                    <h3 className="title1">

                                                        Project Milestone
                                                    </h3>
                                                    {<ProjectDetailsPage toggleProjectHour={true} projectId={myId && myId} />}

                                                    <form className="rd-mailform mt-4">
                                                        <div className="row">
                                                            <div className="col-sm-12">
                                                                <div className="form-group">
                                                                    <input
                                                                        className="form-control"
                                                                        type="text"
                                                                        placeholder="Milestone Title"
                                                                        name="title"
                                                                        value={phase?.title}
                                                                        onChange={(e) =>
                                                                            handlePhaseChange(
                                                                                index,
                                                                                "title",
                                                                                e.target.value
                                                                            )
                                                                        }
                                                                    />
                                                                </div>
                                                                {errors[index] && errors[index].title && (
                                                                    <p className="text-danger">
                                                                        {errors[index].title}
                                                                    </p>
                                                                )}
                                                            </div>
                                                            <div className="col-md-12">
                                                                <div className="form-group">
                                                                    {/* <textarea
                                                                        className="form-control"
                                                                        placeholder="Milestone Description"
                                                                        name="notes"
                                                                        value={phase?.notes}
                                                                        onChange={(e) =>
                                                                            handlePhaseChange(
                                                                                index,
                                                                                "notes",
                                                                                e.target.value
                                                                            )
                                                                        }
                                                                    ></textarea> */}
                                                                    <Editor text={text}setText={ setText}/>
                                                                </div>
                                                                {errors[index] && errors[index].notes && (
                                                                    <p className="text-danger">
                                                                        {errors[index].notes}
                                                                    </p>
                                                                )}
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
                                                                                min={
                                                                                    new Date().toISOString().split("T")[0]
                                                                                }
                                                                                name="startDate"
                                                                                value={phase?.startDate}
                                                                                onChange={(e) =>
                                                                                    handlePhaseChange(
                                                                                        index,
                                                                                        "startDate",
                                                                                        e.target.value
                                                                                    )
                                                                                }
                                                                            />
                                                                        </div>
                                                                        {errors[index] &&
                                                                            errors[index].startDate && (
                                                                                <p className="text-danger">
                                                                                    {errors[index].startDate}
                                                                                </p>
                                                                            )}
                                                                    </div>
                                                                    {/* <div className="col-md">
                                                                        <div className="form-group">
                                                                            <label>Draft Date</label>
                                                                            <input
                                                                                className="form-control"
                                                                                type="date"
                                                                                min={
                                                                                    new Date().toISOString().split("T")[0]
                                                                                }
                                                                                placeholder="Draft Date"
                                                                                name="draftDate"
                                                                                value={phase?.draftDate}
                                                                                onChange={(e) =>
                                                                                    handlePhaseChange(
                                                                                        index,
                                                                                        "draftDate",
                                                                                        e.target.value
                                                                                    )
                                                                                }
                                                                            />
                                                                        </div>
                                                                        {errors[index] &&
                                                                            errors[index].draftDate && (
                                                                                <p className="text-danger">
                                                                                    {errors[index].draftDate}
                                                                                </p>
                                                                            )}
                                                                    </div> */}
                                                                    <div className={"col-md"}>
                                                                        <div className="form-group">
                                                                            <label>Expected End Date</label>
                                                                            <input
                                                                                className="form-control"
                                                                                type="date"
                                                                                placeholder="End Date"
                                                                                name="endDate"
                                                                                value={phase?.endDate}
                                                                                min={
                                                                                    new Date().toISOString().split("T")[0]
                                                                                }
                                                                                onChange={(e) =>
                                                                                    handlePhaseChange(
                                                                                        index,
                                                                                        "endDate",
                                                                                        e.target.value
                                                                                    )
                                                                                }
                                                                            />
                                                                        </div>
                                                                        {errors[index] && errors[index].endDate && (
                                                                            <p className="text-danger">
                                                                                {errors[index].endDate}
                                                                            </p>
                                                                        )}

                                                                    </div>
                                                                </div>


                                                            </div>
                                                        </div>
                                                    </form>

                                                </div>

                                            );
                                        })}
                                <div className="btn-grp mt-4">

                                    <div>
                                        <button
                                            className="btn modal-save-btn me-2"
                                            type="button"
                                            onClick={handleSubmit}
                                        >

                                            {(createMutation?.isLoading || updateMutation?.isLoading) ? <ButtonLoader /> : "Save"}

                                        </button>

                                        <button
                                            type="button"
                                            className="btn modal-close-btn"
                                            onClick={() => nav(-1)}
                                        >
                                            Cancel
                                        </button>

                                    </div>
                                </div>
                                {/* </div> */}
                            </div>

                        }


                    </div>
                </div>
            </div>
        </>
    );
}
