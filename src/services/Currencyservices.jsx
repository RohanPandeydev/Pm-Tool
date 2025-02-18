
import axios from "axios"
import config from "../config"
import HttpHeaders from "../helper/httphelper/HttpHeaders"


const CurrencyServices = {}

CurrencyServices.get = () => {
    
    return axios.get(`${config.apiUrl}/api/currency/get`,HttpHeaders.getAuthHeader())
}

export default CurrencyServices;