import { BASE_URL } from "../Url/BaseUrl";
import router from '@/router';

export function ApiFormData(method, url, data) {
  var user = localStorage.getItem("userData");

  var token = "";
  if (user) {
    token = JSON.parse(localStorage.getItem("userData")).token;
  }
  console.log("token config", token);
  var axios = require("axios");
  var config = {
    method: `${method}`, //'post',
    maxBodyLength: Infinity,
    url: `${BASE_URL + url}`, //'http://192.168.1.18:3306/get-started/create-company',
    headers: {
      Authorization: `Bearer ${token}`,
    
    },
    data,
  };

  return axios(config)
    .then(function (response) {
      return response;
      // console.log(JSON.stringify(response.data));
    })
    .catch(function (error) {
      if([401,403,500,400].includes(error.response.status)){
        localStorage.clear()
        router.push('/login'); }
        return error.response
    
      //console.log(error);
    });
}