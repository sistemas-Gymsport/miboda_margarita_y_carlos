import { api } from './api';

const LONG = { timeout: 120000 };

export const authService = {
  login: (username, password) => api.post('/auth/login', { username, password }, { retries: 2, timeout: 45000 }),
  logout: () => api.post('/auth/logout'),
  me: () => api.get('/auth/me', { retries: 2, timeout: 45000 }),
  changePassword: (currentPassword, newPassword) => api.put('/auth/password', { currentPassword, newPassword }),
};

function collection(path) {
  return {
    list: () => api.get(path),
    create: (data) => api.post(path, data),
    update: (id, data) => api.put(`${path}/${id}`, data),
    remove: (id) => api.delete(`${path}/${id}`),
    reorder: (ids) => api.put(`${path}/reorder`, { ids }),
  };
}

export const adminService = {
  getInvitation: () => api.get('/admin/invitation', { retries: 2, timeout: 45000 }),
  updateWedding: (data) => api.put('/admin/wedding', data),
  updateContent: (data) => api.put('/admin/content', data),
  updateTheme: (data) => api.put('/admin/theme', data),
  updateWhatsapp: (data) => api.put('/admin/whatsapp', data),
  updateGifts: (data) => api.put('/admin/gifts', data),
  updateBank: (data) => api.put('/admin/bank', data),

  schedule: collection('/admin/schedule'),
  locations: collection('/admin/locations'),

  gallery: {
    list: () => api.get('/admin/gallery'),
    upload: (files) => {
      const form = new FormData();
      files.forEach((file) => form.append('images', file));
      return api.post('/admin/gallery', form, LONG);
    },
    replace: (id, file) => {
      const form = new FormData();
      form.append('image', file);
      return api.put(`/admin/gallery/${id}/replace`, form, LONG);
    },
    update: (id, data) => api.put(`/admin/gallery/${id}`, data),
    remove: (id) => api.delete(`/admin/gallery/${id}`),
    setMain: (id) => api.put(`/admin/gallery/${id}/main`),
    reorder: (ids) => api.put('/admin/gallery/reorder', { ids }),
  },
};
