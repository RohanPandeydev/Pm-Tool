import { useQuery } from '@tanstack/react-query';
import React from 'react'
import { FaEdit } from 'react-icons/fa'
import ProjectServices from '../../../services/ProjectServices';
import ValidateAuthenticationKey from '../../../utils/ValidateAuthenticationKey';
import nodata from "../../../assets/nodatafound.png";
import moment from 'moment';

const ViewProjectMilestone = ({ toggleStyle, projectId }) => {
    const { data, isLoading, isError, error } = useQuery(
        ["projectmilestone", projectId],
        () => ProjectServices.getDetails({ id: projectId }),
        {
            enabled: !!projectId,
            refetchOnWindowFocus: false,
            onSuccess: (data = {}) => {
                // //console.log("Project Details", data?.data?.data)
                // setUserData(data?.data?.data?.users);
                return true;

            },
            onError: (err) => {
                if (err?.response?.status === 401) {
                    ValidateAuthenticationKey(err?.response?.status, "Your login session has expired. Please log in again.");
                } else {
                    // console.err(err?.response);
                    return false
                    // toast.error(err?.response?.data?.message || err?.message, {
                    //     delay: 10,
                    // });
                }
            },
        }
    );
    return (
        <div className={
            toggleStyle ? "dash-right-info" : "dash-right-info cstm-wdth2"
        }
        >
            <div className="accordion mt-4" id="accordionExample">
                {
                    (!isLoading &&
                        data?.data?.data?.project) &&
                        data?.data?.data?.project?.milestones?.length == 0 ? (
                        <div className="no-img">
                            <img src={nodata} />
                        </div>) : data?.data?.data?.project?.milestones?.map((milestone, index) => {
                            return <div className="accordion-item" key={milestone?._id}>
                                <h2 className="accordion-header" id="heading1">
                                    <button
                                        className={
                                            index == 0
                                                ? "accordion-button"
                                                : "accordion-button collapsed"
                                        }
                                        type="button"
                                        data-bs-toggle="collapse"
                                        data-bs-target={"#collapse" + index}
                                        aria-expanded="true"
                                        aria-controls={"collapse" + index}
                                    >
                                        {milestone?.title || 'N/A'}
                                    </button>
                                    <a

                                        className="btn modal-save-btn custom-btn"
                                    >
                                        <FaEdit />
                                    </a>
                                </h2>
                                <div
                                    id={"collapse" + index}
                                    className={
                                        index == 0
                                            ? "accordion-collapse collapse show"
                                            : "accordion-collapse collapse "
                                    }
                                    aria-labelledby="heading1"
                                    data-bs-parent="#accordionExample"
                                >
                                    <div className="accordion-body">
                                        <div className="description-bx">
                                            <h5>Details</h5>
                                            <p>
                                                Start Date {
                                                    moment(milestone?.startDate).format("ll")}
                                            </p>
                                            <p>
                                                End Date {
                                                    moment(milestone?.endDate).format("ll")}
                                            </p>
                                            <p>
                                                Draft Date {
                                                    moment(milestone?.draftDate).format("ll")}
                                            </p>
                                        </div>

                                   
                                        <div className="description-bx">
                                            <h5>Notes</h5>
                                            <p>
                                                {
                                                    milestone?.notes || "Sadipscing Elitr, Sed Diam Nonumy Eirmod Tempor Invidunt Ut Labore Et Dolore Magna Aliquyam Erat, Sed Diam Voluptua."}
                                            </p>
                                        </div>
                                        <div className="description-bx">
                                            <h5>Task List</h5>
                                            {milestone?.tasks?.map((task) => {
                                                return <div key={task?._id}>
                                                    <p> Name : {task?.name}</p>
                                                    <p> Hour : {task?.hours}hr.</p>
                                                    <p>Priority : {task?.priority}</p>
                                                    <p> Status : {task?.status}</p>
                                                    <p> Assigned To : {task?.assignedId?.userName}</p>



                                                </div>

                                            })}

                                        </div>

                                    </div>
                                </div>
                            </div>
                        })}

            </div>


        </div>
    )
}

export default ViewProjectMilestone