/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react'
import Header from '../../layout/header/Header';
import SideBarNav from '../../layout/sidebarnav/SideBarNav';
import ProjectDetailsPage from './ProjectDetailsPage';
import { useParams } from 'react-router-dom';
import MainSidebar from '../../layout/sidebarnav/MainSidebar';
import StorageData from '../../helper/storagehelper/StorageData';
import ProjectDetailsTabs from './ProjectDetailsTabs';

const ViewProject = () => {
    const { id } = useParams()
    const [toggleStyle, setToggleStyle] = useState(false);
    const [myId, setMyId] = useState("")
    const handleToggle = () => {
        setToggleStyle(!toggleStyle);
    };




    useEffect(() => {
        try {
            const decodedUserId = atob(id);
            setMyId(() => decodedUserId)
        } catch (error) {
            // console.error("Error decoding user ID:", error.message);
            // Handle the error gracefully, e.g., display an error message to the user
        }
    }, [id]);


    return (
        <div className="container-fluid">
            <div className="dashboard-wrapper">
                <MainSidebar />

                <div className="dash-right">
                    <div className="inner-wrapper">
                        <Header
                            handleToggle={handleToggle}
                            name={"Project Milestone"}
                            subname={"Add"}
                        />
                    </div>


                    <SideBarNav
                        toggleStyle={toggleStyle}
                    />

                    {


                        <div className={
                            toggleStyle ? "dashboard-body p-3" : "dashboard-body p-3 cstm-wdth2"
                        }
                        >
                            {myId && <ProjectDetailsPage toggleProjectHour={false} projectId={myId} />}
                            {myId && <ProjectDetailsTabs projectId={myId} />}


                        </div>

                    }


                </div>
            </div>
        </div>
    )
}

export default ViewProject