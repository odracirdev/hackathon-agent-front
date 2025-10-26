// Axios-based API helper that reads the base URL from Vite env vars
// Usage:
// import { apiClient, apiFetch } from '@/lib/api';
// const { data } = await apiClient.get('/agents');
// or
// const data = await apiFetch('/agents');

import axios from 'axios';
import type { AxiosInstance, AxiosRequestConfig } from 'axios';

const API_AGENT = (import.meta as any).env?.VITE_API_AGENT || '';

function normalizeBase(base: string) {
  return base.replace(/\/+$/, '');
}

export const apiAgent: AxiosInstance = axios.create({
  baseURL: API_AGENT ? normalizeBase(API_AGENT) : undefined,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

export async function apiFetchAgent<T = any>(path: string, config: AxiosRequestConfig = {}) {
  const url = path;
  try {
    const res = await apiAgent.request<T>({ url, ...config });
    return res.data;
  } catch (err: any) {
    // Normalize error for callers
    const message = err?.response
      ? `API Agents request failed: ${err.response.status} ${err.response.statusText}`
      : err.message;
    const error = new Error(message);
    (error as any).original = err;
    throw error;
  }
}

export { API_AGENT };

// ---- Second API client (optional) ----
// Use VITE_API_DETAILS to point to the inventory backend.
// Example in .env: VITE_API_DETAILS=https://api-2.example.com/api
const API_DETAILS = (import.meta as any).env?.VITE_API_DETAILS || '';

export const apiDetails: AxiosInstance = axios.create({
  baseURL: API_DETAILS ? normalizeBase(API_DETAILS) : undefined,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

export async function apiFetchDetails<T = any>(path: string, config: AxiosRequestConfig = {}) {
  const url = path;
  try {
    const res = await apiDetails.request<T>({ url, ...config });
    return res.data;
  } catch (err: any) {
    const message = err?.response
      ? `API Details request failed: ${err.response.status} ${err.response.statusText}`
      : err.message;
    const error = new Error(message);
    (error as any).original = err;
    throw error;
  }
}

export { API_DETAILS };
