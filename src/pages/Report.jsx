import React, { useState } from 'react'
import MainSidebar from '../layout/sidebarnav/MainSidebar'
import Header from '../layout/header/Header'
import background from "../assets/bg3.png";
import tp1 from '../assets/tp1.png';
import tp2 from '../assets/tp2.png';
import tp3 from '../assets/tp3.png';
import tp4 from '../assets/tp4.png';
import tp5 from '../assets/tp5.png';
import tp6 from '../assets/tp6.png';
import tp7 from '../assets/tp7.png';
import tp8 from '../assets/tp8.png';
import icon1 from '../assets/icon1.png';
import icon2 from '../assets/icon2.png';
import icon3 from '../assets/icon3.png';
import icon4 from '../assets/icon4.png';
import icon5 from '../assets/icon5.png';
import icon6 from '../assets/icon6.png';
import DashboardTeamCard from '../utils/DashboardTeamCard';
import { useQuery } from '@tanstack/react-query';
import DashboardServices from '../services/DashboardServices';
import ValidateAuthenticationKey from '../utils/ValidateAuthenticationKey';
import { toast } from 'react-toastify';
import { IoSearchSharp, IoSettingsOutline } from 'react-icons/io5';
import { FaEye } from 'react-icons/fa6';
import SideBarNav from '../layout/sidebarnav/SideBarNav';
import SideBarNav1 from '../layout/sidebarnav/SideBarNav1';


const Report = () => {

    const [teamsList] = useState([
        {
            name: "Design",
            target: 10,
            image: tp1,
            id: 1
        },
        {
            name: "React/App",
            target: 0,
            image: tp2,
            id: 2
        },
        {
            name: "Laravel",
            target: 0,
            image: tp3,
            id: 3
        },
        {
            name: "Wordpress",
            target: 0,
            image: tp4,
            id: 4
        },
        {
            name: "Q/A",
            target: 0,
            image: tp5,
            id: 5
        },
        {
            name: "IOT",
            target: 10,
            image: tp6,
            id: 6
        },
        {
            name: "Digital Marketing",
            target: 0,
            image: tp7,
            id: 7
        },
        {
            name: "AI",
            target: 0,
            image: tp8,
            id: 8
        },
    ])
    // Team Wise Project Count
    const { data: teamWiseProject, isLoading } = useQuery(
        ["team-wise-project-report"],
        () => DashboardServices.getList(),
        {
            refetchOnWindowFocus: false,
            select: (data) => {
                const teamWiseProject = data?.data?.data?.teamwiseproject?.teamProjectCounts
                    ?.filter((team) => !!team?.team?._id)
                    .map((team) => {
                        const matchingTeam = teamsList.find((t) => t.name.includes(team?.team?.name));

                        return {
                            id: team?.team?._id,
                            name: team?.team?.name,
                            image: matchingTeam ? matchingTeam.image : tp1,
                            count: team?.projectCount
                        };
                    });
                return { totalCount: data?.data?.data?.teamwiseproject?.totalProjectCount || 0, teamWiseProject: teamWiseProject };
            },
            onError: (err) => {
                if (err?.response?.status === 401) {

                    ValidateAuthenticationKey(err?.response?.status, "Your login session has expired. Please log in again.")
                    return
                }
                // console.log(err?.response);
                toast.error(err?.response?.data?.message || err?.message, {
                    delay: 10,
                });
            },
        }
    );

    const [toggleStyle, setToggleStyle] = useState(false);
    const handleToggle = () => {
        setToggleStyle(!toggleStyle);
      };

    return (
        <div className='dashboard-wrapper'>
            <MainSidebar />

            <div className="dash-right">
                <div className='inner-wrapper'>
                    <Header
                        handleToggle={handleToggle}
                        name={"Project"}
                        subname={"Drive Details"}
                    />
                </div>

                <SideBarNav1
                    setToggleStyle={setToggleStyle}
                    toggleStyle={toggleStyle}
                />

            </div>
        </div>
    )
}

export default Report