import React, { useState } from "react";
import MainSidebar from "../layout/sidebarnav/MainSidebar";
import Header from "../layout/header/Header";
import SideBarNav1 from "../layout/sidebarnav/SideBarNav1";
import UserReportMain from "../components/Report/UserReportMain";
import SideBarNav from "../layout/sidebarnav/SideBarNav";

const UserReport = () => {
    const [toggleStyle, setToggleStyle] = useState(false);

    const handleToggle = () => {
        setToggleStyle(!toggleStyle);
      };


      

  return (
    <>
      <div className="dashboard-wrapper">
        <MainSidebar />

        <div className="dash-right">
          <div className="inner-wrapper">
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
          <UserReportMain />
        </div>
      </div>
    </>
  );
};

export default UserReport;
