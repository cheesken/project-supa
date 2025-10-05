import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Heart, ShoppingCart, Sparkles, Filter, Star, TrendingUp, Zap } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { api } from '../utils/api';

interface RecommendationsProps {
  userId: string;
}

export function Recommendations({ userId }: RecommendationsProps) {
  const [likedItems, setLikedItems] = useState<number[]>([]);
  const [filter, setFilter] = useState('all');

  // Load wishlist from backend
  useEffect(() => {
    const loadWishlist = async () => {
      try {
        const wishlist = await api.getWishlist(userId);
        setLikedItems(wishlist);
      } catch (error) {
        console.error('Error loading wishlist:', error);
      }
    };

    loadWishlist();
  }, [userId]);

  const recommendations = [
    {
      id: 1,
      name: 'Cropped Wool Sweater',
      brand: 'Everlane',
      price: 88,
      originalPrice: 120,
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=300&fit=crop',
      category: 'Tops',
      reason: 'Complements your minimalist blazer collection',
      matchScore: 95,
      colors: ['cream', 'beige'],
      style: 'Minimalist',
      occasion: ['casual', 'professional'],
      inStock: true,
      trending: true
    },
    {
      id: 2,
      name: 'Wide-Leg Trousers',
      brand: 'COS',
      price: 79,
      originalPrice: null,
      image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=300&h=300&fit=crop',
      category: 'Bottoms',
      reason: 'Perfect for creating professional looks with your existing blazers',
      matchScore: 92,
      colors: ['navy', 'black'],
      style: 'Contemporary',
      occasion: ['professional', 'evening'],
      inStock: true,
      trending: false
    },
    {
      id: 3,
      name: 'Statement Gold Necklace',
      brand: 'Mejuri',
      price: 145,
      originalPrice: null,
      image: 'https://images.unsplash.com/photo-1569388330338-53ecda03dfa1?w=300&h=300&fit=crop',
      category: 'Accessories',
      reason: 'Adds visual interest to your neutral wardrobe',
      matchScore: 88,
      colors: ['gold'],
      style: 'Contemporary',
      occasion: ['evening', 'professional'],
      inStock: false,
      trending: true
    },
    {
      id: 4,
      name: 'Cashmere Cardigan',
      brand: 'Uniqlo',
      price: 69,
      originalPrice: 99,
      image: 'https://images.unsplash.com/photo-1578758071273-1b4c8db4e0fe?w=300&h=300&fit=crop',
      category: 'Tops',
      reason: 'Layering piece that matches your sophisticated aesthetic',
      matchScore: 90,
      colors: ['camel', 'gray'],
      style: 'Minimalist',
      occasion: ['casual', 'professional'],
      inStock: true,
      trending: false
    },
    {
      id: 5,
      name: 'Structured Handbag',
      brand: 'Polene',
      price: 295,
      originalPrice: null,
      image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300&h=300&fit=crop',
      category: 'Accessories',
      reason: 'Elevates your existing outfits with a luxury touch',
      matchScore: 87,
      colors: ['tan', 'black'],
      style: 'Contemporary',
      occasion: ['professional', 'evening'],
      inStock: true,
      trending: true
    },
    {
      id: 6,
      name: 'Midi Slip Dress',
      brand: 'Reformation',
      price: 158,
      originalPrice: 218,
      image: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=300&h=300&fit=crop',
      category: 'Dresses',
      reason: 'Versatile piece that can be dressed up or down',
      matchScore: 89,
      colors: ['sage', 'navy'],
      style: 'Contemporary',
      occasion: ['evening', 'casual'],
      inStock: true,
      trending: false
    }
  ];

  const categories = ['all', 'Tops', 'Bottoms', 'Dresses', 'Accessories'];

  const filteredRecommendations = recommendations.filter(item => 
    filter === 'all' || item.category === filter
  );

  const toggleLike = async (id: number) => {
    const updatedLikes = likedItems.includes(id)
      ? likedItems.filter(item => item !== id)
      : [...likedItems, id];
    
    setLikedItems(updatedLikes);
    
    // Save to backend
    try {
      await api.saveWishlist(userId, updatedLikes);
    } catch (error) {
      console.error('Error saving wishlist:', error);
    }
  };

  const getMatchColor = (score: number) => {
    if (score >= 90) return 'text-green-600 bg-green-100';
    if (score >= 85) return 'text-yellow-600 bg-yellow-100';
    return 'text-orange-600 bg-orange-100';
  };

  return (
    <div className="space-y-12">
      <div className="text-center space-y-4">
        <h2 className="text-4xl font-light text-[#e8e3d8]" style={{fontFamily: 'var(--font-serif)'}}>Discover</h2>
        <p className="text-sm text-[#a39882] max-w-2xl mx-auto">
          Curated pieces that complement your wardrobe
        </p>
      </div>

      <Tabs defaultValue="recommendations" className="w-full">
        <TabsList className="inline-flex h-auto gap-8 bg-transparent border-b border-[#2a2a2a] w-full justify-center p-0 mb-12">
          <TabsTrigger value="recommendations" className="border-b-2 border-transparent data-[state=active]:border-[#d4af37] rounded-none bg-transparent pb-3 px-0 text-xs uppercase tracking-[0.15em] font-medium text-[#a39882] data-[state=active]:text-[#d4af37]">
            For You
          </TabsTrigger>
          <TabsTrigger value="trending" className="border-b-2 border-transparent data-[state=active]:border-[#d4af37] rounded-none bg-transparent pb-3 px-0 text-xs uppercase tracking-[0.15em] font-medium text-[#a39882] data-[state=active]:text-[#d4af37]">
            Trending
          </TabsTrigger>
          <TabsTrigger value="wishlist" className="border-b-2 border-transparent data-[state=active]:border-[#d4af37] rounded-none bg-transparent pb-3 px-0 text-xs uppercase tracking-[0.15em] font-medium text-[#a39882] data-[state=active]:text-[#d4af37]">
            Wishlist ({likedItems.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="recommendations" className="space-y-8">
          <div className="flex justify-between items-center pb-6 border-b border-[#2a2a2a]">
            <div>
              <p className="text-xs uppercase tracking-[0.15em] text-[#666]">Based on your style</p>
            </div>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-4 py-2 border border-[#2a2a2a] text-xs uppercase tracking-[0.1em] bg-[#1a1a1a] text-[#e8e3d8] hover:border-[#d4af37] transition-colors"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category === 'all' ? 'All Categories' : category}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredRecommendations.map((item) => (
              <Card key={item.id} className="group relative overflow-hidden hover:border-[#d4af37]/30 transition-colors border-[#2a2a2a] bg-[#141414]">
                {item.trending && (
                  <div className="absolute top-4 left-4 z-10">
                    <span className="text-[10px] uppercase tracking-[0.15em] bg-[#d4af37] text-[#0a0a0a] px-2 py-1">
                      Trending
                    </span>
                  </div>
                )}
                
                <div className="absolute top-4 right-4 z-10">
                  <Button
                    size="sm"
                    variant="ghost"
                    className={`w-8 h-8 p-0 border transition-all ${
                      likedItems.includes(item.id)
                        ? 'bg-[#d4af37] text-[#0a0a0a] border-[#d4af37]'
                        : 'bg-[#141414] text-[#e8e3d8] border-[#2a2a2a] hover:border-[#d4af37]'
                    }`}
                    onClick={() => toggleLike(item.id)}
                  >
                    <Heart className={`h-3.5 w-3.5 ${likedItems.includes(item.id) ? 'fill-current' : ''}`} />
                  </Button>
                </div>

                <div className="relative aspect-[3/4] overflow-hidden bg-[#1a1a1a]">
                  <ImageWithFallback
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  {!item.inStock && (
                    <div className="absolute inset-0 bg-[#0a0a0a]/80 flex items-center justify-center">
                      <span className="text-xs uppercase tracking-[0.15em] bg-[#e8e3d8] text-[#0a0a0a] px-3 py-1.5">
                        Out of Stock
                      </span>
                    </div>
                  )}
                </div>

                <CardContent className="p-6 space-y-4">
                  <div>
                    <h4 className="text-sm mb-1 text-[#e8e3d8]">{item.name}</h4>
                    <p className="text-xs uppercase tracking-[0.1em] text-[#a39882]">{item.brand}</p>
                  </div>

                  <div className="flex items-baseline gap-3">
                    <span className="text-lg text-[#e8e3d8]">${item.price}</span>
                    {item.originalPrice && (
                      <span className="text-sm text-[#666] line-through">
                        ${item.originalPrice}
                      </span>
                    )}
                    <span className="ml-auto text-xs text-[#d4af37]">
                      {item.matchScore}% Match
                    </span>
                  </div>

                  <div className="pt-4 border-t border-[#2a2a2a]">
                    <p className="text-xs text-[#a39882] leading-relaxed">{item.reason}</p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <span className="text-[10px] uppercase tracking-[0.15em] text-[#666]">
                      {item.style}
                    </span>
                    {item.occasion.slice(0, 2).map((occ, index) => (
                      <span key={index} className="text-[10px] uppercase tracking-[0.15em] text-[#666]">
                        · {occ}
                      </span>
                    ))}
                  </div>

                  <Button 
                    className={`w-full h-11 ${item.inStock ? 'bg-[#d4af37] hover:bg-[#c9a961] text-[#0a0a0a]' : 'bg-transparent text-[#666] border border-[#2a2a2a]'}`}
                    disabled={!item.inStock}
                  >
                    {item.inStock ? 'Add to Cart' : 'Notify When Available'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="trending" className="space-y-8">
          <div className="pb-6 border-b border-[#2a2a2a]">
            <p className="text-xs uppercase tracking-[0.15em] text-[#666]">Popular items aligned with your style</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {recommendations.filter(item => item.trending).map((item) => (
              <div key={item.id} className="space-y-3 group cursor-pointer">
                <div className="relative aspect-[3/4] overflow-hidden bg-[#1a1a1a]">
                  <ImageWithFallback
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm text-[#e8e3d8]">{item.name}</h4>
                  <p className="text-xs uppercase tracking-[0.1em] text-[#a39882]">{item.brand}</p>
                  <p className="text-sm text-[#d4af37]">${item.price}</p>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="wishlist" className="space-y-8">
          {likedItems.length === 0 ? (
            <div className="py-20 text-center">
              <Heart className="h-12 w-12 text-[#2a2a2a] mx-auto mb-6" />
              <h3 className="text-xl font-light mb-2 text-[#e8e3d8]" style={{fontFamily: 'var(--font-serif)'}}>Your wishlist is empty</h3>
              <p className="text-xs uppercase tracking-[0.1em] text-[#666]">Save items you love</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {recommendations.filter(item => likedItems.includes(item.id)).map((item) => (
                <div key={item.id} className="group relative">
                  <div className="absolute top-3 right-3 z-10">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="w-8 h-8 p-0 border bg-[#d4af37] text-[#0a0a0a] border-[#d4af37] hover:bg-[#1a1a1a] hover:text-[#d4af37] transition-colors"
                      onClick={() => toggleLike(item.id)}
                    >
                      <Heart className="h-3.5 w-3.5 fill-current" />
                    </Button>
                  </div>
                  
                  <div className="aspect-[3/4] overflow-hidden bg-[#1a1a1a] mb-3">
                    <ImageWithFallback
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  </div>
                  
                  <div className="space-y-1">
                    <h4 className="text-sm text-[#e8e3d8]">{item.name}</h4>
                    <p className="text-xs uppercase tracking-[0.1em] text-[#a39882]">{item.brand}</p>
                    <p className="text-sm mt-2 text-[#d4af37]">${item.price}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}