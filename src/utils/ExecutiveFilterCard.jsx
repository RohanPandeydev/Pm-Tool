import React, { useEffect, useState } from 'react'
import ButtonLoader from './Loader/ButtonLoader'
import { useQuery } from '@tanstack/react-query'
import UserServices from '../services/UserServices'
import ValidateAuthenticationKey from './ValidateAuthenticationKey'
import { toast } from 'react-toastify'
import { GrPowerReset } from 'react-icons/gr'
import StorageData from '../helper/storagehelper/StorageData'
import TaskServices from '../services/TaskServices'

const ExecutiveFilterCard = ({ setIsLoading, setFilteredData }) => {
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [toggleQuery, setToggleQuery] = useState(false)
    const [filterQuery, setFilterQuery] = useState({})
    const loggedInUserId = StorageData.getUserData()?._id; const date = new Date();
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

    const handleReset = () => {
        setStartDate("")
        setEndDate("")
        setFilterQuery({})
        setToggleQuery(!toggleQuery)

    }


    const handleSubmit = () => {
        if (!!!startDate || !!!endDate) {
            toast.error("Please Select Start and End Date")
            return false
        }
        if (startDate > endDate) {
            toast.error("Start date can't be greater than end date")

            return false

        }
        setToggleQuery(!toggleQuery)
        // id, fromDate, toDate, month, year 
        setFilterQuery({ startDate: startDate, endDate: endDate })
        return;
    }

    const { data, isLoading } = useQuery(
        ["userlist-all-executive"],
        () => UserServices.getTaskUserList(),
        {
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
        ['findTask', toggleQuery],
        () => TaskServices.findTask(`startDate=${filterQuery?.startDate || formattedDate}&endDate=${filterQuery?.endDate || ""
            }&assignedUserId=${filterQuery?.executive || loggedInUserId}`),
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
    useEffect(() => {
        setIsLoading(() => fetchTask)
    }, [fetchTask])
    return (
        <div className='d-flex justify-content-end cstm-add'>
            <div className='right-nav-content-right'>
                <input className="form-control" type="date" placeholder="Start Date" value={startDate} onChange={handleStartDateChange} />
                <input className="form-control" type="date" placeholder="End Date" value={endDate} onChange={handleEndDateChange} />
                <button type="button" className="btn modal-save-btn" onClick={handleSubmit} >Search</button>

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

export default ExecutiveFilterCard