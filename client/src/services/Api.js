import axios from 'axios';
import router from '@/router';

const Api = axios.create({
  baseURL: 'http://localhost:5003/api/v1/',
  withCredentials: true,
});

const requestHandler = (request) => {
  return request;
};

const responseHandler = (response) => {
  return response;
};

const errorHandler = (error) => {
  if (error.response.status === 401 || error.response.status === 403) {
    //  console.log(error.response);
    router.push({
      name: 'login',
    });
  }
  return Promise.reject(error);
};

Api.interceptors.request.use(
  (request) => requestHandler(request),
  (error) => errorHandler(error)
);
Api.interceptors.response.use(
  (response) => responseHandler(response),
  (error) => errorHandler(error)
);

export default () => Api;
