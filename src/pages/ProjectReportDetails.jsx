import React, { useState } from 'react'
import SideBarNav1 from '../layout/sidebarnav/SideBarNav1'
import Header from '../layout/header/Header'
import MainSidebar from '../layout/sidebarnav/MainSidebar'
import ProjectReportDetailsMain from '../components/Report/ProjectReportDetailsMain'
import SideBarNav from '../layout/sidebarnav/SideBarNav'

const ProjectReportDetails = () => {
    const [toggleStyle, setToggleStyle] = useState(false);

    const handleToggle = () => {
        setToggleStyle(!toggleStyle);
      };
  return (
    <>
      <div className='dashboard-wrapper'>
            <MainSidebar />

            <div className="dash-right">
                <Header
                    handleToggle={handleToggle}
                    name={"Report"}
                    subname={"Project Report Details"}
                />

                <SideBarNav
                    setToggleStyle={setToggleStyle}
                    toggleStyle={toggleStyle}
                />
                <ProjectReportDetailsMain/>

               
            </div>
        </div>
    </>
  )
}

export default ProjectReportDetails