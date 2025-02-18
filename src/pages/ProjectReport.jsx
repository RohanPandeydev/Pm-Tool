import React, { useState } from 'react'
import MainSidebar from '../layout/sidebarnav/MainSidebar'
import Header from '../layout/header/Header'
import SideBarNav1 from '../layout/sidebarnav/SideBarNav1'
import ProjectReportMain from '../components/Report/ProjectReportMain'
import SideBarNav from '../layout/sidebarnav/SideBarNav'

const ProjectReport = () => {
    const [toggleStyle, setToggleStyle] = useState(false);
    const handleToggle = () => {
        setToggleStyle(!toggleStyle);
      };


      
      


    return (
        <><div className='dashboard-wrapper'>
            <MainSidebar />

            <div className="dash-right">
                <div className='inner-wrapper'>
                    <Header
                        handleToggle={handleToggle}
                        name={"Project"}
                        subname={"Drive Details"}
                    />
                </div>

                <SideBarNav
                    setToggleStyle={setToggleStyle}
                    toggleStyle={toggleStyle}
                />

                <ProjectReportMain />
            </div>
        </div></>
    )
}

export default ProjectReport