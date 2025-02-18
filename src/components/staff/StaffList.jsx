import React, { useEffect, useMemo, useState } from "react";

import { CiMenuKebab } from "react-icons/ci";
import { IoSettingsOutline } from "react-icons/io5";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import moment from "moment/moment";
import UserServices from "../../services/UserServices";
import { useLocation, useNavigate } from "react-router-dom";
import nodata from "../../assets/nodatafound.png";
import Loader from "../../utils/Loader/Loader";
import Header from "../../layout/header/Header";
import MainSidebar from "../../layout/sidebarnav/MainSidebar";
import SideBarNav from "../../layout/sidebarnav/SideBarNav";
import AddStaffModel from "./AddStaffModel";
import Pagination from "../../utils/Pagination";
import ValidateAuthenticationKey from "../../utils/ValidateAuthenticationKey";
import { toast } from "react-toastify";
import { CheckPageIsAccessable, IsAccessable, IsAccessableMultiple } from "../../guard/AcessControl";
import config from "../../config";
const StaffList = () => {
    const queryClient = useQueryClient();
    let navigate = useNavigate();
    let location = useLocation();
    let queryParams = new URLSearchParams(location.search);
    let pageValue = queryParams.get("page");
    let filterValue = queryParams.get("role");
    const [role, setRole] = useState("")
    const [search, setSearch] = useState("")
    const [toggleRole, setToggleRole] = useState(false);
    const [isModel, setIsModel] = useState(false)
    const [userEdit, setUserEdit] = useState(null);
    const [toggleStyle, setToggleStyle] = useState(false);
    const [pageid, setPageId] = useState(pageValue || 1);
    const [page_limit, setPage_Limit] = useState([5, 10, 25, 50, 100]);
    const [data_per_page, setData_Per_Page] = useState({
        final_no: 0,
        initial_no: 1,
        total_no: 0,
    });
    // Get the 'page' parameter value

    const handleOpen = () => {
        setIsModel(!isModel);
    }


    const handleToggle = () => {
        setToggleStyle(!toggleStyle);
    };

    const handleUserSearch = (e) => {
        e.preventDefault()
        console.log(e?.target?.value)
        setSearch(e?.target?.value)
      }

    const handleDelete = (id) => {
        swal({
            title: "It will delete permanently",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        }).then((willDelete) => {
            if (willDelete) {
                deleteUser.mutate({ id: id, isDeleted: true });
                //UserServices
            }
        });
    };
    const handleUpdate = (data) => {
        handleOpen()
        setUserEdit(data);
        return;
    };
    const { data, isLoading } = useQuery(
        ["userslist", pageid ? pageid : 1, filterValue ? filterValue : "",role ? role : "", search ? search : "" ],
        () => UserServices.getList(!!role ? `page=${pageid}&limit=${10}&role=${role}&keyword=${search}` : `page=${pageid}&limit=${10}&keyword=${search}`),
        {
            refetchOnWindowFocus: false,
            onSuccess: (data) => {
                return;
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

    //It Control Page Change
    const handlePageChange = (id) => {
        setPageId(id);
        queryParams.set("page", id ? id : 1);
        queryParams.set("limit", 5);

        // Replace the current history entry with the updated query parameters
        navigate({
            pathname: location.pathname,
            search: queryParams.toString(),
        });
    };
    const data_per_pages = useMemo(() => {

        setData_Per_Page((prev) => {
            return {
                initial_no:
                    parseInt(data?.data?.data?.pagination?.page) *
                    parseInt(data?.data?.data?.pagination?.limit) -
                    parseInt(data?.data?.data?.pagination?.limit) +
                    1,
                final_no:
                    parseInt(data?.data?.data?.pagination?.total) >
                        parseInt(data?.data?.data?.pagination?.limit) *
                        parseInt(data?.data?.data?.pagination?.page)
                        ? parseInt(data?.data?.data?.pagination?.limit) *
                        parseInt(data?.data?.data?.pagination?.page)
                        : data?.data?.data?.pagination?.total,
                total_no: data?.data?.data?.pagination?.total,
            };
        });
    }, [data?.data?.pagination, isLoading,]);

    const deleteUser = useMutation(
        (formdata) => {
            return UserServices.deleteUser(formdata);
        },
        {
            onSuccess: (data) => {
                if (data?.data?.error) {
                    toast.error(data?.data?.message, { delay: 10 });
                    return;
                }
                toast.success(data?.data?.message, { delay: 10 });
                queryClient.invalidateQueries("userlist");
                queryClient.refetchQueries("userlist");
                return
            },
            onError: (err) => {
                // //console.log("Get", err?.response?.data?.data);
                // formik.touched.c_password

                toast.error(err?.response?.data?.message || err?.message, {
                    delay: 10,
                });
            },
        }
    );
    useEffect(() => {
        try {

            const decodedRole = atob(filterValue);
            //console.log("decodedRole",decodedRole,filterValue)
        
            setRole(() =>!!filterValue ? decodedRole:"")
        } catch (error) {
            // console.error("Error decoding user ID:", error.message);
            // Handle the error gracefully, e.g., display an error message to the user
        }
    }, [filterValue]);

    return (
        <CheckPageIsAccessable modulename={window.location.pathname} permission={"read"} >
            { <div className="container-fluid">
                <div className="dashboard-wrapper">
                    <MainSidebar />

                    <div className="dash-right">
                        <div className="inner-wrapper">
                            <Header
                                handleToggle={handleToggle}
                                name={"Staffs"}
                                subname={"Staff List"}
                            />
                        </div>

                        <div>
                            <SideBarNav
                                toggleRole={toggleRole}
                                setToggleRole={setToggleRole}
                                toggleStyle={toggleStyle}
                            />


                            <div className={
                                toggleStyle ? "dash-right-info" : "dash-right-info cstm-wdth2"
                            }
                            >
                                <div className="dash-right-head">
                                    <div className="right-nav-content-left">
                                        {
                                            <IsAccessable modulename={window.location.pathname} permission={"create"}>
                                                <button
                                                    type="button"
                                                    className="btn triggle-modal-btn"
                                                    onClick={handleOpen}
                                                >
                                                    + Staff
                                                </button>
                                            </IsAccessable>

                                        }
                                    </div>
                                    <div className="right-nav-content-right">
                                        <div className="search-bx">
                                            <form>
                                            <input type="text" placeholder="Search" onChange={handleUserSearch} value={search}/>
                                            <div className="search-icon"></div>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                                {isLoading ? <Loader /> :  <div className="dash-right-bottom">
                                        <div className="table-responsive">
                                            {
                                                !isLoading && data?.data?.data?.users?.length == 0
                                                    ? <div
                                                        className="no-img"
                                                    >
                                                        <img src={nodata} />
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
                                                                <th scope="col">Name</th>
                                                                {/* <th scope="col">Designation</th> */}
                                                                <th scope="col">Role</th>
                                                                <th scope="col">Designation</th>
                                                                <th scope="col">Reporting To</th>
                                                                <th scope="col">Team</th>
                                                                <th scope="col">Email</th>
                                                                <th scope="col">Contact</th>
                                                                <th scope="col">Status</th>
                                                                {/* <th scope="col">Date of Birth</th> */}
                                                                <th scope="col">Last Updated on</th>
                                                                <IsAccessable modulename={window.location.pathname} permission={"update"}>
                                                                    <th scope="col" className="settings-icon">
                                                                        <IoSettingsOutline />
                                                                    </th>
                                                                </IsAccessable>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {data?.data?.data?.users?.map((each, ind) => {

                                                                return (
                                                                    <tr key={each?._id} style={{opacity: each?.active ? 1 : 0.6 }}>
                                                                        <td>
                                                                            <div className="form-check">

                                                                                <label
                                                                                    className="form-check-label"
                                                                                    htmlFor="flexCheckDefault"
                                                                                >
                                                                                    {ind + 1}
                                                                                </label>
                                                                            </div>
                                                                        </td>
                                                                        <td> {each?.userName}</td>
                                                                        {/* <td> {each?.designation || 'N/A'}</td> */}
                                                                        <td> {each?.role?.roleName}</td>
                                                                        <td> {each?.designation.length>0? each?.designation?.map((each)=><p>{each?.name || "N/A"}</p>):"N/A"}</td>
                                                                        <td> {(each?.role?.roleUId != config.Admin && each?.role?.roleUId != config.superAdmin) && (each?.reportingTo?.userName || 'N/A')}</td>
                                                                        <td> {each?.team?.length && each?.team?.map((elem) => <p key={elem?.name}> {elem?.name || 'N/A'}</p>) || 'N/A'}</td>
                                                                        <td> {each?.email}</td>
                                                                        <td> {each?.phoneNumber}</td>
                                                                        <td> <span className={each?.active ? "badge bg-green" : "badge bg-red"} >{each?.active === true ? 'Active' : 'Deleted' }</span></td>
                                                                        {/* <td>
                                                                            {each?.dateOfBirth && moment(each?.dateOfBirth).format(
                                                                                "DD/MM/YYYY"
                                                                            ) || 'N/A'}
                                                                        </td> */}
                                                                        <td>
                                                                            {moment(each?.updateAt).format("ll")}
                                                                        </td>
                                                                        {
                                                                            <IsAccessableMultiple modulename={window.location.pathname} permission={["update", "delete"]}>
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
                                                                                                 <IsAccessable modulename={window.location.pathname} permission={"update"}>
                                                                                                <li>
                                                                                                    <a
                                                                                                        className="dropdown-item"
                                                                                                        href="#"
                                                                                                        onClick={() =>
                                                                                                            handleUpdate(each)
                                                                                                        }
                                                                                                    >
                                                                                                        Update
                                                                                                    </a>
                                                                                                </li>
                                                                                                </IsAccessable>
                                                                                                <IsAccessable modulename={window.location.pathname} permission={"delete"}>
                                                                                                <li>
                                                                                                    <a
                                                                                                        className="dropdown-item"
                                                                                                        href="#"
                                                                                                        onClick={() =>
                                                                                                            handleDelete(each?._id)
                                                                                                        }
                                                                                                    >
                                                                                                        Delete
                                                                                                    </a>
                                                                                                </li>
                                                                                                </IsAccessable>
                                                                                                </>
                                                                                            }

                                                                                        </ul>
                                                                                    </div>
                                                                                </td>
                                                                            </IsAccessableMultiple>
                                                                        }
                                                                    </tr>
                                                                );
                                                            })}
                                                        </tbody>
                                                    </table>
                                            }
                                            {(!isLoading && data?.data?.data?.users?.length > 0) && <Pagination handlePageChange={handlePageChange}
                                                pagination={data?.data?.data?.pagination}
                                                pageid={pageid}
                                                data_per_page={data_per_page} />}
                                        </div>
                                    </div>
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>}


            {/* Modal */}
            <AddStaffModel isModel={isModel} prefill={userEdit} setPrefill={setUserEdit} setIsModel={setIsModel} />

            {/* <AddStaff formik={formik} roleData={roleData} roleLoading={roleLoading}/> */}


        </CheckPageIsAccessable>
    );
};

export default StaffList;
