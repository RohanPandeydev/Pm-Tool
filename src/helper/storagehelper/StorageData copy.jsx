import config from "../../config";
import DecryptData from "../../utils/Decryption";
import EncryptData from "../../utils/EncryptionData";

class StorageData {
    setToken(data) {
        localStorage.setItem("pmtool_token", data);
    }
    setData = async (data) => {
        try {
            //console.log(data)
            const encryptedInfo =await  EncryptData(data, config.secretKey);
            localStorage.setItem("pmtool_user_details", encryptedInfo);
            //console.log("Encrypted data:", encryptedInfo);
            return;
        } catch(err) { 
            //console.log(err?.message)
        }
    };

    getToken() {
        return localStorage.getItem("pmtool_token");
    }
    getUserData = async () => {
        // try {
        //     const decrypted =await  DecryptData(
        //         localStorage.getItem("pmtool_user_details"),
        //         config.secretKey
        //     );
        //     //console.log("Decrypt",decrypted)
        //     return  decrypted;
        // } catch(err) {
        //     //console.log("hh",err?.message)
        //  }
        
    };

    removeData() {
        localStorage.removeItem("pmtool_user_details");
        localStorage.removeItem("pmtool_token");
        return;
        // return localStorage.clear()
    }
}

export default StorageData = new StorageData();
