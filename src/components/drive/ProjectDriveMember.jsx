import React from 'react'
import female from "../../assets/female.png";
import male from "../../assets/male.png";
import logo from "../../assets/logo.png";
const ProjectDriveMember = ({projectMember}) => {
  return (
    <>
     <div className='dash-right-head message-board-assign-head'>
        <ul className='emp-list'>
          {
            projectMember?.map((member)=>{
              return <li>
              <span>  <img
                src={
                  member.profileImage
                    ? member.profileImage
                    : member?.gender === "female"
                    ? female
                    : member?.gender === "male"
                    ? male
                    : logo
                }
                alt={member.userName}
                style={{ width: "32px", borderRadius: "50%" }}
              />
              </span> 
              {member.userName}
              </li>
            })
          }
            {/* <li><span>DS</span> David Squitin</li>
            <li><span>TR</span> Terra Roux</li>
            <li><span>SD</span> Sandeep Dadia</li> */}
        </ul>
        {/* <button className='ctd-del-btn'>+ Add Member</button> */}
    </div>
    </>
  )
}

export default ProjectDriveMember