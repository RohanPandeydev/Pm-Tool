import React, { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import customContext from "../contexts/Context";
const RequireAuth = ({ children }) => {
    const location = useLocation();
    const { token } = customContext();
    if (!!!token) {
        return <Navigate to="/login" state={{ path: location.pathname }} />;
    }
    return children;
}
export const NonAuth = ({ children }) => {
    const { token } = customContext();
    if (!!token) {
        return <Navigate to="/"  />;
    }
    return children;
}





export default RequireAuth;