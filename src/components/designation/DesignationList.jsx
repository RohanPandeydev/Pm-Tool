import React, { useState } from "react";
import { IoSettingsOutline } from "react-icons/io5";
import SideBarNav from "../../layout/sidebarnav/SideBarNav";
import Header from "../../layout/header/Header";
import MainSidebar from "../../layout/sidebarnav/MainSidebar";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Loader from "../../utils/Loader/Loader";
import nodata from "../../assets/nodatafound.png";
import moment from "moment";
import { toast } from "react-toastify";
import ValidateAuthenticationKey from "../../utils/ValidateAuthenticationKey";
import { CheckPageIsAccessable, IsAccessable } from "../../guard/AcessControl";
import { CiMenuKebab } from "react-icons/ci";
import AddDesignationModel from "./AddDesignationModel";
import DesignationServices from "../../services/DesignationServices";
import swal from 'sweetalert'

const DesignationList = () => {
    const [toggleStyle, setToggleStyle] = useState(false);
    const [prefill, setPrefill] = useState();
    const [isModel, setIsModel] = useState(false);
    const queryClient=useQueryClient()

    const handleToggle = () => {
        setToggleStyle((v) => !v);
    };
    const handleOpen = () => {
        setIsModel(!isModel);
    };
    // /designation/delete/:id
    const { data, isLoading } = useQuery(
        ["designation-list"],
        () => DesignationServices.get(),
        {
            refetchOnWindowFocus: false,
            onSuccess: (data) => {
                // //console.log("Team Data", data?.data)
            },
            onError: (err) => {
                // //console.log(err?.response);

                if (err?.response?.status === 401) {
                    ValidateAuthenticationKey(
                        err?.response?.status,
                        "Your login session has expired. Please log in again."
                    );
                    return;
                }
                toast.error(err?.response?.data?.message || err?.message, {
                    delay: 10,
                });
            },
        }
    );

    const handleEdit = (data) => {
        // //console.log("data", data)
        setPrefill(data);
        setIsModel(!isModel);
        return;
    };

    const handleDelete=(id)=>{

        swal({
            title: "Are you sure you want to delete this designation",
            icon: "warning",
            buttons: true,
            dangerMode: true,
            allowOutsideClick: false,
            closeOnClickOutside: false,
          }).then((willDelete) => {
            if (willDelete) {
                deleteMutation.mutate({ id: id });
            }
          });

    }


    const deleteMutation = useMutation(
        (formdata) => {
          return DesignationServices.delete(formdata);
        },
        {
          onSuccess: (data) => {
            if (data?.data?.error) {
              toast.error(data?.data?.message, { delay: 10 });
              return;
            }
            toast.success(data?.data?.message, { delay: 10 });
            queryClient.invalidateQueries('designation-list')
            queryClient.refetchQueries('designation-list')
            return;
          },
          onError: (err) => {
            toast.error(err?.response?.data?.message || err?.message, {
              delay: 10,
          });        return
          },
        }
      );
    return (
        <CheckPageIsAccessable modulename={window.location.pathname} permission={"read"} >

            {isLoading ? (
                <Loader />
            ) : (
                <div className="container-fluid">
                    <div className="dashboard-wrapper">
                        <MainSidebar />

                        <div className="dash-right">
                            <div className="inner-wrapper">
                                <Header
                                    handleToggle={handleToggle}
                                    name={"Designation"}
                                    subname={"List"}
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
                                            {<IsAccessable modulename={window.location.pathname} permission={"create"}><a
                                                className="btn triggle-modal-btn"
                                                // data-bs-toggle="modal"
                                                // data-bs-target="#teamform"
                                                onClick={handleOpen}
                                            >
                                                + Designation
                                            </a>
                                            </IsAccessable>
                                            }
                                        </div>
                                    </div>
                                    <div className="dash-right-bottom">
                                        {data?.data?.data?.designations &&
                                            data?.data?.data?.designations?.length == 0 ? (
                                            <div className="no-img">
                                                <img src={nodata} />
                                            </div>
                                        ) : (
                                            <table className="table table-bordered">
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
                                                        <th scope="col">Name</th>
                                                        <th scope="col">Team Created By</th>
                                                        <th scope="col">Created on</th>
                                                        <IsAccessable modulename={window.location.pathname} permission={"update"}>
                                                            {/* <th scope="col" className="settings-icon">
                                                                <IoSettingsOutline />
                                                            </th> */}
                                                        </IsAccessable>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {data?.data?.data?.designations &&
                                                        data?.data?.data?.designations?.map((elem, ind) => {
                                                            return (
                                                                <tr key={elem?._id}>
                                                                    <td>{ind + 1}</td>
                                                                    <td>{elem?.name || "N/A"}</td>
                                                                    <td>{elem?.userId?.userName || "Lorem"}</td>
                                                                    <td>
                                                                        {moment(elem?.createdAt).format("ll")}
                                                                    </td>
                                                                    <IsAccessable modulename={window.location.pathname} permission={"update"}>
                                                                        <td>
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

                                                                                    {
                                                                                        <>
                                                                                        <li>
                                                                                            <a
                                                                                                className="dropdown-item"
                                                                                                href="#"
                                                                                                onClick={() =>
                                                                                                    handleEdit(elem)
                                                                                                }
                                                                                            >
                                                                                                Update
                                                                                            </a>
                                                                                        </li>
                                                                                        <li>
                                                                                            <a
                                                                                                className="dropdown-item"
                                                                                                href="#"
                                                                                                onClick={() =>
                                                                                                    handleDelete(elem?._id)
                                                                                                }
                                                                                            >
                                                                                                Delete
                                                                                            </a>
                                                                                        </li>
                                                                                        </>
                                                                                    }

                                                                                </ul>
                                                                            </div>
                                                                        </td>
                                                                    </IsAccessable>
                                                                    {/* <td onClick={() => handleEdit(elem)}>
                                                                        <FaEdit />
                                                                    </td> */}
                                                                </tr>
                                                            );
                                                        })}
                                                </tbody>
                                            </table>
                                        )}
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            )}

            <AddDesignationModel
                isModel={isModel}
                prefill={prefill}
                setPrefill={setPrefill}
                setIsModel={setIsModel}
            />
        </CheckPageIsAccessable>
    );
};

export default DesignationList;
