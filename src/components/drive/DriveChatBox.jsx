/* eslint-disable react/jsx-key */
import React from "react";
import { useQuery } from "@tanstack/react-query";
import moment from "moment";
import parse from "html-react-parser";
import { TbDotsVertical } from "react-icons/tb";
import ProjectDriveServices from "../../services/ProjectDriveServices";
import ValidateAuthenticationKey from "../../utils/ValidateAuthenticationKey";
import { toast } from "react-toastify";
import NoImageFound from "../../utils/NoImageFound";
import female from "../../assets/female.png";
import male from "../../assets/male.png";
import logo from "../../assets/logo.png";
import { useEffect } from "react";
import config from "../../config";

const DriveChatBox = ({ boardId, myId, boardDetails, loggedInUserId, setFirstMessage }) => {
  const { data: boardMessage, isLoading: isBoardMessageLoad } = useQuery(
    ["drive-project-board-message", boardId],
    () => ProjectDriveServices.MessageBoardMessageList({ boardId: boardId }),
    {
      // enabled: !!boardDetails && !!myId && !!boardId,
      refetchOnWindowFocus: false,
      select: (data) => {
        console.log("Drive Board Message", data?.data?.data);
        return data?.data?.data?.noteDetails;

        //console.log("data",response?.data?.data?.projectDetails?.projectAddedMember);
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


  useEffect(() => {
    // console.log("isBoardMessageLoad", isBoardMessageLoad, boardMessage)

    if (!isBoardMessageLoad && boardMessage?.length == 0) return

    if (!isBoardMessageLoad) {
      console.log("fff", boardMessage)

      setFirstMessage(() => boardMessage[0] || {})
    }



  }, [isBoardMessageLoad])
  return (
    <>
      {!isBoardMessageLoad && boardMessage?.length == 0 ? (
        <NoImageFound />
      ) : (
        !isBoardMessageLoad && boardMessage?.map((message, ind) => {
          // if(ind==0)return
          return (
            <div className="chat-bx2 comment-list">
              <span className="edit-dots">
                <TbDotsVertical />
              </span>
              <span className="task-date">
                {moment(message?.createdAt).format("lll")}
              </span>
              <div className="comment-user-icon">
                <img
                    src={
                      message?.userId?.profileImage
                        ? message?.userId?.profileImage
                        : message?.userId?.gender === "female"
                          ? female
                          : message?.userId?.gender === "male"
                            ? male
                            : logo
                    }
                    alt={message?.userId?.userName}
                    
                  />
              </div>
              <div className="user-comment">
                <h4 className="user-name">{message?.userId?.userName || "N/A"}
                  
                   <span>{message?.userId?.designation?.length>0 && message?.userId?.designation[0]?.name || ""}</span>
                   </h4>

                <div className="comment-prt">
                  <div className="d-flex align-items-center">
                    {message?.mentions?.length > 0 &&
                      message?.mentions?.map((member) => {
                        return (
                          // <div className="chat-bx">

                          <>
                            <h5 className="tag-name">
                              <span>
                                <img
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
                                  style={{ width: "32px", height: "32px", borderRadius: "50%" }}
                                />
                              </span>{" "}
                              {member.userName || "N/A"}
                            </h5>
                          </>
                          // </div>
                        );
                      })}
                  </div>

                  <p>{parse(message?.notes || "N/A")}</p>
                </div>
              </div>
              
              
            </div>
          );
        })
      )}
    </>
  );
};

export default DriveChatBox;
