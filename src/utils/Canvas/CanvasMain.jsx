import React, { useEffect, useState } from 'react'
import { Button, Offcanvas, OffcanvasBody, OffcanvasHeader } from 'reactstrap'
import OffSideNav from './OffSideNav'
import OffRightComp from './OffRightComp'
import { useQuery } from '@tanstack/react-query'
import ProjectServices from '../../services/ProjectServices'
import ValidateAuthenticationKey from '../ValidateAuthenticationKey'

const CanvasMain = ({ isOpenOff, setCanvasProjectId, canvasProjectId, OffCanvastoggle, CloseCanvas,canvasProjectName, setCanvasProjectName }) => {
    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [storeProjectId, setProjectId] = useState("")
    const [projectMember,setProjectMember]=useState([])

    useEffect(() => {
        const fetchData = async () => {
            if (!storeProjectId) return;
            setIsLoading(true);
            try {
                const response = await ProjectServices.notesProject({ id: storeProjectId });
                //console.log("data",response?.data?.data?.projectDetails?.projectAddedMember);
                setData(response?.data?.data?.projectDetails
                );
                setProjectMember(response?.data?.data?.projectDetails?.projectAddedMember)


                setIsLoading(false);
            } catch (err) {
                setIsLoading(false);
                setError(err);
                if (err?.response?.status === 401) {
                    ValidateAuthenticationKey(err?.response?.status, "Your login session has expired. Please log in again.");
                } else {
                    console.error(err?.response);
                }
            }
        };

        fetchData();
    }, [storeProjectId]);

    useEffect(() => {
        setProjectId(canvasProjectId)
    }, [canvasProjectId])

    return (
        <Offcanvas isOpen={isOpenOff} toggle={OffCanvastoggle} placement="end" direction="end">
            <OffcanvasHeader >
                <Button className="btn-close text-reset" onClick={ CloseCanvas}>X</Button></OffcanvasHeader>
            <OffcanvasBody>
                <div className="d-flex">
                    {!isLoading && <OffSideNav data={data} canvasProjectName={canvasProjectName} setCanvasProjectName={setCanvasProjectName} setCanvasProjectId={setCanvasProjectId} canvasProjectId={canvasProjectId} />}
                    {!isLoading && <OffRightComp projectMember={projectMember} canvasProjectName={canvasProjectName} setCanvasProjectName={setCanvasProjectName} setCanvasProjectId={setCanvasProjectId} canvasProjectId={canvasProjectId} />}
                </div>
            </OffcanvasBody>
        </Offcanvas>
    )
}

export default CanvasMain