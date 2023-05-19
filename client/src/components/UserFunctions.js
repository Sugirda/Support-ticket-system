import axios from 'axios';

export const register = (newUser) => {
  return axios
    .post('/users/register', newUser)
    .then((response) => {
      console.log('Registered');
    })
    .catch((error) => {
      console.log(error);
    });
};

export const login = (user) => {
  return axios
    .post('/users/login', user)
    .then((response) => {
      localStorage.setItem('usertoken', response.data);
      return response.data;
    })
    .catch((error) => {
      console.log(error);
    });
};

export const getProfile = () => {
  return axios
    .get('/users/profile')
    .then((response) => {
      console.log(response);
      return response.data;
    })
    .catch((error) => {
      console.log(error);
    });
};