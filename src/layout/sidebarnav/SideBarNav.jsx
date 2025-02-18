import React, { memo, useEffect, useState } from "react";
import { FaListAlt, FaUserTag } from "react-icons/fa";
import { FaUserShield } from "react-icons/fa6";
import { NavLink } from "react-router-dom";
import { HasPermission } from "../../guard/AcessControl";
import { RiTeamFill } from "react-icons/ri";
import StorageData from "../../helper/storagehelper/StorageData";
import config from "../../config";

const SideBarNav = memo(function SideBarNav({ toggleStyle }) {
  const loggedInUserRoleId = StorageData.getUserData()?.role?.roleUId;
  const loggedInUserId = StorageData.getUserData()?._id;
  const loggedInUserName = StorageData.getUserData()?.userName;

  const toggleUserRoleMenu = [
    {
      path: "/staffs",
      name: "Staff",
      icon: <FaUserShield className="icons" />,
      feature: "staffs",
    },
    {
      icon: <FaUserTag className="icons" />,
      path: "/roles",
      name: "Staff Role",
      feature: "roles",
    },
    {
      icon: <FaUserTag className="icons" />,
      path: "/designations",
      name: "Designation",
      feature: "roles",
    },
  ];
  const toggleReportMenu = [
    // {
    //   path: "/report/project",
    //   name: "Project Report",
    //   icon: <FaUserShield className="icons" />,
    //   feature: "projects",
    // },
    {
      icon: <FaUserTag className="icons" />,
      path: "/report/user",
      name: "User Report",
      feature: "projects",
    },
  ];
  const toggleReportMenuExecutive = [
    {
      icon: <FaUserTag className="icons" />,
      path: "/report/user/" + btoa(loggedInUserId),
      name: loggedInUserName,
      feature: "projects",
    },
    
  ];
  const toggleReportMenuAdmin = [
    {
      path: "/report/project",
      name: "Project Report",
      icon: <FaUserShield className="icons" />,
      feature: "projects",
    },
    {
      icon: <FaUserTag className="icons" />,
      path: "/report/user",
      name: "User Report",
      feature: "projects",
    },
    {
      feature: "projects",
      icon: <FaUserShield className="icons" />,
      name: "Report Monthly",
      path: "/report/monthly",
    },

  ];
  const toggleTeamMenu = [
    {
      path: "/teams",
      name: "Teams",
      icon: <RiTeamFill className="icons" />,
      feature: "teams",
    },
  ];
  const toggleProjectRegex = [
    {
      path: "/projects",
      name: "Project List",
      icon: <FaListAlt className="icons" />,
      feature: "projects",
    },
  ];

  // Report page
  const reportRegex = /^\/report/;
  const [toggleMenuNav, setToggleMenuNav] = useState([]);

  //Staff page
  const staffRegex = /^\/(roles|staffs|designations)$/;
  //Team Page
  const teamRegex = /^\/teams$/;
  // Project Page
  const projectRegex = /^(\/projects?(\/milestone.*)?)|.*project.*$/;

  useEffect(() => {
    if (staffRegex.test(window.location.pathname)) {
      setToggleMenuNav(toggleUserRoleMenu);
      return;
    } else if (teamRegex.test(window.location.pathname)) {
      setToggleMenuNav(toggleTeamMenu);
    } else if (reportRegex.test(window.location.pathname)) {
      if (loggedInUserRoleId == config.Executive) {
        setToggleMenuNav(toggleReportMenuExecutive);
        return;
      }
      if (loggedInUserRoleId == config.superAdmin) {
        setToggleMenuNav(toggleReportMenuAdmin);
        return;
      }

      setToggleMenuNav(toggleReportMenu);
    } else if (projectRegex.test(window.location.pathname)) {
      setToggleMenuNav(toggleProjectRegex);
    }
  }, [window.location.pathname]);

  return (
    <>
      <div
        className="dash-left-menu"
        style={{ display: toggleStyle ? "none" : "block" }}
      >
        <div className="menu-list-content">
          <ul className="menu-list">
            <li>
              <div className="user-nav-content">
                {toggleMenuNav?.map((ele, index) => {
                  return (
                    HasPermission(ele.feature) && (
                      <NavLink
                        to={ele?.path}
                        style={({ isActive }) => ({
                          backgroundColor: isActive ? "#eac92c" : "transparent",
                        })}
                        key={index}
                      >
                        {ele?.icon}
                        {ele?.name}
                      </NavLink>
                    )
                  );
                })}
              </div>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
});

export default SideBarNav;
