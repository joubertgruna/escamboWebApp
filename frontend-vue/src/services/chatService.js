import api from './api';

export default {
  getMessages(matchId, page = 1) {
    return api.get(`/matches/${matchId}/messages`, { params: { page } });
  },
  sendMessage(matchId, content) {
    return api.post(`/matches/${matchId}/messages`, { content });
  },
};
