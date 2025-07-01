// Twitter API integration utilities
export interface TwitterApiResponse {
  posts: Array<{
    id: string;
    text: string;
    author_id: string;
    created_at: string;
    public_metrics: {
      retweet_count: number;
      like_count: number;
      reply_count: number;
    };
    attachments?: {
      media_keys: string[];
    };
  }>;
  includes?: {
    users: Array<{
      id: string;
      username: string;
      name: string;
    }>;
    media?: Array<{
      media_key: string;
      url: string;
    }>;
  };
}

export async function fetchTwitterPosts(): Promise<TwitterApiResponse | null> {
  const bearerToken = import.meta.env.VITE_TWITTER_BEARER_TOKEN || 
                     import.meta.env.VITE_TWITTER_API_KEY;
  
  if (!bearerToken) {
    console.error("Twitter API credentials not found");
    return null;
  }

  try {
    const response = await fetch("/api/twitter/refresh", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Failed to fetch Twitter posts:", error);
    return null;
  }
}

export function formatTwitterPost(post: any, users: any[], media: any[] = []) {
  const author = users.find(user => user.id === post.author_id);
  const postMedia = post.attachments?.media_keys?.map((key: string) => 
    media.find(m => m.media_key === key)
  ).filter(Boolean);

  return {
    tweetId: post.id,
    content: post.text,
    author: author?.name || "Unknown",
    handle: author?.username || "unknown",
    createdAt: new Date(post.created_at),
    likes: post.public_metrics?.like_count || 0,
    retweets: post.public_metrics?.retweet_count || 0,
    replies: post.public_metrics?.reply_count || 0,
    imageUrl: postMedia?.[0]?.url || null,
  };
}
