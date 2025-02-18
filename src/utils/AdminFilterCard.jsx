import React, { useEffect, useState } from 'react'
import ButtonLoader from './Loader/ButtonLoader'
import { useQuery } from '@tanstack/react-query'
import UserServices from '../services/UserServices'
import ValidateAuthenticationKey from './ValidateAuthenticationKey'
import { toast } from 'react-toastify'
import { GrPowerReset } from 'react-icons/gr'
import StorageData from '../helper/storagehelper/StorageData'
import TeamServices from '../services/TeamServices'
import TaskServices from '../services/TaskServices'

const AdminFilterCard = ({ setIsLoading, setFilteredData }) => {
    const [executiveFilter, setExecutiveFilter] = useState("")
    const [managerFilter, setManagerFilter] = useState("")
    const [teamFilter, setTeamFilter] = useState("")
    const [tlFilter, setTlFilter] = useState("")
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [filterQuery, setFilterQuery] = useState({})
    const [toggleQuery, setToggleQuery] = useState(false)
    const loggedInUserId = StorageData.getUserData()?._id;
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based, so add 1 and pad with zero if needed
    const day = String(date.getDate()).padStart(2, '0'); // Pad day with zero if needed
    const formattedDate = `${year}-${month}-${day}`

    const handleStartDateChange = (e) => {
        setStartDate(e?.target?.value)
    }
    const handleEndDateChange = (e) => {
        setEndDate(e?.target?.value)
    };
    const handleExecutive = (e) => {
        setExecutiveFilter(e?.target?.value)
    }
    const handleManager = (e) => {
        setManagerFilter(e?.target?.value)
    }
    const handleTl = (e) => {
        setTlFilter(e?.target?.value)
    }
    const handleTeam = (e) => {
        setTeamFilter(e?.target?.value)
    }
    const handleReset = () => {
        setStartDate("")
        setEndDate("")
        setManagerFilter("")
        setTeamFilter("")
        setTlFilter("")
        setExecutiveFilter("")
        setFilterQuery({})
        setToggleQuery(!toggleQuery)
    }
    // Manager List 
    const { data: managerList, isLoading: isManagerListing } = useQuery(
        ["user-manager-list-admin", loggedInUserId],
        () => UserServices.getTaskUserList(),
        {
            enabled: !!loggedInUserId,
            refetchOnWindowFocus: false,
            onSuccess: (data) => {
                setTlFilter("")
                setExecutiveFilter("")
                setTeamFilter("")
                // //console.log("getTaskUserList", data?.data?.data?.users)
                return;
            },
            onError: (err) => {
                if (err?.response?.status === 401) {

                    ValidateAuthenticationKey(err?.response?.status, "Your login session has expired. Please log in again.")
                    return
                }

                // //console.log(err?.response);
                toast.error(err?.response?.data?.message || err?.message, {
                    delay: 10,
                });
            },
        }
    );
    //Team  List By Manager Id
    const { data: managerTeam, isLoading: isManagerTeamLoaded } = useQuery(
        ["userlist-manger-team-list-admin", managerFilter],
        () => TeamServices.getTeamByManagerIdAdmin({ id: managerFilter }),
        {
            enabled: !!managerFilter,
            refetchOnWindowFocus: false,
            onSuccess: (data) => {
                // //console.log("Data====>=========>",data?.data)

                setTlFilter("")
                setExecutiveFilter("")
                setTeamFilter("")
                return;
            },
            onError: (err) => {
                if (err?.response?.status === 401) {

                    ValidateAuthenticationKey(err?.response?.status, "Your login session has expired. Please log in again.")
                    return
                }
                // //console.log(err?.response);
                toast.error(err?.response?.data?.message || err?.message, {
                    delay: 10,
                });
            },
        }
    );
    //Team Leader  List
    const { data, isLoading } = useQuery(
        ["userlist-manger-list-admin", teamFilter, managerFilter],
        () => UserServices.getManagerByTeamId({ id: managerFilter, teamId: teamFilter }),
        {
            enabled: !!teamFilter && !!managerFilter,
            refetchOnWindowFocus: false,
            onSuccess: (data) => {
                setExecutiveFilter("")

                // //console.log("getTaskUserList", data?.data?.data?.users)
                return;
            },
            onError: (err) => {
                if (err?.response?.status === 401) {

                    ValidateAuthenticationKey(err?.response?.status, "Your login session has expired. Please log in again.")
                    return
                }
                // //console.log(err?.response);
                toast.error(err?.response?.data?.message || err?.message, {
                    delay: 10,
                });
            },
        }
    );
    // Team Leader Executive List 
    const { data: teamExecutiveList, isLoading: isteamExecutiveLoaded } = useQuery(
        ["userlist-team-executive-list-admin", tlFilter ? tlFilter : ""],
        () => UserServices.getTaskUserListbyId({ id: tlFilter }),
        {
            enabled: !!tlFilter,
            refetchOnWindowFocus: false,
            onSuccess: (data) => {
                // //console.log("getTaskUserList", data?.data?.data?.users)
                return;
            },
            onError: (err) => {
                if (err?.response?.status === 401) {

                    ValidateAuthenticationKey(err?.response?.status, "Your login session has expired. Please log in again.")
                    return
                }
                // //console.log(err?.response);
                toast.error(err?.response?.data?.message || err?.message, {
                    delay: 10,
                });
            },
        }
    );
    const { data: _, isLoading: fetchTask, isError, error } = useQuery(
        ['findTask-admin', toggleQuery],
        () => TaskServices.findTask(`startDate=${filterQuery?.startDate || formattedDate}&endDate=${filterQuery?.endDate || ""
            }&assignedUserId=${filterQuery?.executive || ""}`),
        {
            enabled: !!loggedInUserId,
            onSuccess: (data) => {
                if (data?.data?.error) {
                    toast.error(data?.data?.message, { delay: 10 });
                    return;
                }
                setFilteredData(() => data?.data?.data?.taskList);
            },
            onError: (err) => {
                toast.error(err?.response?.data?.message || err?.message, {
                    delay: 10,
                });
            },
        }
    );

    const handleSubmit = () => {

        if (!!!startDate || !!!endDate) {
            toast.error("Please Select Start and End Date")
            return false
        }
        if (startDate > endDate) {
            toast.error("Start date can't be greater than end date")

            return false

        }
        if (!!!managerFilter) {
            toast.error("Choose a Manager")

            return false
        }
        if (!!!teamFilter) {
            toast.error("Choose a Team")

            return false
        }
        if (!!!tlFilter) {
            toast.error("Choose a TeamLeader")

            return false
        }


        setToggleQuery(!toggleQuery)


        // id, fromDate, toDate, month, year 
        setFilterQuery({ startDate: startDate, endDate: endDate, executive: executiveFilter || tlFilter })
        return;
    }

    useEffect(() => {
        setIsLoading(() => fetchTask)
    }, [fetchTask])
    return (
        <div className='d-flex justify-content-end cstm-add'>

            <div className='right-nav-content-right'>
                <input className="form-control" type="date" placeholder="Start Date" value={startDate} onChange={handleStartDateChange} />
                <input className="form-control" type="date" placeholder="End Date" value={endDate} onChange={handleEndDateChange} />
                {/* Manager List */}
                <select className='form-select' value={managerFilter} onChange={handleManager}>
                    <option value={""}>Select One Manager</option>
                    {
                        isManagerListing ? <ButtonLoader /> : managerList?.data?.data?.users?.map((user) => {
                            return <option key={user?._id} value={user?._id}>{user?.userName || 'N/A'}</option>
                        })
                    }
                </select>

                {/* Team  List */}
                <select className='form-select' value={teamFilter} onChange={handleTeam} disabled={isManagerTeamLoaded}>
                    <option value="">Select Team</option>
                    {
                        isManagerTeamLoaded ? <ButtonLoader /> : managerTeam?.data?.data?.teams?.map((team) => {
                            return <option key={team?._id} value={team?._id}>{team?.name || 'N/A'}</option>
                        })
                    }
                </select>
                {/* Team Leader List */}
                <select className='form-select' value={tlFilter} onChange={handleTl} disabled={!!!teamFilter} >
                    <option value={""}>Select One Team Leader</option>

                    {
                        isLoading ? <ButtonLoader /> : data?.data?.data?.users?.map((user) => {
                            return <option key={user?._id} value={user?._id}>{user?.userName || 'N/A'}</option>
                        })
                    }
                </select>


                {/* Executive Select  */}
                <select className='form-select' value={executiveFilter} onChange={handleExecutive} disabled={isteamExecutiveLoaded}>
                    <option value={""}>Select One Executive</option>
                    {
                        isteamExecutiveLoaded ? <ButtonLoader /> : teamExecutiveList?.data?.data?.users?.map((user) => {
                            return <option key={user?._id} value={user?._id}>{user?.userName || 'N/A'}</option>
                        })
                    }
                </select>
                <button type="button" className="btn modal-save-btn" onClick={handleSubmit}>Search</button>

                <button
                    className="btn btn-secondary dropdown-toggle"
                    type="button"
                    id="dropdownMenuButton1"
                    aria-expanded="false"
                    data-bs-toggle="tooltip"
                    data-bs-placement="top"
                    onClick={handleReset}
                >
                    <GrPowerReset title="Reset" />
                </button>
            </div>
        </div>
    )
}

export default AdminFilterCard