
import CryptoJS from 'crypto-js';

  const DecryptData = (ciphertext, salt) => {
    const bytes = CryptoJS.AES.decrypt(ciphertext, salt);
    try {
     return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    }catch(err){
     return null;
     }
    }

    export default DecryptData;