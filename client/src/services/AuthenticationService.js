import Api from '@/services/Api';

export default {
  login(credintials) {
    return Api().post('/users/login', credintials);
  },
};
