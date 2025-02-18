import React from 'react'
import { NavLink } from 'react-router-dom'

const SideBarNav1 = ({ toggleStyle }) => {

    return (
        <>
            <div className="dash-left-menu"
                style={{ display: toggleStyle ? "none" : "block" }}
            >
                <div className="menu-list-content">
                    <ul className="menu-list">
                        <li>
                            <div className="user-nav-content">
                                <NavLink
                                    to={"/report/project"}
                                    style={({ isActive }) => ({
                                        backgroundColor: isActive
                                            ? "#eac92c"
                                            : "transparent",
                                    })}
                                >

                                    Project Report
                                </NavLink>
                                <NavLink
                                    to={"/report/user"}
                                    style={({ isActive }) => ({
                                        backgroundColor: isActive
                                            ? "#eac92c"
                                            : "transparent",
                                    })}
                                >

                                    Staff Report
                                </NavLink>

                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </>)
}

export default SideBarNav1