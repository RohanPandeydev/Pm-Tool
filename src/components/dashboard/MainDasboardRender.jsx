import React from 'react'
import LandingPage from './LandingPage'
import TlDashboard from './TlDashboard'
import StorageData from '../../helper/storagehelper/StorageData';
import config from '../../config';
import ExecutiveDashboard from './ExecutiveDashboard';
import AmDashboard from './AmDashboard';

const MainDasboardRender = () => {
    const loggedInUserTeamId = StorageData.getUserData()?.team[0]?._id;
    const loggedInUserId = StorageData.getUserData()?._id;
    const loggedInUserRoleId = StorageData.getUserData()?.role?.roleUId;


    if (loggedInUserRoleId == config.Admin || loggedInUserRoleId == config.Manager) {
        return <LandingPage />
    }

    else if (loggedInUserRoleId == config.teamLeader) {
        return <TlDashboard />
    }
    else if (loggedInUserRoleId == config.Executive) {
        return <ExecutiveDashboard />
    }
    else if (loggedInUserRoleId == config.Am) {
        return <AmDashboard />
    }
    else {
        return <LandingPage />
    }



}

export default MainDasboardRender