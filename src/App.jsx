import { Route, Routes, useLocation } from "react-router-dom";
import Loader from "./utils/Loader/Loader";
import PageNotFound from "./components/ErrorPage/PageNotFound";
import CommonRoutes from "./helper/Routes/CommonRoutes";
import customContext from "./contexts/Context";
import UserServices from "./services/UserServices";
import { useQuery } from "@tanstack/react-query";
import ValidateAuthenticationKey from "./utils/ValidateAuthenticationKey";
import StorageData from "./helper/storagehelper/StorageData";
import RbacRoutes from "./helper/Routes/RbacRoutes";
import { useEffect } from "react";

export default function App() {
  // const {userData, setUserData}=customContext()
  const location = useLocation();
  const userData=StorageData?.getUserData();

 
  const { data, isLoading, isError, error, refetch } = useQuery(
    ["userdetails", userData?._id, location.pathname],
    () => UserServices.getDetails({ id: userData?._id || "" }),
    {
      enabled: userData && !!userData?._id || false,
      refetchOnWindowFocus: false,
      onSuccess: (data = {}) => {
        StorageData.setData(data?.data?.data?.users);
        return true;
      },
      onError: (err) => {
        if (err?.response?.status === 401) {
          ValidateAuthenticationKey(err?.response?.status, "Your login session has expired. Please log in again.");
        } else {
          return false;
        }
      },
    }
  );

  
  return <Routes>
    {/* Common Routes */}
    {CommonRoutes()}
    {/* Rbac Routes */}
    {RbacRoutes()}
    
    <Route
      path="/*"
      element={
        <PageNotFound />
      }
      loader={<Loader />}
    />

  </Routes>
}