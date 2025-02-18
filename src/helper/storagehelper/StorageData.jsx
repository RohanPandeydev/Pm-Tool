
import  secureLocalStorage  from  "react-secure-storage";
import config from "../../config";


class StorageData {
    setToken(data) {
        secureLocalStorage.setItem(config.localStorageUserToken, data);
    }
    setData(data) {
        secureLocalStorage.setItem(config?.localStorageUserDetails, JSON.stringify(data));
    }
    getToken() {
        return secureLocalStorage.getItem(config.localStorageUserToken);
    }
    setBoardId(data) {
        secureLocalStorage.setItem(config?.localStorageBoardId, JSON.stringify(data));
    }
    getBoardId() {
        return JSON.parse(secureLocalStorage.getItem(config.localStorageBoardId));
    }
    getUserData() {
        return JSON.parse(secureLocalStorage.getItem(config?.localStorageUserDetails));
    }
    removeData() {
        secureLocalStorage.removeItem(config?.localStorageUserDetails);
        secureLocalStorage.removeItem(config.localStorageUserToken);
        secureLocalStorage.removeItem(config.localStorageBoardId);
return
        // return localStorage.clear()
    }
}

export default StorageData = new StorageData();
