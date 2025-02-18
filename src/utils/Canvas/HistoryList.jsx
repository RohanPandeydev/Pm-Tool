import React from 'react'
import { CiMenuKebab } from 'react-icons/ci'
import { MdCall } from 'react-icons/md'
import { CiStickyNote } from "react-icons/ci";

const HistoryList = ({ }) => {
    return (
        <>
            <div className='focus-wrapper'>
                <div className='focus-box'>
                <MdCall className='activityF-icons'/>
                <div className='focus-list'>
                    <div className='focus-options'>
                        <div className="form-check">
                            <input className="form-check-input" type="checkbox" value="" id="flexCheckChecked" checked/>
                            <label className="form-check-label" for="flexCheckChecked">
                                Call
                            </label>
                        </div>
                        <div className="dropdown triple-dot">
                            <button
                                className="btn btn-secondary dropdown-toggle"
                                type="button"
                                id="dropdownMenuButton1"
                                data-bs-toggle="dropdown"
                                aria-expanded="false"
                            >
                                <CiMenuKebab />
                            </button>
                            <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                                <li>
                                    <a className="dropdown-item" href="#">
                                        Edit
                                    </a>
                                </li>
                                <li>
                                    <a className="dropdown-item" href="#"
                                        
                                    >
                                        Delete
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <ul className='focus-tags'>
                        <li><p className='overdue'>Overdue</p></li>
                        
                        <li><p className="date">Feb 5</p></li>
                        <li><p className="host">Pradipta Ghosh</p></li>
                        <li><p className="client">Tabs Reddy</p></li>
                        <li><p className="company">Tabs Reddy & Co.</p></li>
                    </ul>
                </div>
            </div>
           
                <div className='focus-box'>
                <CiStickyNote className='activityF-icons'/>
                <div className='focus-list'>
                    <div className='focus-options'>
                        <ul className='focus-tags'>
                          <li><p className="date">Feb 5</p></li>
                          <li><p className="host">Pradipta Ghosh</p></li>
                        </ul>
                        <div className="dropdown triple-dot">
                            <button
                                className="btn btn-secondary dropdown-toggle"
                                type="button"
                                id="dropdownMenuButton1"
                                data-bs-toggle="dropdown"
                                aria-expanded="false"
                            >
                                <CiMenuKebab />
                            </button>
                            <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                                <li>
                                    <a className="dropdown-item" href="#">
                                        Edit
                                    </a>
                                </li>
                                <li>
                                    <a className="dropdown-item" href="#"
                                        
                                    >
                                        Delete
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className='focus-msg'>
                        <p>Need a followup</p>
                    </div>
                </div>
            </div>
            </div>
        </>
    )
}

export default HistoryList