import React from 'react'
import icon1 from "../../assets/icon1.png";
import icon2 from "../../assets/icon2.png";
import icon3 from "../../assets/icon3.png";
import icon4 from "../../assets/icon4.png";
import icon5 from "../../assets/icon5.png";

import icon6 from "../../assets/icon6.png";
import DashboardServices from '../../services/DashboardServices';
import StorageData from '../../helper/storagehelper/StorageData';
import ValidateAuthenticationKey from '../../utils/ValidateAuthenticationKey';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';

const DashboardProjectStatus = ({ setTotalProjects }) => {
    const myId = StorageData.getUserData()?.team[0]?._id
    const teamId = StorageData.getUserData()?.team
    const userId = StorageData.getUserData()
    const [projectList,setProjectList]=useState([])
    const { data: projectstats, isLoading } = useQuery(
        ["project-stats-tls", userId?._id,teamId?.length],
        () => DashboardServices.getTeamWiseProjectStats(`team=${myId}`),
        {
            refetchOnWindowFocus: false,
            enabled: !!userId?._id && !!teamId?.length>0,
            onSuccess: (data) => {
                const statusCounts = [
                    { status: 'Total Projects', count: data?.data?.data?.projectDetails?.totalCount || 0, icon: icon1 },
                    { status: 'Not Started Projects', count: data?.data?.data?.projectDetails?.statusCounts[0]?.count || 0, icon: icon2 },
                    { status: 'Ongoing Projects', count: data?.data?.data?.projectDetails?.statusCounts[1]?.count || 0, icon: icon3 },
                    { status: 'Completed Projects', count: data?.data?.data?.projectDetails?.statusCounts[2]?.count || 0, icon: icon4 },
                    { status: 'Hold Projects', count: data?.data?.data?.projectDetails?.statusCounts[3]?.count || 0, icon: icon5 },
                    { status: 'Waiting For Feedback Projects', count: data?.data?.data?.projectDetails?.statusCounts[4]?.count || 0, icon: icon6 }
                ];
                setTotalProjects(() => data?.data?.data?.projectDetails?.totalCount || 0)
                setProjectList(()=>statusCounts)
                return statusCounts;
                //   console.log("MY Time Wise History List", data?.data?.data?.projectDetails?.statusCounts
                // )




            },
            onError: (err) => {
                if (err?.response?.status === 401) {

                    ValidateAuthenticationKey(err?.response?.status, "Your login session has expired. Please log in again.")
                    return
                }
                // console.log(err?.response);
                // toast.error(err?.response?.data?.message || err?.message, {
                //     delay: 10,
                // });
            },
        }
    );
    // You can use the projectstats directly
// const statusCounts = projectstats || [];


    return (

        <div className="pro-status-bx cstm-hovr mt-3">
            {
                (!isLoading &&  projectList?.length >0)&& projectList?.map((each) => {
                    return <div className="status-bx2">
                        <div className="d-flex align-items-start justify-content-between">
                            <div>
                                <h5>{each?.status || "N/A"}</h5>
                                <h3>{each?.count || 0}</h3 >
                            </div>
                            <img src={each?.icon || icon1} alt="" />
                        </div>
                    </div>

                })
            }
        </div>)
}

export default DashboardProjectStatus