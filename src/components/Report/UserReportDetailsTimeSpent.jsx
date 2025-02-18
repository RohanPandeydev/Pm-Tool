/* eslint-disable react/jsx-key */
import moment from "moment";
import React from "react";
import convertSecondsToHHMMSS from "../../utils/TotalWorkingTime";
import nodata from "../../assets/nodatafound.png";
import NoImageFound from "../../utils/NoImageFound";

const UserReportDetailsTimeSpent = ({ userTimeSpent,sectionRef,isLoadTimeSpent}) => {
  // console.log("userTimeSpent", userTimeSpent);
  return (
    <>

     {!isLoadTimeSpent && <div className="table-responsive mt-3" ref={sectionRef}>
        <div className="accordion timespent-bx" id="accordionExample">
          {userTimeSpent?.length === 0 ? (
            <div className="no-img">
              <img src={nodata} alt="No data" />
            </div>
          ) : (
            userTimeSpent?.length > 0 &&
            userTimeSpent?.map((each, index) => {
              const isFirst = index === 0;
              return (
                <div key={index} className="accordion-item">
                  <h2 className="accordion-header">
                    <button
                      className={`accordion-button ${!isFirst && "collapsed"}`}
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target={`#collapse${index}`}
                      aria-expanded={isFirst}
                      aria-controls={`collapse${index}`}
                    >
                      {moment(each?._id).format("ll")}{" "}
                      <span className="total-time">
                      {convertSecondsToHHMMSS(
                                      Math.ceil(each?.totalWorkedTime / 1000) || 0
                                    )}
                      </span>
                    </button>
                  </h2>
                  <div
                    id={`collapse${index}`}
                    className={`accordion-collapse collapse ${
                      isFirst && "show"
                    }`}
                    data-bs-parent="#accordionExample"
                  >
                    <div className="accordion-body">
                      <table className="table table-bordered">
                        <thead>
                          <tr>
                            <th scope="col">Project </th>
                            <th scope="col">Milestone </th>
                            <th scope="col">Task </th>
                            <th scope="col">Time Spent</th>
                          </tr>
                        </thead>
                        <tbody>
                          {each?.tasks?.length == 0 ? (
                            <NoImageFound />
                          ) : (
                            each?.tasks?.map((task) => {
                              return (
                                <tr>
                                  {/* <td>{moment(each).format("ll") || "N/A"}</td> */}
                                  <td>{task?.projectName || ""}</td>
                                  <td>{task?.milestoneName || ""}</td>
                                  <td>{task?.taskName || ""}</td>
                                  <td>
                                    {convertSecondsToHHMMSS(
                                      Math.ceil(task?.totalTime / 1000) || 0
                                    )}
                                  </td>
                                  {/* <td></td> */}
                                </tr>
                              );
                            })
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>}
    </>
  );
};

export default UserReportDetailsTimeSpent;
