

import StorageData from '../helper/storagehelper/StorageData'
import { toast } from 'react-toastify'

const ValidateAuthenticationKey = (statusCode, msg) => {

    if (statusCode === 401) {
        toast.error(msg, { delay: 10 })
        StorageData.removeData()
        setTimeout(() => {
            return window.location.replace('/login')
        }, 700)
    }

    return
}

export default ValidateAuthenticationKey