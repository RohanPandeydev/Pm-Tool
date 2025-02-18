import React from 'react'
import { useQuery } from '@tanstack/react-query';
import email from "../../../assets/contact-ico1.png";
import client from "../../../assets/contact-ico3.png";
import calendar from "../../../assets/contact-ico7.png";
import client2 from "../../../assets/contact-ico8.png";
import time from "../../../assets/contact-ico9.png";
import budget from "../../../assets/contact-ico10.png";
import design from "../../../assets/design.png";
import wp from "../../../assets/wp.png";
import qa from "../../../assets/qa.png";
import ButtonLoader from '../../../utils/Loader/ButtonLoader';
import moment from 'moment'
import FormatNumber from '../../../utils/FormatNumber';
import getCurrencySymbol from '../../../utils/CurrencySymbol';
import ProjectServices from '../../../services/ProjectServices';
import ValidateAuthenticationKey from '../../../utils/ValidateAuthenticationKey';
import StorageData from '../../../helper/storagehelper/StorageData';
const MilestoneDetailsPage = ({ milestoneId, projectId, setTIsUserTeamLeader }) => {
    const loggedInUserTeamId = StorageData.getUserData()?.team[0]?._id;
    const loggedInUserId = StorageData.getUserData()?._id;

    //console.log("--->",projectId,milestoneId)

    const { data, isLoading, isError, error } = useQuery(
        ["milestonedetails", milestoneId ? milestoneId : "", projectId ? projectId : ""
        ],
        () => ProjectServices.getProjectMilestoneDetails({ milestoneId: milestoneId, projectId: projectId }),
        {
            enabled: !!milestoneId && !!projectId,
            refetchOnWindowFocus: false,
            onSuccess: (data = {}) => {
                const team = data?.data?.data?.projectmilestoneOne?.projectId?.teams;
                const milestone = data?.data?.data?.projectmilestoneOne;
                const checkleader = team.find(item => item.team == milestone?.team && item.teamLeader == loggedInUserId);
                const check = (data?.data?.data?.projectmilestoneOne?.CreatedbyId == loggedInUserId) || checkleader
                setTIsUserTeamLeader(!!check)
                return true;

            },
            onError: (err) => {
                if (err?.response?.status === 401) {
                    ValidateAuthenticationKey(err?.response?.status, "Your login session has expired. Please log in again.");
                } else {
                    console.err(err?.message);
                    return false
                    // toast.error(err?.response?.data?.message || err?.message, {
                    //     delay: 10,
                    // });
                }
            },
        }
    );

    return (

        <>
            {
                isLoading ? <ButtonLoader /> : <div className='d-flex align-items-center'>
                    {/* <div className='staff-img'>
        <img src={staff} alt='' />
    </div> */}
                    <div className='staff-info'>
                        <h4>{data?.data?.data?.projectmilestoneOne?.title || 'N/A'}</h4>
                        <ul>
                            <li><img src={calendar} alt='' /> {data?.data?.data?.projectmilestoneOne?.startDate && moment(data?.data?.data?.projectmilestoneOne?.startDate).format("ll")}</li>
                            <li><img src={calendar} alt='' /> {data?.data?.data?.projectmilestoneOne?.endDate && moment(data?.data?.data?.projectmilestoneOne?.endDate).format("ll")}</li>
                            {/* <li><img src={client} alt='' /> {data?.data?.data?.projectmilestoneOne?.projectId?.customerName || 'N/A'}</li> */}
                            <li><img src={time} alt='' /> {data?.data?.data?.projectmilestoneOne?.projectId?.estimatedTime || '0'} Hr.</li>
                            {/* <li><img src={budget} alt='' />{data?.data?.data?.projectmilestoneOne?.projectId?.price && FormatNumber(data?.data?.data?.projectmilestoneOne?.projectId?.price || 0)} {getCurrencySymbol(data?.data?.data?.projectmilestoneOne?.currencyType)}</li> */}
                            {/* <li><img src={email} alt='' /> {data?.data?.data?.projectmilestoneOne?.projectId?.customerEmail || 'N/A'}</li> */}
                            {/* <li><img src={company} alt='' /> SB Infowaves Pvt. Ltd.</li>
              <li><img src={phone} alt='' />  {response?.data?.data?.projectmilestoneOne?.customerPhoneNumber || 'N/A'}</li>
              <li><img src={designation} alt='' /> UI Designer</li>
              <li><img src={category} alt='' /> Designer</li> */}
                        </ul>
                        {/* <ul>

                            <li><img src={design} alt='' /> 15 Hrs</li>
                            <li><img src={wp} alt='' /> 24 Hrs</li>
                            <li><img src={qa} alt='' /> 08 Hrs</li>
                        </ul> */}
                    </div>
                </div>
            }

        </>


    )
}

export default MilestoneDetailsPage