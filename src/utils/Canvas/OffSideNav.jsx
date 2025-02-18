import React from 'react'
import { IoPricetag } from "react-icons/io5";
import { FaMoneyBills } from "react-icons/fa6";
import { ImFlag } from "react-icons/im";
import { FaCity } from "react-icons/fa6";
import { FaRegCircleDot } from "react-icons/fa6";
import { FaRegCircleUser } from "react-icons/fa6";
import { GrUserSettings } from "react-icons/gr";
import { CgOrganisation } from "react-icons/cg";
import { IoIosInformationCircleOutline } from "react-icons/io";
import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import ProjectServices from '../../services/ProjectServices';
import ValidateAuthenticationKey from '../ValidateAuthenticationKey';
import { toast } from 'react-toastify';
import moment from 'moment';
import RemoveUnderscore from '../RemoveUnderScoreAndMakeCapital';

const OffSideNav = ({ data, canvasProjectId, setCanvasProjectId, canvasProjectName, setCanvasProjectName }) => {

    //console.log("V", data)



    return (
        <>
            {
                <aside className='off-side-nav'>
                    <div className='off-side-header'>
                        <h5 className='off-side-title'>{canvasProjectName || "N/A"} </h5>
                        {/* <IoGrid /> */}
                    </div>
                    <div className='off-side-list'>
                        <div className='list-container'>
                            <h5>Project Information</h5>
                            <ul className='side-nav-list'>
                         

                                <li>
                                    {/* <Link> */}
                                    <div className='side-link'>
                                    <FaRegCircleUser className='side-icons' />

                                        {data?.projectManagerId
                                            ?.userName || 'N/A'}
                                    </div>
                                    {/* </Link> */}
                                </li>
                                <li>
                                    {/* <Link> */}
                                    <div className='side-link'>
                                    <GrUserSettings className='side-icons' />

                                        {data?.assistantManagerId
                                            ?.userName || 'N/A'}
                                    </div>
                                    {/* </Link> */}
                                </li>
                                <li>
                                    {/* <Link> */}
                                    <div className='side-link'>
                                        <ImFlag className='side-icons' />
                                        {RemoveUnderscore(data?.status
                                            || 'N/A')}

                                    </div>
                                    {/* </Link> */}
                                </li>
                                <li>
                                    {/* <Link> */}
                                    <div className='side-link'>
                                        <ImFlag className='side-icons' />
                                        {moment(data?.startDate).format('ll')
                                            || 'N/A'}

                                    </div>
                                    {/* </Link> */}
                                </li>
                                <li>
                                    {/* <Link> */}
                                    <div className='side-link'>
                                        <FaCity className='side-icons' />
                                        {moment(data?.endDate).format('ll')
                                            || 'N/A'}
                                    </div>
                                    {/* </Link> */}
                                </li>
                              
                            </ul>
                        </div>
                        <div className='list-container'>
                            <h5>Teams</h5>
                            <ul className='side-nav-list'>



                                {
                                    data?.teams?.map((each) => <li>
                                        {/* <Link> */}
                                        <div className='side-link'>
                                            <CgOrganisation className='side-icons' />
                                            <span>{each?.team?.name || 'N/A'} ({each?.teamLeader?.userName || 'N/A'})</span>
                                            {each?.members?.map((ele) => <li>{ele?.userName || 'N/A'}</li>)}

                                        </div>
                                        {/* </Link> */}
                                    </li>)
                                }



                            </ul>
                        </div>
                        <div className='list-container'>
                            <h5>Client Information</h5>
                            <ul className='side-nav-list'>
                                <li>
                                    {/* <Link> */}
                                    <div className='side-link'>
                                        <CgOrganisation className='side-icons' />
                                        <span>{data?.customerName || 'N/A'}</span>

                                    </div>
                                    {/* </Link> */}
                                </li>
                                <li>
                                    {/* <Link> */}
                                    <div className='side-link'>
                                        <CgOrganisation className='side-icons' />
                                        <span>{data?.customerPhoneNumber || 'N/A'}</span>

                                    </div>
                                    {/* </Link> */}
                                </li>
                                <li>
                                    {/* <Link> */}
                                    <div className='side-link'>
                                        <CgOrganisation className='side-icons' />
                                        <span>{data?.customerEmail || 'N/A'}</span>

                                    </div>
                                    {/* </Link> */}
                                </li>
                                {/* <li>
                                    <Link>
                                        <div className='side-link'>
                                            <IoLocationOutline />
                                            <span>Address</span>
                                        </div>
                                    </Link>
                                </li> */}
                            </ul>
                        </div>
                        {/* <div className='list-container'>
                            <h5>Email BCC</h5>
                            <ul className='side-nav-list'>
                                <li>
                                    <div className='off-input-box'>
                                        <label htmlFor="">
                                            Lead Specific Address
                                            <IoIosInformationCircleOutline />
                                        </label>
                                        <input type="text" className='form-control' />
                                    </div>
                                    <div className='off-input-box'>
                                        <label htmlFor="">
                                            Universal Address
                                            <IoIosInformationCircleOutline />
                                        </label>
                                        <input type="text" className='form-control' />
                                    </div>
                                </li>
                            </ul>

                            <button type='button' className='btn ctd-btn'>
                                Save
                            </button>
                        </div> */}
                        {/* <div className='off-side-btns'>
                    
                    <button type='button' className='btn ctd-del-btn'>
                        <RiDeleteBin4Line />
                    </button>
                </div> */}
                    </div>
                    {/* <div className='list-container'>
                <h5>Email BCC</h5>
                <ul className='side-nav-list'>
                    <li>
                        <div className='off-input-box'>
                            <label htmlFor="">
                                Lead Specific Address 
                                <IoIosInformationCircleOutline />
                            </label>
                            <input type="text" className='form-control'/>
                        </div>
                        <div className='off-input-box'>
                            <label htmlFor="">
                                Universal Address 
                                <IoIosInformationCircleOutline />
                            </label>
                            <input type="text" className='form-control'/>
                        </div>
                    </li>
                </ul>
                <div className='off-side-btns'>
                    <button type='button' className='btn ctd-btn'>
                        Convert To Deal
                    </button>
                    <button type='button' className='btn ctd-del-btn'>
                        <RiDeleteBin4Line />
                    </button>
                </div>
            </div> */}
                </aside>
            }

        </>
    )
}

export default OffSideNav