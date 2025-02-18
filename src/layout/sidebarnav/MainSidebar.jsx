import React, { memo, useMemo } from "react";
import logo from "../../assets/logo.png";
import dashboard from "../../assets/dashboard.png";
import user from "../../assets/user.png";
import project from "../../assets/projectlist.png";
import task from "../../assets/task-list.png";
import team from "../../assets/team.png";
import { Link, useNavigate } from "react-router-dom";
import { CheckAccess, HasPermission } from "../../guard/AcessControl";
import customContext from "../../contexts/Context";
import config from "../../config";
import StorageData from "../../helper/storagehelper/StorageData";

const MainSidebar = memo(function MainSidebar() {
  const navigate = useNavigate();
  const { userData, setUserData } = customContext();
  const loggedInUserRoleId = StorageData.getUserData()?.role?.roleUId;
  const loggedInUserUserId = StorageData.getUserData()?._id;

  const navItems = [
    { feature: "staffs", icon: user, title: "Staffs", link: "/staffs" },
    { feature: "roles", icon: user, title: "Roles", link: "/roles" },
    { feature: "teams", icon: team, title: "Teams", link: "/teams" },
    {
      feature: "projects",
      icon: project,
      title: "Projects",
      link: "/projects",
    },
    { feature: "projects", icon: task, title: "Task", link: "/tasks" },
    {
      feature: "projects",
      icon: task,
      title: "Reports",
      link: "/report/user",
    }
  ];
  
  const handleNav = (nav, title) => {
    if (loggedInUserRoleId === config.Executive && title === "Reports") {
      navigate("/report/user/" + btoa(loggedInUserUserId));
      return;
    }

    if (!HasPermission("staffs") && HasPermission("roles")) {
      const nav = CheckAccess("staffs", "roles");
      navigate(nav);
      return;
    }
    navigate(nav);
  };

  const hasStaffPermission = HasPermission("staffs");
  const hasRolesPermission = HasPermission("roles");

  const prioritizedNavItems = () => {
    const arr = [];

    if (hasStaffPermission) {
      const nav = navItems.find((item) => item.feature === "staffs");
      if (nav) arr.push(nav);
    } else if (hasRolesPermission) {
      const nav = navItems.find((item) => item.feature === "roles");
      if (nav) arr.push(nav);
    }

    const remainingItems = navItems.filter((item) => {
      if (loggedInUserRoleId === config.Manager && item.feature === "teams") {
        return false; // Do not include "Teams" if the user is a Manager
      }
      if (loggedInUserRoleId === config.Am && item.title === "Reports") {
        return false; // Do not include "Reports" if the user is AM
      }

      return (
        item.feature !== "staffs" &&
        item.feature !== "roles" &&
        HasPermission(item.feature)
      );
    });

    arr.push(...remainingItems);

    return arr;
  };

  const filteredNavItems = useMemo(() => prioritizedNavItems(), []);

  return (
    <aside className="dash-left">
      <div className="icon-content">
        <div className="logo-icon">
          <Link to="/">
            <img src={logo} alt="logo" className="img-fluid logo" />
          </Link>
        </div>
        <div className="icon-div">
          <Link to="/">
            <img
              src={dashboard}
              alt=""
              height={"16px"}
              width={"16px"}
              title="Dashboard"
            />
            <span>Dashboard</span>
          </Link>
        </div>
        {filteredNavItems &&
          filteredNavItems.map((item) => {
            if (loggedInUserRoleId == config.Manager && item?.title == "Teams")
              return null;
            if (loggedInUserRoleId == config.Am && item?.title == "Task")
              return null;

            return (
              <div className="icon-div" key={item.feature}>
                <div onClick={() => handleNav(item.link, item.title)}>
                  <img
                    src={item.icon}
                    alt={item.title}
                    height={"16px"}
                    width={"16px"}
                    title={item.title}
                  />
                  <span>{item?.title}</span>
                </div>
              </div>
            );
          })}
      </div>
    </aside>
  );
});

export default MainSidebar;
