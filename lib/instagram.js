// lib/instagram.js
import axios from 'axios';

export async function getInstagramFollowersCount(accessToken) {
  try {
    const response = await axios.get(
      `https://graph.instagram.com/me?fields=followers_count&access_token=${accessToken}`
    );
    return response.data.followers_count;
  } catch (error) {
    console.error('Error fetching Instagram followers count:', error);
    return null;
  }
}
