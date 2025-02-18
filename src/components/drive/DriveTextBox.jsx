import React, { useState } from "react";
import { TbDotsVertical } from "react-icons/tb";
import Editor from "../../utils/Notes/Editor";
import Select from "react-select";
import female from "../../assets/female.png";
import male from "../../assets/male.png";
import logo from "../../assets/logo.png";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import ProjectDriveServices from "../../services/ProjectDriveServices";
import moment from "moment";
import ButtonLoader from "../../utils/Loader/ButtonLoader";
import { toast } from "react-toastify";

const DriveTextBox = ({
  projectMember,
  id,
  loggedInUserName,
  loggedInUserId,
  profileImage,
  boardId,
}) => {
  console.log("projectMember",projectMember)

  const queryClient=useQueryClient()

  const [text, setText] = useState("");
  const [mentionUser, setMentionUser] = useState([]);
  // const [mentionUserId, setMentionUserId] = useState([]);
  const [err, setErr] = useState({});
  const generateOptions = () => {
    const options = [
      // Option for selecting all members
      {
        value: "all",
        label: "Select All Members",
      },
      // Individual member options
      ...projectMember
        ?.filter((member) => member?._id !== loggedInUserId)
        .map((member) => ({
          value: member._id,
          label: (
            <div className="d-flex align-items-center">
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
              <div className="ms-2">
                <div>{member.userName}</div>
                {/* <p>({member.role?.roleName || "N/A"})</p> */}
              </div>
            </div>
          ),
        })),
    ];
    // Remove "Select All Members" if any member is selected
    if (mentionUser.length > 0) {
      const updatedOptions = options.filter((option) => option.value !== "all");
      return updatedOptions;
    }
    return options;
  };

  //   //console.log("projectMember projectMember", projectMember);
  const handleMentionUser = (selectedOption) => {
    if (selectedOption && selectedOption[0]?.value === "all") {
      // Handle selecting all members
      const allMemberIds = projectMember.filter((member) => member._id !== loggedInUserId).map((member) => ({
        
        value: member._id,
        label: (
          <div className="flex align-items-center">
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
              style={{ width: "32px", borderRadius: "50%" }}
            />
            <div className="ml-2">
              <div>{member.userName}</div>
              {/* <p>({member.role?.roleName || "N/A"})</p> */}
            </div>
          </div>
        ),
      }));
      setMentionUser(allMemberIds);
    } else {
      // Handle individual member selection
      setMentionUser(selectedOption);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const mentionIds = mentionUser?.map((each) => each?.value);
    const allUserIds = projectMember?.map((each) => each?._id);
    if ( !text || text.length == 0 || text == null || !!!text) {
      setErr({ textErr: "Message required" });
      return;
    }
    if(!!!boardId){
      toast.error("First create board to do comment")
      return
    }
    const sendData = {
      project: id,
      boardId: boardId,
      mentions: mentionIds,
      notes: text,
      messageFrom: loggedInUserId,
      addedUsers: allUserIds,
      redirectUrl:window.location.href|| window.location.origin
    };

    console.log("sendData===", sendData);
    createMutation.mutate(sendData);
  };

  const createMutation = useMutation(
    (formdata) => {
      return ProjectDriveServices.MessageBoardMessageSend(formdata);
    },
    {
      onSuccess: (data) => {
        if (data?.data?.error) {
          toast.error(data?.data?.message, { delay: 10 });
          return;
        }

        toast.success(data?.data?.message, { delay: 10 });
        setText("")
        setMentionUser([])
        setErr("")
        queryClient.invalidateQueries(["drive-project-board-message",boardId])
        queryClient.refetchQueries(["drive-project-board-message",boardId])
      

        return;
      },
      onError: (err) => {
        // //console.log("Get", err?.response?.data?.data);
        toast.error(err?.response?.data?.message || err?.message, {
          delay: 10,
        });
      },
    }
  );

  return (
    <>
      <div className="chat-bx2 post-comment-wrap">
        {/* <span className="edit-dots">
          <TbDotsVertical />
        </span> */}
        <span className="task-date">{moment(new Date()).format("ll")}</span>
        <div className="comment-prt">
          <h5 className="tag-name">
            <span>
              {profileImage ? (
                <img className="img-fluid" src={profileImage} />
              ) : (
                loggedInUserName?.slice(0, 3).toUpperCase() || "philips"
              )}
            </span>{" "}
            {loggedInUserName || "N/A"}
          </h5>

          <form className="rd-mailform mt-4">
            <div className="form-group">
              {/* <select className='form-select'>
                                            <option>Add members..</option>
                                            <option>Sudip Hazra</option>
                                            <option>Nayan Dey</option>
                                            <option>Suvendu Roy</option>
                                            <option>Anup Das</option>
                                        </select> */}
              <Select
                value={mentionUser}
                onChange={handleMentionUser}
                options={generateOptions()}
                placeholder="Select "
                name="teamLeader"
                className="basic-multi-select"
                classNamePrefix="select"
                isMulti={true}
                isClearable
                isDisabled={false}
              />
            </div>
            <div className="form-group">
              {/* <textarea className='form-control' placeholder='Type your comment here..'></textarea> */}
              <Editor text={text} setText={setText} />
              {err?.textErr && <p className="text-danger">{err?.textErr}</p>}
            </div>
            <button
              className="btn modal-save-btn"
              onClick={handleSubmit}
              disabled={createMutation?.isLoading}
            >
              {createMutation?.isLoading ? <ButtonLoader /> : "Submit"}
            </button>

            {/* <div className='upload-img-prt'>
                                        <div className='upload-img-bx'>
                                            <img src={uploadimg1} alt='' />
                                        </div>
                                        <div className='upload-img-bx'>
                                            <img src={uploadimg2} alt='' />
                                        </div>
                                    </div> */}
          </form>
        </div>
      </div>
    </>
  );
};

export default DriveTextBox;
