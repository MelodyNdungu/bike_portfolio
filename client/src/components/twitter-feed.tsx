import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { MessageCircle, Repeat2, Heart, ExternalLink } from "lucide-react";
import type { TwitterPost } from "@shared/schema";

export default function TwitterFeed() {
  const { data: posts, isLoading, refetch } = useQuery<TwitterPost[]>({
    queryKey: ["/api/twitter/posts"],
    refetchInterval: 300000, // Refetch every 5 minutes
  });

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - new Date(date).getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return "now";
    if (diffInMinutes < 60) return `${diffInMinutes}m`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h`;
    return `${Math.floor(diffInMinutes / 1440)}d`;
  };

  return (
    <section id="twitter" className="py-20 bg-dark-primary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="font-bold text-4xl md:text-5xl mb-4">Latest Tips & Advice</h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Follow my Twitter for daily motorcycle tips, safety advice, and industry insights.
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <Card className="bg-dark-secondary border-chrome-dark p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="text-orange-accent text-2xl">🐦</div>
                <span className="font-semibold text-xl text-white">@NduthiGear Live Feed</span>
              </div>
              <div className="text-gray-400 text-sm">
                Last updated: <span>Live</span>
              </div>
            </div>
            
            <div className="space-y-6">
              {isLoading ? (
                // Loading skeletons
                Array.from({ length: 3 }).map((_, index) => (
                  <Card key={index} className="bg-dark-primary border-chrome-dark p-4">
                    <div className="flex items-start space-x-3">
                      <Skeleton className="w-10 h-10 rounded-full" />
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center space-x-2">
                          <Skeleton className="h-4 w-20" />
                          <Skeleton className="h-4 w-16" />
                          <Skeleton className="h-4 w-8" />
                        </div>
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-3/4" />
                        <div className="flex space-x-6">
                          <Skeleton className="h-4 w-8" />
                          <Skeleton className="h-4 w-8" />
                          <Skeleton className="h-4 w-8" />
                        </div>
                      </div>
                    </div>
                  </Card>
                ))
              ) : posts?.length ? (
                posts.map((post) => (
                  <Card 
                    key={post.id}
                    className="bg-dark-primary border-chrome-dark hover:border-orange-accent transition-colors duration-200 p-4"
                  >
                    <div className="flex items-start space-x-3">
                      <div className="w-10 h-10 bg-orange-accent rounded-full flex items-center justify-center">
                        <span className="text-dark-primary text-xl">🏍️</span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="font-semibold text-white">{post.author}</span>
                          <span className="text-orange-accent">@{post.handle}</span>
                          <span className="text-gray-400 text-sm">• {formatTimeAgo(post.createdAt)}</span>
                        </div>
                        <p className="text-gray-300 mb-3">
                          {post.content}
                        </p>
                        {post.imageUrl && (
                          <img 
                            src={post.imageUrl} 
                            alt="Tweet image" 
                            className="w-full h-48 object-cover rounded-lg mb-3"
                          />
                        )}
                        <div className="flex items-center space-x-6 text-gray-400 text-sm">
                          <button className="hover:text-orange-accent transition-colors flex items-center space-x-1">
                            <MessageCircle className="h-4 w-4" />
                            <span>{post.replies}</span>
                          </button>
                          <button className="hover:text-orange-accent transition-colors flex items-center space-x-1">
                            <Repeat2 className="h-4 w-4" />
                            <span>{post.retweets}</span>
                          </button>
                          <button className="hover:text-orange-accent transition-colors flex items-center space-x-1">
                            <Heart className="h-4 w-4" />
                            <span>{post.likes}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-400 text-lg">No tweets available. Check back later for updates!</p>
                </div>
              )}
            </div>
          </Card>
          
          <div className="text-center">
            <Button 
              asChild
              className="bg-orange-accent hover:bg-orange-600 text-white"
            >
              <a href="https://twitter.com/nduthigear" target="_blank" rel="noopener noreferrer">
                <ExternalLink className="mr-2 h-4 w-4" />
                Follow on Twitter
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
