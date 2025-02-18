import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { GoDotFill } from "react-icons/go";
import { Link, useLocation, useNavigate } from "react-router-dom";

import DashboardServices from "../services/DashboardServices";
import ValidateAuthenticationKey from "./ValidateAuthenticationKey";
import { toast } from "react-toastify";
import nodata from "../assets/nodatafound.png";
import Pagination from "./Pagination";
import StorageData from "../helper/storagehelper/StorageData";
import config from "../config";
import convertSecondsToHHMMSS, { convertHHMMSS_HM } from "./TotalWorkingTime";

const DashboardActiveEmployeeTable = ({ active }) => {
  let navigate = useNavigate();
  let location = useLocation();
  let queryParams = new URLSearchParams(location.search);
  let pageValue = queryParams.get("page");
  const [role, setRole] = useState("");
  const [toggleRole, setToggleRole] = useState(false);
  const [isModel, setIsModel] = useState(false);
  const [userEdit, setUserEdit] = useState(null);
  const [toggleStyle, setToggleStyle] = useState(false);
  const [pageid, setPageId] = useState(pageValue || 1);
  const [page_limit, setPage_Limit] = useState([5, 10, 25, 50, 100]);
  const loggedInUserRoleId = StorageData.getUserData()?.role?.roleUId;
  const [data_per_page, setData_Per_Page] = useState({
    final_no: 0,
    initial_no: 1,
    total_no: 0,
  });

  const { data: userActiveList, isLoading } = useQuery(
    ["user-active-list", active ? active : ""],
    () => DashboardServices.getUserActiveList(`?keyword=${active || ""}`),
    {
      refetchInterval: 60000,
      refetchOnWindowFocus: true,
      onSuccess: (data) => {},
      onError: (err) => {
        if (err?.response?.status === 401) {
          ValidateAuthenticationKey(
            err?.response?.status,
            "Your login session has expired. Please log in again."
          );
          return;
        }
        // //console.log(err?.response);
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
          parseInt(userActiveList?.data?.data?.pagination?.page) *
            parseInt(userActiveList?.data?.data?.pagination?.limit) -
          parseInt(userActiveList?.data?.data?.pagination?.limit) +
          1,
        final_no:
          parseInt(userActiveList?.data?.data?.pagination?.total) >
          parseInt(userActiveList?.data?.data?.pagination?.limit) *
            parseInt(userActiveList?.data?.data?.pagination?.page)
            ? parseInt(userActiveList?.data?.data?.pagination?.limit) *
              parseInt(userActiveList?.data?.data?.pagination?.page)
            : userActiveList?.data?.data?.pagination?.total,
        total_no: userActiveList?.data?.data?.pagination?.total,
      };
    });
  }, [userActiveList?.data?.pagination, isLoading]);


 
  return (
    <div className="table-responsive">
      {!isLoading && userActiveList?.data?.data?.userlist?.length == 0 ? (
        <div className="no-img">
          <img src={nodata} />
        </div>
      ) : (
        <table className="table table-bordered">
          <thead>
            <tr>
              <th scope="col">Employee Names</th>
              {loggedInUserRoleId == config.superAdmin ||
              loggedInUserRoleId == config.Manager ? (
                <>
                  <th scope="col">Department</th>
                  <th scope="col">Designation</th>
                </>
              ) : (
                <>
                  <th scope="col">Total Time</th>
                  <th scope="col">Worked Time</th>
                </>
              )}
              <th scope="col">Project Name</th>
              <th scope="col">Task Name</th>
              <th scope="col" className="text-center">
                Status
              </th>
            </tr>
          </thead>

          <tbody>
            {userActiveList?.data?.data?.userlist?.map((each) => {
              return (
                <tr key={each?._id}>
                  <td>{each?.userName || "N/A"}</td>
                  {loggedInUserRoleId == config.superAdmin ||
                  loggedInUserRoleId == config.Manager ? (
                    <>
                      <td>{each?.team || "N/A"} </td>
                      <td>{each?.role || "N/A"}</td>
                    </>
                  ) : (
                    <>
                      <td>{convertHHMMSS_HM(each?.hours, each?.timeType)}</td>
                      {
                        <td>
                          {convertSecondsToHHMMSS(each?.totalWorkingTime || 0)}
                        </td>
                      }
                    </>
                  )}

                  <td>
                  <Link
                                                className="mx-2"
                                                to={
                                                  "/project/" + btoa(each?.projectId)
                                                }
                                              // onClick={() =>
                                              //     handleUpdate(each)
                                              // }
                                              >
                    <span class="badge text-bg-yellow">

                      {each?.projectName || "N/A"}
                    </span>
                    </Link>
                  </td>
                  <td>{each?.taskName}</td>
                  <td className="text-center">
                    <GoDotFill color="#6EDF89" />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
      {!isLoading && userActiveList?.data?.data?.userlist?.length > 0 && (
        <Pagination
          handlePageChange={handlePageChange}
          pagination={userActiveList?.data?.data?.pagination}
          pageid={pageid}
          data_per_page={data_per_page}
        />
      )}
    </div>
  );
};

export default DashboardActiveEmployeeTable;
