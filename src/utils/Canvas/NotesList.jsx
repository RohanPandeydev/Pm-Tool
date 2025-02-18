import React from 'react'
import { CiMenuKebab } from 'react-icons/ci'
import { FaEdit } from 'react-icons/fa'
import { RiDeleteBin6Line } from 'react-icons/ri'
import parse from 'html-react-parser';

const NotesList = ({text}) => {
  return (
    <div className='focus-wrapper'>

                            {/* <MdCall className='activityF-icons' /> */}
                            <div className='focus-list'>
                                <div className='focus-options'>
                                    <div className="form-check">
                                        <input className="form-check-input" type="checkbox" value="" id="flexCheckChecked" checked />
                                        <label className="form-check-label" for="flexCheckChecked">
                                            { 'N/A'}
                                        </label>
                                    </div>
                                    <div className='settings-icon'>
                                        {/* <button><FaEdit /></button>
                                        <button><RiDeleteBin6Line /></button> */}
                                    </div>
                                    <div style={{ display: "flex", gap: "10" }}>
                                        <div className="dropdown triple-dot">

                                        </div>


                                        {parse(text || "")}
                                        {/* <div className="dropdown triple-dot">
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
                                                <li><FaEdit /></li>
                                                <li><RiDeleteBin6Line /></li>
                                            </ul>
                                        </div> */}
                                    </div>
                                </div>
                                <ul className='focus-tags'>
                                   
                                    <li><p className='completed'>Completed</p></li>
                                    <li><p className='hold'>Hold</p></li>

                                </ul>
                                {/* <div className='focus-msg'>
                                </div> */}
                            </div>
                        </div>
  )
}

export default NotesList