import React, { useEffect, useState } from "react";
import { Col, Modal, ModalBody, ModalHeader, Row } from "reactstrap";
import { IoCloseOutline } from "react-icons/io5";
import {
    AddTeamForm,
    AddUser,
    UpdateUser,
} from "../../helper/ValidationHelper/Validation-trim";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import customContext from "../../contexts/Context";
import TeamServices from "../../services/TeamServices";
import ButtonLoader from "../../utils/Loader/ButtonLoader";
import { useFormik } from "formik";
import DatePicker from "react-datepicker";
import { FaCalendarAlt } from "react-icons/fa";
import Select from "react-select";
import RoleServices from "../../services/RoleServices";
import { FaEye, FaEyeSlash } from "react-icons/fa6";
import moment from "moment";
import UserServices from "../../services/UserServices";
import StorageData from "../../helper/storagehelper/StorageData";
import config from "../../config";
import Generatepass from "../../utils/GeneratePassword";
import DesignationServices from "../../services/DesignationServices";
const AddStaffModel = ({ setIsModel, isModel, prefill, setPrefill }) => {
    const queryClient = useQueryClient();
    const { userData: user } = customContext()
    const [dobDate, setDobDate] = useState("");
    const [roleDropdown, setRoleDropdown] = useState([]);
    const [teamDropdown, setTeamDropdown] = useState([]);
    const [designationDropdown, setDesignationDropdown] = useState([]);
    const [reportingDropdown, setReporitngDropdown] = useState([]);
    const [role, setRole] = useState("");
    const [team, setTeam] = useState("");
    const [reportingTo, setReportingTo] = useState("");
    const [toggleEye, setToggleEye] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingTeam, setIsLoadingTeam] = useState(false);
    const [isLoadingDesignation, setIsLoadingDesignation] = useState(false);
    const [isLoadingManger, setIsLoadingManager] = useState([]);
    const [teamLeaderList, setTeamLeaderList] = useState([])
    const roleId = StorageData?.getUserData()?.role?.roleUId;
    const [designation,setDesignation]=useState("")


    const formik = useFormik({
        initialValues: {
            userName: "",
            email: "",
            phoneNumber: "",
            dateOfBirth: "",
            role: "",
            gender: "male",
            password: "",
            c_password: "",
            reportingTo: "",
            team: "",
            designation:""
        },
        validationSchema: prefill ? UpdateUser : AddUser,
        onSubmit: (values, action) => {
            if (role?.roleUId != config.Am && values.team?.length == 0) {
                formik.setFieldError("team", "Please select team")
                return
            }
            if (role?.roleUId != config.Am && values?.team?.length > 0 && values?.reportingTo == "") {
                formik.setFieldError("reportingTo", "Please select reporting to")
                return
            }

            handleSubmit(values);
        },
    });

    const handleSelectDesgination=(data)=>{
        // console.log("designations",data)
        setDesignation(data)
        formik.setFieldValue("designation",data?.value)
    }
    //Validate Team
    const handleValidation = (team) => {
        // Check if 'team' meets validation criteria
        if (!(Array.isArray(team) && team.length > 0) && !(typeof team === 'string' && team.trim() !== '')) {
            // If validation fails, set error message
            setError('Team is required');
        } else {
            // If validation passes, clear error
            setError(null);
        }
    };
    const handleClose = () => {
        setIsModel(!isModel);
        formik.resetForm();
        formik.setFieldValue("gender", "male");
        setDobDate("");
        setRole("");
        setTeam("");
        setReportingTo("");
        setPrefill("");
        setDesignation("")

        return;
    };
    const handleSelectRole = (data) => {
        setRole(data);
        // //console.log("==>", data)
        formik.setFieldValue("role", data?.value);
        setTeamLeaderList([])
        setReportingTo("")
        setTeam("");
        formik.setFieldValue("team", "");
        formik.setFieldValue("reportingTo", "");
        if (data?.roleUId == config?.Admin) {
            formik.setFieldValue("team", ["-"]);
            formik.setFieldValue("reportingTo", "-");
            return
        }
        if (data?.roleUId == config?.Am) {
            formik.setFieldValue("team", [user?._id]);
            formik.setFieldValue("reportingTo", user?._id);
            return
        }
    };
    const handleSelectTeam = (data) => {
        setTeam(data);

        formik.setFieldValue("team", [data?.value]);
        setReportingTo("");
        setTeamLeaderList([])
        formik.setFieldValue("reportingTo", "");
        return;
    };
    const handleSelectReportingTo = (data) => {
        setReportingTo(data);
        formik.setFieldValue("reportingTo", data?.value);
        return;
    };
    const handleSubmit = (data) => {
        console.log("Datat",data)
        delete data?.c_password;
        if (!!prefill) {
            // //console.log("Data==>", data);
            delete data?.password
            data.id = prefill?._id
            updateMutation.mutate(data);
            return;
        }
        createMutation.mutate(data);

        return;
    };
    const handleDob = (date) => {
        setDobDate(() => date);
        //console.log(date);
        formik.setFieldValue("dateOfBirth", date);
        return;
    };
    const handleTeamLeader = (data) => {
        setTeamLeaderList(data)
        // //console.log("Data", user, data)
        setTeam("")
        formik.setFieldValue("reportingTo", user?._id)
        formik.setFieldValue("team", data?.map((elem) => elem?.value))
        return
    }
    const createMutation = useMutation(
        (formdata) => {
            return UserServices.createStaffWithRole(formdata);
        },
        {
            onSuccess: (data) => {
                if (data?.data?.error) {
                    toast.error(data?.data?.message, { delay: 10 });
                    return;
                }
                toast.success(data?.data?.message, { delay: 10 });
                queryClient.invalidateQueries("userlist");
                queryClient.refetchQueries("userlist");
                formik.resetForm();
                handleClose();

                return;
            },
            onError: (err) => {
                // //console.log("Get", err?.response?.data?.data);
                formik.setFieldTouched("c_password", false)
                prefillPassword()
                toast.error(err?.response?.data?.message || err?.message, {
                    delay: 10,
                });
            },
        }
    );
    const updateMutation = useMutation(
        (formdata) => {
            return UserServices.updateStaff(formdata);
        },
        {
            onSuccess: (data) => {
                if (data?.data?.error) {
                    toast.error(data?.data?.message, { delay: 10 });
                    return;
                }
                toast.success(data?.data?.message, { delay: 10 });
                queryClient.invalidateQueries("userlist");
                queryClient.refetchQueries("userlist");
                formik.resetForm();
                handleClose();
                return
            },
            onError: (err) => {
                // //console.log("Get", err?.response?.data?.data);
                // formik.touched.c_password
                formik.setFieldTouched("c_password", false)

                toast.error(err?.response?.data?.message || err?.message, {
                    delay: 10,
                });
            },
        }
    );

    useEffect(() => {
        if (!!prefill) {
            // //console.log("Prefill", prefill);
            formik.setFieldValue("userName", prefill?.userName);
            formik.setFieldValue("phoneNumber", prefill?.phoneNumber);
            const utcTime = moment.utc(prefill?.dateOfBirth);
            formik.setFieldValue("email", prefill?.email);
            formik.setFieldValue("gender", prefill?.gender);
            if (prefill?.role?._id) {
                // formik.setFieldValue("reportingTo", prefill.reportingTo._id);
                setRole({
                    value: prefill?.role?._id,
                    label: prefill?.role?.roleName,
                    roleUId: prefill?.role?.roleUId

                });
                formik.setFieldValue("role", prefill?.role?._id);
            }

            if (prefill?.dateOfBirth) {
                setDobDate(new Date(prefill?.dateOfBirth));
                formik.setFieldValue("dateOfBirth", utcTime.format("YYYY-MM-DD"));
            }
            if ((prefill?.role?.roleUId !== config?.Manager) && prefill?.team) {
                // //console.log("=>",prefill?.role)
                formik.setFieldValue("team", [prefill.team[0]?._id]);
                setTeam({ value: prefill?.team[0]?._id, label: prefill?.team[0]?.name });
            }
            if (prefill?.role?.roleUId == config?.Manager && prefill?.team) {

                formik.setFieldValue("team", prefill.team?.map((elem) => elem?._id));
                setTeamLeaderList(prefill?.team?.map((elem) => {
                    return {
                        label: elem?.name,
                        value: elem?._id
                    }
                }));
            }
            if (prefill?.reportingTo?._id) {
                formik.setFieldValue("reportingTo", prefill.reportingTo._id);
                setReportingTo({
                    value: prefill?.reportingTo?._id,
                    label: prefill?.reportingTo?.userName,
                });
            }
            console.log("Prefill",prefill?.designation)
            if(prefill?.designation?.length>0){
                formik.setFieldValue("designation",prefill?.designation[0]?._id)
                setDesignation({label:prefill?.designation[0]?.name,value:prefill?.designation[0]?._id})
            }
        }
        formik.setFieldValue("gender", "male");
    }, [prefill]);
    //Role list
    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                // Check if the data exists in the cache
                const cachedData = queryClient.getQueryData(["rolelist"]);

                if (cachedData) {
                    if (roleId == config.superAdmin) {

                        setRoleDropdown(cachedData?.data?.data?.roles?.filter((each) => each?.roleUId != config.Admin));
                        return;
                    }
                    setRoleDropdown(cachedData?.data?.data?.roles?.filter((r) => r?.roleUId != config.superAdmin && r?.roleUId != config.Admin))
                } else {
                    // If data doesn't exist in cache, fetch it from the API
                    const response = await RoleServices.getList();
                    if (roleId == config.superAdmin) {
                        setRoleDropdown(response?.data?.data?.roles?.filter((each) => each?.roleUId != config.Admin));
                        return;
                    }
                    setRoleDropdown(response?.data?.data?.roles?.filter((r) => r?.roleUId != config.superAdmin && r?.roleUId != config.Admin))
                }
            } catch (error) {
                // Handle errors
                // toast.error(error?.response?.data?.message || error?.message, {
                //     delay: 10,
                // });
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // Run only once on component mount
    //Team List
    useEffect(() => {
        const fetchData = async () => {
            setIsLoadingTeam(true);
            try {
                // Check if the data exists in the cache
                const cachedData = queryClient.getQueryData(["team-list"]);

                if (cachedData) {
                    setTeamDropdown(cachedData?.data?.data?.teams);
                } else {
                    // If data doesn't exist in cache, fetch it from the API
                    const response = await TeamServices.getList();
                    setTeamDropdown(response?.data?.data?.teams);
                }
            } catch (error) {
                // Handle errors
                toast.error(error?.response?.data?.message || error?.message, {
                    delay: 10,
                });
            } finally {
                setIsLoadingTeam(false);
            }
        };

        fetchData();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // Run only once on component mount
    //Reporting Manager
    useEffect(() => {
        const fetchData = async () => {
            setIsLoadingManager(true);
            try {
                // Check if the data exists in the cache
                if (role && team) {
                    // If data doesn't exist in cache, fetch it from the API
                    const response = await UserServices.getReportingManagerList({
                        roleId: role?.value,
                        teamId: team?.value,
                    });
                    // //console.log("Response",response?.data)
                    setReporitngDropdown(response?.data?.data?.users);
                }
            } catch (error) {
                // Handle errors
                // toast.error(error?.response?.data?.message || error?.message, {
                //     delay: 10,
                // });
                setReporitngDropdown([])
            } finally {
                setIsLoadingManager(false);
            }
        };

        fetchData();
    }, [role, team]);

    const prefillPassword = () => {
        const GeneratePass = Generatepass()
        formik.setFieldValue("password", GeneratePass)
        formik.setFieldValue("c_password", GeneratePass)
    }


    useEffect(() => {
        prefillPassword()

        return () => {
            formik.setFieldValue("password", "")
            formik.setFieldValue("c_password", "")
        }

    }, [isModel])



    useEffect(() => {
        const fetchDataDesignation = async () => {
            setIsLoadingDesignation(true);
            try {
                    // If data doesn't exist in cache, fetch it from the API
                    const response = await DesignationServices.get();
                    // console.log("Response===",response?.data?.data)
                    setDesignationDropdown(response?.data?.data?.designations);
                
            } catch (error) {
                // Handle errors
                toast.error(error?.response?.data?.message || error?.message, {
                    delay: 10,
                });
            } finally {
                setIsLoadingDesignation(false);
            }
        };

        fetchDataDesignation();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // Run only once on component mount


// console.log("Designation",designationDropdown)

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
                {!!prefill ? "Update Staff" : "Add Staff"}
            </ModalHeader>

            <ModalBody>
                <form
                    action=""
                    className="moadal-form"
                    onSubmit={formik?.handleSubmit}
                >
                    <div className="row">
                        <div className={"col-lg-6 col-md-12 col-sm-12"}>
                            <div className="modal-form-left">
                                <div className="model-form-box">
                                    <input
                                        type="text"
                                        value={formik?.values?.userName}
                                        onBlur={formik.handleBlur}
                                        onChange={formik.handleChange}
                                        name="userName"
                                        placeholder="User Name"
                                        autoComplete="off"
                                        className="form-control"
                                    />
                                    {formik.touched.userName && (
                                        <p className="text-danger"> {formik.errors.userName} </p>
                                    )}
                                </div>
                                <div className="model-form-box">
                                    <input
                                        type="text"
                                        value={formik.values?.email}
                                        onBlur={formik.handleBlur}
                                        onChange={formik.handleChange}
                                        name="email"
                                        placeholder="Email"
                                        className="form-control"
                                    />
                                    {formik.touched.email && (
                                        <p className="text-danger"> {formik.errors.email} </p>
                                    )}
                                </div>
                                <div className="model-form-box">
                                    <input
                                        type="text"
                                        value={formik.values?.phoneNumber}
                                        onBlur={formik.handleBlur}
                                        onChange={formik.handleChange}
                                        name="phoneNumber"
                                        placeholder="Phone Number"
                                        className="form-control"
                                    />
                                    {formik.touched.phoneNumber && (
                                        <p className="text-danger">
                                            {" "}
                                            {formik.errors.phoneNumber}{" "}
                                        </p>
                                    )}
                                </div>
                                <div className="model-form-box">
                                    <label htmlFor="">Gender</label>
                                    <div className="CheckBox-Content">
                                        <div className="form-check">
                                            <input
                                                className="form-check-input"
                                                type="radio"
                                                name="gender"
                                                id="male"
                                                onClick={() => formik.setFieldValue("gender", "male")}
                                                checked={formik.values.gender == "male"}
                                            />
                                            <label className="form-check-label" htmlFor="male">
                                                Male
                                            </label>
                                        </div>
                                        <div className="form-check">
                                            <input
                                                className="form-check-input"
                                                type="radio"
                                                name="gender"
                                                id="female"
                                                onClick={() =>
                                                    formik.setFieldValue("gender", "female")
                                                }
                                                checked={formik.values.gender == "female"}
                                            />
                                            <label className="form-check-label" htmlFor="female">
                                                Female
                                            </label>
                                        </div>
                                        <div className="form-check">
                                            <input
                                                className="form-check-input"
                                                type="radio"
                                                name="gender"
                                                id="other"
                                                onClick={() =>
                                                    formik.setFieldValue("gender", "other")
                                                }
                                                checked={formik.values.gender == "other"}
                                            />
                                            <label className="form-check-label" htmlFor="other">
                                                Other
                                            </label>
                                        </div>
                                        {formik.touched.gender && (
                                            <p className="text-danger"> {formik.errors.gender} </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="col-lg-6 col-md-12 col-sm-12">
                            <div className="modal-form-right">
                                {/* <label>Date of Birth</label> */}
                                {/* <div className="model-form-box mb-3">
                                    <DatePicker
                                        placeholderText="Enter  Dob"
                                        showIcon
                                        autoComplete="off"
                                        icon={<FaCalendarAlt />}
                                        maxDate={new Date()}
                                        className="date-picker-input"
                                        selected={dobDate}
                                        onChange={handleDob}
                                    />

                                    {formik.touched.dateOfBirth && (
                                        <p className="text-danger">
                                            {" "}
                                            {formik.errors.dateOfBirth}{" "}
                                        </p>
                                    )}
                                </div> */}
                                {!!!prefill && (
                                    <>
                                        <div className="model-form-box mb-3">
                                            <div className="input-group">
                                                <input
                                                    type={toggleEye ? "text" : "password"}
                                                    value={formik.values?.password}
                                                    onBlur={formik.handleBlur}
                                                    onChange={formik.handleChange}
                                                    name="password"
                                                    placeholder="Password"
                                                    className="form-control"
                                                />
                                                {toggleEye ? (
                                                    <FaEye onClick={() => setToggleEye(!toggleEye)} />
                                                ) : (
                                                    <FaEyeSlash
                                                        onClick={() => setToggleEye(!toggleEye)}
                                                    />
                                                )}
                                            </div>
                                            {formik.touched.password && (
                                                <p className="text-danger">
                                                    {" "}
                                                    {formik.errors.password}{" "}
                                                </p>
                                            )}
                                        </div>
                                        <div className="model-form-box mb-2">
                                            <input
                                                type="password"
                                                value={formik.values?.c_password}
                                                onBlur={formik.handleBlur}
                                                onChange={formik.handleChange}
                                                name="c_password"
                                                placeholder="Confirm Password"
                                                className="form-control"
                                            />
                                            {formik.touched.c_password && (
                                                <p className="text-danger">
                                                    {" "}
                                                    {formik.errors.c_password}{" "}
                                                </p>
                                            )}
                                        </div>
                                        
                                        {/* <div className="model-form-box mt-3 ">
                                            <input
                                                type="text"
                                                value={formik.values?.designation}
                                                onBlur={formik.handleBlur}
                                                onChange={formik.handleChange}
                                                name="designation"
                                                placeholder="Enter Designation"
                                                className="form-control"
                                            />
                                            {formik.touched.designation && (
                                                <p className="text-danger">
                                                    {" "}
                                                    {formik.errors.designation}{" "}
                                                </p>
                                            )}
                                        </div> */}
                                    </>
                                )}
                            </div>
                        </div>

                        <div className="col-lg-4 col-md-4 col-sm-12">
                            {/* Select Role */}
                            <div
                                className="modal-form-box"
                                style={{
                                    display: "flex",
                                    alignItems: "flex-start",
                                    justifyContent: "centeflex-start",
                                    flexDirection: "column",
                                    width: "100%",
                                }}
                            >
                                {!isLoading && (
                                    <Select
                                        value={role}
                                        onChange={handleSelectRole}
                                        options={roleDropdown?.map((elem) => {

                                            return {
                                                value: elem?._id,
                                                label: elem?.roleName || "N/A",
                                                roleUId: elem?.roleUId
                                            };
                                        })}
                                        placeholder="Select Role"
                                        name="role"
                                        className="basic-multi-select"
                                        classNamePrefix="select"
                                        style={{ width: "100% !important" }}
                                    />
                                )}
                                {formik.touched.role && (
                                    <p className="text-danger"> {formik.errors.role}</p>
                                )}
                            </div>
                        </div>

                        <div className="col-lg-4 col-md-4 col-sm-12">
                            {/* Select team */}
                            {
                                (role?.roleUId != config.Admin && role?.roleUId !== config.Am) && (role?.roleUId == config?.Manager ? <div
                                    className="modal-form-box"
                                    style={{
                                        display: "flex",
                                        alignItems: "flex-start",
                                        justifyContent: "centeflex-start",
                                        flexDirection: "column",
                                        width: "100%",
                                    }}
                                >
                                    {!isLoadingTeam && (
                                        <Select
                                            value={teamLeaderList}
                                            onChange={handleTeamLeader}
                                            options={teamDropdown?.map((elem) => {
                                                return {
                                                    value: elem?._id,
                                                    label: elem?.name || "N/A",
                                                };
                                            })}
                                            placeholder="Select Team"
                                            name="team"
                                            className="basic-multi-select"
                                            classNamePrefix="select"
                                            style={{ width: "100% !important" }}
                                            isDisabled={!!!formik.values.role}
                                            isMulti
                                        />
                                    )}
                                    {formik.touched.team && (
                                        <p className="text-danger"> {formik.errors.team}</p>
                                    )}
                                </div> : <div
                                    className="modal-form-box"
                                    style={{
                                        display: "flex",
                                        alignItems: "flex-start",
                                        justifyContent: "centeflex-start",
                                        flexDirection: "column",
                                        width: "100%",
                                    }}
                                >
                                    {!isLoadingTeam && (
                                        <Select
                                            value={team}
                                            onChange={handleSelectTeam}
                                            options={teamDropdown?.map((elem) => {
                                                return {
                                                    value: elem?._id,
                                                    label: elem?.name || "N/A",
                                                };
                                            })}
                                            placeholder="Select Team"
                                            name="team"
                                            className="basic-multi-select"
                                            classNamePrefix="select"
                                            style={{ width: "100% !important" }}
                                            isDisabled={!!!formik.values.role}
                                        />
                                    )}
                                    {formik.touched.team && (
                                        <p className="text-danger"> {formik.errors.team}</p>
                                    )}
                                </div>)
                            }
                        </div>


                        <div className="col-lg-4 col-md-4 col-sm-12">
                            {/* Reporting Manager */}
                            <div
                                className="modal-form-box"
                                style={{
                                    display: "flex",
                                    alignItems: "flex-start",
                                    justifyContent: "centeflex-start",
                                    flexDirection: "column",
                                    width: "100%",
                                }}
                            >
                                {!isLoadingManger && (
                                    (role?.roleUId !== config?.Manager && role?.roleUId !== config.Admin && role?.roleUId !== config.Am) && <Select
                                        value={reportingTo}
                                        onChange={handleSelectReportingTo}
                                        options={reportingDropdown?.map((elem) => {
                                            return {
                                                value: elem?._id,
                                                label: elem?.userName || "N/A",

                                            };
                                        })}
                                        placeholder="Select Reporting To"
                                        name="reportingTo"
                                        className="basic-multi-select"
                                        classNamePrefix="select"
                                        style={{ width: "100% !important" }}
                                        isDisabled={
                                            !!formik.values.role && !!formik.values.team
                                                ? false
                                                : true
                                        }
                                    />
                                )}
                                {formik.touched.reportingTo && (
                                    <p className="text-danger"> {formik.errors.reportingTo}</p>
                                )}
                            </div>
                        </div>

                        <div className="col-lg-4 col-md-4 col-sm-12">
                            {/* Reporting Manager */}
                            <div
                                className="modal-form-box"
                                style={{
                                    display: "flex",
                                    alignItems: "flex-start",
                                    justifyContent: "centeflex-start",
                                    flexDirection: "column",
                                    width: "100%",
                                }}
                            >
                                {!isLoadingDesignation && (
                                    <Select
                                        value={designation}
                                        onChange={handleSelectDesgination}
                                        options={designationDropdown?.map((elem) => {
                                            return {
                                                value: elem?._id,
                                                label: elem?.name || "N/A",

                                            };
                                        })}
                                        placeholder="Select Designation"
                                        name="designation"
                                        className="basic-multi-select"
                                        classNamePrefix="select"
                                        style={{ width: "100% !important" }}
                                       
                                    />
                                )}
                                {formik.touched.designation && (
                                    <p className="text-danger"> {formik.errors.designation}</p>
                                )}
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
                            disabled={
                                createMutation?.isLoading || updateMutation?.isLoading
                            }
                            className="btn modal-save-btn"
                        >
                            {createMutation?.isLoading || updateMutation?.isLoading ? (
                                <ButtonLoader />
                            ) : (
                                "Save"
                            )}
                        </button>
                    </div>
                </form>
            </ModalBody>
        </Modal>

    );
};

export default AddStaffModel;
