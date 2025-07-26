import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';
import { Play, Eye } from 'lucide-react';

interface VideoCardProps {
  video: {
    id: string;
    title: string;
    thumbnail: string;
    channel: {
      name: string;
      avatar: string;
    };
    views: number;
    publishedAt: Date;
    duration: string;
    category: string;
  };
}

const VideoCard: React.FC<VideoCardProps> = ({ video }) => {
  const formatViews = (views: number) => {
    if (views >= 1000000) {
      return `${(views / 1000000).toFixed(1)}M`;
    } else if (views >= 1000) {
      return `${(views / 1000).toFixed(1)}K`;
    }
    return views.toString();
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-200 cursor-pointer group">
      <div className="relative">
        <img 
          src={video.thumbnail} 
          alt={video.title}
          className="w-full h-48 object-cover"
        />
        <div className="absolute bottom-2 right-2 bg-black/80 text-white px-2 py-1 rounded text-xs">
          {video.duration}
        </div>
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200 flex items-center justify-center">
          <Play className="h-12 w-12 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200 fill-current" />
        </div>
      </div>
      
      <CardContent className="p-4">
        <div className="flex gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={video.channel.avatar} alt={video.channel.name} />
            <AvatarFallback>{video.channel.name.charAt(0)}</AvatarFallback>
          </Avatar>
          
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-sm leading-5 mb-1 line-clamp-2 group-hover:text-primary transition-colors">
              {video.title}
            </h3>
            
            <p className="text-sm text-muted-foreground mb-1">
              {video.channel.name}
            </p>
            
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <Eye className="h-3 w-3" />
                {formatViews(video.views)} views
              </div>
              <span>•</span>
              <span>{formatDistanceToNow(video.publishedAt, { addSuffix: true })}</span>
            </div>
            
            <Badge variant="secondary" className="mt-2 text-xs">
              {video.category}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default VideoCard;