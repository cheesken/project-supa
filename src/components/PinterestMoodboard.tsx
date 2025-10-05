import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Loader2, RefreshCw, ExternalLink, Grid, Heart, Eye, AlertCircle } from 'lucide-react';
import { api } from '../utils/api';
import { toast } from 'sonner@2.0.3';
import { Alert, AlertDescription } from './ui/alert';

interface PinterestMoodboardProps {
  userId: string;
  isConnected: boolean;
}

interface PinterestBoard {
  id: string;
  name: string;
  description: string;
  pin_count: number;
  image_thumbnail_url?: string;
}

interface PinterestPin {
  id: string;
  title: string;
  description: string;
  media: {
    images?: {
      '400x300'?: {
        url: string;
      };
      original?: {
        url: string;
      };
    };
  };
  link: string;
}

export function PinterestMoodboard({ userId, isConnected }: PinterestMoodboardProps) {
  const [boards, setBoards] = useState<PinterestBoard[]>([]);
  const [selectedBoard, setSelectedBoard] = useState<PinterestBoard | null>(null);
  const [pins, setPins] = useState<PinterestPin[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingPins, setLoadingPins] = useState(false);

  useEffect(() => {
    if (isConnected) {
      loadBoards();
    }
  }, [isConnected]);

  const loadBoards = async () => {
    try {
      setLoading(true);
      const response = await api.getPinterestBoards(userId);
      setBoards(response.boards || []);
      
      if (response.boards && response.boards.length > 0) {
        toast.success(`Loaded ${response.boards.length} Pinterest boards`);
      }
    } catch (error) {
      console.error('Error loading Pinterest boards:', error);
      toast.error('Failed to load Pinterest boards');
    } finally {
      setLoading(false);
    }
  };

  const loadPins = async (board: PinterestBoard) => {
    try {
      setLoadingPins(true);
      setSelectedBoard(board);
      const response = await api.getPinterestPins(userId, board.id);
      setPins(response.pins || []);
      
      if (response.pins && response.pins.length > 0) {
        toast.success(`Loaded ${response.pins.length} pins from "${board.name}"`);
      }
    } catch (error) {
      console.error('Error loading Pinterest pins:', error);
      toast.error('Failed to load Pinterest pins');
    } finally {
      setLoadingPins(false);
    }
  };

  if (!isConnected) {
    return (
      <div className="space-y-8">
        <div className="text-center space-y-4 py-16">
          <div className="w-20 h-20 mx-auto marble-texture border border-[#2a2a2a] flex items-center justify-center relative overflow-hidden">
            <ExternalLink className="h-8 w-8 text-[#d4af37] relative z-10" />
          </div>
          <h3 className="text-2xl font-light text-[#e8e3d8]" style={{fontFamily: 'var(--font-serif)'}}>
            Connect Pinterest
          </h3>
          <p className="text-sm text-[#a39882] max-w-md mx-auto">
            Connect your Pinterest account to import your fashion boards and saved inspiration.
          </p>
          <Button 
            onClick={() => {
              // Navigate to social media tab
              const socialTab = document.querySelector('[data-value="social"]') as HTMLElement;
              if (socialTab) socialTab.click();
            }}
            className="bg-[#d4af37] hover:bg-[#c9a961] text-[#0a0a0a] mt-4"
          >
            Go to Connect Social Media
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-light mb-2 text-[#e8e3d8]" style={{fontFamily: 'var(--font-serif)'}}>
            Pinterest Moodboards
          </h2>
          <p className="text-xs uppercase tracking-[0.1em] text-[#666]">
            {selectedBoard ? selectedBoard.name : 'Your Boards'}
          </p>
        </div>
        <div className="flex gap-3">
          {selectedBoard && (
            <Button
              variant="outline"
              onClick={() => {
                setSelectedBoard(null);
                setPins([]);
              }}
              className="border-[#2a2a2a] text-[#a39882] hover:border-[#d4af37] hover:text-[#e8e3d8]"
            >
              Back to Boards
            </Button>
          )}
          <Button
            variant="outline"
            onClick={loadBoards}
            disabled={loading}
            className="border-[#2a2a2a] text-[#a39882] hover:border-[#d4af37] hover:text-[#e8e3d8]"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Loading...
              </>
            ) : (
              <>
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </>
            )}
          </Button>
        </div>
      </div>

      <Alert className="bg-[#141414] border-[#2a2a2a]">
        <AlertCircle className="h-4 w-4 text-[#d4af37]" />
        <AlertDescription className="text-[#a39882]">
          Your Pinterest boards are automatically synced. Click on any board to view its pins and create moodboards.
        </AlertDescription>
      </Alert>

      {!selectedBoard ? (
        <div className="space-y-6">
          {loading ? (
            <div className="text-center py-16">
              <Loader2 className="h-8 w-8 text-[#d4af37] mx-auto animate-spin mb-4" />
              <p className="text-sm text-[#a39882]">Loading your Pinterest boards...</p>
            </div>
          ) : boards.length === 0 ? (
            <div className="text-center py-16">
              <Grid className="h-12 w-12 text-[#666] mx-auto mb-4" />
              <h3 className="text-xl text-[#e8e3d8] mb-2">No boards found</h3>
              <p className="text-sm text-[#a39882]">
                Create some boards on Pinterest and click refresh to see them here.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {boards.map((board) => (
                <Card
                  key={board.id}
                  className="group cursor-pointer bg-[#141414] border-[#2a2a2a] hover:border-[#d4af37]/50 transition-all overflow-hidden"
                  onClick={() => loadPins(board)}
                >
                  <div className="aspect-square relative overflow-hidden bg-[#0a0a0a]">
                    {board.image_thumbnail_url ? (
                      <ImageWithFallback
                        src={board.image_thumbnail_url}
                        alt={board.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Grid className="h-12 w-12 text-[#666]" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform">
                      <div className="flex items-center gap-2 text-xs text-[#e8e3d8]">
                        <Eye className="h-3 w-3" />
                        View Pins
                      </div>
                    </div>
                  </div>
                  <CardHeader className="pb-4">
                    <CardTitle className="text-base text-[#e8e3d8] line-clamp-1">
                      {board.name}
                    </CardTitle>
                    {board.description && (
                      <CardDescription className="text-xs text-[#a39882] line-clamp-2">
                        {board.description}
                      </CardDescription>
                    )}
                  </CardHeader>
                  <CardContent>
                    <Badge variant="secondary" className="bg-[#d4af37]/10 text-[#d4af37] border-[#d4af37]/20">
                      {board.pin_count} pins
                    </Badge>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          {loadingPins ? (
            <div className="text-center py-16">
              <Loader2 className="h-8 w-8 text-[#d4af37] mx-auto animate-spin mb-4" />
              <p className="text-sm text-[#a39882]">Loading pins from "{selectedBoard.name}"...</p>
            </div>
          ) : pins.length === 0 ? (
            <div className="text-center py-16">
              <Heart className="h-12 w-12 text-[#666] mx-auto mb-4" />
              <h3 className="text-xl text-[#e8e3d8] mb-2">No pins in this board</h3>
              <p className="text-sm text-[#a39882]">
                Add some pins to this board on Pinterest to see them here.
              </p>
            </div>
          ) : (
            <div className="columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
              {pins.map((pin) => {
                const imageUrl = 
                  pin.media?.images?.['400x300']?.url || 
                  pin.media?.images?.original?.url;
                
                return (
                  <Card
                    key={pin.id}
                    className="group break-inside-avoid bg-[#141414] border-[#2a2a2a] hover:border-[#d4af37]/50 transition-all overflow-hidden"
                  >
                    {imageUrl && (
                      <div className="relative overflow-hidden">
                        <ImageWithFallback
                          src={imageUrl}
                          alt={pin.title || 'Pinterest pin'}
                          className="w-full h-auto group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        {pin.link && (
                          <a
                            href={pin.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="absolute top-3 right-3 w-8 h-8 bg-black/60 backdrop-blur-sm flex items-center justify-center rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-[#d4af37]"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <ExternalLink className="h-4 w-4 text-white" />
                          </a>
                        )}
                      </div>
                    )}
                    {pin.title && (
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm text-[#e8e3d8] line-clamp-2">
                          {pin.title}
                        </CardTitle>
                        {pin.description && (
                          <CardDescription className="text-xs text-[#a39882] line-clamp-3 mt-2">
                            {pin.description}
                          </CardDescription>
                        )}
                      </CardHeader>
                    )}
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
