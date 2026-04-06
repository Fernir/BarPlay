import axios from 'axios';
import { Song } from '../types';

const API_BASE_URL = 'http://localhost:3001/api';

class API {
  private token: string | null = null;

  setToken(token: string) {
    this.token = token;
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  }

  async login(email: string, password: string) {
    const response = await axios.post(`${API_BASE_URL}/auth/login`, { email, password });
    return response.data;
  }

  async register(email: string, username: string, password: string) {
    const response = await axios.post(`${API_BASE_URL}/auth/register`, {
      email,
      username,
      password,
    });
    return response.data;
  }

  async getSongs(search?: string) {
    const url = search ? `${API_BASE_URL}/songs?search=${search}` : `${API_BASE_URL}/songs`;
    const response = await axios.get(url);
    return response.data?.songs as Song[];
  }

  async getSong(id: string) {
    const response = await axios.get(`${API_BASE_URL}/songs/${id}`);
    return response.data as Song;
  }

  async createSong(song: any) {
    const response = await axios.post(`${API_BASE_URL}/songs`, song);
    return response.data as Song;
  }

  async updateSong(id: string, song: any) {
    const response = await axios.patch(`${API_BASE_URL}/songs/${id}`, song);
    return response.data as Song;
  }

  async deleteSong(id: string) {
    const response = await axios.delete(`${API_BASE_URL}/songs/${id}`);
    return response.data;
  }

  async likeSong(id: string) {
    const response = await axios.post(`${API_BASE_URL}/songs/${id}/like`);
    return response.data;
  }

  async getUsers() {
    const response = await axios.get(`${API_BASE_URL}/users`);
    return response.data;
  }

  async getStats() {
    const response = await axios.get(`${API_BASE_URL}/users/stats`);
    return response.data;
  }

  async banUser(userId: string) {
    const response = await axios.delete(`${API_BASE_URL}/users/${userId}/ban`);
    return response.data;
  }

  async updateUserRole(userId: string, role: string) {
    const response = await axios.patch(`${API_BASE_URL}/users/${userId}/role/${role}`);
    return response.data;
  }

  async getGroupedArtists() {
    const response = await axios.get(`${API_BASE_URL}/songs/artists/grouped`);
    return response.data;
  }
}

export const api = new API();
