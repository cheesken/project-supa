import { projectId, publicAnonKey } from './supabase/info';
import { supabase } from './supabase/client';

const API_URL = `https://${projectId}.supabase.co/functions/v1/make-server-c7840ac0`;

const getHeaders = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  const token = session?.access_token || publicAnonKey;
  
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
};

export const api = {
  // Profile endpoints
  async getProfile(userId: string) {
    try {
      const headers = await getHeaders();
      const response = await fetch(`${API_URL}/profile/${userId}`, { headers });
      if (!response.ok && response.status !== 404) {
        throw new Error('Failed to fetch profile');
      }
      return response.status === 404 ? null : await response.json();
    } catch (error) {
      console.error('Error fetching profile:', error);
      return null;
    }
  },

  async saveProfile(userId: string, profileData: any) {
    try {
      const headers = await getHeaders();
      const response = await fetch(`${API_URL}/profile/${userId}`, {
        method: 'POST',
        headers,
        body: JSON.stringify(profileData)
      });
      if (!response.ok) throw new Error('Failed to save profile');
      return await response.json();
    } catch (error) {
      console.error('Error saving profile:', error);
      throw error;
    }
  },

  // Orders endpoints
  async getOrders(userId: string) {
    try {
      const headers = await getHeaders();
      const response = await fetch(`${API_URL}/orders/${userId}`, { headers });
      if (!response.ok) throw new Error('Failed to fetch orders');
      return await response.json();
    } catch (error) {
      console.error('Error fetching orders:', error);
      return [];
    }
  },

  async addOrder(userId: string, orderData: any) {
    try {
      const headers = await getHeaders();
      const response = await fetch(`${API_URL}/orders/${userId}`, {
        method: 'POST',
        headers,
        body: JSON.stringify(orderData)
      });
      if (!response.ok) throw new Error('Failed to add order');
      return await response.json();
    } catch (error) {
      console.error('Error adding order:', error);
      throw error;
    }
  },

  async saveOrder(userId: string, orderData: any) {
    return this.addOrder(userId, orderData);
  },

  // Social connections endpoints
  async getSocialConnections(userId: string) {
    try {
      const headers = await getHeaders();
      const response = await fetch(`${API_URL}/social/${userId}`, { headers });
      if (!response.ok) throw new Error('Failed to fetch social connections');
      return await response.json();
    } catch (error) {
      console.error('Error fetching social connections:', error);
      return { instagram: false, tiktok: false, pinterest: false };
    }
  },

  async saveSocialConnections(userId: string, connections: any) {
    try {
      const headers = await getHeaders();
      const response = await fetch(`${API_URL}/social/${userId}`, {
        method: 'POST',
        headers,
        body: JSON.stringify(connections)
      });
      if (!response.ok) throw new Error('Failed to save social connections');
      return await response.json();
    } catch (error) {
      console.error('Error saving social connections:', error);
      throw error;
    }
  },

  // Moodboards endpoints
  async getMoodboards(userId: string) {
    try {
      const headers = await getHeaders();
      const response = await fetch(`${API_URL}/moodboards/${userId}`, { headers });
      if (!response.ok) throw new Error('Failed to fetch moodboards');
      return await response.json();
    } catch (error) {
      console.error('Error fetching moodboards:', error);
      return [];
    }
  },

  async saveMoodboard(userId: string, moodboardData: any) {
    try {
      const headers = await getHeaders();
      const response = await fetch(`${API_URL}/moodboards/${userId}`, {
        method: 'POST',
        headers,
        body: JSON.stringify(moodboardData)
      });
      if (!response.ok) throw new Error('Failed to save moodboard');
      return await response.json();
    } catch (error) {
      console.error('Error saving moodboard:', error);
      throw error;
    }
  },

  async deleteAllMoodboards(userId: string) {
    try {
      const headers = await getHeaders();
      const response = await fetch(`${API_URL}/moodboards/${userId}`, {
        method: 'DELETE',
        headers
      });
      if (!response.ok) throw new Error('Failed to delete moodboards');
      return await response.json();
    } catch (error) {
      console.error('Error deleting moodboards:', error);
      throw error;
    }
  },

  // Wishlist endpoints
  async getWishlist(userId: string) {
    try {
      const headers = await getHeaders();
      const response = await fetch(`${API_URL}/wishlist/${userId}`, { headers });
      if (!response.ok) throw new Error('Failed to fetch wishlist');
      return await response.json();
    } catch (error) {
      console.error('Error fetching wishlist:', error);
      return [];
    }
  },

  async saveWishlist(userId: string, wishlistData: any) {
    try {
      const headers = await getHeaders();
      const response = await fetch(`${API_URL}/wishlist/${userId}`, {
        method: 'POST',
        headers,
        body: JSON.stringify(wishlistData)
      });
      if (!response.ok) throw new Error('Failed to save wishlist');
      return await response.json();
    } catch (error) {
      console.error('Error saving wishlist:', error);
      throw error;
    }
  },

  // Style analysis endpoints
  async getStyleAnalysis(userId: string) {
    try {
      const headers = await getHeaders();
      const response = await fetch(`${API_URL}/style-analysis/${userId}`, { headers });
      if (!response.ok) throw new Error('Failed to fetch style analysis');
      return await response.json();
    } catch (error) {
      console.error('Error fetching style analysis:', error);
      return null;
    }
  },

  async saveStyleAnalysis(userId: string, styleData: any) {
    try {
      const headers = await getHeaders();
      const response = await fetch(`${API_URL}/style-analysis/${userId}`, {
        method: 'POST',
        headers,
        body: JSON.stringify(styleData)
      });
      if (!response.ok) throw new Error('Failed to save style analysis');
      return await response.json();
    } catch (error) {
      console.error('Error saving style analysis:', error);
      throw error;
    }
  },

  // Pinterest endpoints
  async getPinterestAuthUrl(userId: string, redirectUri: string) {
    try {
      const headers = await getHeaders();
      const response = await fetch(`${API_URL}/pinterest/auth-url?userId=${userId}&redirectUri=${encodeURIComponent(redirectUri)}`, { headers });
      if (!response.ok) throw new Error('Failed to get Pinterest auth URL');
      return await response.json();
    } catch (error) {
      console.error('Error getting Pinterest auth URL:', error);
      throw error;
    }
  },

  async completePinterestAuth(code: string, state: string, redirectUri: string) {
    try {
      const headers = await getHeaders();
      const response = await fetch(`${API_URL}/pinterest/callback?redirectUri=${encodeURIComponent(redirectUri)}`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ code, state })
      });
      if (!response.ok) throw new Error('Failed to complete Pinterest authentication');
      return await response.json();
    } catch (error) {
      console.error('Error completing Pinterest auth:', error);
      throw error;
    }
  },

  async getPinterestBoards(userId: string) {
    try {
      const headers = await getHeaders();
      const response = await fetch(`${API_URL}/pinterest/boards/${userId}`, { headers });
      if (!response.ok) throw new Error('Failed to fetch Pinterest boards');
      return await response.json();
    } catch (error) {
      console.error('Error fetching Pinterest boards:', error);
      throw error;
    }
  },

  async getPinterestPins(userId: string, boardId: string) {
    try {
      const headers = await getHeaders();
      const response = await fetch(`${API_URL}/pinterest/pins/${userId}/${boardId}`, { headers });
      if (!response.ok) throw new Error('Failed to fetch Pinterest pins');
      return await response.json();
    } catch (error) {
      console.error('Error fetching Pinterest pins:', error);
      throw error;
    }
  },

  async disconnectPinterest(userId: string) {
    try {
      const headers = await getHeaders();
      const response = await fetch(`${API_URL}/pinterest/disconnect/${userId}`, {
        method: 'DELETE',
        headers
      });
      if (!response.ok) throw new Error('Failed to disconnect Pinterest');
      return await response.json();
    } catch (error) {
      console.error('Error disconnecting Pinterest:', error);
      throw error;
    }
  },

  // Inspiration endpoints
  async getInspiration(userId: string) {
    try {
      const headers = await getHeaders();
      const response = await fetch(`${API_URL}/inspiration/${userId}`, { headers });
      if (!response.ok) throw new Error('Failed to fetch inspiration');
      return await response.json();
    } catch (error) {
      console.error('Error fetching inspiration:', error);
      return null;
    }
  },

  async saveInspiration(userId: string, inspirationImages: string[]) {
    try {
      const headers = await getHeaders();
      const response = await fetch(`${API_URL}/inspiration/${userId}`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ images: inspirationImages })
      });
      if (!response.ok) throw new Error('Failed to save inspiration');
      return await response.json();
    } catch (error) {
      console.error('Error saving inspiration:', error);
      throw error;
    }
  }
};