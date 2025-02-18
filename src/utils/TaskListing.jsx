/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-key */
import moment from "moment";
import React from "react";
import { IoIosPause, IoIosPlay } from "react-icons/io";
import { IoCheckmarkSharp, IoSettingsOutline, IoStop } from "react-icons/io5";
import nodata from "../assets/nodatafound.png";
import convertSecondsToHHMMSS, { convertHHMMSS_HM } from "./TotalWorkingTime";
import config from "../config";
import { FaEdit, FaTrash } from "react-icons/fa";
import { GrRevert } from "react-icons/gr";
import RemoveUnderscore from "./RemoveUnderScoreAndMakeCapital";
// Not Started: Red (#FF0000)
// In Progress: Yellow (#FFFF00)
// Paused: Orange (#FFA500)
// Completed: Green (#008000)

const TaskListing = ({
  task,
  loggedInUserRoleId,
  loggedInUserId,
  changeTaskStatus,
  handleOpen,
  elapsedTime,
  formatTime,
  handleDelete,
}) => {
  return (
    <div>
      <div className="dash-right-head mt-3">
        <h4>{task?.startDate && moment(task?.startDate).format("ll")}</h4>
      </div>
      <div className="dash-right-bottom">
        <table className="table table-bordered">
          <thead>
            <tr>
              <th scope="col">Assigned To</th>
              <th scope="col">Task</th>
              <th scope="col">Task Status</th>
              <th scope="col">Milestone</th>
              <th scope="col">Project</th>
              <th scope="col">Total Time</th>
              <th scope="col">Worked Time</th>
              {loggedInUserRoleId != config.superAdmin &&
                loggedInUserRoleId != config.Manager && (
                  <th scope="col" className="settings-icon">
                    <IoSettingsOutline />
                  </th>
                )}
            </tr>
            {task?.tasks?.length == 0 ? (
              <div className="no-img">
                <img src={nodata} />
              </div>
            ) : (
              task?.tasks?.map((each) => {
                return (
                  <tr>
                    <td onClick={() => handleOpen(each)} scope="col">
                      {each?.assignedName || "N/A"}
                    </td>
                    <td scope="col">{each?.taskName || "N/A"}</td>
                    <td scope="col">
                      {" "}
                      <span
                        className={`badge text-bg-${
                          each?.status == config.paused
                            ? "paused"
                            : each?.status == config.inProgress
                            ? "in-progress"
                            : each?.status == config?.completed
                            ? "complete"
                            : "not-started"
                        } mt-3`}
                      >
                        {RemoveUnderscore(each?.status || "N/A")}
                      </span>
                    </td>

                    <td scope="col">{each?.milestoneTitle || "N/A"}</td>
                    <td scope="col">{each?.projectName || "N/A"}</td>
                    <td>{convertHHMMSS_HM(each?.hours, each?.timeType)}</td>
                    {each?.assignedId==loggedInUserId && each.status == config.inProgress ? (
                      <td>{formatTime(elapsedTime)}</td>
                    ) : (
                      <td>
                        {convertSecondsToHHMMSS(each?.totalWorkingTime || 0)}
                      </td>
                    )}
                    {loggedInUserRoleId != config.superAdmin &&
                      loggedInUserRoleId != config.Manager && (
                        <td className="settings-icon">
                          {loggedInUserRoleId != config.superAdmin &&
                            loggedInUserRoleId != config.Manager &&
                            loggedInUserId == each?.createdBy &&
                            loggedInUserRoleId != config.Executive && (
                              <a
                                href={
                                  "/project/milestone/task/" +
                                  btoa(each?.projectId) +
                                  "/" +
                                  btoa(each?.milestoneId) +
                                  "/" +
                                  btoa(each?.taskId)
                                }
                              >
                                <FaEdit />
                              </a>
                            )}
                          {loggedInUserRoleId != config.superAdmin &&
                            loggedInUserRoleId != config.Manager &&
                            loggedInUserId == each?.createdBy &&
                            loggedInUserRoleId != config.Executive && (
                              <button
                                type="button"
                                onClick={() => handleDelete(each?.taskId)}
                              >
                                <FaTrash />
                              </button>
                            )}
                          {loggedInUserRoleId != config.superAdmin &&
                          loggedInUserRoleId != config.Manager &&
                          each?.status == config.completed ? (
                            <>
                              <button className="btn bg-green">
                                {" "}
                                <IoCheckmarkSharp />
                              </button>
                              {loggedInUserRoleId != config.superAdmin &&
                                loggedInUserRoleId != config.Manager &&
                                loggedInUserId == each?.createdBy &&
                                loggedInUserRoleId != config.Executive &&
                                each?.status == config.completed && (
                                  <button
                                    className="btn"
                                    onClick={() =>
                                      changeTaskStatus(
                                        config.paused,
                                        each?.taskId,
                                        each?.milestoneId,
                                        false
                                      )
                                    }
                                  >
                                    {" "}
                                    <GrRevert />
                                  </button>
                                )}
                            </>
                          ) : (
                            <>
                              {loggedInUserRoleId != config.superAdmin &&
                                loggedInUserRoleId != config.Manager &&
                                each?.assignedId == loggedInUserId &&
                                (each?.status == config.inProgress ? (
                                  <button
                                    className="btn"
                                    onClick={() =>
                                      changeTaskStatus(
                                        config.paused,
                                        each?.taskId,
                                        each?.milestoneId
                                      )
                                    }
                                  >
                                    <IoIosPause />
                                  </button>
                                ) : (
                                  <button
                                    className="btn"
                                    onClick={() =>
                                      changeTaskStatus(
                                        config.inProgress,
                                        each?.taskId,
                                        each?.milestoneId
                                      )
                                    }
                                  >
                                    <IoIosPlay />
                                  </button>
                                ))}
                              {loggedInUserRoleId != config.superAdmin &&
                                loggedInUserRoleId != config.Manager &&
                                each?.assignedId == loggedInUserId &&
                                each?.status == config.inProgress &&
                                each?.status != config.completed && (
                                  <button
                                    onClick={() =>
                                      changeTaskStatus(
                                        config.completed,
                                        each?.taskId,
                                        each?.milestoneId
                                      )
                                    }
                                    className="bg-red"
                                  >
                                    <IoStop />
                                  </button>
                                )}
                            </>
                          )}{" "}
                        </td>
                      )}
                  </tr>
                );
              })
            )}
          </thead>
        </table>
      </div>
    </div>
  );
};

export default TaskListing;
