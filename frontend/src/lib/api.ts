import axios from 'axios';

// Get backend URL from env vars or fallback to localhost directly
export const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const api = axios.create({
  baseURL: API_BASE,
});

// Helper for images since DB doesn't have images
export const getPlaceholderImage = (id: string | number = 1) => 
  `https://via.placeholder.com/600x400?text=Produit+${id}`;
