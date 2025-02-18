import React from 'react'
import { BiCommentDetail } from "react-icons/bi";
import { LuCalendarDays } from "react-icons/lu";
import NoteComp from './NoteCamp';
import Activity from './Activity';
import Details from './Details';
import { MdOutlineStickyNote2 } from 'react-icons/md';

const OffRightComp = ({canvasProjectId,setCanvasProjectId,canvasProjectName,setCanvasProjectName,projectMember }) => {
    // //console.log("projectMember",projectMember)


    return (
        <>
            <div className='off-right-wrapper'>
                <div className='off-tab'>
                    <ul className="nav nav-pills mb-3" id="pills-tab" role="tablist">
                        <li className="nav-item" role="presentation">
                            <button className="nav-link active" id="pills-home-tab" data-bs-toggle="pill" data-bs-target="#pills-offtab1" type="button" role="tab" aria-controls="pills-offtab1" aria-selected="true">
                                <MdOutlineStickyNote2 />
                                <span>Notes</span>
                            </button>
                        </li>
                        <li className="nav-item" role="presentation">
                            <button className="nav-link" id="pills-profile-tab" data-bs-toggle="pill" data-bs-target="#pills-offtab2" type="button" role="tab" aria-controls="pills-offtab2" aria-selected="false">
                                <LuCalendarDays />
                                <span>Drive</span>
                            </button>
                        </li>
                        {/* <li className="nav-item" role="presentation">
                            <button className="nav-link" id="pills-contact-tab" data-bs-toggle="pill" data-bs-target="#pills-offtab3" type="button" role="tab" aria-controls="pills-offtab3" aria-selected="false">
                                <BiCommentDetail />
                                <span>Details</span>
                            </button>
                        </li> */}
                    </ul>
                    <div className="tab-content" id="pills-tabContent">
                        <div className="tab-pane fade show active" id="pills-offtab1" role="tabpanel" aria-labelledby="pills-home-tab">
                            <NoteComp projectMember={projectMember} canvasProjectName={canvasProjectName} setCanvasProjectName={setCanvasProjectName} setCanvasProjectId={setCanvasProjectId} canvasProjectId={canvasProjectId} />
                        </div>
                        <div className="tab-pane fade" id="pills-offtab2" role="tabpanel" aria-labelledby="pills-profile-tab">
                            <Activity  canvasProjectName={canvasProjectName} setCanvasProjectName={setCanvasProjectName} setCanvasProjectId={setCanvasProjectId} canvasProjectId={canvasProjectId}/>
                        </div>
                        <div className="tab-pane fade" id="pills-offtab3" role="tabpanel" aria-labelledby="pills-contact-tab">
                            <Details  canvasProjectName={canvasProjectName} setCanvasProjectName={setCanvasProjectName} setCanvasProjectId={setCanvasProjectId} canvasProjectId={canvasProjectId} />

                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default OffRightComp