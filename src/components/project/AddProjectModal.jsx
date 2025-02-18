import React, { useEffect, useRef, useState } from "react";
import { Col, Modal, ModalBody, ModalHeader, Row } from "reactstrap";
import { IoCloseOutline } from "react-icons/io5";
import {
  AddProjectForm,
  AddUser,
  UpdateUser,
} from "../../helper/ValidationHelper/Validation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import customContext from "../../contexts/Context";
import TeamServices from "../../services/TeamServices";
import ButtonLoader from "../../utils/Loader/ButtonLoader";
import { useFormik } from "formik";
import Select from "react-select";
import UserServices from "../../services/UserServices";
import CurrencyServices from "../../services/Currencyservices";
import ProjectServices from "../../services/ProjectServices";
import moment from "moment";
import { FaRegTrashCan } from "react-icons/fa6";
import { useMemo } from "react";
import StorageData from "../../helper/storagehelper/StorageData";
import config from "../../config";
const AddProjectModal = ({ setIsModel, isModel, prefill, setPrefill }) => {
  const projectStatusValue = [
    { label: "Not Started", value: "not_started" },
    { label: "Ongoing", value: "ongoing" },
    { label: "Complete", value: "complete" },
    { label: "Hold", value: "hold" },
    { label: "Waiting for Feedback", value: "waiting_for_feedback" },
  ];
  const queryClient = useQueryClient();
  const { userData } = customContext();
  const loggedUserId = StorageData?.getUserData()?._id;
  const tlUId=config.teamLeader;
  const managerUId=config.Manager;

  const [teamLeaderList, setTeamLeaderList] = useState([]);
  const [teamDropdown, setTeamDropdown] = useState([]);
  const [allTeamDropdown, setAllTeamDropdown] = useState([]);
  const [myTeamnLeaderList, setMyTeamnLeaderList] = useState([
    {
      team: "",
      teamLeader: "",
      time: "",
    },
  ]);
  const [availableTeamLeaders, setAvailableTeamLeaders] = useState({});
  const [isLoadingTeam, setIsLoadingTeam] = useState(false);
  const [amsData, setAmsData] = useState("");
  const [pmsData, setPmsData] = useState("");
  const [priceType, setPriceType] = useState("fixed");
  const [errors, setErrors] = useState([]);
  const [makeDisableExistingTeam, setMakeDisableExistingTeam] = useState([]);
  const [prefillTeamsList, setPrefillTeamList] = useState([]);
  const [costCurrency, setCostCurrency] = useState({
    value: "",
    type: "USD",
  });
  const [triggerProjectNameSuggestion, setTriggerProjectNameSuggestion] =
    useState("");
  const [nameSuggestionLoader, setProjectNameSuggetionLoader] = useState(false);
  const [projectNameSuggestion, setProjectNameSuggestion] = useState([]);
  const [toggleDrop, setToggleDrop] = useState(false);

  const [projectStatus, setProjectStatus] = useState("");
  const [id, setId] = useState("");

  const handleProjectStatus = (data) => {
    setProjectStatus(data);
  };
  const [priceTypeList] = useState([
    {
      name: "fixed",
      id: 1,
      feature: "Fixed",
    },
    {
      name: "hourly",
      id: 2,
      feature: "Hourly",
    },
  ]);
  const formik = useFormik({
    initialValues: {
      name: "",
      customerName: "",
      customerEmail: "",
      customerPhoneNumber: "",
      assistantManagerId: "",
      teams: [],
      priceType: "fixed",
      estimatedTime: "",
      comments: "",
      currencyType: "USD",
      price: "0",
      startDate: "",
      endDate: "",
      subManagers: [],
    },
    validationSchema: AddProjectForm,
    onSubmit: (values, action) => {
      if (new Date(values.startDate) > new Date(values.endDate)) {
        formik.setFieldError(
          "startDate",
          `Start Date cannot be greater than End Date`
        );
        return false;
      }
      handleSubmit(values);
    },
  });

  const handleClose = () => {
    setIsModel(!isModel);
    formik.resetForm();
    setTeamLeaderList([]);
    setAmsData("");
    setPmsData("");
    setCostCurrency({ type: "USD", value: "" });
    setPriceType("");
    setPrefill(null);
    setProjectStatus("");
    setMyTeamnLeaderList([
      {
        team: "",
        teamLeader: null,
        time: "",
      },
    ]);
    setAvailableTeamLeaders({});
    setErrors("");
    setToggleDrop(false);
    setId("");
    setProjectNameSuggetionLoader(false);
    setProjectNameSuggestion([]);
    setTriggerProjectNameSuggestion("");

    return;
  };

  const handleSubmit = (data) => {
    // Replace empty strings with null
    const formattedTeamLeaderList = myTeamnLeaderList.map((item) => ({
      ...item,
      teamLeader: item.teamLeader === "" ? null : item.teamLeader,
      time: item.time === "" ? 0 : parseInt(item.time),
    }));
    const sumOfTime = formattedTeamLeaderList.reduce(
      (acc, item) => acc + parseInt(item.time),
      0
    );

    if (!validateFields(formattedTeamLeaderList)) {
      return;
    }
    if (false) {
      formik.setFieldError(
        "estimatedTime",
        "Estimated Time Should Greater than or Equal to Team Total TIme"
      );
      return;
    } else {
      // data.estimatedTime = sumOfTime;
      data.teams = formattedTeamLeaderList;
      // //console.log("data",data)

      if (!!prefill) {
        //console.log("data", data)
        const addMember = prefill?.teams?.map((each) => {
          return {
            teamLeader: each?.teamLeader?._id,
            members: each?.members,
            team: each?.team?._id,
          };
        });
        const result = [];
        const finalStructure = addMember.forEach((item1) => {
          const matchingItem = data?.teams.find(
            (item) => item.teamLeader === item1.teamLeader
          );
          if (matchingItem) {
            result.push({
              team: matchingItem?.team,
              teamLeader: matchingItem.teamLeader,
              member: item1?.members,
            });
          }
        });
        //console.log("addMember", result)

        updateMutation?.mutate({
          status: projectStatus?.value,
          ...data,
          id: prefill?._id,
          projectManagerId: userData?._id,
        });
        return;
      }

      createMutation.mutate({ ...data, projectManagerId: userData?._id });
      return;
    }
  };
  const handleSelectAms = (data) => {
    setAmsData(data);
    formik.setFieldValue("assistantManagerId", data?.value);
    return;
  };
  const handleSelectPms = (data) => {
    setPmsData(data);
    formik.setFieldValue(
      "subManagers",
      data?.map((ele) => ele?.value)
    );
    return;
  };
  const handleCurrency = (e) => {
    setCostCurrency({ ...costCurrency, [e?.target?.name]: e.target?.value });
    if (e?.target?.name == "type") {
      formik.setFieldValue("currencyType", e?.target?.value);
    }
    if (e?.target?.name == "value") {
      formik.setFieldValue("price", e?.target?.value);
    }
  };
  const handlePriceType = (data) => {
    setPriceType(data);
    formik.setFieldValue("priceType", data?.value);
    return;
  };
  const handleAddMore = () => {
    if (!validateFields(myTeamnLeaderList)) {
      return;
    }
    setMyTeamnLeaderList([
      ...myTeamnLeaderList,
      { team: "", teamLeader: "", time: "", isNew: true },
    ]);
  };

  const validateFields = (list) => {
    const newErrors = list.map((item) => ({
      team: !item.team ? "Team is required" : "",
      time: !item.time
        ? "Time is required"
        : isNaN(item.time)
        ? "Time must be a valid number"
        : "", // Validation for 'time' required and must be a number
       teamLeader: !item.teamLeader ? "Team Leader is required" : "", // Validation for 'teamLeader' required
    }));
    setErrors(newErrors);
    return newErrors.every(
      (error) => !error.team && !error.time && !error.teamLeader
    ); // Check 'team', 'time' and 'teamLeader' errors
  };

  const handleTime = (value, index, time) => {
    const newTeamLeaderList = [...myTeamnLeaderList];
    newTeamLeaderList[index].time = value;

    //console.log("show teamleader List1============>", newTeamLeaderList);
    setMyTeamnLeaderList(newTeamLeaderList);
    const sumOfTime = newTeamLeaderList.reduce(
      (acc, item) => acc + parseInt(item.time),
      0
    );
    //formik.setFieldValue("estimatedTime", sumOfTime || 0);
    return;
  };
  const handleTeamChange = (index, data) => {
    // console.log(findIsLoggedInUserTeam, "findIsLoggedInUserTeam");

    const newTeamLeaderList = [...myTeamnLeaderList];
    newTeamLeaderList[index].team = data.value;
    newTeamLeaderList[index].teamLeader = ""; // Reset the team leader when team changes
    //console.log("show teamleader List2============>", newTeamLeaderList);
    setMyTeamnLeaderList(newTeamLeaderList);
    // Optionally, remove the corresponding entry from availableTeamLeaders
    setAvailableTeamLeaders((prevState) => {
      const newState = { ...prevState };
      delete newState[index];
      return newState;
    });
    formik.setFieldValue("teams", newTeamLeaderList);

    // Fetch the team leaders for the selected team
    fetchTeamLeaders(data.value, index);
  };
  const handleTeamLeaderChange = (index, data) => {
    //console.warn(data)
    const teamLeaderExists = myTeamnLeaderList.find(
      (team) => team.teamLeader === data.value && team.team === myTeamnLeaderList[index].team
    );
    if (teamLeaderExists) {
      toast.error("The teamLeader has already exist.");
      return;
    } else {
      const newTeamLeaderList = [...myTeamnLeaderList];
      newTeamLeaderList[index].teamLeader = data.value;
     // console.log("show teamleader List3============>", newTeamLeaderList);
      setMyTeamnLeaderList(newTeamLeaderList);
    }
  };
  const handleRemove = async (index) => {
    if (!!prefill) {
      const newTeamLeaderList = myTeamnLeaderList.filter((_, i) => i !== index);
      const removedTeamLeader = myTeamnLeaderList.find((_, i) => i == index);
      const sendData = {
        projectId: prefill?._id,
        team: removedTeamLeader?.team,
        teamlead: removedTeamLeader?.teamLeader,
      };

      try {
        const response = await checkTeamHasMilestone.mutateAsync(sendData);
        if (response?.data?.error) {
          toast.error("The team has been assigned a milestone.");
          return;
        } else {
         // console.log("show teamleader List4============>", newTeamLeaderList);
          setMyTeamnLeaderList(newTeamLeaderList);
          // Optionally, remove the corresponding entry from availableTeamLeaders
          setAvailableTeamLeaders((prevState) => {
            const newState = { ...prevState };
            delete newState[index];
            return newState;
          });
          const sumOfTime = newTeamLeaderList.reduce(
            (acc, item) => acc + parseInt(item.time),
            0
          );
          // formik.setFieldValue("estimatedTime", sumOfTime || 0);

          const prefillTeamnLeader = newTeamLeaderList.map((elem) => ({
            team: elem.team,
            teamLeader: elem.teamLeader || null,
            time: elem?.time || null,
          }));
          updateAvailableTeamLeaders(prefillTeamnLeader);
          return;
        }
      } catch (error) {
        console.error(
          `Error checking team with ID ${removedTeamLeader?._id}:`,
          error
        );
        return; // Exit if there's an error, you might want to handle this differently
      }
    }
    const newTeamLeaderList = myTeamnLeaderList.filter((_, i) => i !== index);
    //console.log("show teamleader List5============>", newTeamLeaderList);
    setMyTeamnLeaderList(newTeamLeaderList);
    // Optionally, remove the corresponding entry from availableTeamLeaders
    setAvailableTeamLeaders((prevState) => {
      const newState = { ...prevState };
      delete newState[index];
      return newState;
    });
    // //console.log("newTeamLeaderList", newTeamLeaderList)
    const prefillTeamnLeader = newTeamLeaderList.map((elem) => ({
      team: elem.team,
      teamLeader: elem.teamLeader || null,
      time: elem?.time || null,
    }));
    const sumOfTime = newTeamLeaderList.reduce(
      (acc, item) => acc + parseInt(item.time),
      0
    );
    //formik.setFieldValue("estimatedTime", sumOfTime || 0);

    updateAvailableTeamLeaders(prefillTeamnLeader);
  };

  const updateAvailableTeamLeaders = async (teams) => {
    const leaders = await Promise.all(
      teams.map(async (team, index) => {
        const teamLeaders = await fetchTeamLeaders(team.team, index);
        return teamLeaders?.map((leader) => ({
          value: leader._id,
          label: leader.userName,
        }));
      })
    );
    // setAvailableTeamLeaders(leaders);
  };
  //Get Currency List
  const { data: currency, isLoading: isLoadingCurrency } = useQuery(
    ["currencytype"],
    () => CurrencyServices.get(),
    {
      refetchOnWindowFocus: false,
      onSuccess: (data) => {
        // //console.log("My Daa===>", data?.data?.data?.currency);
      },
      onError: (err) => {
        // //console.log(err);
        toast.error(err?.response?.data?.message || err?.message, {
          delay: 10,
        });
      },
    }
  );
  //Get Am List
  const { data: AmsList, isLoading: isLoadingAms } = useQuery(
    ["amsList"],
    () => UserServices.getAmsList(),
    {
      refetchOnWindowFocus: false,
      onSuccess: (data) => {
        // //console.log("My Ams List===>", data?.data?.data);
      },
      onError: (err) => {
        // //console.log(err);
        // toast.error(err?.response?.data?.message || err?.message, {
        //     delay: 10,
        // });
      },
    }
  );
  //Get Manager List
  const { data: PmsList, isLoading: isLoadingPms } = useQuery(
    ["pmsList"],
    () => UserServices.getPmList(),
    {
      refetchOnWindowFocus: false,
      onSuccess: (data) => {
        // //console.log("My Ams List===>", data?.data?.data);
      },
      onError: (err) => {
        // //console.log(err);
        // toast.error(err?.response?.data?.message || err?.message, {
        //     delay: 10,
        // });
      },
    }
  );
  // //Get Tl List
  // const { data: TlsList, isLoading: isLoadingTls } = useQuery(
  //     ["tlsList"],
  //     () => UserServices.getTlsList(),
  //     {
  //         refetchOnWindowFocus: false,
  //         onSuccess: (data) => {
  //             // //console.log("My Tls List===>", data?.data?.data);
  //         },
  //         onError: (err) => {
  //             //console.log(err);
  //             toast.error(err?.response?.data?.message || err?.message, {
  //                 delay: 10,
  //             });
  //         },
  //     }
  // );
  const createMutation = useMutation(
    (formdata) => {
      return ProjectServices.create(formdata);
    },
    {
      onSuccess: (data) => {
        if (data?.data?.error) {
          toast.error(data?.data?.message, { delay: 10 });
          return;
        }
        toast.success(data?.data?.message, { delay: 10 });
        queryClient.invalidateQueries("projectlist");
        queryClient.refetchQueries("projectlist");
        formik.resetForm();
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
  const checkTeamHasMilestone = useMutation(
    (formdata) => {
      return ProjectServices.checkTeamHasMilestone(formdata);
    },
    {
      onSuccess: (data) => {
        return;
      },
      onError: (err) => {
        // //console.log("Get", err?.response?.data?.data);
        // toast.error(err?.response?.data?.message || err?.message, {
        //     delay: 10,
        // });
      },
    }
  );
  const updateMutation = useMutation(
    (formdata) => {
      return ProjectServices.update(formdata);
    },
    {
      onSuccess: (data) => {
        formik.resetForm();
        if (data?.data?.error) {
          toast.error(data?.data?.message, { delay: 10 });
          return;
        }
        toast.success(data?.data?.message, { delay: 10 });
        handleClose();
        queryClient.invalidateQueries("projectlist");
        queryClient.refetchQueries("projectlist");
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
  useEffect(() => {
    //console.log(prefill)
    if (!!prefill) {
      formik.setFieldValue("name", prefill?.name);
      formik.setFieldValue("customerName", prefill?.customerName);
      formik.setFieldValue("customerEmail", prefill?.customerEmail);
      formik.setFieldValue("customerPhoneNumber", prefill?.customerPhoneNumber);
      formik.setFieldValue("projectManagerId", prefill?.projectManagerId?._id);
      formik.setFieldValue("estimatedTime", prefill?.estimatedTime);
      formik.setFieldValue("comments", prefill?.comments);
      formik.setFieldValue("startDate", prefill?.startDate);
      formik.setFieldValue("endDate", prefill?.endDate);
      // formik.setFieldValue("comment", prefill?.comments);
      setProjectStatus(
        projectStatusValue.find((each) => each.value == prefill?.status)
      );

      if (!!prefill?.assistantManagerId) {
        formik.setFieldValue(
          "assistantManagerId",
          prefill?.assistantManagerId?._id
        );
        setAmsData({
          value: prefill?.assistantManagerId?._id,
          label: prefill?.assistantManagerId?.userName,
        });
      }
      if (!!prefill?.subManagers?.length > 0) {
        formik.setFieldValue(
          "subManagers",
          prefill?.subManagers?.map((ele) => {
            return ele?._id;
          })
        );

        setPmsData(
          prefill?.subManagers?.map((ele) => {
            return {
              value: ele?._id,
              label: ele?.userName,
            };
          })
        );
      }
      if (!!prefill?.projectManagerId) {
        formik.setFieldValue(
          "projectManagerId",
          prefill?.projectManagerId?._id
        );
      }
      if (!!prefill?.startDate) {
        const Sdate = moment(prefill?.startDate).format("YYYY-MM-DD");
        formik.setFieldValue("startDate", Sdate);
      }
      if (!!prefill?.endDate) {
        const Edate = moment(prefill?.endDate).format("YYYY-MM-DD");

        formik.setFieldValue("endDate", Edate);
      }
      if (!!prefill?.currencyType && !!prefill?.price) {
        formik.setFieldValue("currencyType", prefill?.currencyType);
        formik.setFieldValue("price", prefill?.price);
        setCostCurrency({ value: prefill?.price, type: prefill?.value });
      }
      // if (!!prefill?.priceType) {
      //     formik.setFieldValue("priceType", prefill?.priceType);
      //     setPriceType({
      //         label: prefill?.priceType?.toUpperCase(),
      //         value: prefill?.priceType,
      //     });
      // }
      if (prefill?.teams) {
        // console.log(prefill, "prefillprefillprefill");
        const prefillTeamnLeader = prefill.teams.map((elem) => ({
          team: elem.team?._id,
          teamLeader: elem.teamLeader?._id || null,
          time: elem?.time || null,
        }));
        formik.setFieldValue("teams", prefillTeamnLeader);
        updateAvailableTeamLeaders(prefillTeamnLeader);
        setMyTeamnLeaderList(prefillTeamnLeader);
        setMakeDisableExistingTeam(prefillTeamnLeader);
        setPrefillTeamList(prefill.teams);
      }
    }
  }, [prefill]);
  //Team List
  useEffect(() => {
    const fetchData = async () => {
      setIsLoadingTeam(true);
      try {
        // Check if the data exists in the cache
        const cachedData = queryClient.getQueryData(["team-list"]);

        if (cachedData) {
          setTeamDropdown(
            userData?.team.map((team) => ({
              value: team._id,
              label: team.name,
            }))
          );
          setAllTeamDropdown(
            cachedData.data.data.teams.map((team) => ({
              value: team._id,
              label: team.name,
            }))
          );
        } else {
          // If data doesn't exist in cache, fetch it from the API
          const response = await TeamServices.getTeamList();
          setAllTeamDropdown(
            response.data.data.teams.map((team) => ({
              value: team._id,
              label: team.name,
            }))
          );
          setTeamDropdown(
            userData?.team.map((team) => ({
              value: team._id,
              label: team.name,
            }))
          );
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
  }, []); // Run only once on component mount

  // Function to fetch team leaders based on team
  const fetchTeamLeaders = async (team, index) => {
    // Simulate an API call
    // setIsLoadingTeam(true);
    try {
      const response = await UserServices.getTlsList({ teamId: team });



      setAvailableTeamLeaders((prevState) => ({
        ...prevState,
        [index]: response?.data?.data?.TlList?.map((each) => {
          
          if(each?.role?.roleUId === tlUId  || prefill?.teams.find(tm => tm.team._id == team && tm.teamLeader._id == each?._id  )){
            if(loggedUserId == each?._id){
              return {
                value: each?._id,
                label: 'SELF',
              };
            }else{
              return {
                value: each?._id,
                label: each?.userName,
              };

            }
          
          }else if(prefill == null || prefill?.teams ==undefined){
            if(loggedUserId == each?._id){
              return {
                value: each?._id,
                label: 'SELF',
              };

            }
          }else{
          
            if(loggedUserId == each?._id && each?.role?.roleUId == managerUId ){
               if(prefill?.projectManagerId?._id == each?._id){
                console.log("Response1", prefill.subManagers,  each?._id,prefill.subManagers.find(submanager => submanager._id == each?._id), Array.isArray(prefill?.subManagers) )
                return {
                  value: each?._id,
                  label: 'SELF',
                };
              }else if(Array.isArray(prefill?.subManagers) && prefill?.subManagers.length > 0){
                console.log("Response0",each?._id,prefill?.projectManagerId?._id)
                if(prefill.subManagers.find(submanager => submanager._id == each?._id)) {
                  console.log("Response", prefill.subManagers,  each?._id,prefill.subManagers.find(submanager => submanager._id == each?._id), Array.isArray(prefill?.subManagers) )
                  return {
                    value: each?._id,
                    label: 'SELF',
                  };
                }
              }
            
              return false;

            }else{
              return false;
            }
            
          }

         
        }).filter(Boolean),
      }));
    } catch (error) {
      // Handle errors
      // //console.log(error?.message)
      // toast.error(error?.response?.data?.message || error?.message, {
      //     delay: 10,
      // });
    } finally {
      // setIsLoadingTeam(false);
    }
  };

  const getPrefillproject = () => {
    setToggleDrop(false);
  };

  const getProjectNameSuggestion = async () => {
    setProjectNameSuggetionLoader(true);
    const data = await ProjectServices.getProjectNameSuggestion({
      keyword: formik?.values?.name,
    });
    // console.log("==>Project Suggestion", data?.data);
    setProjectNameSuggestion(data?.data?.data?.ProjectSuggestion);
    setProjectNameSuggetionLoader(false);
  };
  useEffect(() => {
    let timeoutId = null;

    const delayedFetch = () => {
      setToggleDrop(true);
      timeoutId = setTimeout(getProjectNameSuggestion, 1000);
    };

    if (triggerProjectNameSuggestion.length > 1) {
      delayedFetch();
    } else {
      setProjectNameSuggestion([]);
      setToggleDrop(false);
    }

    return () => clearTimeout(timeoutId);
  }, [triggerProjectNameSuggestion]);

  const handleInputChange = (event) => {
    formik.handleChange(event);
    setTriggerProjectNameSuggestion(event.target.value);
  };

  const handleBodyClick = (event) => {
    if (
      !event.target.closest("#exampleDataList") &&
      !event.target.closest(".searchable-list")
    ) {
      setToggleDrop(false);
    }
  };

  useEffect(() => {
    document.body.addEventListener("click", handleBodyClick);
    return () => {
      document.body.removeEventListener("click", handleBodyClick);
    };
  }, []);

  return (
    <Modal
      isOpen={isModel}
      size="lg"
      toggle={handleClose}
      centered
      backdrop="static"
      keyboard={false}
    >
      <ModalHeader
        close={
          <button className="close" onClick={handleClose} type="button">
            &times;
          </button>
        }
        toggle={handleClose}
      >
        {!!prefill ? "Update Project" : "Add Project"}
      </ModalHeader>
      <ModalBody className="cstm-change">
        <form action="" className="moadal-form" onSubmit={formik?.handleSubmit}>
          <div className="row">
            <div className="col-md-6">
              <div className="model-form-box mb-3">
                <div className="searchable">
                  <input
                    type="text"
                    value={formik?.values?.name}
                    onBlur={formik.handleBlur}
                    onChange={(e) => {
                      if (
                        prefill &&
                        prefill?.projectManagerId?._id != loggedUserId
                      ) {
                        // console.log(
                        //   prefill?.projectManagerId?._id == loggedUserId
                        // );
                        return;
                      }
                      formik.handleChange(e);
                    }}
                    name="name"
                    disabled={
                      prefill && prefill?.projectManagerId?._id != loggedUserId
                    }
                    placeholder="Project Name"
                    autoComplete="off"
                    className="form-control"
                    id="exampleDataList"
                    list="datalistOptions"
                    // ref={inputRef}
                  />

                  {toggleDrop && (
                    <ul className="searchable-list">
                      {/* <p onClick={()=>setToggleDrop(false)}>X</p> */}
                      {nameSuggestionLoader ? (
                        <ButtonLoader />
                      ) : (
                        projectNameSuggestion?.map((project) => (
                          <li
                            key={project?._id}
                            onClick={() => getPrefillproject()}
                          >
                            {project?.name || "N/A"}
                            {/* {project?.fields?.projectCostPrice || 0}) */}
                          </li>
                        ))
                      )}
                    </ul>
                  )}
                  {formik.touched.name && (
                    <p className="text-danger"> {formik.errors.name} </p>
                  )}
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="model-form-box mb-3">
                <input
                  type="text"
                  value={formik?.values?.customerName}
                  onBlur={formik.handleBlur}
                  onChange={(e) => {
                    if (
                      prefill &&
                      prefill?.projectManagerId?._id != loggedUserId
                    ) {
                      return;
                    }
                    formik.handleChange(e);
                  }}
                  disabled={
                    prefill && prefill?.projectManagerId?._id != loggedUserId
                  }
                  name="customerName"
                  placeholder="Customer Name"
                  autoComplete="off"
                  className="form-control"
                  onFocus={() => setToggleDrop(false)}
                />
                {formik.touched.customerName && (
                  <p className="text-danger"> {formik.errors.customerName} </p>
                )}
              </div>
            </div>
            <div className="col-md-6">
              <div className="model-form-box mb-3">
                <input
                  type="text"
                  value={formik.values?.customerEmail}
                  onBlur={formik.handleBlur}
                  onChange={(e) => {
                    if (
                      prefill &&
                      prefill?.projectManagerId?._id != loggedUserId
                    ) {
                      return;
                    }
                    formik.handleChange(e);
                  }}
                  disabled={
                    prefill && prefill?.projectManagerId?._id != loggedUserId
                  }
                  name="customerEmail"
                  placeholder="Customer Email "
                  className="form-control"
                  onFocus={() => setToggleDrop(false)}
                />
                {formik.touched.customerEmail && (
                  <p className="text-danger"> {formik.errors.customerEmail} </p>
                )}
              </div>
            </div>
            <div className="col-md-6">
              <div className="model-form-box mb-3">
                <input
                  type="text"
                  value={formik.values?.customerPhoneNumber}
                  onBlur={formik.handleBlur}
                  onChange={(e) => {
                    if (
                      prefill &&
                      prefill?.projectManagerId?._id != loggedUserId
                    ) {
                      return;
                    }
                    formik.handleChange(e);
                  }}
                  disabled={
                    prefill && prefill?.projectManagerId?._id != loggedUserId
                  }
                  name="customerPhoneNumber"
                  placeholder="Phone Number"
                  className="form-control"
                  onFocus={() => setToggleDrop(false)}
                />
                {formik.touched.customerPhoneNumber && (
                  <p className="text-danger">
                    {" "}
                    {formik.errors.customerPhoneNumber}{" "}
                  </p>
                )}
              </div>
            </div>

            {/* Select  Managers */}
            <div className="col-md-12">
              <div
                className="modal-form-box mb-3"
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  justifyContent: "centeflex-start",
                  flexDirection: "column",
                  width: "100%",
                }}
              >
                {!isLoadingPms && (
                  <Select
                    onChange={(e) => {
                      if (
                        prefill &&
                        prefill?.projectManagerId?._id != loggedUserId
                      ) {
                        return;
                      }
                      handleSelectPms(e);
                    }}
                    value={pmsData}
                    isDisabled={
                      prefill && prefill?.projectManagerId?._id != loggedUserId
                    }
                    isMulti
                    options={PmsList?.data?.data?.managerList?.map((elem) => {
                      return {
                        value: elem?._id,
                        label: elem?.userName || "N/A",
                      };
                    })}
                    placeholder="Select Manager"
                    name="subManagers"
                    className="basic-multi-select"
                    classNamePrefix="select"
                    style={{ width: "100% !important" }}
                    onFocus={() => setToggleDrop(false)}
                  />
                )}
                {formik.touched.assistantManagerId && (
                  <p className="text-danger">
                    {" "}
                    {formik.errors.assistantManagerId}
                  </p>
                )}
              </div>
            </div>
            {/* Select Ams */}
            <div className="col-md-12">
              <div
                className="modal-form-box mb-3"
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  justifyContent: "centeflex-start",
                  flexDirection: "column",
                  width: "100%",
                }}
              >
                {!isLoadingAms && (
                  <Select
                    onChange={(e) => {
                      if (
                        prefill &&
                        prefill?.projectManagerId?._id != loggedUserId
                      ) {
                        return;
                      }
                      handleSelectAms(e);
                    }}
                    value={amsData}
                    isDisabled={
                      prefill && prefill?.projectManagerId?._id != loggedUserId
                    }
                    options={AmsList?.data?.data?.AmsList?.map((elem) => {
                      return {
                        value: elem?._id,
                        label: elem?.userName || "N/A",
                      };
                    })}
                    placeholder="Select Sales Team"
                    name="assistantManagerId"
                    className="basic-multi-select"
                    classNamePrefix="select"
                    style={{ width: "100% !important" }}
                    onFocus={() => setToggleDrop(false)}
                  />
                )}
                {formik.touched.assistantManagerId && (
                  <p className="text-danger">
                    {" "}
                    {formik.errors.assistantManagerId}
                  </p>
                )}
              </div>
            </div>

            {/* Select team */}
            {
              <div className="col-md-12">
                <div
                  className="modal-form-box"
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    width: "100%",
                  }}
                >
                  {/* <div className="multi-prt-bx">
                    {!isLoadingTeam &&
                      teamDropdown?.length > 0 &&
                      myTeamnLeaderList?.map((item, index) => {
                        const selectedTeam = teamDropdown.find(
                          (option) => option.value === item.team
                        );
                        const selectedLeader =
                          availableTeamLeaders &&
                          availableTeamLeaders[index] &&
                          availableTeamLeaders[index]?.find(
                            (option) => option.value === item.teamLeader
                          );
                        const selectedTeam1 = selectedTeam
                          ? selectedTeam
                          : null; // Set to null if not found
                        const selectedLeader1 = selectedLeader
                          ? selectedLeader
                          : null; // Set to null if not found
                        // //console.log('my test data ', availableTeamLeaders);
                        // //console.log("Debug Info:", item, selectedLeader1);
                        const isDisabled = makeDisableExistingTeam.some(
                          (existingItem) =>
                            existingItem.team === item.team &&
                            existingItem.teamLeader === item.teamLeader &&
                            existingItem.teamLeader !== null
                        );
                        return (
                          <div key={index} className="add-select-bx">
                            <Select
                              isDisabled={isDisabled}
                              value={selectedTeam1}
                              onChange={(data) => handleTeamChange(index, data)}
                              options={teamDropdown}
                              placeholder="Select Team"
                              name="team"
                              className="basic-multi-select"
                              classNamePrefix="select"
                              style={{ width: "100% !important" }}
                            />
                            {errors[index]?.team && (
                              <p className="text-danger">
                                {errors[index].team}
                              </p>
                            )}
                            {item?.team && (
                              <>
                                <Select
                                  isDisabled={isDisabled}
                                  // disable an option
                                  value={selectedLeader1}
                                  onChange={(data) =>
                                    handleTeamLeaderChange(index, data)
                                  }
                                  options={availableTeamLeaders[index]}
                                  placeholder="Select Team Leader"
                                  name="teamLeader"
                                  className="basic-multi-select"
                                  classNamePrefix="select"
                                  disabled={true}
                                  style={{ width: "100% !important" }}
                                  isClearable // Allows clearing the selection and showing the placeholder
                                />
                                {errors[index]?.teamLeader && (
                                  <p className="text-danger">
                                    {errors[index].teamLeader}
                                  </p>
                                )}
                                <input
                                  type="number"
                                  min={1}
                                  className="form-control"
                                  value={item.time}
                                  onChange={(e) =>
                                    handleTime(e.target.value, index, "time")
                                  }
                                  name="time"
                                  placeholder={"Enter Time (Hr.)"}
                                  aria-describedby="basic-addon2"
                                />
                                {errors[index]?.time && (
                                  <p className="text-danger">
                                    {errors[index].time}
                                  </p>
                                )}
                              </>
                            )}

                            {myTeamnLeaderList?.length > 1 && (
                              <button
                                className="btn btn-secondary mx-2"
                                type="button"
                                onClick={() => handleRemove(index)}
                              >
                                <FaRegTrashCan />
                              </button>
                            )}
                          </div>
                        );
                      })}
                  </div> */}
                  <div className="multi-prt-bx">
                    {!isLoadingTeam &&
                      teamDropdown?.length > 0 &&
                      myTeamnLeaderList?.map((item, index) => {
                        const selectedTeam = prefill
                          ? allTeamDropdown.find(
                              (option) => option.value === item.team
                            )
                          : teamDropdown.find(
                              (option) => option.value === item.team
                            );
                           // console.log('avl tl===================>',availableTeamLeaders)
                        const selectedLeader =
                          availableTeamLeaders &&
                          availableTeamLeaders[index] &&
                          availableTeamLeaders[index]?.find(
                            (option) => option.value === item.teamLeader
                          );
                        const selectedTeam1 = selectedTeam
                          ? selectedTeam
                          : null; // Set to null if not found
                        const selectedLeader1 = selectedLeader
                          ? selectedLeader
                          : null; // Set to null if not found

                        const isDisabled = makeDisableExistingTeam.some(
                          (existingItem) =>
                            existingItem.team === item.team &&
                            existingItem.teamLeader === item.teamLeader &&
                            existingItem.teamLeader !== null
                        );

                        const isDisabled1 = makeDisableExistingTeam.some(
                          (existingItem) =>
                            existingItem.team === item.team &&
                            existingItem.teamLeader === item.teamLeader &&
                            existingItem.teamLeader !== null &&
                            selectedLeader1 === null
                        );

                        // Only apply team check logic if prefill exists and it's not a new row
                        const isUserTeam =
                          !item.isNew &&
                          prefill &&
                          userData?.team?.some((team) => team._id == item.team);

                        return (
                          <div key={index} className="add-select-bx">
                            <Select
                              isDisabled={prefill && !isUserTeam && !item.isNew} // Disable if not a user team and prefill exists and the row is not new
                              value={selectedTeam1}
                              onChange={(data) => {
                                if (prefill && !isUserTeam && !item.isNew)
                                  return; // Prevent onChange if not a user team, prefill exists, and the row is not new
                                handleTeamChange(index, data);
                              }}
                              options={teamDropdown}
                              placeholder="Select Team"
                              name="team"
                              className="basic-multi-select"
                              classNamePrefix="select"
                              style={{ width: "100% !important" }}
                            />
                            {errors[index]?.team && (
                              <p className="text-danger">
                                {errors[index].team}
                              </p>
                            )}
                            {item?.team && (
                              <>
                               
                                <div className="w-100 d-flex flex-column mx-2">
                                  <Select
                                    isDisabled={
                                      prefill && !isUserTeam && !item.isNew
                                    } // Disable if not a user team, prefill exists, and the row is not new
                                    value={selectedLeader1}
                                    onChange={(data) => {
                                      if (prefill && !isUserTeam && !item.isNew)
                                        return; // Prevent onChange if not a user team, prefill exists, and the row is not new
                                      handleTeamLeaderChange(index, data);
                                    }}
                                    options={availableTeamLeaders[index]}
                                    placeholder="Select Team Leader"
                                    name="teamLeader"
                                    className="basic-multi-select"
                                    classNamePrefix="select"
                                    style={{ width: "100% !important" }}
                                    isClearable // Allows clearing the selection and showing the placeholder
                                  />
                                  {errors[index]?.teamLeader && (
                                    <p className="text-danger">
                                      {errors[index].teamLeader}
                                    </p>
                                  )}
                                </div>
                                <div className="w-100 d-flex flex-column">
                                  <input
                                    disabled={
                                      prefill && !isUserTeam && !item.isNew
                                    } // Disable if not a user team, prefill exists, and the row is not new
                                    type="number"
                                    min={1}
                                    className="form-control"
                                    value={item.time}
                                    onChange={(e) => {
                                      if (prefill && !isUserTeam && !item.isNew)
                                        return; // Prevent onChange if not a user team, prefill exists, and the row is not new
                                      handleTime(e.target.value, index, "time");
                                    }}
                                    name="time"
                                    placeholder={"Enter Time (Hr.)"}
                                    aria-describedby="basic-addon2"
                                  />
                                  {errors[index]?.time && (
                                    <p className="text-danger">
                                      {errors[index].time}
                                    </p>
                                  )}
                                </div>
                              </>
                            )}
                            {myTeamnLeaderList?.length > 1 && (
                              <button
                                className="btn btn-secondary mx-2"
                                type="button"
                                onClick={() => handleRemove(index)}
                                disabled={
                                  isDisabled1 ||
                                  (prefill && !isUserTeam && !item.isNew)
                                } // Disable if not a user team, prefill exists, and the row is not new
                              >
                                <FaRegTrashCan />
                              </button>
                            )}
                          </div>
                        );
                      })}
                  </div>

                  {
                    <button
                      type="button"
                      onClick={handleAddMore}
                      onFocus={() => setToggleDrop(false)}
                      className="btn modal-save-btn"
                    >
                      Add +
                    </button>
                  }
                </div>
                {formik.touched.teams && (
                  <p className="text-danger"> {formik.errors.teams}</p>
                )}
              </div>
            }

            {/* Start and End Date */}
            <div className={"col-md-12"}>
              <div className="row">
                <div className="col-md">
                  <div className="model-form-box mb-3">
                    <label>Start Date</label>

                    <input
                      className="form-control"
                      type="date"
                      placeholder="Start Date"
                      value={formik.values?.startDate}
                      onBlur={formik.handleBlur}
                      onChange={(e) => {
                        if (
                          prefill &&
                          prefill?.projectManagerId?._id != loggedUserId
                        ) {
                          return;
                        }
                        formik.handleChange(e);
                      }}
                      disabled={
                        prefill &&
                        prefill?.projectManagerId?._id != loggedUserId
                      }
                      name="startDate"
                      min={!!!prefill && new Date().toISOString().split("T")[0]}
                      onFocus={() => setToggleDrop(false)}
                    />
                    {formik.touched.startDate && (
                      <p className="text-danger"> {formik.errors.startDate} </p>
                    )}
                  </div>
                </div>
                <div className={"col-md"}>
                  <div className="model-form-box mb-3">
                    <label>Expected End Date</label>
                    <input
                      className="form-control"
                      type="date"
                      placeholder="End Date"
                      name="endDate"
                      value={formik.values?.endDate}
                      onBlur={formik.handleBlur}
                      // onChange={formik.handleChange}
                      onChange={(e) => {
                        if (
                          prefill &&
                          prefill?.projectManagerId?._id != loggedUserId
                        ) {
                          return;
                        }
                        formik.handleChange(e);
                      }}
                      disabled={
                        prefill &&
                        prefill?.projectManagerId?._id != loggedUserId
                      }
                      min={!!!prefill && new Date().toISOString().split("T")[0]}
                      onFocus={() => setToggleDrop(false)}
                    />
                    {formik.touched.endDate && (
                      <p className="text-danger"> {formik.errors.endDate} </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-12">
              <div className="model-form-box mb-3">
                <div className="input-group">
                  <input
                    type="number"
                    min={1}
                    className="form-control"
                    value={formik.values.estimatedTime}
                    onChange={(e) => {
                      if (
                        prefill &&
                        prefill?.projectManagerId?._id != loggedUserId
                      ) {
                        return;
                      }
                      formik.handleChange(e);
                    }}
                    disabled={
                      prefill && prefill?.projectManagerId?._id != loggedUserId
                    }
                    onBlur={formik.handleBlur}
                    name="estimatedTime"
                    placeholder={"Estimated Time (Hr.)"}
                    aria-label="Value"
                    aria-describedby="basic-addon2"
                    onFocus={() => setToggleDrop(false)}
                  />
                </div>
                {formik.touched.estimatedTime && (
                  <p className="text-danger">{formik.errors.estimatedTime}</p>
                )}
              </div>
            </div>
            <div className="col-md-12">
              <div className="model-form-box mb-3">
                <div className="form-group">
                  <textarea
                    type="text"
                    min={1}
                    row={10}
                    cols={2}
                    className="form-control"
                    value={formik.values.comments}
                    onChange={(e) => {
                      if (
                        prefill &&
                        prefill?.projectManagerId?._id != loggedUserId
                      ) {
                        return;
                      }
                      formik.handleChange(e);
                    }}
                    disabled={
                      prefill && prefill?.projectManagerId?._id != loggedUserId
                    }
                    onBlur={formik.handleBlur}
                    name="comments"
                    placeholder={"Comment"}
                    aria-label="Value"
                    aria-describedby="basic-addon2"
                    onFocus={() => setToggleDrop(false)}
                  ></textarea>

                  {formik.touched.comments && (
                    <p className="text-danger">{formik.errors.comments}</p>
                  )}
                </div>
                <p>{formik.values?.comments?.length + " /" + 200}</p>
              </div>
            </div>
            {!!prefill && (
              <div className="col-md-12">
                <label>Project Status</label>

                <Select
                  className="basic-single"
                  classNamePrefix="select"
                  value={projectStatus}
                  placeholder={"Select Project Status"}
                  onChange={(e) => {
                    if (
                      prefill &&
                      prefill?.projectManagerId?._id != loggedUserId
                    ) {
                      return;
                    }
                    handleProjectStatus(e);
                  }}
                  isDisabled={
                    prefill && prefill?.projectManagerId?._id != loggedUserId
                  }
                  options={projectStatusValue}
                />
              </div>
            )}
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
              disabled={createMutation?.isLoading || updateMutation?.isLoading}
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

export default AddProjectModal;
