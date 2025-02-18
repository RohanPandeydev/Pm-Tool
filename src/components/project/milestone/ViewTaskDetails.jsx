import moment from 'moment';
import React from 'react'
import { Modal, ModalBody, ModalHeader, Row } from "reactstrap";
import capitalizeAndFormatText from '../../../utils/MakeLetterCapital';
import RemoveUnderscore from '../../../utils/RemoveUnderScoreAndMakeCapital';
import { convertHHMMSS_HM } from '../../../utils/TotalWorkingTime';
import parse from 'html-react-parser'
const ViewTaskDetails = ({ setIsModel, isModel, data, setPrefillData }) => {
    const handleClose = () => {
        setIsModel(!isModel);
        setPrefillData({})
        return;
    };
    // console.log("data", data)
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
                Task Details

            </ModalHeader>

            <ModalBody>

                <div className="row">
                    <div className="col-md-12 col-sm-12">
                        <div className="modal-form-left">
                            <div className="model-form-box">
                                {/* <p> <strong>Project : </strong>  {data?.projectName || data?.name || 'N/A'} </p>
                                <p> <strong>Milestone : </strong>  {data?.milestoneTitle || data?.milestone?.title || 'N/A'} </p>
                                <p> <strong>Title : </strong>  {data?.taskName || data?.name || 'N/A'} </p>
                                <p> <strong>Description : </strong> {parse(data?.notes || 'N/A')} </p>
                                <p><strong> Start Date  : </strong> {(data?.startDate &&
                                    moment(data?.startDate).format("ll")) ||
                                    "N/A"} </p>
                                <p><strong>Allotted Time  : </strong> {convertHHMMSS_HM(data?.hours, data?.timeType)} </p>
                                <p><strong> Priority  :</strong>  {capitalizeAndFormatText(data?.priority || "N/A")} </p>
                                <p><strong> Status  :</strong> {RemoveUnderscore(data.status || "N/A")}</p> */}


                                <table className='table table-striped'>
                                    <tbody>
                                        <tr>
                                            <th>Project</th>
                                            <td><p>{data?.projectName || data?.name || 'N/A'}</p></td>
                                        </tr>
                                        <tr>
                                            <th>Milestone</th>
                                            <td><p>{data?.milestoneTitle || data?.milestone?.title || 'N/A'} </p></td>
                                        </tr>
                                        <tr>
                                            <th>Title</th>
                                            <td><p>{data?.taskName || data?.name || 'N/A'}</p></td>
                                        </tr>
                                        <tr>
                                            <th>Description</th>
                                            <td><p>{parse(data?.notes || 'N/A')}</p></td>
                                        </tr>
                                        <tr>
                                            <th>Start Date</th>
                                            <td>
                                                <p>{(data?.startDate && moment(data?.startDate).format("ll")) || "N/A"} </p>
                                            </td>
                                        </tr>
                                        <tr>
                                            <th>Allotted Time</th>
                                            <td><p>{convertHHMMSS_HM(data?.hours, data?.timeType)}</p></td>
                                        </tr>
                                        <tr>
                                            <th>Priority</th>
                                            <td><p>{capitalizeAndFormatText(data?.priority || "N/A")}</p></td>
                                        </tr>
                                        <tr>
                                            <th>Status</th>
                                            <td><p>{RemoveUnderscore(data.status || "N/A")}</p></td>
                                        </tr>
                                    </tbody>
                                </table>




                            </div>

                        </div>
                    </div>
                </div>
                <div className="modal-footer">
                    <button
                        type="button"
                        className="btn modal-close-btn"
                        onClick={handleClose}
                    >
                        Close
                    </button>

                </div>

            </ModalBody>
        </Modal>)
}

export default ViewTaskDetails