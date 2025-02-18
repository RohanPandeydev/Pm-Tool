import { useQuery } from '@tanstack/react-query';
import moment from 'moment';
import React, { useMemo, useState } from 'react'
import { IoSettingsOutline } from 'react-icons/io5';
import ProjectServices from '../services/ProjectServices';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import StorageData from '../helper/storagehelper/StorageData';
import ValidateAuthenticationKey from './ValidateAuthenticationKey';
import Pagination from './Pagination';
import nodata from "../assets/nodatafound.png";
import { convertHHMMSS_HM } from './TotalWorkingTime';
import RemoveUnderscore from './RemoveUnderScoreAndMakeCapital';
import { FaEye, FaGoogleDrive } from 'react-icons/fa6';


const DashboardProjectDetailsList = ({ design, wp, qa, teamId, myFilterId }) => {

    let navigate = useNavigate();
    let location = useLocation();
    let queryParams = new URLSearchParams(location.search);
    const roleUId = StorageData?.getUserData()?.role?.roleUId;
    let pageValue = queryParams.get("page");
    const [isModel, setIsModel] = useState(false);
    const [toggleStyle, setToggleStyle] = useState(false);
    const [pageid, setPageId] = useState(pageValue || 1);
    const [page_limit, setPage_Limit] = useState([5, 10, 25, 50, 100]);
    const [prefill, setPrefill] = useState(null);

    const [data_per_page, setData_Per_Page] = useState({
        final_no: 0,
        initial_no: 1,
        total_no: 0,
    });
    // Get the 'page' parameter value
    const handleOpen = () => {
        setIsModel(!isModel);
    };
    const handleToggle = () => {
        setToggleStyle(!toggleStyle);
    };
    const { data, isLoading } = useQuery(
        ["projectlist-team", pageid ? pageid : 1, myFilterId ? myFilterId : ""],
        () => ProjectServices.getList(`page=${pageid}&limit=${10}&team=${teamId}&assignedUserId=${myFilterId}`),
        {
            refetchOnWindowFocus: false,
            onSuccess: (data) => {
                return;
            },
            onError: (err) => {
                if (err?.response?.status === 401) {
                    ValidateAuthenticationKey(
                        err?.response?.status,
                        "Your login session has expired. Please log in again."
                    );
                    return;
                }
                // //console.log(err?.message);
                // toast.error(err?.response?.data?.message || err?.message, {
                //     delay: 10,
                // });
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
    }, [data?.data?.pagination, isLoading]);





    return (
        <div className="table-responsive">
            {!isLoading &&
                data?.data?.data?.projects?.length == 0 ? (
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
                                <th scope="col">Customer Details</th>
                                <th scope="col">Account Manager</th>
                                <th scope="col">Project Manager</th>
                                {/* <th scope="col">Teams</th> */}
                                <th scope="col">Start Date</th>
                                <th scope="col">End Date</th>
                                <th scope="col">Project Status</th>
                                {/* <th scope="col">Price Type</th> */}
                                {/* <th scope="col">Price </th> */}
                                <th scope="col">EstimatedTime (Hr.) </th>
                            <th scope="col" className="text-center">Details</th>




                        </tr>
                    </thead>

                    <tbody>
                              {data?.data?.data?.projects?.map((each, ind) => {
                                return (
                                  <tr key={each?._id}>
                                    <td
                                      // onClick={() =>
                                      //   OffCanvastoggle(each?._id, each?.name)
                                      // }
                                    >
                                      <div className="form-check">
                                        <label
                                          className="form-check-label"
                                          htmlFor="flexCheckDefault"
                                        >
                                          {"#"}
                                          {each?.projectCode || "SB00000"}
                                        </label>
                                      </div>
                                    </td>
                                    <td
                                    // onClick={() =>
                                    //   OffCanvastoggle(each?._id, each?.name)
                                    // }
                                    >
                                      {" "}
                                      {each?.name}
                                    </td>
                                    <td>{each?.customerName || "N/A"}</td>

                                    <td>
                                      {each?.assistantManagerId?.userName ||
                                        "N/A"}
                                    </td>
                                    <td>
                                      {each?.projectManagerId?.userName ||
                                        "N/A"}
                                    </td>
                                    {/* <td>
                                                                            <div>
                                                                                {each?.teams?.map((elem) => (
                                                                                    <p key={elem?._id}>
                                                                                        {elem?.team?.name}(
                                                                                        {elem?.teamLeader?.userName ||
                                                                                            "N/A"}
                                                                                        )
                                                                                    </p>
                                                                                ))}
                                                                            </div>
                                                                        </td> */}
                                    <td>
                                      {(each?.startDate &&
                                        moment(each?.startDate).format("ll")) ||
                                        "N/A"}
                                    </td>
                                    <td>
                                      {(each?.endDate &&
                                        moment(each?.endDate).format("ll")) ||
                                        "N/A"}
                                    </td>
                                    {/* <td>
                                                                            {" "}
                                                                            {each?.priceType.toUpperCase() || "N/A"}
                                                                        </td> */}
                                    {/* <td>
                                                                            {" "}
                                                                            {getCurrencySymbol(each?.currencyType)} &nbsp;{each?.price && FormatNumber(each?.price || 0)}
                                                                        </td> */}
                                    <td>
                                      {" "}
                                      {RemoveUnderscore(each?.status || "N/A")}
                                    </td>
                                    <td>
                                      {" "}
                                      {convertHHMMSS_HM(
                                        each?.estimatedTime || 0
                                      )}
                                    </td>
                                    {/* <td>
                                                                            {moment(each?.updateAt).format("ll")}
                                                                        </td> */}
                                    {
                                      <td className="settings-icon">
                                          <Link
                                                className="mx-2"
                                                to={
                                                  "/project/" + btoa(each?._id)
                                                }
                                              // onClick={() =>
                                              //     handleUpdate(each)
                                              // }
                                              >
                                                <FaEye />
                                              </Link>
                                              <Link
                                              className=""
                                              to={"/drive/"+ btoa(each?._id)}

                                            >
                                             <FaGoogleDrive />

                                            </Link>

                                        
                                        {/* <div className="dropdown triple-dot"> */}
                                        {/* <button
                                                                                        className="btn btn-secondary dropdown-toggle"
                                                                                        type="button"
                                                                                        id="dropdownMenuButton1"
                                                                                        data-bs-toggle="dropdown"
                                                                                        aria-expanded="false"
                                                                                    >
                                                                                        <CiMenuKebab />
                                                                                    </button> */}
                                        {/* <ul
                                                                                        className="dropdown-menu"
                                                                                        aria-labelledby="dropdownMenuButton1"
                                                                                    > */}
                                        
                                        {/* </ul> */}
                                        {/* </div> */}
                                      </td>
                                    }
                                  </tr>
                                );
                              })}
                            </tbody>
                </table>
            )}

            {(!isLoading && data?.data?.data?.projects?.length > 0) && (
                <Pagination
                    handlePageChange={handlePageChange}
                    pagination={data?.data?.data?.pagination}
                    pageid={pageid}
                    data_per_page={data_per_page}
                />
            )}

        </div>

    )
}

export default DashboardProjectDetailsList