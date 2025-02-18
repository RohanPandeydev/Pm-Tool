import React, { useEffect, useState } from "react";
import Header from "../../layout/header/Header";
import MainSidebar from "../../layout/sidebarnav/MainSidebar";
import { FaEdit } from "react-icons/fa";
import email from "../../assets/contact-ico1.png";
import client2 from "../../assets/contact-ico8.png";
import time from "../../assets/contact-ico9.png";
import client from "../../assets/contact-ico3.png";
import money from "../../assets/contact-ico10.png";
import calendar from "../../assets/contact-ico7.png";
import notifiy from "../../assets/contact-ico11.png";
import doc from "../../assets/d1.png";
// import uploadimg1 from "../../assets/img1.jpg";
// import uploadimg2 from "../../assets/img2.jpg";
import { TbDotsVertical } from "react-icons/tb";
import ProjectDetailsDrive from "./ProjectDetailsDrive";
import ProjectDriveMember from "./ProjectDriveMember";
import DriveMessageBoard from "./DriveMessageBoard";
import DriveDocsnFiles from "./DriveDocsnFiles";
import DriveChatBox from "./DriveChatBox";
import DriveTextBox from "./DriveTextBox";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import ProjectServices from "../../services/ProjectServices";
import ValidateAuthenticationKey from "../../utils/ValidateAuthenticationKey";
import { toast } from "react-toastify";
import Loader from "../../utils/Loader/Loader";
import StorageData from "../../helper/storagehelper/StorageData";
import female from "../../assets/female.png";
import male from "../../assets/male.png";
import logo from "../../assets/logo.png";
import ProjectDriveServices from "../../services/ProjectDriveServices";
import BoardMessageBox from "./BoardMessageBox";
const Drive = () => {
  const { id } = useParams();
  const [myId, setMyId] = useState("");
  const [projectMember, setProjectMember] = useState([]);
  const loggedInUserId = StorageData.getUserData()?._id;
  const loggedInUserName = StorageData.getUserData()?.userName;
  const [boardId, setBoardId] = useState("");
  const [boardDetails, setBoardDetails] = useState({});
  const [firstMessage,setFirstMessage]=useState("")
  const profileImage = StorageData.getUserData()?.profileImage;

  const { data, isLoading } = useQuery(
    ["drive-project-details", myId],
    () => ProjectServices.driveProjectDetails({ id: myId }),
    {
      enabled: !!myId,
      refetchOnWindowFocus: false,
      onSuccess: (data) => {
        console.log("Drive Project  Data", data?.data?.data?.projectDetails);

        //console.log("data",response?.data?.data?.projectDetails?.projectAddedMember);
        const uniqueData = data?.data?.data?.projectDetails?.projectAddedMember.filter((value, index, self) =>
          index === self.findIndex((item) => item._id === value._id)
        );
        setProjectMember(uniqueData);
       // setProjectMember(data?.data?.data?.projectDetails?.projectAddedMember);
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
    try {
      const decodedUserId = atob(id);
      setMyId(() => decodedUserId);
    } catch (error) {
      // console.error("Error decoding user ID:", error.message);
      // Handle the error gracefully, e.g., display an error message to the user
    }
  }, [id]);

  const handleChangeBoard = (boardId,projectId, boardData) => {
    // console.log("BoardId====>", boardId,projectId,boardData);
    setBoardId(boardId);
    setBoardDetails(boardData);
    StorageData.setBoardId({projectId:projectId,boardId:boardId})
  };
// console.log("boardDetails897987789",boardDetails)
  return (
    <div className="dashboard-wrapper">
      <MainSidebar />

      <div className="dash-right">
        <div className="inner-wrapper">
          <Header
            //handleToggle={handleToggle}
            name={"Project"}
            subname={"Drive Details"}
          />
        </div>
        {isLoading ? (
          <Loader />
        ) : (
          <div className="dashboard-body p-3">
            {/* Project Details */}
            <ProjectDetailsDrive
              details={data?.data?.data?.projectDetails || {}}
            />
            {/* Project Member */}
            {projectMember?.length && (
              <ProjectDriveMember projectMember={projectMember} />
            )}

            <div className="row mt-3 mid-board-wrap">
              <div className="col-md-6">
                {/* Project Drive Message Board */}
                {!!myId && (
                  <DriveMessageBoard
                  loggedInUserId={loggedInUserId}
                    setBoardId={setBoardId}
                    boardId={boardId}
                    handleChangeBoard={handleChangeBoard}
                    projectMember={projectMember}
                    project={myId}
                  />
                )}
              </div>
              <div className="col-md-6">
                {/* Project Drive Docs n Files */}

                {!!myId && (
                  <DriveDocsnFiles
                    id={myId}
                    name={data?.data?.data?.projectDetails?.name}
                  />
                )}
              </div>
            </div>

            <div className="staff-info message-board-wrap mt-3">
             {(!!boardDetails && boardDetails?.hasOwnProperty("title")) && <BoardMessageBox  firstMessage={firstMessage}  boardDetails={boardDetails} />}

              {/* Chats Box */}
              {(!!myId && boardId) && <DriveChatBox setFirstMessage={setFirstMessage} loggedInUserId={loggedInUserId} boardDetails={boardDetails}  myId={myId} boardId={boardId}/>}

              {/* Chat  Text Box */}
              {(!!myId && boardDetails?.hasOwnProperty("title")) && (
                <DriveTextBox
                  projectMember={boardDetails?.addedUsers || []}
                  profileImage={profileImage}
                  id={myId}
                  boardId={boardId}
                  loggedInUserName={loggedInUserName}
                  loggedInUserId={loggedInUserId}
                />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Drive;
