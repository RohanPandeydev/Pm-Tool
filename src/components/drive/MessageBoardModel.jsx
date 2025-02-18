import { useFormik } from "formik";
import React, { useState } from "react";
import { Col, Modal, ModalBody, ModalHeader, Row } from "reactstrap";
import Select from "react-select";
import female from "../../assets/female.png";
import male from "../../assets/male.png";
import logo from "../../assets/logo.png";
import { AddBoardForm } from "../../helper/ValidationHelper/Validation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import ProjectDriveServices from "../../services/ProjectDriveServices";
import ButtonLoader from "../../utils/Loader/ButtonLoader";
import StorageData from "../../helper/storagehelper/StorageData";
const MessageBoardModel = ({
  isModel,
  setIsModel,
  project,
  projectMember,
  loggedInUserId,
}) => {
  const [mentionUser, setMentionUser] = useState([]);
  const [err, setErr] = useState("");
  const queryClient = useQueryClient();


// console.log("project",project)

  const initialValues = {
    title: "",
    description: "",
    userId: loggedInUserId || "",
    project: project || "",
    isPrivate: false,
  };

  const handleClose = () => {
    setIsModel(!isModel);
    setMentionUser([]);
    formik.resetForm();
    return;
  };
  // const [mentionUserId, setMentionUserId] = useState([]);
  const generateOptions = () => {
    const options = [
      // Option for selecting all members
      {
        value: "all",
        label: "Select All Members",
      },
      // Individual member options
      ...projectMember
      ?.filter((member) => member?._id !== loggedInUserId && member?.isDeleted === false && member?.active === true)
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
                style={{ width: "32px", borderRadius: "50%" }}
              />
              <div className="ms-2">
                <div style={{fontSize:'14px',}}>{member.userName} ({member.role?.roleName || "N/A"})</div>
                {/* <p></p> */}
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

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: AddBoardForm,
    onSubmit: (values, action) => {
      if (mentionUser?.length == 0) {
        setErr("Atleast One member required");
        return;
      }
      setErr("");
      handleSubmit(values);
    },
  });
  const handleSubmit = (data) => {
    const mentionIds = mentionUser?.map((each) => each?.value);
    const allUserIds = projectMember?.map((each) => each?._id);
    const sendData = {
      ...data,
      addedUsers: mentionIds,
      redirectUrl:window.location.href|| window.location.origin
    };

    // console.log("Alll Data", sendData,window.location.href
    // );
    createMutation.mutate(sendData);
  };

  const createMutation = useMutation(
    (formdata) => {
      return ProjectDriveServices.MessageBoardCreate(formdata);
    },
    {
      onSuccess: (data) => {
        if (data?.data?.error) {
          toast.error(data?.data?.message, { delay: 10 });
          return;
        }
        console.log("data?.data=============Model",data?.data)
        StorageData.setBoardId({projectId:data?.data?.data?.createdNotes?.project,boardId:data?.data?.data?.createdNotes?._id})
        toast.success(data?.data?.message, { delay: 10 });
        handleClose();
        queryClient.invalidateQueries(["project-board-list", project]);
        queryClient.refetchQueries(["project-board-list", project]);
        return;
      },
      onError: (err) => {
        toast.error(data?.data?.data?.message || err?.message, { delay: 10 });
      },
    }
  );

  return (
    <>
      <Modal isOpen={isModel} size="lg" toggle={handleClose} centered>
        <ModalHeader
          close={
            <button className="close" onClick={handleClose} type="button">
              &times;
            </button>
          }
          toggle={handleClose}
        >
          Add Board
        </ModalHeader>

        <ModalBody>
          <form onSubmit={formik.handleSubmit} className="moadal-form">
            <div className="row">
              <div className="col-md-12 col-sm-12">
                <div className="modal-form-left">
                  <div className="model-form-box">
                    <input
                      type="text"
                      value={formik?.values?.title}
                      onBlur={formik.handleBlur}
                      onChange={formik.handleChange}
                      name="title"
                      placeholder="Add  Board  Name"
                      className="form-control"
                    />

                    {formik.touched.title && (
                      <p className="text-danger"> {formik.errors.title} </p>
                    )}
                  </div>
                  <div className="model-form-box">
                    <textarea
                      cols={5}
                      rows={2}
                      type="text"
                      value={formik?.values?.description}
                      onBlur={formik.handleBlur}
                      onChange={formik.handleChange}
                      name="description"
                      placeholder="Add  Board  Description"
                      className="form-control"
                    ></textarea>

                    {formik.touched.description && (
                      <p className="text-danger">
                        {" "}
                        {formik.errors.description}{" "}
                      </p>
                    )}
                  </div>
                  <div className="model-form-box">
                    <Select
                      value={mentionUser}
                      onChange={handleMentionUser}
                      options={generateOptions()}
                      placeholder="Select Members "
                      name="teamLeader"
                      className="basic-multi-select"
                      classNamePrefix="select"
                      isMulti={true}
                      isClearable
                      isDisabled={false}
                    />
                    {err && <p className="text-danger"> {err} </p>}
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn modal-close-btn"
                onClick={handleClose}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn modal-save-btn"
                disabled={createMutation?.isLoading}
              >
                {createMutation?.isLoading ? <ButtonLoader /> : "Save"}
              </button>
            </div>
          </form>
        </ModalBody>
      </Modal>
    </>
  );
};

export default MessageBoardModel;
