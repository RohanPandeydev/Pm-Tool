/* eslint-disable react/jsx-key */
import React from 'react'
import { CiMenuKebab } from 'react-icons/ci';
import ButtonLoader from '../Loader/ButtonLoader';
import img from '../../assets/img.png';
import docs from '../../assets/docs.png';
import sheet from '../../assets/sheets.png';
import volume from '../../assets/volume.png';
import video from '../../assets/video.png';
import pdf from '../../assets/pdf.png';
import ppt from '../../assets/ppt.png';
import { RiDeleteBin6Line } from 'react-icons/ri';
import { FaEdit } from 'react-icons/fa';
const FocusList = ({ dirveFiles, isLoading }) => {
    const allowedExtensions = [
        '.doc', '.docx', '.pdf', '.jpg', '.jpeg', '.png', '.csv', '.xlsx',
        '.mp4', '.mov', '.wmv', '.flv', '.avi', // Video extensions
        '.mp3', '.wav', '.aac', '.flac',        // Audio extensions
        '.ppt', '.pptx'                         // PowerPoint extensions
    ];
    const getFileIcon = (fileType, url) => {
        const extension = fileType?.toLowerCase();
        // //console.log("fileType", fileType);

        switch (true) {
            case extension.includes('application/vnd.openxmlformats-officedocument.presentationml.presentation'):
                return { icon: ppt, url };
            case extension.includes('application/msword') || extension.includes('application/vnd.openxmlformats-officedocument.wordprocessingml.document'):
                return { icon: docs, url };
            case extension.includes('application/pdf'):
                return { icon: pdf, url };
            case extension.includes('image/jpeg') || extension.includes('image/png'):
                return { icon: url, url };
            case extension.includes('text/csv') || extension.includes('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'):
                return { icon: sheet, url };
            case extension.includes('video/mp4') || extension.includes('video/quicktime') || extension.includes('video/x-ms-wmv') ||
                extension.includes('video/x-flv') || extension.includes('video/x-msvideo'):
                return { icon: video, url };
            case extension.includes('audio/mpeg') || extension.includes('audio/wav') || extension.includes('audio/aac') ||
                extension.includes('audio/flac'):
                return { icon: volume, url };
            default:
                return null; // Default icon or handle unknown types
        }
    };
    return (
        <>
            {

                isLoading ? <ButtonLoader /> :
                    dirveFiles?.map((each) => {
                        return <div className='focus-wrapper'>

                            {/* <MdCall className='activityF-icons' /> */}
                            <div className='focus-list'>
                                <div className='focus-options'>
                                    <div className="form-check">
                                        <input className="form-check-input" type="checkbox" value="" id="flexCheckChecked" checked />
                                        <label className="form-check-label" for="flexCheckChecked">
                                            {each?.title || 'N/A'}
                                        </label>
                                    </div>
                                    <div className='settings-icon'>
                                        {/* <button><FaEdit /></button>
                                        <button><RiDeleteBin6Line /></button> */}
                                    </div>
                                    {/* <div style={{ display: "flex", gap: "10" }}>
                                        <div className="dropdown triple-dot">

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
                                                <li><FaEdit /></li>
                                                <li><RiDeleteBin6Line /></li>
                                            </ul>
                                        </div>
                                    </div> */}
                                </div>
                                <ul className='focus-tags'>
                                    {
                                        each?.files?.length > 0 && each?.files?.map((elem) => {
                                            return <a target='_sb' href={getFileIcon(elem?.fileType, elem?.url)?.url} download={true}>
                                                <img src={getFileIcon(elem?.fileType, elem?.url)?.icon} height={20} width={20} />


                                            </a>
                                        })
                                    }

                                    {/* <li><p className='completed'>Completed</p></li> */}
                                    {/* <li><p className='hold'>Hold</p></li> */}

                                </ul>
                                {/* <div className='focus-msg'>
                                </div> */}
                            </div>
                        </div>

                    })
            }



        </>
    )
}

export default FocusList;