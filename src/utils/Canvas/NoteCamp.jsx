import React, { useEffect, useState } from "react";
import { MdCall } from "react-icons/md";
import Editor from "../Notes/Editor";
import Select from "react-select";
import female from "../../assets/female.png";
import male from "../../assets/male.png";
import logo from "../../assets/logo.png";
import NotesList from "./NotesList";
import { toast } from "react-toastify";
import ProjectServices from "../../services/ProjectServices";
import ProjectNotesServices from "../../services/ProjectNotesServices";
import { useMutation } from "@tanstack/react-query";
const NoteCamp = ({ projectMember, canvasProjectId }) => {
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
      ...projectMember.map((member) => ({
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
              <p>({member.role?.roleName || "N/A"})</p>
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
      const allMemberIds = projectMember.map((member) => ({
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
              <p>({member.role?.roleName || "N/A"})</p>
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
    const allUserIds=projectMember?.map((each)=>each?._id)
    if (text.length == 0 || text == null || !!!text) {
      setErr({ textErr: "Required" });
      return;
    }
    const sendData = {
      project: canvasProjectId,
      mentions: mentionIds,
      notes: text,
      addedUsers:allUserIds,
    };

    console.log("sendData",sendData)

  };

  const createMutation = useMutation(
    (formdata) => {
        return ProjectNotesServices.create(formdata);
    },
    {
        onSuccess: (data) => {
            if (data?.data?.error) {
                toast.error(data?.data?.message, { delay: 10 });
                return;
            }
            toast.success(data?.data?.message, { delay: 10 });
           
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
      <div className="focus-box">
        <MdCall className="activityF-icons" />
        <div className="notes-wrapper">
          {/* <form onSubmit={formik.handleSubmit}> */}

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
          <Editor text={text} setText={setText} />
          {err?.textErr && <p className="text-danger">{err?.textErr}</p>}

          {/* <Mention projectMember={projectMember}/> */}

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "end",
              width: "100%",
            }}
          >
            <button
              type="submit"
              className="btn ctd-btn"
              onClick={handleSubmit}
            >
              Submit
            </button>
          </div>
          {/* </form> */}
        </div>
      </div>
      <NotesList text={text} />
    </>
  );
};

export default NoteCamp;
