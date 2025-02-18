import React, { useState } from "react";

import { CiMenuKebab } from "react-icons/ci";
import { IoSettingsOutline } from "react-icons/io5";
import { useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import moment from "moment/moment";
import RoleServices from "../../services/RoleServices";
import MainSidebar from "../../layout/sidebarnav/MainSidebar";
import Header from "../../layout/header/Header";
import SideBarNav from "../../layout/sidebarnav/SideBarNav";
import Loader from "../../utils/Loader/Loader";
import nodata from '../../assets/nodatafound.png'
import AddRoleIWithPermission from "./AddRoleIWithPermission";
import ValidateAuthenticationKey from "../../utils/ValidateAuthenticationKey";
import { CheckPageIsAccessable, IsAccessable } from "../../guard/AcessControl";
import config from "../../config";
const RoleList = () => {
  const [toggleStyle, setToggleStyle] = useState(false);
  const [toggleModal, setToggleModel] = useState(false);
  const [roleEditData, setRoleEditData] = useState(null);

  const { data, isLoading } = useQuery(
    ["rolelist"],
    () => RoleServices.getList(),
    {
      refetchOnWindowFocus: false,
      onSuccess: (data) => {
        ////console.log("data===>", data?.data?.data?.roles);
      },
      onError: (err) => {
        if (err?.response?.status === 401) {

          ValidateAuthenticationKey(err?.response?.status, "Your login session has expired. Please log in again.")
          return
        }
        // //console.log(err?.response);
        toast.error(err?.response?.data?.message || err?.message, {
          delay: 10,
        });
      },
    }
  );

  const handleToggle = () => {
    setToggleStyle((v) => !v);
  };

  const handleRoleEdit = (data) => {
    setRoleEditData(data);
    setToggleModel(() => true);
  };
  return (
    <CheckPageIsAccessable modulename={window.location.pathname} permission={"read"} >

      {isLoading && <Loader />}
      <div className="container-fluid">
        <div className="dashboard-wrapper">
          <MainSidebar />

          <div className="dash-right">
            <div className="inner-wrapper">
              <Header
                handleToggle={handleToggle}
                name={"Role"}
                subname={"Role List"}
              />
            </div>

            <div>
              <SideBarNav
                toggleStyle={toggleStyle}
                livechat={"User View"}
                chatbot={"Chatbot"}
                webforms={" Web Forms"}
                prospector={"Prospector"}
                booster={"Leads Booster"}
              />


              <div className={
                toggleStyle ? "dash-right-info" : "dash-right-info cstm-wdth2"
              }
              >
                <div className="dash-right-head">
                  <div className="right-nav-content-left">
                    {!toggleModal && (
                      <IsAccessable modulename={window.location.pathname} permission={"create"}>
                        <a
                          className="btn triggle-modal-btn"
                          onClick={() => { setRoleEditData(null), setToggleModel(true) }}
                        >
                          + Role
                        </a>
                      </IsAccessable>
                    )}
                  </div>
                </div>
                <div className="dash-right-bottom">
                  {toggleModal ? <AddRoleIWithPermission setToggleModel={setToggleModel}
                    setRoleEditData={setRoleEditData}
                    prefill={roleEditData} /> : data?.data?.data?.roles?.length == 0
                    ? <div
                      className="no-img"
                    >
                      <div className="no-img">
                        <img src={nodata} />
                      </div>
                    </div> : <table className="table table-bordered">
                      <thead>
                        <tr>
                          <th scope="col">
                            <div className="form-check">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                value=""
                                id="flexCheckDefault"
                              />
                              <label
                                className="form-check-label"
                                htmlFor="flexCheckDefault"
                              >
                                SL
                              </label>
                            </div>
                          </th>
                          <th scope="col">Role</th>
                          <th scope="col">Permissions</th>
                          <th scope="col">Created on</th>
                          <IsAccessable modulename={window.location.pathname} permission={"update"}>
                            <th scope="col" className="settings-icon">
                              <IoSettingsOutline />
                            </th>
                          </IsAccessable>
                        </tr>
                      </thead>
                      <tbody>

                        {data?.data?.data?.roles?.map((each, ind) => {
                          return (
                            <tr key={each?._id}>
                              <td>
                                <div className="form-check">
                                  <input
                                    className="form-check-input"
                                    type="checkbox"
                                    value=""
                                    id="flexCheckDefault"
                                  />
                                  <label
                                    className="form-check-label"
                                    htmlFor="flexCheckDefault"
                                  >
                                    {ind + 1}
                                  </label>
                                </div>
                              </td>
                              <td> {each?.roleName}</td>
                              <td>
                                {" "}
                                {each?.rolePermissions
                                  ?.map((r) => r.moduleName)
                                  .toString()}
                              </td>
                              <td>
                                {moment(each?.createdAt).format("ll")}
                              </td>
                              <IsAccessable modulename={window.location.pathname} permission={"update"}>

                                <td>
                                  {(
                                    each?.roleUId != config?.superAdmin &&
                                    <div className="dropdown triple-dot">
                                      <button
                                        className="btn btn-secondary dropdown-toggle"
                                        type="button"
                                        id="dropdownMenuButton1"
                                        data-bs-toggle="dropdown"
                                        aria-expanded="false"
                                      >
                                        <CiMenuKebab />
                                      </button>
                                      <ul
                                        className="dropdown-menu"
                                        aria-labelledby="dropdownMenuButton1"
                                      >
                                        <li>
                                          <a
                                            className="dropdown-item"
                                            onClick={() =>
                                              handleRoleEdit(each)
                                            }
                                          >
                                            Update
                                          </a>

                                        </li>


                                      </ul>
                                    </div>
                                  )}
                                </td>
                              </IsAccessable>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  }



                  {/* <ol className="list-group list-group-numbered">
                      <li className="list-group-item">Super Admin - admin</li>
                      <li className="list-group-item">Sales Manager - salesmanagerl1</li>
                      <li className="list-group-item">Account Manager - accountmanagerl1</li>
                      <li className="list-group-item">Sales Executive  - salesexecutivel1</li>
                      <li className="list-group-item">Project Manager - projectmanagerl1</li>
                      <li className="list-group-item">Team Lead - teamleadl1</li>
                      <li className="list-group-item">Executive Developer - executivedeveloperl1</li>
                    </ol> */}

                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </CheckPageIsAccessable>
  );
};

export default RoleList;
