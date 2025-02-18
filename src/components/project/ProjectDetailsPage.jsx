import React, { useEffect, useState } from 'react'
import ProjectServices from '../../services/ProjectServices';
import ValidateAuthenticationKey from '../../utils/ValidateAuthenticationKey';
import { useQuery } from '@tanstack/react-query';
import email from "../../assets/contact-ico1.png";
import client from "../../assets/contact-ico3.png";
import calendar from "../../assets/contact-ico7.png";
import background from '../../assets/bg4.png';
import time from "../../assets/contact-ico9.png";
import wallet from "../../assets/wallet.png";
import ButtonLoader from '../../utils/Loader/ButtonLoader';
import moment from 'moment'
import FormatNumber from '../../utils/FormatNumber';
import getCurrencySymbol from '../../utils/CurrencySymbol';
import convertSeconds from '../../utils/ConvertSecondToMins&Hour';
import { formatRemainingTime, formatRemainingTimeInHour } from '../../utils/CurrentTime';
const ProjectDetailsPage = ({ projectId, toggleProjectHour }) => {
  const [teamList, setTeamList] = useState([]);
  const [timeWiseTeam, setTimeWiseTeam] = useState([])
  const [allottedTime, setAllottedTime] = useState(0)
  const [usedHour, setUsedHour] = useState("")
  const [digitalMarketingId, setDigitalMarketingId] = useState(['66853bfd659d3c4be4e2869d','6641ba7c10c5bd732114061a']);
  //const [allottedTime, setAllottedTime] = useState(0)
  const [remainingHour, setRemainingHour] = useState("")

  const { data, isLoading, isError, error } = useQuery(
    ["projectdetails", projectId ? projectId : ""
    ],
    () => ProjectServices.getDetails({ id: projectId }),
    {
      enabled: !!projectId,
      refetchOnWindowFocus: false,
      onSuccess: (data = {}) => {
        setTeamList(data?.data?.data?.project?.teams);


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
  const { data: teamWiseHour, isLoading: isLoadingTeamWise } = useQuery(
    ["projecttimewise", projectId ? projectId : ""
    ],
    () => ProjectServices.getProjectWiseTime({ id: projectId }),
    {
      enabled: !!projectId,
      refetchOnWindowFocus: false,
      onSuccess: (data = {}) => {

      },
      onError: (err) => {
        if (err?.response?.status === 401) {
          ValidateAuthenticationKey(err?.response?.status, "Your login session has expired. Please log in again.");
        } else {
          // console.err(err?.message);
          return false
          // toast.error(err?.response?.data?.message || err?.message, {
          //     delay: 10,
          // });
        }
      },
    }
  );
  useEffect(() => {
    const teamData = []
    const timeTeamWise = teamWiseHour?.data?.data

    
    teamList?.forEach((each) => {
     
      const matchingTeam = timeTeamWise?.find((elem) => elem?.teamName === each.team?.name && elem?._id === each.teamLeader?._id);
      console.log("Time Wise Project",timeTeamWise)
      console.log("Time Wise team",each)
      if (matchingTeam) {
        teamData.push({
          teamLeaderId: each.teamLeader?._id,
          teamId: each.team?._id,
          teamName: each.team?.name,
          teamLeaderName: matchingTeam?.userName,
          totalWorkingTime: convertSeconds(Number(matchingTeam?.totalWorkingTime || 0)),
          remainingHour: formatRemainingTime(matchingTeam?.totalHours, matchingTeam?.totalWorkingTime),
          totalHours: Number(matchingTeam?.totalHours || 0),
          worikingTimeInSecond: matchingTeam?.totalWorkingTime,
          pmAllottedTime:each?.time || 0


        });
      } else {
        teamData.push({
          teamLeaderId: each.teamLeader?._id,
          teamId: each.team?._id,
          teamName: each.team?.name,
          teamLeaderName: each.teamLeader?.userName,
          totalWorkingTime: convertSeconds(0),
          remainingHour: formatRemainingTime(0, 0),
          totalHours: Number(0),
          worikingTimeInSecond: 0,
          pmAllottedTime:each?.time || 0
        });
      }
    });
    const initialValue = 0;
    
    const sumWithInitial = teamData
                          .filter(teamMember => !digitalMarketingId.includes(teamMember.teamId.toString()))
                          .reduce(
                            (accumulator, currentValue) => accumulator + currentValue?.worikingTimeInSecond,
                            initialValue,
                          );
    console.log('casll team data=======>',teamData)                      
    setUsedHour(convertSeconds(sumWithInitial))
    const sumOfTime = teamData
                        .filter(teamMember => !digitalMarketingId.includes(teamMember.teamId.toString()))
                        .reduce(
                          (acc, currentValue) => acc + parseInt(currentValue?.pmAllottedTime),
                          0
                        );
    setAllottedTime(sumOfTime)

    !isLoading && setRemainingHour(formatRemainingTime(sumOfTime || 0, sumWithInitial))


    setTimeWiseTeam(() => teamData)

  }, [isLoading, isLoadingTeamWise, teamList.length,teamWiseHour?.data?.data?.length])

  return (

    <>
      {
        (isLoading || isLoadingTeamWise) ? <ButtonLoader /> : <div className='d-flex align-items-center'>
          {/* <div className='staff-img'>
        <img src={staff} alt='' />
    </div> */}
          <div className='staff-info'>
            <h4>{data?.data?.data?.project?.name || 'N/A'}</h4>
            <ul>
              {/* <li><img src={calendar} alt='' /> {data?.data?.data?.project?.createdAt && moment(data?.data?.data?.project?.createdAt).format("ll")}</li> */}
              <li><img src={calendar} alt='' /> {data?.data?.data?.project?.startDate && moment(data?.data?.data?.project?.startDate).format("ll") || 'N/A'}</li>
              <li><img src={calendar} alt='' /> {data?.data?.data?.project?.endDate && moment(data?.data?.data?.project?.endDate).format("ll") || 'N/A'}</li>
              <li><img src={client} alt='' /> {data?.data?.data?.project?.assistantManagerId && data?.data?.data?.project?.assistantManagerId?.userName || 'N/A'}</li>
              <li><img src={client} alt='' /> {data?.data?.data?.project?.projectManagerId && data?.data?.data?.project?.projectManagerId?.userName || 'N/A'}</li>
              <li><img src={client} alt='' /> {data?.data?.data?.project?.customerName || 'N/A'}</li>
              {toggleProjectHour && <li><img src={time} alt='' /> {data?.data?.data?.project?.estimatedTime || '0'} Hr.</li>}
              {/* <li><img src={wallet} alt='' /> {getCurrencySymbol(data?.data?.data?.project?.currencyType)} &nbsp;{data?.data?.data?.project?.price && FormatNumber(data?.data?.data?.project?.price || 0)} </li> */}
              {/* <li><img src={email} alt='' /> {data?.data?.data?.project?.customerEmail || 'N/A'}</li> */}

              {/* <li><img src={company} alt='' /> SB Infowaves Pvt. Ltd.</li>
              <li><img src={phone} alt='' />  {data?.data?.data?.project?.customerPhoneNumber || 'N/A'}</li>
              <li><img src={designation} alt='' /> UI Designer</li>
              <li><img src={category} alt='' /> Designer</li> */}
            </ul>

            <ul>
              {
                // (!isLoadingTeamWise && timeWiseTeam?.length > 0) && timeWiseTeam?.map((each) => {
                //   return <li><img src={design} alt='' />{each?.totalWorkingTime > 0 ? Number(each?.totalWorkingTime).toFixed(2) : Number(each?.totalWorkingTime)} Hr.</li>
                // })
              }
            </ul>

          </div>

        </div>
      }






    {!toggleProjectHour &&  <>
        <div className='total-time-bx mt-3'>
          <div className='lead-bx' style={{ backgroundImage: `url(${background})` }}>
            <h5>Total Project Hours</h5>
            <h3>{!isLoading && data?.data?.data?.project?.estimatedTime || '0'} hr
            </h3>
          </div>
          <div className='lead-bx' style={{ backgroundImage: `url(${background})` }}>
            <h5>PM Allotted Time</h5>
            <h3>{(!isLoadingTeamWise && timeWiseTeam?.length > 0) && allottedTime || 0} hr
            </h3>
          </div>
          <div className='lead-bx' style={{ backgroundImage: `url(${background})` }}>
            <h5>Used Hours</h5>
            <h3>{(!isLoadingTeamWise && timeWiseTeam?.length > 0) && usedHour || 0}</h3>
          </div>
          <div className='lead-bx' style={{ backgroundImage: `url(${background})` }}>
            <h5>Left Hours</h5>
            <h3>{(!isLoadingTeamWise && timeWiseTeam?.length > 0) && remainingHour || 0}</h3>
          </div>
        </div>

        <div className='time-status-bx assign-time-log cstm-hovr mt-3'>
          {(!isLoadingTeamWise && timeWiseTeam?.length > 0) && timeWiseTeam?.map((each) => {

            return <div className='time-bx'>
              <h4><span>Team Name</span> <span>{each?.teamName || 'N/A'}</span></h4>
              <h5><span>TL</span> <span>{each?.teamLeaderName || 'N/A'}</span></h5>
              <h5><span>PM Alloted Hours</span> <span>{each?.pmAllottedTime || '0'} hr</span></h5>
              <h5><span>Alloted Hours</span> <span>{formatRemainingTimeInHour (each?.totalHours || 0,0)}</span></h5>
              <h5><span>Used Hours</span> <span>{each?.totalWorkingTime}</span></h5>
              <h5><span>Left Hours</span> <span> {each?.remainingHour}</span></h5>
            </div>
          })



          }

          {/* <div className='time-bx'>
            <h4><span>Team Name</span> <span>Design</span></h4>
            <h5><span>Alloted Hours</span> <span>1 Hours</span></h5>
            <h5><span>Used Hours</span> <span>30 mnt</span></h5>
            <h5><span>Left Hours</span> <span>30 mnt</span></h5>
          </div>
          <div className='time-bx'>
            <h4><span>Team Name</span> <span>Frontend Html</span></h4>
            <h5><span>Alloted Hours</span> <span>1 Hours</span></h5>
            <h5><span>Used Hours</span> <span>30 mnt</span></h5>
            <h5><span>Left Hours</span> <span>30 mnt</span></h5>
          </div> */}
        </div>
      </>}

    </>


  )
}

export default ProjectDetailsPage