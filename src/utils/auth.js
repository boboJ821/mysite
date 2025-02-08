export const checkAuth = () => {
  const token = localStorage.getItem('admin_token');
  return !!token;
};

export const login = (password) => {
  // 这里使用简单的密码验证，实际应用中应该使用更安全的方式
  if (password === import.meta.env.VITE_ADMIN_PASSWORD) {
    const token = Date.now().toString();
    localStorage.setItem('admin_token', token);
    return true;
  }
  return false;
};

export const logout = () => {
  localStorage.removeItem('admin_token');
}; 