import React from "react";
import { createContext, useContext, useState } from "react";
import StorageData from '../helper/storagehelper/StorageData'
import UserServices from "../services/UserServices";
import ValidateAuthenticationKey from "../utils/ValidateAuthenticationKey";
import { useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";

const userContext = createContext();
const ContextWrapper = ({ children }) => {
  const myuserToken = StorageData.getToken();
  const myuserData = StorageData.getUserData();
  const [token, setToken] = useState(myuserToken ? myuserToken : "");
  const [redirectUrl,setRedirectUrl]=useState("")
  const [userData, setUserData] = useState(
    myuserData != null ? myuserData : {}
  );
//   const { data, isLoading } = useQuery(
//     ["userdetails"],
//     () => UserServices.getDetails({id:myuserData?._id}),
//     {
//         refetchOnWindowFocus: false,
//         enabled:!!myuserData?._id,
//         onSuccess: (data) => {
//           setAccessControl(data?.data?.data?.users?.role?.rolePermissions?.map((elem)=>{
//             return {
//               name:elem?.moduleName,
//               module:elem?.modulePermissions
//             }
//           }))
//           // //console.log("Nnn",data?.data?.data?.users)
//             return;
//         },
//         onError: (err) => {
//             if (err?.response?.status === 401) {

//                 ValidateAuthenticationKey(err?.response?.status, "Your login session has expired. Please log in again.")
//                 return
//             }
//             //console.log(err?.response);
//             toast.error(err?.response?.data?.message || err?.message, {
//                 delay: 10,
//             });
//         },
//     }
// );
 

  // //console.log("modulePermission",accessControl)

  return (
    <userContext.Provider
      value={{
        token,
        setToken,
        userData,
        setUserData,
        redirectUrl,
        setRedirectUrl
      }}
    >
      {children}
    </userContext.Provider>
  );
};


const customContext = () => {
  return useContext(userContext);
};
export default customContext;
export { ContextWrapper };
