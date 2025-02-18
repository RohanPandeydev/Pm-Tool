import React, { useState } from 'react'
import { Col, Modal, ModalBody, ModalHeader, Row } from "reactstrap";
import UserServices from '../../../services/UserServices';
import StorageData from '../../../helper/storagehelper/StorageData';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import ValidateAuthenticationKey from '../../../utils/ValidateAuthenticationKey';
import ButtonLoader from '../../../utils/Loader/ButtonLoader';
import Select from 'react-select'
import ProjectServices from '../../../services/ProjectServices';
import { toast } from 'react-toastify';
const AddTeamMember = ({ setIsModel,activeTeam ,isModel, prefill, projectId, toggleRefetch, setToggleRefetch, setActiveTab }) => {
    const [teamExecutive, setTeamExecutive] = useState([])
    const [err, setShowErr] = useState("")
    const queryClient = useQueryClient()
    const id = StorageData?.getUserData()?._id
    const handleClose = () => {
        setIsModel(!isModel);
        setTeamExecutive([])
        return;
    };
    console.log('this i smy team==================>',activeTeam)  
    const { data, isLoading, isError, error } = useQuery(
        ["tllist-member", id,activeTeam],
        () => UserServices.getTlsExecutiveList1({ tlId: id,team:activeTeam?._id }),
        { 
            enabled: !!id && !!activeTeam,
            refetchOnWindowFocus: false,
            onSuccess: (data = {}) => {
                // //console.log("Tl List", data?.data?.data)
                // setUserData(data?.data?.data?.users);
                return true;

            },
            onError: (err) => {
                if (err?.response?.status === 401) {
                    ValidateAuthenticationKey(err?.response?.status, "Your login session has expired. Please log in again.");
                } else {
                    // console.err(err?.response);
                    return false
                    // toast.error(err?.response?.data?.message || err?.message, {
                    //     delay: 10,
                    // });
                }
            },
        }
    );
    const executivesToSkip = new Set();
    const handleExecutive = async (selectedOptions) => {
        //console.log("selectedOptions", selectedOptions, teamExecutive);
        const existingExecutiveIds = new Set(teamExecutive.map(executive => executive.value));
        const selectedExecutiveIds = new Set(selectedOptions.map(option => option.value));
        const newExecutives = [];
        const executivesToSkip = new Set();

        // Determine which executives have been removed
        const removedExecutives = teamExecutive.filter(executive => !selectedExecutiveIds.has(executive.value));

        for (const option of selectedOptions) {
            const executiveId = option.value;
            //console.log("existingExecutiveIds", existingExecutiveIds, executiveId);

            if (!existingExecutiveIds.has(executiveId) && !executivesToSkip.has(executiveId)) {
                try {
                    const data = await checkExecutivePresent.mutateAsync({ projectId, executiveId,team:activeTeam?._id });

                    if (!data?.data?.error) {
                        newExecutives.push(option);
                        existingExecutiveIds.add(executiveId);
                    } else {
                        toast.error("Member already exists in the team.");
                        executivesToSkip.add(executiveId);  // Mark this executive ID to be skipped in future iterations
                    }
                } catch (error) {
                    console.error(`Error checking executive with ID ${executiveId}:`, error);
                    return;  // Exit if there's an error, you might want to handle this differently
                }
            }
        }

        // Update state with new valid executives and remove the unselected ones
        setTeamExecutive([...teamExecutive.filter(executive => !removedExecutives.includes(executive)), ...newExecutives]);
    };

    const handleSubmit = (e) => {
        e.preventDefault()
        if (teamExecutive.length == 0) {
            setShowErr("Select one team member atleast")
            return;
        }


        e.preventDefault()
        createMutation.mutate({ projectId: projectId, team:activeTeam?._id, teamExecutive: teamExecutive.map((each) => each?.value) })
    }
    const checkExecutivePresent = useMutation(
        (formdata) => ProjectServices.checkExecutivePresent(formdata),
        {
            onSuccess: (data, variables) => {
                if (data?.data?.error) {
                    // toast.error(data?.data?.message, { delay: 10 });
                    // Set the error for this specific executiveId to prevent its addition
                    executivesToSkip.add(variables.executiveId);
                }
            },
            onError: (err, variables) => {
                toast.error(err?.response?.data?.message || err?.message, { delay: 10 });
                // Assuming error means executive does not exist
            },
        }
    );

    const createMutation = useMutation(
        (formdata) => {
            return ProjectServices.updateTeamMember(formdata);
        },
        {
            onSuccess: (data) => {
                if (data?.data?.error) {
                    toast.error(data?.data?.message, { delay: 10 });
                    return;
                }
                toast.success(data?.data?.message, { delay: 10 });
                queryClient.invalidateQueries("projectdetails");
                queryClient.refetchQueries("projectdetails");
                setToggleRefetch(!toggleRefetch)


                handleClose();

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

        <Modal isOpen={isModel} size="lg" toggle={handleClose} centered>
            <ModalHeader
                close={
                    <button className="close" onClick={handleClose} type="button">
                        &times;
                    </button>
                }
                toggle={handleClose}
            >
                {!!prefill ? "Update Staff" : "Add Team Member"}
            </ModalHeader>

            <ModalBody>
                <form
                    action=""
                    className="moadal-form"
                >
                    <div className="row">
                        <div className="col-md-12 col-sm-12">
                            <div className="modal-form-left">
                                <div className="model-form-box">
                                    <Select
                                        value={teamExecutive}
                                        onChange={handleExecutive}
                                        options={
                                            isLoading ? <ButtonLoader /> : data?.data?.data?.user?.map((executive) => {
                                                return {
                                                    value: executive?._id,
                                                    label: executive?.userName || 'N/A'
                                                }
                                            })
                                        }
                                        placeholder="Select Team Member"
                                        name="team"
                                        className="basic-multi-select"
                                        classNamePrefix="select"
                                        style={{ width: "100% !important" }}
                                        isMulti
                                    />
                                    {
                                        err && <p className='text-danger'>{err}</p>
                                    }
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
                            onClick={handleSubmit}
                            className="btn modal-save-btn"
                            disabled={createMutation?.isLoading}
                        >
                            {createMutation?.isLoading ? <ButtonLoader /> : "Save"}
                        </button>
                    </div>
                </form>
            </ModalBody>
        </Modal>)
}

export default AddTeamMember