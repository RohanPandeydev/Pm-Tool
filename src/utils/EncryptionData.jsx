import CryptoJS from 'crypto-js';
                                    
const  EncryptData = (data, salt) =>
 CryptoJS.AES.encrypt(JSON.stringify(data), salt).toString();

export default EncryptData;