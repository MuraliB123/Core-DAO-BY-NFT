import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';
import VideoCard from '@/components/VideoCard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TrendingUp, Flame, Music, Gamepad2, Film, Trophy } from 'lucide-react';

// Dummy video data
const dummyVideos = [
  {
    id: '1',
    title: 'How to Build Amazing React Apps with TypeScript',
    thumbnail: 'https://picsum.photos/400/225?random=1',
    channel: {
      name: 'Tech Tutorials',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=tech'
    },
    views: 1250000,
    publishedAt: new Date(2024, 0, 15),
    duration: '15:32',
    category: 'Technology'
  },
  {
    id: '2',
    title: 'Beautiful UI Design Principles for Modern Web Apps',
    thumbnail: 'https://picsum.photos/400/225?random=2',
    channel: {
      name: 'Design Masters',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=design'
    },
    views: 890000,
    publishedAt: new Date(2024, 0, 20),
    duration: '22:45',
    category: 'Design'
  },
  {
    id: '3',
    title: 'Latest JavaScript Features You Should Know in 2024',
    thumbnail: 'https://picsum.photos/400/225?random=3',
    channel: {
      name: 'Code Academy',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=code'
    },
    views: 2100000,
    publishedAt: new Date(2024, 1, 5),
    duration: '18:20',
    category: 'Programming'
  },
  {
    id: '4',
    title: 'Epic Gaming Moments - Best Highlights Compilation',
    thumbnail: 'https://picsum.photos/400/225?random=4',
    channel: {
      name: 'Gaming Zone',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=gaming'
    },
    views: 5600000,
    publishedAt: new Date(2024, 1, 10),
    duration: '12:15',
    category: 'Gaming'
  },
  {
    id: '5',
    title: 'Relaxing Piano Music for Focus and Study',
    thumbnail: 'https://picsum.photos/400/225?random=5',
    channel: {
      name: 'Peaceful Sounds',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=music'
    },
    views: 3200000,
    publishedAt: new Date(2024, 1, 12),
    duration: '1:45:30',
    category: 'Music'
  },
  {
    id: '6',
    title: 'Amazing Travel Destinations You Must Visit',
    thumbnail: 'https://picsum.photos/400/225?random=6',
    channel: {
      name: 'Travel Explorer',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=travel'
    },
    views: 1800000,
    publishedAt: new Date(2024, 1, 18),
    duration: '25:10',
    category: 'Travel'
  }
];

const categories = [
  { name: 'All', icon: TrendingUp, count: dummyVideos.length },
  { name: 'Trending', icon: Flame, count: 12 },
  { name: 'Music', icon: Music, count: 8 },
  { name: 'Gaming', icon: Gamepad2, count: 15 },
  { name: 'Movies', icon: Film, count: 6 },
  { name: 'Sports', icon: Trophy, count: 9 }
];

const Index = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-6">
        {/* Categories */}
        <div className="mb-8">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <Button
                  key={category.name}
                  variant={category.name === 'All' ? 'default' : 'secondary'}
                  className="flex items-center gap-2 whitespace-nowrap"
                >
                  <Icon className="h-4 w-4" />
                  {category.name}
                  <Badge variant="outline" className="ml-1">
                    {category.count}
                  </Badge>
                </Button>
              );
            })}
          </div>
        </div>

        {/* Content Tabs */}
        <Tabs defaultValue="home" className="w-full">
          <TabsList className="grid w-full grid-cols-3 max-w-md">
            <TabsTrigger value="home">Home</TabsTrigger>
            <TabsTrigger value="trending">Trending</TabsTrigger>
            <TabsTrigger value="subscriptions" disabled={!isAuthenticated}>
              Subscriptions
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="home" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {dummyVideos.map((video) => (
                <VideoCard key={video.id} video={video} />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="trending" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {dummyVideos
                .sort((a, b) => b.views - a.views)
                .slice(0, 4)
                .map((video) => (
                  <VideoCard key={video.id} video={video} />
                ))}
            </div>
          </TabsContent>
          
          <TabsContent value="subscriptions" className="mt-6">
            {isAuthenticated ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No subscriptions yet. Start following your favorite creators!</p>
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">Sign in to see your subscriptions</p>
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Welcome Message for Non-authenticated Users */}
        {!isAuthenticated && (
          <div className="mt-12 text-center bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg p-8">
            <h2 className="text-2xl font-bold mb-4">Welcome to YouTube Clone</h2>
            <p className="text-muted-foreground mb-6">
              Sign in to access personalized features, subscribe to channels, and manage your dashboard.
            </p>
            <div className="flex gap-4 justify-center">
              <Button size="lg">Sign In</Button>
              <Button variant="outline" size="lg">Learn More</Button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;
