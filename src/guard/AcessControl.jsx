import { Navigate } from "react-router-dom";
import StorageData from "../helper/storagehelper/StorageData";
import config from "../config";
import { useEffect, useState } from "react";
import Loader from "../utils/Loader/Loader";
const roleName = StorageData?.getUserData()?.role?.roleUId;

// const modulePermission = [
//     {
//         name: "roles",
//         module: ["create", "read", "delete","update"],
//     },
//     {
//         name: "teams",
//         module: ["create", "read", "update", "delete"],
//     },
//     {
//         name: "staffs",
//         module: ["create", "read", "update","delete"],
//     },
// ];

//Check Module Access Control
const checkModuleNamePresent = (name) => {
    // const { accessControl: modulePermission } = customContext()
    const modulePermission = StorageData?.getUserData()?.role?.rolePermissions;
    if (roleName == config.superAdmin) return true;
    else if (modulePermission?.length > 0) {
        return modulePermission.some((module) => module.moduleName === name);
    }
};
//Check Module Permission Access Control
const checkIsAccessable = (modulename, permission) => {
    if (roleName == config.superAdmin) return true;
    const modulePermission = StorageData?.getUserData()?.role?.rolePermissions;
    // //console.log("Af",modulePermission)
    const module = modulePermission.find(
        (module) => module.moduleName === modulename
    );
    if (module) {
        return module.modulePermissions.includes(permission);
    }

    return false;
};
//Check Module Permission Access Control
const checkIsAccessableMultiple = (modulename, permissions) => {
   
    if (roleName == config.superAdmin ) return true;
    const modulePermission = StorageData?.getUserData()?.role?.rolePermissions;
    // //console.log("Af",modulePermission)
    const module = modulePermission.find(
        (module) => module.moduleName === modulename
    );
    
    if (module) {
      
        return permissions.every(permission => module.modulePermissions.includes(permission));
    }

    return false;
};
//Page Module Access Control
const CheckPermission = ({ moduleName, children }) => {
    // moduleName = moduleName.split("/")[1];

    if (checkModuleNamePresent(moduleName)) {
        return children;
    }
    return <Navigate to={"/denied"} replace />;
};
//Each Module Permission Access Control
const IsAccessable = ({ modulename, permission, children }) => {
    modulename = modulename.split("/")[1];
    if (checkIsAccessable(modulename, permission)) {
        return children;
    }
    return false;
};

const IsAccessableMultiple = ({ modulename, permission, children }) => {
    modulename = modulename.split("/")[1];
     
    if (checkIsAccessableMultiple(modulename, permission)) {
      
        return children;
    }
    return false;
};
//Each Module Permission Access Control
const CheckPageIsAccessable = ({ modulename, permission, children }) => {
    const [isLoading, setIsLoading] = useState(true); // State to track loading status
    const [isAccessible, setIsAccessible] = useState(false); // State to track accessibility status

    useEffect(() => {
        // Simulate an asynchronous operation (e.g., check access)
        setTimeout(() => {
            modulename = modulename.split("/")[1]; // Extract module name from pathname
            const isAccessAllowed = checkIsAccessable(modulename, permission); // Perform access check
            setIsAccessible(isAccessAllowed); // Update accessibility status
            setIsLoading(false); // Set loading to false after check is complete
        }, 1000); // Replace with actual access check logic
    }, [modulename, permission]); // Ensure useEffect runs when modulename or permission change

    if (isLoading) {
        return <Loader/>; // Replace with your preferred loading indicator/spinner
    }

    if (isAccessible) {
        return children; // Render children if access is allowed
    }

    return <Navigate to={"/denied"} replace />; // Redirect if access is denied
};
// Navbar Access Control
function HasPermission(permission) {
    // const {data,isLoading}=useQuery(['permission-data'],()=>)
    return checkModuleNamePresent(permission);
}
const CheckAccess = (module1, module2) => {
    const modulePermission = StorageData?.getUserData()?.role?.rolePermissions;
    const modules = modulePermission.map((item) => item.moduleName);
    const hasModule1 = modules.includes(module1);
    const hasModule2 = modules.includes(module2);
    if (roleName == config.superAdmin) return true;
    if (hasModule1 && hasModule2) {
        return module1;
    } else if (hasModule1) {
        return module1;
    } else if (hasModule2) {
        return module2;
    }
    return null;
};

// CheckAccess("staffs","roles")
export { CheckPermission, IsAccessable,IsAccessableMultiple, HasPermission, CheckAccess, CheckPageIsAccessable,checkIsAccessableMultiple };
