import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card';
import { Button } from './components/ui/button';
import { Badge } from './components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './components/ui/avatar';
import { Progress } from './components/ui/progress';
import { ImageWithFallback } from './components/figma/ImageWithFallback';
import { Instagram, MessageCircle, Plus, Heart, ShoppingBag, Sparkles, Palette, TrendingUp, LogOut } from 'lucide-react';
import { SocialMediaConnect } from './components/SocialMediaConnect';
import { OrderHistory } from './components/OrderHistory';
import { StyleAnalysis } from './components/StyleAnalysis';
import { MoodboardCreator } from './components/MoodboardCreator';
import { PinterestMoodboard } from './components/PinterestMoodboard';
import { Recommendations } from './components/Recommendations';
import { Auth } from './components/Auth';
import { api } from './utils/api';
import { supabase } from './utils/supabase/client';
import { Toaster } from './components/ui/sonner';
import { toast } from 'sonner@2.0.3';

export default function App() {
  const [activeTab, setActiveTab] = useState('overview');
  const [isConnected, setIsConnected] = useState({
    instagram: false,
    tiktok: false,
    pinterest: false
  });
  const [userId, setUserId] = useState<string | null>(null);
  const [userName, setUserName] = useState<string>('');
  const [userEmail, setUserEmail] = useState<string>('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [orders, setOrders] = useState<any[]>([]);
  const [showDevTools, setShowDevTools] = useState(false);

  // Check authentication status on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        setIsLoading(true);
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          setIsAuthenticated(true);
          setUserId(session.user.id);
          setUserEmail(session.user.email || '');
          setUserName(session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'User');
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('Error checking auth:', error);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setIsAuthenticated(true);
        setUserId(session.user.id);
        setUserEmail(session.user.email || '');
        setUserName(session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'User');
      } else {
        setIsAuthenticated(false);
        setUserId(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Load user data from backend when authenticated
  useEffect(() => {
    if (!userId || !isAuthenticated) return;

    const loadUserData = async () => {
      try {
        // Load social connections
        const connections = await api.getSocialConnections(userId);
        setIsConnected(connections);
        
        // Load orders
        const userOrders = await api.getOrders(userId);
        
        // If no orders exist, populate with luxury wardrobe mock data
        if (!userOrders || userOrders.length === 0) {
          const mockOrders = [
            {
              id: 1,
              date: '2025-01-15',
              items: [
                {
                  name: 'Structured Wool Blazer',
                  brand: 'Gucci',
                  category: 'Outerwear',
                  price: 2890,
                  image: 'https://images.unsplash.com/photo-1758387813664-5cd1211304f6?w=400&h=400&fit=crop',
                  color: 'Navy',
                  size: '36'
                },
                {
                  name: 'Silk Midi Dress',
                  brand: 'Reformation',
                  category: 'Dresses',
                  price: 298,
                  image: 'https://images.unsplash.com/photo-1756483510840-b0dda5f0dd0f?w=400&h=400&fit=crop',
                  color: 'Champagne',
                  size: 'S'
                },
                {
                  name: 'Classic Trench Coat',
                  brand: 'Burberry',
                  category: 'Outerwear',
                  price: 1950,
                  image: 'https://images.unsplash.com/photo-1628565931779-4f4f0b4f578a?w=400&h=400&fit=crop',
                  color: 'Beige',
                  size: 'M'
                }
              ],
              total: 5138,
              status: 'delivered'
            },
            {
              id: 2,
              date: '2025-01-28',
              items: [
                {
                  name: 'Cashmere Turtleneck',
                  brand: 'Prada',
                  category: 'Tops',
                  price: 1290,
                  image: 'https://images.unsplash.com/photo-1631541909061-71e349d1f203?w=400&h=400&fit=crop',
                  color: 'Cream',
                  size: 'S'
                },
                {
                  name: 'Leather Tote Bag',
                  brand: 'Balenciaga',
                  category: 'Accessories',
                  price: 2150,
                  image: 'https://images.unsplash.com/photo-1682317056294-1970c953cfd7?w=400&h=400&fit=crop',
                  color: 'Black',
                  size: 'One Size'
                },
                {
                  name: 'Leather Knee Boots',
                  brand: 'Valentino',
                  category: 'Shoes',
                  price: 1450,
                  image: 'https://images.unsplash.com/photo-1758387813660-1ae7497ace27?w=400&h=400&fit=crop',
                  color: 'Black',
                  size: '38'
                }
              ],
              total: 4890,
              status: 'delivered'
            },
            {
              id: 3,
              date: '2025-02-10',
              items: [
                {
                  name: 'Oversized Wool Coat',
                  brand: 'Maniere De Voir',
                  category: 'Outerwear',
                  price: 485,
                  image: 'https://images.unsplash.com/photo-1746972466957-6fe022ade280?w=400&h=400&fit=crop',
                  color: 'Charcoal',
                  size: 'M'
                },
                {
                  name: 'Designer Sunglasses',
                  brand: 'Chanel',
                  category: 'Accessories',
                  price: 495,
                  image: 'https://images.unsplash.com/photo-1689666418910-1f43a80b943b?w=400&h=400&fit=crop',
                  color: 'Black',
                  size: 'One Size'
                },
                {
                  name: 'Silk Blouse',
                  brand: 'Aritzia',
                  category: 'Tops',
                  price: 168,
                  image: 'https://images.unsplash.com/photo-1756483496981-05b741fdd40a?w=400&h=400&fit=crop',
                  color: 'Ivory',
                  size: 'XS'
                }
              ],
              total: 1148,
              status: 'delivered'
            },
            {
              id: 4,
              date: '2025-02-25',
              items: [
                {
                  name: 'Structured Handbag',
                  brand: 'Miu Miu',
                  category: 'Accessories',
                  price: 1890,
                  image: 'https://images.unsplash.com/photo-1758171692659-024183c2c272?w=400&h=400&fit=crop',
                  color: 'Cognac',
                  size: 'One Size'
                },
                {
                  name: 'Premium Denim Jeans',
                  brand: 'Reformation',
                  category: 'Bottoms',
                  price: 168,
                  image: 'https://images.unsplash.com/photo-1475178626620-a4d074967452?w=400&h=400&fit=crop',
                  color: 'Dark Wash',
                  size: '27'
                },
                {
                  name: 'Satin Pumps',
                  brand: 'Valentino',
                  category: 'Shoes',
                  price: 995,
                  image: 'https://images.unsplash.com/photo-1670243322279-727e3d9df08d?w=400&h=400&fit=crop',
                  color: 'Nude',
                  size: '38'
                }
              ],
              total: 3053,
              status: 'delivered'
            },
            {
              id: 5,
              date: '2025-03-08',
              items: [
                {
                  name: 'Knit Cardigan',
                  brand: 'Aritzia',
                  category: 'Tops',
                  price: 198,
                  image: 'https://images.unsplash.com/photo-1702628907361-818e77fc05c4?w=400&h=400&fit=crop',
                  color: 'Camel',
                  size: 'S'
                },
                {
                  name: 'Pleated Midi Skirt',
                  brand: 'Banana Republic',
                  category: 'Bottoms',
                  price: 130,
                  image: 'https://images.unsplash.com/photo-1709281961493-a9acb8558177?w=400&h=400&fit=crop',
                  color: 'Olive',
                  size: 'S'
                },
                {
                  name: 'Silk Scarf',
                  brand: 'Gucci',
                  category: 'Accessories',
                  price: 450,
                  image: 'https://images.unsplash.com/photo-1591176134674-87e8f7c73ce9?w=400&h=400&fit=crop',
                  color: 'Multi',
                  size: 'One Size'
                },
                {
                  name: 'Wide-Leg Trousers',
                  brand: 'Aritzia',
                  category: 'Bottoms',
                  price: 148,
                  image: 'https://images.unsplash.com/photo-1748340399022-a10409974ed2?w=400&h=400&fit=crop',
                  color: 'Black',
                  size: '2'
                }
              ],
              total: 926,
              status: 'delivered'
            },
            {
              id: 6,
              date: '2025-03-20',
              items: [
                {
                  name: 'Suede Ankle Boots',
                  brand: 'Prada',
                  category: 'Shoes',
                  price: 1350,
                  image: 'https://images.unsplash.com/photo-1707676179930-b2a8d251288a?w=400&h=400&fit=crop',
                  color: 'Taupe',
                  size: '37'
                },
                {
                  name: 'Cashmere Sweater',
                  brand: 'Banana Republic',
                  category: 'Tops',
                  price: 228,
                  image: 'https://images.unsplash.com/photo-1631541909061-71e349d1f203?w=400&h=400&fit=crop',
                  color: 'Oatmeal',
                  size: 'M'
                },
                {
                  name: 'Tailored Jumpsuit',
                  brand: 'Reformation',
                  category: 'Dresses',
                  price: 278,
                  image: 'https://images.unsplash.com/photo-1641808895412-8d0464f08e02?w=400&h=400&fit=crop',
                  color: 'Navy',
                  size: 'S'
                }
              ],
              total: 1856,
              status: 'delivered'
            },
            {
              id: 7,
              date: '2025-04-02',
              items: [
                {
                  name: 'Leather Moto Jacket',
                  brand: 'Balenciaga',
                  category: 'Outerwear',
                  price: 3950,
                  image: 'https://images.unsplash.com/photo-1645636667214-c4875ef3d59c?w=400&h=400&fit=crop',
                  color: 'Black',
                  size: '36'
                },
                {
                  name: 'Evening Gown',
                  brand: 'Valentino',
                  category: 'Dresses',
                  price: 4200,
                  image: 'https://images.unsplash.com/photo-1756483492038-974f2a2ff341?w=400&h=400&fit=crop',
                  color: 'Burgundy',
                  size: '2'
                },
                {
                  name: 'Crisp White Shirt',
                  brand: 'Aritzia',
                  category: 'Tops',
                  price: 98,
                  image: 'https://images.unsplash.com/photo-1684780932918-a66efb799c37?w=400&h=400&fit=crop',
                  color: 'White',
                  size: 'XS'
                }
              ],
              total: 8248,
              status: 'delivered'
            },
            {
              id: 8,
              date: '2025-04-18',
              items: [
                {
                  name: 'Leather Crossbody Bag',
                  brand: 'Chanel',
                  category: 'Accessories',
                  price: 4500,
                  image: 'https://images.unsplash.com/photo-1758817863246-8b7e43b1daea?w=400&h=400&fit=crop',
                  color: 'Black',
                  size: 'One Size'
                },
                {
                  name: 'Designer Sneakers',
                  brand: 'Gucci',
                  category: 'Shoes',
                  price: 790,
                  image: 'https://images.unsplash.com/photo-1543652711-77eeb35ae548?w=400&h=400&fit=crop',
                  color: 'White',
                  size: '38'
                },
                {
                  name: 'Leather Belt',
                  brand: 'Prada',
                  category: 'Accessories',
                  price: 595,
                  image: 'https://images.unsplash.com/photo-1758297679736-2e6ff92d2021?w=400&h=400&fit=crop',
                  color: 'Black',
                  size: '75'
                }
              ],
              total: 5885,
              status: 'delivered'
            },
            {
              id: 9,
              date: '2025-05-05',
              items: [
                {
                  name: 'Tailored Pinstripe Blazer',
                  brand: 'American Eagle',
                  category: 'Outerwear',
                  price: 129,
                  image: 'https://images.unsplash.com/photo-1660119602205-3aa5be623a3f?w=400&h=400&fit=crop',
                  color: 'Navy',
                  size: 'M'
                },
                {
                  name: 'Satin Evening Clutch',
                  brand: 'Miu Miu',
                  category: 'Accessories',
                  price: 850,
                  image: 'https://images.unsplash.com/photo-1742626181959-f6442aea029b?w=400&h=400&fit=crop',
                  color: 'Gold',
                  size: 'One Size'
                },
                {
                  name: 'Merino Wool Sweater',
                  brand: 'Banana Republic',
                  category: 'Tops',
                  price: 158,
                  image: 'https://images.unsplash.com/photo-1601762267916-6668efcbc741?w=400&h=400&fit=crop',
                  color: 'Grey',
                  size: 'S'
                },
                {
                  name: 'Structured Leather Tote',
                  brand: 'Prada',
                  category: 'Accessories',
                  price: 2850,
                  image: 'https://images.unsplash.com/photo-1723799657615-241599b2efa0?w=400&h=400&fit=crop',
                  color: 'Black',
                  size: 'One Size'
                }
              ],
              total: 3987,
              status: 'delivered'
            },
            {
              id: 10,
              date: '2025-05-20',
              items: [
                {
                  name: 'Camel Hair Coat',
                  brand: 'Maniere De Voir',
                  category: 'Outerwear',
                  price: 595,
                  image: 'https://images.unsplash.com/photo-1724856604247-0de2c43b6491?w=400&h=400&fit=crop',
                  color: 'Camel',
                  size: 'L'
                },
                {
                  name: 'Silk Camisole',
                  brand: 'Reformation',
                  category: 'Tops',
                  price: 88,
                  image: 'https://images.unsplash.com/photo-1645654731316-a350fdcf3bae?w=400&h=400&fit=crop',
                  color: 'Blush',
                  size: 'XS'
                },
                {
                  name: 'Strappy Heeled Sandals',
                  brand: 'Valentino',
                  category: 'Shoes',
                  price: 895,
                  image: 'https://images.unsplash.com/photo-1709282028322-35c1fb068ef8?w=400&h=400&fit=crop',
                  color: 'Nude',
                  size: '38'
                },
                {
                  name: 'Gold Chain Necklace',
                  brand: 'Chanel',
                  category: 'Jewelry',
                  price: 3200,
                  image: 'https://images.unsplash.com/photo-1642373174965-ef3793eabcb2?w=400&h=400&fit=crop',
                  color: 'Gold',
                  size: 'One Size'
                }
              ],
              total: 4778,
              status: 'delivered'
            },
            {
              id: 11,
              date: '2025-06-03',
              items: [
                {
                  name: 'High-Waisted Wool Pants',
                  brand: 'Aritzia',
                  category: 'Bottoms',
                  price: 178,
                  image: 'https://images.unsplash.com/photo-1738520420640-5818ce094b4e?w=400&h=400&fit=crop',
                  color: 'Charcoal',
                  size: '4'
                },
                {
                  name: 'Leather Ballet Flats',
                  brand: 'Chanel',
                  category: 'Shoes',
                  price: 750,
                  image: 'https://images.unsplash.com/photo-1599049354107-fac4c52f3ace?w=400&h=400&fit=crop',
                  color: 'Beige',
                  size: '38'
                },
                {
                  name: 'Gold Drop Earrings',
                  brand: 'Gucci',
                  category: 'Jewelry',
                  price: 680,
                  image: 'https://images.unsplash.com/photo-1705175028747-d8e4f350245c?w=400&h=400&fit=crop',
                  color: 'Gold',
                  size: 'One Size'
                },
                {
                  name: 'Double-Breasted Blazer',
                  brand: 'Banana Republic',
                  category: 'Outerwear',
                  price: 298,
                  image: 'https://images.unsplash.com/photo-1515736076039-a3ca66043b27?w=400&h=400&fit=crop',
                  color: 'Navy',
                  size: 'S'
                }
              ],
              total: 1906,
              status: 'delivered'
            },
            {
              id: 12,
              date: '2025-06-18',
              items: [
                {
                  name: 'Designer Watch',
                  brand: 'Prada',
                  category: 'Accessories',
                  price: 1450,
                  image: 'https://images.unsplash.com/photo-1636289141131-389e44e981c0?w=400&h=400&fit=crop',
                  color: 'Silver',
                  size: 'One Size'
                },
                {
                  name: 'Little Black Dress',
                  brand: 'Balenciaga',
                  category: 'Dresses',
                  price: 2100,
                  image: 'https://images.unsplash.com/photo-1695461569773-e7c75f38ac3b?w=400&h=400&fit=crop',
                  color: 'Black',
                  size: '34'
                },
                {
                  name: 'Leather Loafers',
                  brand: 'Gucci',
                  category: 'Shoes',
                  price: 850,
                  image: 'https://images.unsplash.com/photo-1708962000105-849e984e69a8?w=400&h=400&fit=crop',
                  color: 'Black',
                  size: '37'
                }
              ],
              total: 4400,
              status: 'delivered'
            },
            {
              id: 13,
              date: '2025-07-05',
              items: [
                {
                  name: 'Silk Wrap Dress',
                  brand: 'Reformation',
                  category: 'Dresses',
                  price: 248,
                  image: 'https://images.unsplash.com/photo-1655203092913-377fd909240f?w=400&h=400&fit=crop',
                  color: 'Emerald',
                  size: 'M'
                },
                {
                  name: 'Silk Halter Top',
                  brand: 'Aritzia',
                  category: 'Tops',
                  price: 128,
                  image: 'https://images.unsplash.com/photo-1750032542737-248fabdf6668?w=400&h=400&fit=crop',
                  color: 'Ivory',
                  size: 'S'
                },
                {
                  name: 'Leather Pencil Skirt',
                  brand: 'Balenciaga',
                  category: 'Bottoms',
                  price: 1890,
                  image: 'https://images.unsplash.com/photo-1599926181154-461be0dc7a41?w=400&h=400&fit=crop',
                  color: 'Black',
                  size: '36'
                },
                {
                  name: 'Cashmere Open Cardigan',
                  brand: 'Maniere De Voir',
                  category: 'Tops',
                  price: 385,
                  image: 'https://images.unsplash.com/photo-1731267776886-90f90af75eb1?w=400&h=400&fit=crop',
                  color: 'Camel',
                  size: 'M'
                },
                {
                  name: 'Leather Mules',
                  brand: 'Prada',
                  category: 'Shoes',
                  price: 795,
                  image: 'https://images.unsplash.com/photo-1705336216242-bb2c10c6a61a?w=400&h=400&fit=crop',
                  color: 'Black',
                  size: '38'
                }
              ],
              total: 3446,
              status: 'delivered'
            },
            {
              id: 14,
              date: '2025-07-22',
              items: [
                {
                  name: 'Gold Cuff Bracelet',
                  brand: 'Chanel',
                  category: 'Jewelry',
                  price: 2850,
                  image: 'https://images.unsplash.com/photo-1758297679746-622bf9e6a20e?w=400&h=400&fit=crop',
                  color: 'Gold',
                  size: 'One Size'
                },
                {
                  name: 'Wool Pencil Skirt',
                  brand: 'American Eagle',
                  category: 'Bottoms',
                  price: 69,
                  image: 'https://images.unsplash.com/photo-1556747439-3b96858b9d8d?w=400&h=400&fit=crop',
                  color: 'Black',
                  size: '4'
                },
                {
                  name: 'Leather Bucket Bag',
                  brand: 'Gucci',
                  category: 'Accessories',
                  price: 1850,
                  image: 'https://images.unsplash.com/flagged/photo-1553802922-5f7e9934e328?w=400&h=400&fit=crop',
                  color: 'Tan',
                  size: 'One Size'
                },
                {
                  name: 'Tailored Vest',
                  brand: 'Banana Republic',
                  category: 'Tops',
                  price: 138,
                  image: 'https://images.unsplash.com/photo-1628565663674-de1c8161d72c?w=400&h=400&fit=crop',
                  color: 'Charcoal',
                  size: 'S'
                },
                {
                  name: 'Silk Kimono Jacket',
                  brand: 'Valentino',
                  category: 'Outerwear',
                  price: 3200,
                  image: 'https://images.unsplash.com/photo-1673855945969-5a340b5c0843?w=400&h=400&fit=crop',
                  color: 'Burgundy',
                  size: 'M'
                }
              ],
              total: 8107,
              status: 'delivered'
            }
          ];
          
          // Save mock orders to backend
          try {
            for (const order of mockOrders) {
              await api.saveOrder(userId, order);
            }
            console.log('Luxury wardrobe saved to backend:', mockOrders.length, 'orders');
            toast.success(`Loaded ${mockOrders.length} luxury wardrobe orders with 50 items`);
          } catch (error) {
            console.error('Error saving mock orders to backend:', error);
            toast.error('Error loading luxury wardrobe');
          }
          
          setOrders(mockOrders);
        } else {
          // Load existing orders
          setOrders(userOrders);
          // Calculate total items across all orders
          const totalItems = userOrders.reduce((sum, order) => sum + (order.items?.length || 0), 0);
          console.log(`Loaded existing wardrobe: ${userOrders.length} orders, ${totalItems} items`);
        }
      } catch (error) {
        console.error('Error loading user data:', error);
      }
    };

    loadUserData();
  }, [userId, isAuthenticated]);

  // Save social connections when they change
  useEffect(() => {
    if (userId && isAuthenticated) {
      api.saveSocialConnections(userId, isConnected).catch(console.error);
    }
  }, [isConnected, userId, isAuthenticated]);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      setIsAuthenticated(false);
      setUserId(null);
      setUserName('');
      setUserEmail('');
      setOrders([]);
      setIsConnected({ instagram: false, tiktok: false, pinterest: false });
      toast.success('Signed out successfully');
    } catch (error) {
      console.error('Error signing out:', error);
      toast.error('Failed to sign out');
    }
  };

  const handleAuthSuccess = () => {
    // Auth state will be updated by the onAuthStateChange listener
  };

  const mockUserData = {
    name: userName,
    avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=f43f5e&color=fff`,
    connectedAccounts: Object.values(isConnected).filter(Boolean).length,
    totalOrders: orders.length,
    styleScore: 92,
    dominantStyles: ["Minimalist", "Contemporary", "Elegant"]
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-center">
          <div className="relative mb-8">
            <div className="animate-spin rounded-full h-12 w-12 border border-[#d4af37] border-t-transparent mx-auto"></div>
          </div>
          <p className="text-xs uppercase tracking-[0.2em] text-[#a39882]">Loading</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Auth onAuthSuccess={handleAuthSuccess} />;
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Header */}
      <header className="border-b border-[#2a2a2a] bg-[#0a0a0a]/95 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-[1600px] mx-auto px-8 lg:px-16 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-8">
              <div>
                <h1 className="text-2xl tracking-tight font-light text-[#e8e3d8]" style={{fontFamily: 'var(--font-serif)'}}>StyleSync</h1>
              </div>
            </div>
            <div className="flex items-center gap-8">
              <div className="hidden md:block">
                <span className="text-xs uppercase tracking-[0.15em] text-[#a39882]">Style Score</span>
                <span className="ml-3 text-sm text-[#d4af37]">{mockUserData.styleScore}%</span>
              </div>
              <div className="flex items-center gap-4">
                <Avatar className="h-9 w-9 border border-[#2a2a2a]">
                  <AvatarImage src={mockUserData.avatar} />
                  <AvatarFallback className="bg-[#d4af37] text-[#0a0a0a] text-xs">
                    {mockUserData.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => setShowDevTools(!showDevTools)} 
                  title="Developer Tools" 
                  className="hover:bg-[#1a1a1a] h-9 w-9 text-[#a39882]"
                  onDoubleClick={() => setShowDevTools(!showDevTools)}
                >
                  <span className="text-xs">🛠</span>
                </Button>
                <Button variant="ghost" size="icon" onClick={handleLogout} title="Sign out" className="hover:bg-[#1a1a1a] h-9 w-9 text-[#a39882]">
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Developer Tools Panel */}
      {showDevTools && (
        <div className="bg-red-950/20 border-b border-red-500/30">
          <div className="max-w-[1600px] mx-auto px-8 lg:px-16 py-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.15em] text-red-400 mb-2">Developer Tools</p>
                <p className="text-xs text-[#a39882]">Clear all backend data for testing</p>
              </div>
              <div className="flex gap-3">
                <Button
                  onClick={async () => {
                    if (confirm('⚠️ WARNING: Delete ALL moodboards? This cannot be undone.')) {
                      try {
                        await api.deleteAllMoodboards(userId!);
                        toast.success('All moodboards deleted');
                        window.location.reload();
                      } catch (error) {
                        console.error('Error deleting moodboards:', error);
                        toast.error('Failed to delete moodboards');
                      }
                    }
                  }}
                  variant="outline"
                  className="border-red-500/30 text-red-400 hover:bg-red-500/10 text-xs"
                >
                  Clear Moodboards
                </Button>
                <Button
                  onClick={() => setShowDevTools(false)}
                  variant="ghost"
                  className="text-[#a39882] text-xs"
                >
                  Close
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-[1600px] mx-auto px-8 lg:px-16 py-12">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-16">
          <TabsList className="inline-flex h-auto gap-8 bg-transparent border-b border-[#2a2a2a] w-full justify-start p-0 rounded-none">
            <TabsTrigger value="overview" data-value="overview" className="border-b-2 border-transparent data-[state=active]:border-[#d4af37] rounded-none bg-transparent pb-3 px-0 text-xs uppercase tracking-[0.15em] font-medium data-[state=active]:shadow-none text-[#a39882] data-[state=active]:text-[#d4af37]">
              Overview
            </TabsTrigger>
            <TabsTrigger value="connect" data-value="connect" className="border-b-2 border-transparent data-[state=active]:border-[#d4af37] rounded-none bg-transparent pb-3 px-0 text-xs uppercase tracking-[0.15em] font-medium data-[state=active]:shadow-none text-[#a39882] data-[state=active]:text-[#d4af37]">
              Connect
            </TabsTrigger>
            <TabsTrigger value="orders" className="border-b-2 border-transparent data-[state=active]:border-[#d4af37] rounded-none bg-transparent pb-3 px-0 text-xs uppercase tracking-[0.15em] font-medium data-[state=active]:shadow-none text-[#a39882] data-[state=active]:text-[#d4af37]">
              Wardrobe
            </TabsTrigger>
            <TabsTrigger value="moodboard" className="border-b-2 border-transparent data-[state=active]:border-[#d4af37] rounded-none bg-transparent pb-3 px-0 text-xs uppercase tracking-[0.15em] font-medium data-[state=active]:shadow-none text-[#a39882] data-[state=active]:text-[#d4af37]">
              Moodboard
            </TabsTrigger>
            <TabsTrigger value="recommendations" className="border-b-2 border-transparent data-[state=active]:border-[#d4af37] rounded-none bg-transparent pb-3 px-0 text-xs uppercase tracking-[0.15em] font-medium data-[state=active]:shadow-none text-[#a39882] data-[state=active]:text-[#d4af37]">
              Discover
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-16">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <Card className="bg-[#141414] border border-[#2a2a2a] hover:border-[#d4af37]/30 transition-colors">
                <CardHeader className="pb-4">
                  <CardTitle className="text-xs uppercase tracking-[0.15em] text-[#a39882] font-medium">Connected</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-5xl font-light text-[#e8e3d8]" style={{fontFamily: 'var(--font-serif)'}}>{mockUserData.connectedAccounts}</div>
                  <p className="text-xs uppercase tracking-[0.1em] text-[#666] mt-3">Social platforms</p>
                </CardContent>
              </Card>

              <Card className="bg-[#141414] border border-[#2a2a2a] hover:border-[#d4af37]/30 transition-colors">
                <CardHeader className="pb-4">
                  <CardTitle className="text-xs uppercase tracking-[0.15em] text-[#a39882] font-medium">Wardrobe</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-5xl font-light text-[#e8e3d8]" style={{fontFamily: 'var(--font-serif)'}}>{mockUserData.totalOrders}</div>
                  <p className="text-xs uppercase tracking-[0.1em] text-[#666] mt-3">Total items</p>
                </CardContent>
              </Card>

              <Card className="bg-[#141414] border border-[#2a2a2a] hover:border-[#d4af37]/30 transition-colors">
                <CardHeader className="pb-4">
                  <CardTitle className="text-xs uppercase tracking-[0.15em] text-[#a39882] font-medium">Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-5xl font-light text-[#e8e3d8]" style={{fontFamily: 'var(--font-serif)'}}>{mockUserData.styleScore}%</div>
                    <Progress value={mockUserData.styleScore} className="h-px bg-[#2a2a2a]" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-[#141414] border border-[#2a2a2a] hover:border-[#d4af37]/30 transition-colors">
                <CardHeader className="pb-4">
                  <CardTitle className="text-xs uppercase tracking-[0.15em] text-[#a39882] font-medium">Profile</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col gap-2">
                    {mockUserData.dominantStyles.map((style, index) => (
                      <span key={index} className="text-xs uppercase tracking-[0.1em] text-[#a39882]">
                        {style}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <Card className="bg-[#141414] border border-[#2a2a2a]">
                <CardHeader className="border-b border-[#2a2a2a] pb-6">
                  <CardTitle className="text-xl font-light text-[#e8e3d8]" style={{fontFamily: 'var(--font-serif)'}}>Style Insights</CardTitle>
                  <CardDescription className="text-xs uppercase tracking-[0.1em] text-[#666] mt-2">Based on your activity</CardDescription>
                </CardHeader>
                <CardContent className="pt-6 space-y-6">
                  <div className="flex items-start gap-6 pb-6 border-b border-[#1a1a1a]">
                    <div className="w-10 h-10 border border-[#2a2a2a] flex items-center justify-center flex-shrink-0">
                      <Palette className="h-4 w-4 text-[#d4af37]" />
                    </div>
                    <div>
                      <p className="text-sm mb-2 text-[#e8e3d8]">Gravitating towards neutral tones</p>
                      <p className="text-xs text-[#a39882] uppercase tracking-[0.1em]">Instagram analysis</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-6">
                    <div className="w-10 h-10 border border-[#2a2a2a] flex items-center justify-center flex-shrink-0">
                      <TrendingUp className="h-4 w-4 text-[#d4af37]" />
                    </div>
                    <div>
                      <p className="text-sm mb-2 text-[#e8e3d8]">Minimalist aesthetic trending</p>
                      <p className="text-xs text-[#a39882] uppercase tracking-[0.1em]">Pinterest activity</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-[#141414] border border-[#2a2a2a]">
                <CardHeader className="border-b border-[#2a2a2a] pb-6">
                  <CardTitle className="text-xl font-light text-[#e8e3d8]" style={{fontFamily: 'var(--font-serif)'}}>Quick Actions</CardTitle>
                  <CardDescription className="text-xs uppercase tracking-[0.1em] text-[#666] mt-2">Get started</CardDescription>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                  <Button className="w-full justify-start bg-transparent hover:bg-[#d4af37] hover:text-[#0a0a0a] text-[#e8e3d8] border border-[#2a2a2a] hover:border-[#d4af37] transition-colors h-12" variant="outline" onClick={() => setActiveTab('connect')}>
                    Connect Accounts
                  </Button>
                  <Button className="w-full justify-start bg-transparent hover:bg-[#d4af37] hover:text-[#0a0a0a] text-[#e8e3d8] border border-[#2a2a2a] hover:border-[#d4af37] transition-colors h-12" variant="outline" onClick={() => setActiveTab('moodboard')}>
                    Create Moodboard
                  </Button>
                  <Button className="w-full justify-start bg-transparent hover:bg-[#d4af37] hover:text-[#0a0a0a] text-[#e8e3d8] border border-[#2a2a2a] hover:border-[#d4af37] transition-colors h-12" variant="outline" onClick={() => setActiveTab('recommendations')}>
                    Discover Pieces
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="connect">
            <SocialMediaConnect isConnected={isConnected} setIsConnected={setIsConnected} userId={userId!} />
          </TabsContent>

          <TabsContent value="orders">
            <OrderHistory userId={userId!} orders={orders} setOrders={setOrders} />
          </TabsContent>

          <TabsContent value="moodboard">
            <div className="space-y-12">
              <MoodboardCreator userId={userId!} orders={orders} setOrders={setOrders} />
              <div className="border-t border-[#2a2a2a] pt-12">
                <PinterestMoodboard userId={userId!} isConnected={isConnected.pinterest} />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="recommendations">
            <Recommendations userId={userId!} />
          </TabsContent>
        </Tabs>
      </div>
      <Toaster />
    </div>
  );
}