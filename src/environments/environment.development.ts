const BASE_URL = 'http://localhost:3242';
export const environment = {
  production: false,
  BASE_URL,
  AUTH_API_URL: `${BASE_URL}/api/auth`,
  AUTH_API_LOGIN_URL: `${BASE_URL}/api/auth/login`,
  AUTH_API_LOGOUT_URL: `${BASE_URL}/api/auth/logout`,
  AUTH_API_REFRESH_URL: `${BASE_URL}/api/auth/refresh`,
  AUTH_API_ME_URL: `${BASE_URL}/api/auth/me`,
  VACANCIES_API_URL: `${BASE_URL}/api/vacancies`,
  VACANCIES_APPLICATIONS_API_URL: `${BASE_URL}/api/applications`,
  VACANCIES_FAVORITES_API_URL: `${BASE_URL}/api/favorites`,
  VACANCIES_SET_FAVORITE_API_URL: `${BASE_URL}/api/favorites/toggle`,
};
