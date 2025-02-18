import { useQuery } from '@tanstack/react-query';
import React from 'react'
import DashboardServices from '../services/DashboardServices';
import ValidateAuthenticationKey from './ValidateAuthenticationKey';
import ButtonLoader from './Loader/ButtonLoader';
import nodata from "../assets/nodatafound.png";
import convertTo12HourFormat, { convertGMTtoIST12Hour } from './Convert12Hr';
import config from '../config';
import capitalizeAndFormatText from './MakeLetterCapital';
import RemoveUnderscore from './RemoveUnderScoreAndMakeCapital';


const DashboardOngoingList = () => {
    const { data: taskhistory, isLoading } = useQuery(
        ["task-time-history"],
        () => DashboardServices.getTimeWiseTaskHistory(),
        {
            refetchInterval: 60000,
            refetchOnWindowFocus: false,
            onSuccess: (data) => {
            },
            onError: (err) => {
                if (err?.response?.status === 401) {

                    ValidateAuthenticationKey(err?.response?.status, "Your login session has expired. Please log in again.")
                    return
                }
                // //console.log(err?.response);
                // toast.error(err?.response?.data?.message || err?.message, {
                //     delay: 10,
                // });
            },
        }
    );

    const HrToMin = (time) => {
        const timeConversion = time * 60;
        if (timeConversion < 60) return `${timeConversion} Mins`
        return `${timeConversion} Hrs`
    }
    return (
        <ul className="employee-list mt-2">
            {
                isLoading ? <ButtonLoader /> : taskhistory?.data?.data?.userlist?.length > 0 && taskhistory?.data?.data?.userlist?.map((task, ind) => {

                    return <li key={ind}>
                        <div className='task-details'>
                            <h3>{task?.history?.userName || 'N/A'}</h3>
                            <h4>{task?.projectName || 'N/A'}</h4>
                            <p>{task?.taskName || 'N/A'}</p>
                        </div>
                        <div className='task-timing'>
                            {/* <p>{convertTo12HourFormat(task?.history?.time)}({HrToMin(task?.hours) || 0} )</p> */}
                            <p>{convertTo12HourFormat(task?.history?.time)}</p>
                            <span className={`badge text-bg-${task?.history?.status == config.paused ? "paused" : task?.history?.status == config.inProgress ? "in-progress" : task?.history?.status == config?.completed ? "complete" : "not-started"} mt-3`}>{RemoveUnderscore(task?.history?.status) || 'N/A'}</span>
                        </div>
                    </li>
                })
            }

            {/* <li>
                <div>
                    <h3>Sandeep Dadia..</h3>
                    <h4>Hawaiiluxurytour</h4>
                    <p>Contact form fixing</p>
                </div>
                <div>
                    <p>11:15 PM (2 Hrs)</p>
                    <span className="badge text-bg-success mt-3">Start Task</span>
                </div>
            </li>  <li>
                <div>
                    <h3>Sandeep Dadia..</h3>
                    <h4>Hawaiiluxurytour</h4>
                    <p>Contact form fixing</p>
                </div>
                <div>
                    <p>11:15 PM (2 Hrs)</p>
                    <span className="badge text-bg-success mt-3">Start Task</span>
                </div>
            </li>  <li>
                <div>
                    <h3>Sandeep Dadia..</h3>
                    <h4>Hawaiiluxurytour</h4>
                    <p>Contact form fixing</p>
                </div>
                <div>
                    <p>11:15 PM (2 Hrs)</p>
                    <span className="badge text-bg-success mt-3">Start Task</span>
                </div>
            </li>  <li>
                <div>
                    <h3>Sandeep Dadia..</h3>
                    <h4>Hawaiiluxurytour</h4>
                    <p>Contact form fixing</p>
                </div>
                <div>
                    <p>11:15 PM (2 Hrs)</p>
                    <span className="badge text-bg-success mt-3">Start Task</span>
                </div>
            </li> */}
        </ul>
    )
}

export default DashboardOngoingList