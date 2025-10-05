import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Instagram, MessageCircle, CheckCircle, ExternalLink, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from './ui/alert';
import { api } from '../utils/api';
import { toast } from 'sonner@2.0.3';

interface SocialMediaConnectProps {
  isConnected: {
    instagram: boolean;
    tiktok: boolean;
    pinterest: boolean;
  };
  setIsConnected: React.Dispatch<React.SetStateAction<{
    instagram: boolean;
    tiktok: boolean;
    pinterest: boolean;
  }>>;
  userId: string;
}

export function SocialMediaConnect({ isConnected, setIsConnected, userId }: SocialMediaConnectProps) {
  const [isConnecting, setIsConnecting] = useState<string | null>(null);

  // Handle Pinterest OAuth callback
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const state = urlParams.get('state');
    
    if (code && state && window.location.pathname === '/pinterest-callback') {
      handlePinterestCallback(code, state);
    }
  }, []);

  const handlePinterestCallback = async (code: string, state: string) => {
    try {
      const redirectUri = `${window.location.origin}/pinterest-callback`;
      const result = await api.completePinterestAuth(code, state, redirectUri);
      
      if (result.success) {
        const updatedConnections = { ...isConnected, pinterest: true };
        setIsConnected(updatedConnections);
        await api.saveSocialConnections(userId, updatedConnections);
        
        toast.success('Pinterest connected successfully!');
        
        // Redirect back to main app
        window.history.replaceState({}, '', '/');
      }
    } catch (error) {
      console.error('Pinterest callback error:', error);
      toast.error('Failed to connect Pinterest');
      window.history.replaceState({}, '', '/');
    }
  };

  const handleConnect = async (platform: string) => {
    if (platform === 'pinterest') {
      await handlePinterestConnect();
      return;
    }
    
    setIsConnecting(platform);
    // Simulate API connection delay for Instagram/TikTok (mock connections)
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const updatedConnections = { ...isConnected, [platform]: true };
    setIsConnected(updatedConnections);
    
    // Save to backend
    try {
      await api.saveSocialConnections(userId, updatedConnections);
      toast.success(`${platform.charAt(0).toUpperCase() + platform.slice(1)} connected successfully!`);
    } catch (error) {
      console.error('Error saving connection:', error);
      toast.error('Failed to save connection');
    }
    
    setIsConnecting(null);
  };

  const handlePinterestConnect = async () => {
    try {
      setIsConnecting('pinterest');
      const redirectUri = `${window.location.origin}/pinterest-callback`;
      const { authUrl } = await api.getPinterestAuthUrl(userId, redirectUri);
      
      // Redirect to Pinterest OAuth page
      window.location.href = authUrl;
    } catch (error) {
      console.error('Error connecting to Pinterest:', error);
      toast.error('Failed to initiate Pinterest connection');
      setIsConnecting(null);
    }
  };

  const handleDisconnect = async (platform: string) => {
    try {
      if (platform === 'pinterest') {
        await api.disconnectPinterest(userId);
      }
      
      const updatedConnections = { ...isConnected, [platform]: false };
      setIsConnected(updatedConnections);
      await api.saveSocialConnections(userId, updatedConnections);
      
      toast.success(`${platform.charAt(0).toUpperCase() + platform.slice(1)} disconnected`);
    } catch (error) {
      console.error('Error disconnecting:', error);
      toast.error('Failed to disconnect');
    }
  };

  const platforms = [
    {
      id: 'instagram',
      name: 'Instagram',
      icon: Instagram,
      description: 'Analyze your outfit posts and style preferences',
      benefits: ['Outfit analysis', 'Color palette detection', 'Style trend tracking']
    },
    {
      id: 'tiktok',
      name: 'TikTok',
      icon: MessageCircle,
      description: 'Discover fashion trends and styling videos you engage with',
      benefits: ['Trend discovery', 'Video style analysis', 'Influencer tracking']
    },
    {
      id: 'pinterest',
      name: 'Pinterest',
      icon: ExternalLink,
      description: 'Import your fashion boards and saved outfit inspiration',
      benefits: ['Mood board analysis', 'Saved outfit styles', 'Inspiration tracking']
    }
  ];

  return (
    <div className="space-y-12">
      <div className="text-center space-y-4">
        <h2 className="text-4xl font-light text-[#e8e3d8]" style={{fontFamily: 'var(--font-serif)'}}>Connect Your Social Media</h2>
        <p className="text-sm text-[#a39882] max-w-2xl mx-auto">
          Link your social media accounts to help us understand your style preferences and create personalized fashion recommendations.
        </p>
      </div>

      <Alert className="bg-[#141414] border-[#2a2a2a]">
        <AlertCircle className="h-4 w-4 text-[#d4af37]" />
        <AlertDescription className="text-[#a39882]">
          We only analyze publicly available content and style-related posts. Your personal data remains private and secure.
        </AlertDescription>
      </Alert>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {platforms.map((platform) => {
          const Icon = platform.icon;
          const connected = isConnected[platform.id as keyof typeof isConnected];
          const connecting = isConnecting === platform.id;

          return (
            <Card key={platform.id} className="relative overflow-hidden bg-[#141414] border-[#2a2a2a] hover:border-[#d4af37]/30 transition-colors">
              <CardHeader className="pb-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 marble-texture border border-[#2a2a2a] flex items-center justify-center relative overflow-hidden">
                      <Icon className="h-6 w-6 text-[#e8e3d8] relative z-10" />
                    </div>
                    <div>
                      <CardTitle className="text-lg text-[#e8e3d8]">{platform.name}</CardTitle>
                      {connected && (
                        <Badge variant="secondary" className="bg-[#d4af37]/10 text-[#d4af37] border-[#d4af37]/20 mt-1">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Connected
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
                <CardDescription className="text-[#a39882]">{platform.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <p className="text-xs uppercase tracking-[0.15em] text-[#666]">Benefits:</p>
                  <ul className="space-y-2">
                    {platform.benefits.map((benefit, index) => (
                      <li key={index} className="flex items-center gap-3 text-sm text-[#a39882]">
                        <div className="w-1 h-1 bg-[#d4af37] rounded-full" />
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <Button
                  className={`w-full h-11 ${connected ? 'bg-[#141414] border-[#d4af37]/30 text-[#d4af37]' : 'bg-[#d4af37] hover:bg-[#c9a961] text-[#0a0a0a]'}`}
                  variant={connected ? "outline" : "default"}
                  disabled={connected || connecting}
                  onClick={() => handleConnect(platform.id)}
                >
                  {connecting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2" />
                      Connecting...
                    </>
                  ) : connected ? (
                    <>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Connected
                    </>
                  ) : (
                    <>
                      <Icon className="h-4 w-4 mr-2" />
                      Connect {platform.name}
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {Object.values(isConnected).some(Boolean) && (
        <Card className="bg-[#141414] border-[#d4af37]/30 relative overflow-hidden">
          <div className="absolute inset-0 marble-texture opacity-20" />
          <CardHeader className="relative z-10">
            <CardTitle className="text-[#d4af37]">Great! You're connected</CardTitle>
            <CardDescription className="text-[#a39882]">
              We're now analyzing your style preferences. Check back in a few minutes for personalized insights.
            </CardDescription>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="flex items-center gap-6">
              <div className="flex -space-x-3">
                {Object.entries(isConnected).filter(([_, connected]) => connected).map(([platform]) => {
                  const platformData = platforms.find(p => p.id === platform);
                  if (!platformData) return null;
                  const Icon = platformData.icon;
                  return (
                    <div key={platform} className="w-10 h-10 marble-texture border-2 border-[#d4af37] flex items-center justify-center relative overflow-hidden">
                      <Icon className="h-4 w-4 text-[#e8e3d8] relative z-10" />
                    </div>
                  );
                })}
              </div>
              <div>
                <p className="text-sm text-[#e8e3d8]">
                  {Object.values(isConnected).filter(Boolean).length} platform(s) connected
                </p>
                <p className="text-xs text-[#a39882] uppercase tracking-[0.1em]">Analysis in progress...</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}