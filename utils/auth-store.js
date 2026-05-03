// utils/auth-store.js

export const authStore = {
  setSession(accessToken, refreshToken, usuario) {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    localStorage.setItem('usuario', JSON.stringify(usuario));
  },
  getAccessToken() {
    return localStorage.getItem('accessToken');
  },
  getRefreshToken() {
    return localStorage.getItem('refreshToken');
  },
  getUsuario() {
    const userStr = localStorage.getItem('usuario');
    return userStr ? JSON.parse(userStr) : null;
  },
  getRol() {
    const user = this.getUsuario();
    return user ? user.rol : null;
  },
  getNombre() {
    const user = this.getUsuario();
    return user ? user.nombre : null;
  },
  isAuthenticated() {
    return !!this.getAccessToken();
  },
  clear() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('usuario');
  },
  updateAccessToken(newToken) {
    localStorage.setItem('accessToken', newToken);
  }
};
