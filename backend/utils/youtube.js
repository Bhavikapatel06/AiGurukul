/**
 * utils/youtube.js — NEW FILE
 * Path: backend/utils/youtube.js
 * Fetches videos from Saregama Bhakti channel by Adhyay number
 *
 * HOW TO FIND YOUR CHANNEL ID:
 * 1. Go to Saregama Bhakti YouTube channel
 * 2. Right-click → View Page Source
 * 3. Search for "channelId" — copy the value (starts with UC...)
 */
const CHANNEL_ID  = 'UCxxxxxxxxxxxxxxxxxxxxxxx'; // ← replace with Saregama Bhakti channel ID
const MAX_RESULTS = 5;

async function fetchAdhyayVideos(adhyay) {
  const apiKey = process.env.YOUTUBE_API_KEY;
  if (!apiKey) throw new Error('YOUTUBE_API_KEY not set in .env');

  const query = `Bhagavad Gita Adhyay ${adhyay}`;
  const url   = new URL('https://www.googleapis.com/youtube/v3/search');
  url.searchParams.set('part',       'snippet');
  url.searchParams.set('channelId',  CHANNEL_ID);
  url.searchParams.set('q',          query);
  url.searchParams.set('type',       'video');
  url.searchParams.set('maxResults', MAX_RESULTS);
  url.searchParams.set('order',      'relevance');
  url.searchParams.set('key',        apiKey);

  const res = await fetch(url.toString());
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error?.message || 'YouTube API error');
  }

  const data = await res.json();
  return data.items.map(item => ({
    videoId:     item.id.videoId,
    title:       item.snippet.title,
    description: item.snippet.description,
    thumbnail:   item.snippet.thumbnails?.medium?.url || '',
    publishedAt: item.snippet.publishedAt,
    embedUrl:    `https://www.youtube.com/embed/${item.id.videoId}`,
    watchUrl:    `https://www.youtube.com/watch?v=${item.id.videoId}`,
  }));
}

module.exports = { fetchAdhyayVideos };
