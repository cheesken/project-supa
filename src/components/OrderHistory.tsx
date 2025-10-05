import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Calendar, ShoppingBag, Star, Filter, Search, Upload, X, AlertCircle, CheckCircle2, Download, Sparkles } from 'lucide-react';
import { Input } from './ui/input';
import { Alert, AlertDescription } from './ui/alert';
import { api } from '../utils/api';
import { parseWardrobeCSV, convertItemsToOrders } from '../utils/csvParser';
import { toast } from 'sonner@2.0.3';

interface OrderHistoryProps {
  userId: string;
  orders: any[];
  setOrders: React.Dispatch<React.SetStateAction<any[]>>;
}

export function OrderHistory({ userId, orders, setOrders }: OrderHistoryProps) {
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<{ type: 'success' | 'error' | null, message: string }>({ type: null, message: '' });
  const [isGeneratingTestData, setIsGeneratingTestData] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleCSVUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadStatus({ type: null, message: '' });

    try {
      const text = await file.text();
      const { items, errors } = parseWardrobeCSV(text);

      if (errors.length > 0 && items.length === 0) {
        setUploadStatus({ type: 'error', message: errors.join('; ') });
        toast.error('Failed to parse CSV file');
        return;
      }

      if (items.length === 0) {
        setUploadStatus({ type: 'error', message: 'No valid items found in CSV' });
        toast.error('No valid items found');
        return;
      }

      // Convert items to order format
      const newOrders = convertItemsToOrders(items);
      
      // Save to backend
      try {
        for (const order of newOrders) {
          await api.saveOrder(userId, order);
        }
      } catch (error) {
        console.error('Error saving orders to backend:', error);
        // Continue even if backend save fails
      }

      // Update local state
      setOrders(prev => [...prev, ...newOrders]);
      
      const successMessage = `Successfully imported ${items.length} item(s) from CSV${errors.length > 0 ? ` (${errors.length} rows had errors)` : ''}`;
      setUploadStatus({ type: 'success', message: successMessage });
      toast.success(`Imported ${items.length} items`);

      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('Error processing CSV:', error);
      setUploadStatus({ type: 'error', message: 'Failed to process CSV file' });
      toast.error('Failed to process file');
    } finally {
      setIsUploading(false);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const generateTestData = async () => {
    setIsGeneratingTestData(true);
    
    const luxuryTestData = [
      {
        id: Date.now() + 1,
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
        id: Date.now() + 2,
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
        id: Date.now() + 3,
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
        id: Date.now() + 4,
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
        id: Date.now() + 5,
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
      }
    ];

    try {
      // Save to backend
      for (const order of luxuryTestData) {
        await api.saveOrder(userId, order);
      }
      
      // Update local state
      setOrders(prev => [...prev, ...luxuryTestData]);
      
      const totalItems = luxuryTestData.reduce((sum, order) => sum + order.items.length, 0);
      toast.success(`Generated ${luxuryTestData.length} orders with ${totalItems} luxury items`);
    } catch (error) {
      console.error('Error generating test data:', error);
      toast.error('Failed to generate test data');
    } finally {
      setIsGeneratingTestData(false);
    }
  };

  const mockOrders = orders.length > 0 ? orders : [
    {
      id: 1,
      date: '2024-10-01',
      items: [
        {
          name: 'Minimalist White Blazer',
          brand: 'Everlane',
          category: 'Outerwear',
          price: 168,
          image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=300&h=300&fit=crop',
          color: 'White',
          size: 'M'
        },
        {
          name: 'High-Waisted Straight Jeans',
          brand: 'Reformation',
          category: 'Bottoms',
          price: 128,
          image: 'https://images.unsplash.com/photo-1582418702059-97ebafb35d09?w=300&h=300&fit=crop',
          color: 'Medium Blue',
          size: '28'
        }
      ],
      total: 296,
      status: 'delivered'
    },
    {
      id: 2,
      date: '2024-09-15',
      items: [
        {
          name: 'Silk Midi Dress',
          brand: 'Reformation',
          category: 'Dresses',
          price: 198,
          image: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=300&h=300&fit=crop',
          color: 'Forest Green',
          size: 'S'
        }
      ],
      total: 198,
      status: 'delivered'
    },
    {
      id: 3,
      date: '2024-09-02',
      items: [
        {
          name: 'Classic Trench Coat',
          brand: 'COS',
          category: 'Outerwear',
          price: 225,
          image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=300&h=300&fit=crop',
          color: 'Camel',
          size: 'M'
        },
        {
          name: 'Leather Ankle Boots',
          brand: 'Everlane',
          category: 'Shoes',
          price: 225,
          image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=300&h=300&fit=crop',
          color: 'Black',
          size: '8'
        },
        {
          name: 'Cashmere Scarf',
          brand: 'Uniqlo',
          category: 'Accessories',
          price: 39,
          image: 'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=300&h=300&fit=crop',
          color: 'Camel',
          size: 'One Size'
        }
      ],
      total: 489,
      status: 'delivered'
    }
  ];

  const categories = ['all', 'Outerwear', 'Bottoms', 'Dresses', 'Shoes', 'Accessories', 'Tops', 'Jewelry'];

  const filteredOrders = orders.filter(order => {
    const matchesFilter = filter === 'all' || order.items.some(item => item.category === filter);
    const matchesSearch = searchTerm === '' || order.items.some(item => 
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.brand.toLowerCase().includes(searchTerm.toLowerCase())
    );
    return matchesFilter && matchesSearch;
  });

  const totalItems = orders.reduce((sum, order) => sum + order.items.length, 0);
  const totalSpent = orders.reduce((sum, order) => sum + order.total, 0);
  const topBrands = orders.flatMap(order => order.items.map(item => item.brand))
    .reduce((acc, brand) => {
      acc[brand] = (acc[brand] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

  return (
    <div className="space-y-12">
      <div className="flex flex-col md:flex-row gap-6 justify-between items-start md:items-center pb-8 border-b border-[#2a2a2a]">
        <div>
          <h2 className="text-3xl font-light mb-2 text-[#e8e3d8]" style={{fontFamily: 'var(--font-serif)'}}>Wardrobe</h2>
          <p className="text-xs uppercase tracking-[0.1em] text-[#666]">Your collection</p>
        </div>
        <div className="flex gap-3 w-full md:w-auto flex-wrap md:flex-nowrap">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#666]" />
            <Input
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 border-[#2a2a2a] bg-[#1a1a1a] text-[#e8e3d8] h-10 hover:border-[#d4af37] transition-colors"
            />
          </div>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-4 py-2 border border-[#2a2a2a] text-xs uppercase tracking-[0.1em] bg-[#1a1a1a] text-[#e8e3d8] hover:border-[#d4af37] transition-colors"
          >
            {categories.map(category => (
              <option key={category} value={category}>
                {category === 'all' ? 'All' : category}
              </option>
            ))}
          </select>
          {orders.length === 0 && (
            <Button
              onClick={generateTestData}
              disabled={isGeneratingTestData}
              className="bg-[#d4af37]/20 hover:bg-[#d4af37]/30 text-[#d4af37] border border-[#d4af37]/30 h-10 gap-2"
            >
              {isGeneratingTestData ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-[#d4af37] border-t-transparent" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  Generate Test Data
                </>
              )}
            </Button>
          )}
          <Button
            onClick={handleUploadClick}
            disabled={isUploading}
            className="bg-[#d4af37] hover:bg-[#c9a961] text-[#0a0a0a] h-10 gap-2"
          >
            {isUploading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-[#0a0a0a] border-t-transparent" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="h-4 w-4" />
                Import CSV
              </>
            )}
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            onChange={handleCSVUpload}
            className="hidden"
          />
        </div>
      </div>

      {/* Upload Status Alert */}
      {uploadStatus.type && (
        <Alert className={`${uploadStatus.type === 'success' ? 'bg-[#d4af37]/10 border-[#d4af37]/30' : 'bg-red-500/10 border-red-500/30'}`}>
          <div className="flex items-start gap-3">
            {uploadStatus.type === 'success' ? (
              <CheckCircle2 className="h-4 w-4 text-[#d4af37] mt-0.5" />
            ) : (
              <AlertCircle className="h-4 w-4 text-red-500 mt-0.5" />
            )}
            <div className="flex-1">
              <AlertDescription className={uploadStatus.type === 'success' ? 'text-[#d4af37]' : 'text-red-400'}>
                {uploadStatus.message}
              </AlertDescription>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 hover:bg-transparent"
              onClick={() => setUploadStatus({ type: null, message: '' })}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </Alert>
      )}

      {/* CSV Format Guide */}
      {orders.length === 0 && (
        <Card className="bg-[#141414] border-[#2a2a2a]">
          <CardHeader>
            <CardTitle className="text-lg text-[#e8e3d8] flex items-center gap-3">
              <div className="w-10 h-10 marble-texture border border-[#2a2a2a] flex items-center justify-center">
                <Upload className="h-4 w-4 text-[#d4af37]" />
              </div>
              Import Your Wardrobe
            </CardTitle>
            <CardDescription className="text-[#a39882] mt-2">
              Upload a CSV file to quickly add all your wardrobe items
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-xs uppercase tracking-[0.15em] text-[#666] mb-3">Required CSV Columns:</p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {['Name', 'Brand', 'Category', 'Price', 'Color'].map((col) => (
                  <Badge key={col} variant="outline" className="border-[#2a2a2a] text-[#a39882]">
                    {col}
                  </Badge>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.15em] text-[#666] mb-3">Optional Columns:</p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {['Size', 'Image', 'Date'].map((col) => (
                  <Badge key={col} variant="outline" className="border-[#2a2a2a]/50 text-[#666]">
                    {col}
                  </Badge>
                ))}
              </div>
            </div>
            <div className="pt-4 border-t border-[#2a2a2a] space-y-4">
              <p className="text-xs text-[#a39882] leading-relaxed">
                Example: <span className="text-[#d4af37] font-mono">Name,Brand,Category,Price,Color,Size</span>
              </p>
              <a
                href="/wardrobe_template.csv"
                download="wardrobe_template.csv"
                className="inline-block"
              >
                <Button variant="outline" className="bg-transparent hover:bg-[#1a1a1a] text-[#e8e3d8] border-[#2a2a2a] hover:border-[#d4af37] h-10 gap-2">
                  <Download className="h-4 w-4" />
                  Download Template CSV
                </Button>
              </a>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-[#141414] border-[#2a2a2a]">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 marble-texture border border-[#2a2a2a] flex items-center justify-center">
                <ShoppingBag className="h-5 w-5 text-[#d4af37]" />
              </div>
              <div>
                <p className="text-3xl font-light text-[#e8e3d8]" style={{fontFamily: 'var(--font-serif)'}}>{totalItems}</p>
                <p className="text-xs uppercase tracking-[0.1em] text-[#666]">Total Items</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#141414] border-[#2a2a2a]">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 marble-texture border border-[#2a2a2a] flex items-center justify-center">
                <Star className="h-5 w-5 text-[#d4af37]" />
              </div>
              <div>
                <p className="text-3xl font-light text-[#e8e3d8]" style={{fontFamily: 'var(--font-serif)'}}>${totalSpent}</p>
                <p className="text-xs uppercase tracking-[0.1em] text-[#666]">Invested</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#141414] border-[#2a2a2a]">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 marble-texture border border-[#2a2a2a] flex items-center justify-center">
                <Calendar className="h-5 w-5 text-[#d4af37]" />
              </div>
              <div>
                <p className="text-3xl font-light text-[#e8e3d8]" style={{fontFamily: 'var(--font-serif)'}}>{orders.length}</p>
                <p className="text-xs uppercase tracking-[0.1em] text-[#666]">Orders</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#141414] border-[#2a2a2a]">
          <CardContent className="p-6">
            <div>
              <p className="text-xs uppercase tracking-[0.1em] text-[#666] mb-2">Top Brand</p>
              <p className="text-xl text-[#e8e3d8]">{Object.entries(topBrands).sort(([,a], [,b]) => b - a)[0]?.[0] || 'N/A'}</p>
              <Badge variant="secondary" className="mt-2 bg-[#d4af37]/10 text-[#d4af37] border-[#d4af37]/20">
                {Object.entries(topBrands).sort(([,a], [,b]) => b - a)[0]?.[1] || 0} items
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Orders List */}
      <div className="space-y-6">
        {filteredOrders.map((order) => (
          <Card key={order.id} className="bg-[#141414] border-[#2a2a2a]">
            <CardHeader className="border-b border-[#2a2a2a]">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg text-[#e8e3d8]">Order #{order.id}</CardTitle>
                  <CardDescription className="text-[#a39882]">
                    {new Date(order.date).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </CardDescription>
                </div>
                <div className="text-right">
                  <p className="text-lg text-[#e8e3d8]">${order.total}</p>
                  <Badge variant="secondary" className="bg-[#d4af37]/10 text-[#d4af37] border-[#d4af37]/20">
                    {order.status}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {order.items.map((item, index) => (
                  <div key={index} className="flex gap-4 p-4 border border-[#2a2a2a] bg-[#1a1a1a] hover:border-[#d4af37]/30 transition-colors">
                    <ImageWithFallback
                      src={item.image}
                      alt={item.name}
                      className="w-20 h-20 object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm truncate text-[#e8e3d8]">{item.name}</h4>
                      <p className="text-xs text-[#a39882] uppercase tracking-[0.1em]">{item.brand}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="outline" className="text-[10px] border-[#2a2a2a] text-[#a39882]">
                          {item.category}
                        </Badge>
                        <span className="text-xs text-[#666]">{item.color}</span>
                      </div>
                      <p className="text-sm mt-2 text-[#d4af37]">${item.price}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredOrders.length === 0 && (
        <Card className="bg-[#141414] border-[#2a2a2a]">
          <CardContent className="p-12 text-center">
            <ShoppingBag className="h-12 w-12 text-[#2a2a2a] mx-auto mb-6" />
            <h3 className="text-xl font-light mb-2 text-[#e8e3d8]" style={{fontFamily: 'var(--font-serif)'}}>No orders found</h3>
            <p className="text-xs uppercase tracking-[0.1em] text-[#666]">Try adjusting your search or filter criteria.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}