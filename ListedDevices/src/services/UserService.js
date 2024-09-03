import http from "../http-common";

const authenticate = (user) => {
  return http.post(`/auth/authenticate`, user);
};

const register = (user) => {
  return http.post(`/auth/register`, user);
};

const UserService = {
  authenticate,
  register,
};

export default UserService;
