import React from 'react'
import { FaEdit } from "react-icons/fa";
import email from "../../assets/contact-ico1.png";
import client2 from "../../assets/contact-ico8.png";
import time from "../../assets/contact-ico9.png";
import client from "../../assets/contact-ico3.png";
import money from "../../assets/contact-ico10.png";
import calendar from "../../assets/contact-ico7.png";
import notifiy from "../../assets/contact-ico11.png";
import doc from "../../assets/d1.png";
import moment from 'moment';
const BoardMessageBox = ({boardDetails,firstMessage}) => {
    console.log("boardDetails",firstMessage)
  return (
    <>     <div className="dash-right-head">
    <h4>{boardDetails?.title || 'N/A'}</h4>
    <div className="settings-icon">
      <a href="#">
        <FaEdit />
      </a>
    </div>
  </div>

  <ul>
    <li>
      <img src={calendar} alt="" /> {moment(boardDetails?.createdAt).format("ll")}
    </li>
    <li>
      <img src={client2} alt="" />{boardDetails?.userId?.userName || 'N/A'}
    </li>
    <li>
      <img src={notifiy} alt="" /> Notified {boardDetails?.addedUsers?.length || 0      } people
    </li>
  </ul>

  {/* <div className="chat-bx">
    <h5 className="tag-name">
      <span>ND</span> Nayan Dey
    </h5>
    <p>The design must start immediately.</p>
  </div> */}
  </>
  )
}

export default BoardMessageBox