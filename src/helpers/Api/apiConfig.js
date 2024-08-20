import { BASE_URL } from '@/helpers/Url/baseUrl';
import axios from 'axios';
import router from '@/router'


export async function Api(method, url, data) {

  var token = ''
  token = localStorage.getItem('AccessToken');
  // console.log('token config',token);

  data = JSON.stringify(data);

  var config = {
    method: `${method}`,//'post',
    maxBodyLength: Infinity,
    url: `${BASE_URL + url}`,
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    data: data
  };

  return axios(config)
    .then(function (response) {
      return response
      // console.log(JSON.stringify(response.data));
    })
    .catch(function (error) {
      // console.log('errrr api config',error);

      if ([401, 403, 500, 400].includes(error.response.status)) {
        localStorage.clear()
        router.push('/login');
      }


      return error.response

      //console.log(error);
    });


}
