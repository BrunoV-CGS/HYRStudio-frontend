export const API_URL_BASE = import.meta.env.VITE_API_URL_PRODUCTI || "http://localhost:3000";

export const API_URL_CONTENT_REQUEST = `${API_URL_BASE}/content/generate`;

export const API_URL_GOOGLE_IMAGE_REQUEST = `${API_URL_BASE}/generate/image/gemini`;

export const API_URL_GET_CONTENT_REQUEST = `${API_URL_BASE}/content/all`;

export const API_URL_CONTENT_REVIEW = `${API_URL_BASE}/content/review`;

export const API_URL_GET_REVIEWED_CONTENT_REQUEST = `${API_URL_BASE}/content/reviewed`;

export const API_URL_SEND_TO_MIXPOST = `${API_URL_BASE}/mixpost/draft`;

export const API_URL_USER_INFO = `${API_URL_BASE}/auth/me`;

export const API_URL_UPDATE_KNOWLEDGE_BASE = `${API_URL_BASE}/knowledge-base/update`;

//--------------------------------------------------------

export const API_URL_CREATE_USERS = `${API_URL_BASE}/users`;

export const API_URL_GET_USERS = `${API_URL_BASE}/users/all`;

//--------------------------------------------------------

export const API_URL_CREATE_COMPANY = `${API_URL_BASE}/companies`;

export const API_URL_GET_COMPANIES = `${API_URL_BASE}/companies/all`;



