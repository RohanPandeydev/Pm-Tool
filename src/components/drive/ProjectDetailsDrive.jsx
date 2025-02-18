import React from 'react'
import uploadimg1 from "../../assets/img1.jpg";
import uploadimg2 from "../../assets/img2.jpg";
import time from "../../assets/contact-ico9.png";
import client from "../../assets/contact-ico3.png";
import money from "../../assets/contact-ico10.png";
import email from "../../assets/contact-ico1.png";
import client2 from "../../assets/contact-ico8.png";
import calendar from "../../assets/contact-ico7.png";

import { FaEdit } from 'react-icons/fa';
import ProjectDriveMember from './ProjectDriveMember';
import moment from 'moment';

const ProjectDetailsDrive = ({details}) => {
  return (
    <> <div className='staff-info'>
    <div className='dash-right-head'>
        <h4>{details?.name || 'N/A'}</h4>
        <div className='settings-icon'>
            {/* <a href="#"><FaEdit /></a> */}
        </div>
    </div>
    <ul className="flex-wrap">
        <li><img src={calendar} alt="" /> {details?.startDate && moment(details?.startDate).format("ll") || 'N/A'}</li>
        <li><img src={client2} alt="" /> {details?.assistantManagerId && details?.assistantManagerId?.userName || 'N/A'}</li>
        <li><img src={time} alt="" /> {details?.estimatedTime || '0'} Hr.</li>
        <li><img src={client} alt="" /> {details?.projectManagerId && details?.projectManagerId?.userName || 'N/A'}</li>
        <li><img src={client} alt="" /> {details?.project?.customerName || 'N/A'}</li>
        <li><img src={email} alt="" /> {details?.project?.customerEmail|| 'N/A'}</li>
    </ul>
</div></>
  )
}

export default ProjectDetailsDrive