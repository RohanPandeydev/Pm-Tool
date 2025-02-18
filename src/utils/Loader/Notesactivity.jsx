import React from 'react'
import { CiMenuKebab, CiStickyNote } from 'react-icons/ci'

const Notesactivity = () => {
  return (
    <div className="focus-wrapper ">
        <div className="focus-box ">
            <CiStickyNote className="activityF-icons" />
            <div className="focus-list pulse">
                <div className="focus-options pulse">
                    {/* <ul className="focus-tags">
                        <li>
                            <p className="date"></p>
                        </li>
                        <li>
                            <p className="host"></p>
                        </li>
                    </ul> */}
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
                    </div> */}
                </div>
                <div className="focus-msg loader-gray pulse">
                    <p></p>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Notesactivity