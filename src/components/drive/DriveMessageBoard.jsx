/* eslint-disable react/jsx-key */
import React, { useState } from "react";
import MessageBoardModel from "./MessageBoardModel";
import StorageData from "../../helper/storagehelper/StorageData";
import { useQuery } from "@tanstack/react-query";
import ProjectDriveServices from "../../services/ProjectDriveServices";
import ValidateAuthenticationKey from "../../utils/ValidateAuthenticationKey";
import { toast } from "react-toastify";
import ButtonLoader from "../../utils/Loader/ButtonLoader";
import nodata from "../../assets/nodatafound.png";
import female from "../../assets/female.png";
import male from "../../assets/male.png";
import logo from "../../assets/logo.png";
import moment from "moment";
import { Tooltip } from "reactstrap";
const DriveMessageBoard = ({
  projectMember,
  project,
  boardId,
  handleChangeBoard,
}) => {
  const [isModel, setIsModel] = useState(false);
  const loggedInUserId = StorageData.getUserData()?._id;
  const loggedInUserLastBoardId = StorageData?.getBoardId();
  const handleOpen = () => {
    setIsModel(!isModel);
  };

  const { data, isLoading } = useQuery(
    ["project-board-list", project],
    () => ProjectDriveServices.MessageBoardList({ id: project }),
    {
      enabled: !!project,
      refetchOnWindowFocus: false,
      onSuccess: (data) => {
        if (data?.data?.error) {
          toast.error(data?.data?.message);
          return;
        }
        console.log(
          "Board Data",
          data?.data?.data?.notes,
          loggedInUserLastBoardId
        );
        if (data?.data?.data?.notes.length == 0) {
          return;
        }
        console.log('loggedInUserLastBoardId56456', data?.data?.data?.notes, loggedInUserId, loggedInUserLastBoardId)
        if (!!loggedInUserLastBoardId) {
          const findData = data?.data?.data?.notes?.find((ids) => {
            return (
              ids?.project == loggedInUserLastBoardId?.projectId &&
              ids?._id == loggedInUserLastBoardId?.boardId && !!(ids?.addedUsers?.some((idx) => idx?._id == loggedInUserId))
            );
          });
          console.log("findData", findData);
          if (!!findData) {
            handleChangeBoard(
              loggedInUserLastBoardId?.boardId || "",
              loggedInUserLastBoardId?.projectId || "",
              findData || {}
            );
            return;
          }

          handleChangeBoard(
            data?.data?.data?.notes[0]?._id || "",
            data?.data?.data?.notes[0]?.project || "",
            data?.data?.data?.notes[0] || {}
          );

          return;
        }
        handleChangeBoard(
          data?.data?.data?.notes[0]?._id || "",
          data?.data?.data?.notes[0]?.project || "",
          data?.data?.data?.notes[0] || {}
        );
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

  return (
    <>
      <div className="overview-bx">
        <div className="dash-right-head">
          <h4>Message Board</h4>
          <button className="ctd-del-btn" onClick={handleOpen}>
            + Add Board
          </button>
        </div>
        {isLoading ? (
          <ButtonLoader />
        ) : data?.data?.data?.notes?.length == 0 ? (
          <div className="no-img">
            <img src={nodata} />
          </div>
        ) : (
          data?.data?.data?.notes?.map((each) => {
            return (
              <div
                style={{
                  backgroundColor: `${boardId == each?._id ? "#f1c40f" : ""}`,
                }}
                className="massege-board"
                onClick={() => handleChangeBoard(each?._id, each?.project, each)}
              >
                <ul className="emp-list">
                  {each?.addedUsers?.map((member, index) => {
                    if (loggedInUserId == member?._id) return;
                    return (
                      <li>
                        <span>
                          <img
                            title={member?.userName || "N/A"}
                            id={"TooltipExample" + index}
                            src={
                              member.profileImage
                                ? member.profileImage
                                : member?.gender === "female"
                                  ? female
                                  : member?.gender === "male"
                                    ? male
                                    : logo
                            }
                            alt={member.userName}
                            style={{
                              borderRadius: "50%",
                            }}
                          />
                        </span>
                      </li>
                    );
                  })}
                </ul>
                <div className="d-flex justify-content-between mt-3">
                  <p>{each?.title || "N/A"}</p>
                  <span className="start-date">
                    {moment(each?.createdAt).format("ll")}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
      {!!project && (
        <MessageBoardModel
          project={project}
          loggedInUserId={loggedInUserId}
          isModel={isModel}
          setIsModel={setIsModel}
          projectMember={projectMember}
        />
      )}{" "}
    </>
  );
};

export default DriveMessageBoard;
