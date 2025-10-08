/* src/lib/storageApi.js */
const USERS_KEY = "mm_users";
const PROFILES_KEY = "mm_profiles";

const storageApi = {
  register(email, password) {
    const users = JSON.parse(localStorage.getItem(USERS_KEY) || "{}");
    if (users[email]) return false; // user exists
    users[email] = { email, password };
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    return true;
  },

  login(email, password) {
    const users = JSON.parse(localStorage.getItem(USERS_KEY) || "{}");
    if (users[email] && users[email].password === password) {
      localStorage.setItem("mm_session_email", email);
      return true;
    }
    return false;
  },

  logout() {
    localStorage.removeItem("mm_session_email");
  },

  getSession() {
    return localStorage.getItem("mm_session_email");
  },

  saveProfile(email, profile) {
    const profiles = JSON.parse(localStorage.getItem(PROFILES_KEY) || "{}");
    profiles[email] = profile;
    localStorage.setItem(PROFILES_KEY, JSON.stringify(profiles));
  },

  getProfile(email) {
    const profiles = JSON.parse(localStorage.getItem(PROFILES_KEY) || "{}");
    return profiles[email] || null;
  },
};

export default storageApi;
