/* eslint-disable no-unused-vars */
import React, { memo, useMemo } from 'react';
import { Route } from 'react-router-dom';
import RequireAuth, { NonAuth } from '../../guard/RoutesGuard';
import Login from '../../pages/Login';
import Loader from '../../utils/Loader/Loader';
import ForgotPassword from '../../auth/forgotpassword/ForgotPassword';
import Otp from '../../auth/forgotpassword/Otp';
import MainDasboardRender from '../../components/dashboard/MainDasboardRender';
import DesignationList from '../../components/designation/DesignationList';
import Designation from '../../pages/Designation';
import Drive from '../../components/drive/Drive';
import Report from '../../pages/Report';
import ProjectReport from '../../pages/ProjectReport';
import UserReport from '../../pages/UserReport';
import ProjectReportDetails from '../../pages/ProjectReportDetails';
import UserReportDetails from '../../pages/UserReportDetails';
import UserMonthlyReportMain from '../../components/Report/UserMonthlyReportMain';


const routes = [
    {
        path: '/',
        element: <RequireAuth><MainDasboardRender /></RequireAuth>,
        loader: <Loader />
    },

    {
        path: '/login',
        element: <NonAuth> <Login /></NonAuth>,
        loader: <Loader />
    },
    {
        path: '/forgotpassword',
        element: <NonAuth><ForgotPassword /></NonAuth>,
        loader: <Loader />
    },
    {
        path: '/otp/:email',
        element: <NonAuth> <Otp /></NonAuth>,
        loader: <Loader />
    },
    {
        path: '/designations',
        element: <RequireAuth> <Designation /></RequireAuth>,
        loader: <Loader />
    },
    {
        path: '/drive/:id',
        element: <RequireAuth> <Drive /></RequireAuth>,
        loader: <Loader/>
    },
    {
        path: '/report/project',
        element: <RequireAuth> <ProjectReport /></RequireAuth>,
        loader: <Loader />
    },
    {
        path: '/report/project/:id?',
        element: <RequireAuth> <ProjectReportDetails /></RequireAuth>,
        loader: <Loader />
    },
    {
        path: '/report/user',
        element: <RequireAuth> <UserReport /></RequireAuth>,
        loader: <Loader />
    },
    {
        path: '/report/user/:id',
        element: <RequireAuth> <UserReportDetails /></RequireAuth>,
        loader: <Loader />
    },
    {
        path: '/report/monthly',
        element: <RequireAuth> <UserMonthlyReportMain /></RequireAuth>,
        loader: <Loader />
    },
];
const CommonRoutes = () => {
    return (
        <>
            {routes.map((route, index) => (
                <Route
                    key={index}
                    path={route.path}
                    element={route.element}
                    loader={route.loader}
                />
            ))}
        </>
    );
}

export default CommonRoutes;