import React, { memo, useMemo } from 'react';
import { Route } from 'react-router-dom';
import RequireAuth from '../../guard/RoutesGuard';
import Loader from '../../utils/Loader/Loader';
import { CheckPermission } from '../../guard/AcessControl';
import Project from '../../pages/Project';
import TaskListDateWise from '../../components/TaskList/TaskListDateWise';
import Profile from '../../pages/Profile';
import Roles from '../../pages/Roles';
import Staffs from '../../pages/Staffs';
import Teams from '../../pages/Teams';
import AccessDenied from '../../pages/AccessDenied';
import AddProjectMilestone from '../../components/project/milestone/AddProjectMilestone';
import TaskList from '../../components/project/milestone/TaskList';
import ViewProject from '../../components/project/ViewProject';
import ViewTaskList from '../../components/project/milestone/ViewTaskList';
import DashboardTeamProjectDetails from '../../components/dashboard/DashboardTeamProjectDetails';

const routes = [
    {
        path: '/project/:projectId/milestone/:milestoneId/task',
        element: <RequireAuth><ViewTaskList /></RequireAuth>,
        loader: <Loader />
    },
    {
        path: '/project/milestone/:id/:milestoneId?',
        element: <RequireAuth><AddProjectMilestone /></RequireAuth>,
        loader: <Loader />
    },
    {
        path: '/project/:id',
        element: <RequireAuth><ViewProject /></RequireAuth>,
        loader: <Loader />
    },
    {
        path: '/profile/:id',
        element: <RequireAuth><Profile /></RequireAuth>,
        loader: <Loader />
    },
    {
        path: '/project/milestone/task/:projectId/:milestoneId/:taskId?',
        element: <RequireAuth><TaskList /></RequireAuth>,
        loader: <Loader />
    },
    {
        path: '/team/projects/:id',
        element: <RequireAuth><DashboardTeamProjectDetails /></RequireAuth>,
        loader: <Loader />
    },
    {
        path: '/tasks',
        element: <RequireAuth><TaskListDateWise /></RequireAuth>,
        loader: <Loader />
    },
    {
        path: '/roles',
        element: <RequireAuth><CheckPermission moduleName={"roles"}><Roles /></CheckPermission></RequireAuth>,
        loader: <Loader />
    },
    {
        path: '/staffs',
        element: <RequireAuth><CheckPermission moduleName={"staffs"}><Staffs /></CheckPermission></RequireAuth>,
        loader: <Loader />
    },
    {
        path: '/teams',
        element: <RequireAuth><CheckPermission moduleName={"teams"}> <Teams /></CheckPermission></RequireAuth>,
        loader: <Loader />
    },
    {
        path: '/projects',
        element: <RequireAuth><CheckPermission moduleName={"projects"}> <Project /></CheckPermission></RequireAuth>,
        loader: <Loader />
    },
    {
        path: '/denied',
        element: <RequireAuth><AccessDenied /></RequireAuth>,
        loader: <Loader />
    }
];
const RbacRoutes = () => {
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

export default RbacRoutes;