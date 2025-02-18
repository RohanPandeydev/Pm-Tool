import { useQuery } from "@tanstack/react-query";
import React from "react";
import { GoDotFill } from "react-icons/go";
import DashboardServices from "../services/DashboardServices";
import ValidateAuthenticationKey from "./ValidateAuthenticationKey";
import nodata from "../assets/nodatafound.png";

const DashboardIdleEmployee = ({ idle }) => {
  const { data: idleUsers, isLoading } = useQuery(
    ["user-idle-list", idle ? idle : ""],
    () => DashboardServices.getUserIdleList(`?keyword=${idle}` || ""),
    {
      refetchInterval: 60000,
      refetchOnWindowFocus: true,
      onSuccess: (data) => {
        // //console.log("MY Data Idle List",data?.data)
      },
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

  return (
    <div className="table-responsive">
      {!isLoading && idleUsers?.data?.data?.userlist?.length == 0 ? (
        <div className="no-img">
          <img src={nodata} />
        </div>
      ) : (
        <table className="table table-bordered">
          <thead>
            <tr>
              <th scope="col">Employee Names</th>
              <th scope="col">Department</th>
              <th scope="col">Designation</th>
              <th scope="col">Project Name</th>
              <th scope="col">Task Name</th>
              <th scope="col" className="text-center">
                Status
              </th>
            </tr>
          </thead>

          <tbody>
            {idleUsers?.data?.data?.userlist?.map((each) => {
              return (
                <tr key={each?._id}>
                  <td>{each?.userName || "N/A"}</td>
                  <td>{each?.team || "N/A"} </td>
                  <td>{each?.role || "N/A"}</td>
                  <td>
                    <span class="badge text-bg-yellow">
                      {each?.projectName || "N/A"}
                    </span>
                  </td>
                  <td>{each?.taskName || "N/A"}</td>
                  <td className="text-center">
                    <GoDotFill color="#DC6262" />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default DashboardIdleEmployee;
