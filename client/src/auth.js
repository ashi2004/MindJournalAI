export function saveToken(token) {
  localStorage.setItem("mindjournalai_token", token);
}

export function getToken() {
  return localStorage.getItem("mindjournalai_token");
}

export function removeToken() {
  localStorage.removeItem("mindjournalai_token");
}