import React from 'react'
import { useMemo } from 'react'
import female from "../../../assets/female.png";
import male from "../../../assets/male.png";
import logo from "../../../assets/logo.png";

const ShowTeamMember = ({ teamList, teamListId,teamLeaderId, toggleRefetch }) => {

  const activeTeamMembers = useMemo(() => {
    const team = teamList?.find((team) => team?.team?._id === teamListId && team?.teamLeader?._id  === teamLeaderId);
    return team ? team.members : [];
  }, [teamListId, teamList,teamLeaderId, toggleRefetch]);


  return (
    <div className=''>
      <ul className='emp-list'>
        {
          activeTeamMembers.map((member) => {
            return <>
              <li>
              <span>
                                  {
                                    <img
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
                                      style={{
                                        width: "32px",
                                        borderRadius: "50%",
                                      }}
                                    />
                                  }
                                </span>{" "}
                                {member.userName || "N/A"}
                {/* ({member?.email}) */}
              </li>
            </>
          })
        }
      </ul>

    </div>
  )
}

export default ShowTeamMember