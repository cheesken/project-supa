import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Upload, Download, Share2, Heart, Sparkles, Grid, LayoutGrid, Move, Plus, X, Wand2, Check, Trash2 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { api } from '../utils/api';
import { toast } from 'sonner@2.0.3';
import { Alert, AlertDescription } from './ui/alert';

interface MoodboardCreatorProps {
  userId: string;
  orders: any[];
  setOrders: React.Dispatch<React.SetStateAction<any[]>>;
}

interface WardrobeItem {
  name: string;
  brand: string;
  category: string;
  price: number;
  image: string;
  color: string;
  size: string;
}

export function MoodboardCreator({ userId, orders, setOrders }: MoodboardCreatorProps) {
  const [inspirationImages, setInspirationImages] = useState<string[]>([]);
  const [selectedWardrobeItems, setSelectedWardrobeItems] = useState<WardrobeItem[]>([]);
  const [wardrobeItems, setWardrobeItems] = useState<WardrobeItem[]>([]);
  const [generatedMoodboards, setGeneratedMoodboards] = useState<any[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeStep, setActiveStep] = useState<'inspiration' | 'wardrobe' | 'generate'>('inspiration');
  const [savedInspiration, setSavedInspiration] = useState<string[] | null>(null);
  const [isSavingInspiration, setIsSavingInspiration] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  // Load user's wardrobe items from orders prop
  useEffect(() => {
    const allItems: WardrobeItem[] = [];
    
    orders.forEach((order: any) => {
      if (order.items) {
        order.items.forEach((item: WardrobeItem) => {
          allItems.push(item);
        });
      }
    });
    
    setWardrobeItems(allItems);
  }, [orders]);

  // Load saved moodboards and inspiration on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const savedMoodboards = await api.getMoodboards(userId);
        if (savedMoodboards && savedMoodboards.length > 0) {
          setGeneratedMoodboards(savedMoodboards);
          console.log(`Loaded ${savedMoodboards.length} saved moodboards`);
        }

        const inspiration = await api.getInspiration(userId);
        if (inspiration?.images) {
          setSavedInspiration(inspiration.images);
          console.log(`Loaded saved inspiration with ${inspiration.images.length} images`);
        }
      } catch (error) {
        console.error('Error loading data:', error);
      }
    };

    loadData();
  }, [userId]);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file) => {
      if (!file.type.startsWith('image/')) {
        toast.error(`${file.name} is not an image file`);
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result;
        if (typeof result === 'string') {
          setInspirationImages(prev => [...prev, result]);
          toast.success('Inspiration image added');
        }
      };
      reader.onerror = () => {
        toast.error('Failed to read image file');
      };
      reader.readAsDataURL(file);
    });

    // Reset input
    event.target.value = '';
  };

  const removeInspirationImage = (index: number) => {
    setInspirationImages(inspirationImages.filter((_, i) => i !== index));
    toast.success('Image removed');
  };

  const toggleWardrobeItem = (item: WardrobeItem) => {
    const isSelected = selectedWardrobeItems.some(
      selected => selected.name === item.name && selected.brand === item.brand
    );

    if (isSelected) {
      setSelectedWardrobeItems(selectedWardrobeItems.filter(
        selected => !(selected.name === item.name && selected.brand === item.brand)
      ));
    } else {
      setSelectedWardrobeItems([...selectedWardrobeItems, item]);
    }
  };

  const isItemSelected = (item: WardrobeItem) => {
    return selectedWardrobeItems.some(
      selected => selected.name === item.name && selected.brand === item.brand
    );
  };

  const generateMoodboard = async () => {
    if (inspirationImages.length === 0 && !savedInspiration) {
      toast.error('Please add inspiration images first');
      setActiveStep('inspiration');
      return;
    }

    if (selectedWardrobeItems.length === 0) {
      toast.error('Please select at least one wardrobe item');
      return;
    }

    setIsGenerating(true);

    try {
      // Show progress feedback
      toast.info('Analyzing inspiration and styling your items...');
      
      // Simulate AI processing
      await new Promise(resolve => setTimeout(resolve, 2500));

      // Use saved inspiration or current inspiration images
      const inspirationToUse = inspirationImages.length > 0 ? inspirationImages : savedInspiration || [];

      // Get items not selected by user - these are available for AI styling
      const availableItems = wardrobeItems.filter(item => 
        !selectedWardrobeItems.some(selected => 
          selected.name === item.name && selected.brand === item.brand
        )
      );

      // AI-generated complementary items to complete the outfit
      const generatedItems: WardrobeItem[] = [];
      
      // Categorize available items
      const availableTops = availableItems.filter(item => item.category === 'Tops');
      const availableBottoms = availableItems.filter(item => item.category === 'Bottoms');
      const availableDresses = availableItems.filter(item => item.category === 'Dresses');
      const availableShoes = availableItems.filter(item => item.category === 'Shoes');
      const availableOuterwear = availableItems.filter(item => item.category === 'Outerwear');
      const availableAccessories = availableItems.filter(item => 
        item.category === 'Accessories' || item.category === 'Jewelry'
      );

      // Check what categories user already selected
      const selectedCategories = selectedWardrobeItems.map(item => item.category);
      const hasDress = selectedCategories.includes('Dresses');
      const hasTop = selectedCategories.includes('Tops');
      const hasBottom = selectedCategories.includes('Bottoms');
      const hasShoes = selectedCategories.includes('Shoes');
      const hasOuterwear = selectedCategories.includes('Outerwear');
      const hasAccessories = selectedCategories.some(cat => cat === 'Accessories' || cat === 'Jewelry');

      // Build a complete outfit by adding missing pieces
      if (!hasDress && !hasTop && availableTops.length > 0) {
        const randomTop = availableTops[Math.floor(Math.random() * availableTops.length)];
        generatedItems.push(randomTop);
      }

      if (!hasDress && !hasBottom && availableBottoms.length > 0) {
        const randomBottom = availableBottoms[Math.floor(Math.random() * availableBottoms.length)];
        generatedItems.push(randomBottom);
      }

      if (!hasShoes && availableShoes.length > 0) {
        const randomShoes = availableShoes[Math.floor(Math.random() * availableShoes.length)];
        generatedItems.push(randomShoes);
      }

      // 60% chance to add outerwear if not already selected
      if (!hasOuterwear && availableOuterwear.length > 0 && Math.random() > 0.4) {
        const randomOuterwear = availableOuterwear[Math.floor(Math.random() * availableOuterwear.length)];
        generatedItems.push(randomOuterwear);
      }

      // Add 1-3 accessories if none selected
      if (!hasAccessories && availableAccessories.length > 0) {
        const accessoryCount = Math.min(
          availableAccessories.length,
          Math.floor(Math.random() * 3) + 1
        );
        const shuffledAccessories = [...availableAccessories].sort(() => 0.5 - Math.random());
        generatedItems.push(...shuffledAccessories.slice(0, accessoryCount));
      }

      // Combine user-selected items + AI-generated items
      const allMoodboardItems = [...selectedWardrobeItems, ...generatedItems];

      // Generate a descriptive name based on ALL items
      const categories = [...new Set(allMoodboardItems.map(item => item.category))];
      const topBrand = allMoodboardItems
        .map(item => item.brand)
        .reduce((acc, brand) => {
          acc[brand] = (acc[brand] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);
      const dominantBrand = Object.entries(topBrand).sort(([,a], [,b]) => b - a)[0]?.[0];

      const styleNames = [
        'Luxury Edit',
        'Capsule Collection',
        'Styled Wardrobe',
        'Fashion Curation',
        'Designer Mix',
        'Elevated Style',
        'Signature Look',
        'Curated Edit'
      ];
      
      const randomStyleName = styleNames[Math.floor(Math.random() * styleNames.length)];
      const moodboardName = categories.length <= 2 
        ? `${categories.join(' & ')} ${randomStyleName}`
        : randomStyleName;

      const newMoodboard = {
        id: Date.now(),
        name: moodboardName,
        createdAt: new Date().toISOString(),
        inspirationImages: inspirationToUse,
        wardrobeItems: allMoodboardItems,
        userSelectedItems: [...selectedWardrobeItems],
        aiGeneratedItems: generatedItems,
        totalValue: allMoodboardItems.reduce((sum, item) => sum + item.price, 0),
        itemCount: allMoodboardItems.length,
        categories: categories,
        dominantBrand: dominantBrand || 'Mixed Brands'
      };

      // Save to backend
      console.log(`Saving moodboard with ${selectedWardrobeItems.length} user-selected + ${generatedItems.length} AI-styled items`);
      await api.saveMoodboard(userId, newMoodboard);

      // Update local state
      const updatedMoodboards = [...generatedMoodboards, newMoodboard];
      setGeneratedMoodboards(updatedMoodboards);

      toast.success(`✨ "${moodboardName}" created with ${selectedWardrobeItems.length} selected + ${generatedItems.length} styled items!`);
      setActiveStep('generate');

      // Clear selections for next moodboard
      setInspirationImages([]);
      setSelectedWardrobeItems([]);
    } catch (error) {
      console.error('Error creating moodboard:', error);
      toast.error('Failed to create moodboard. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const deleteMoodboard = async (moodboardId: number) => {
    try {
      // Update local state immediately
      setGeneratedMoodboards(generatedMoodboards.filter(mb => mb.id !== moodboardId));
      
      // Note: We'd need to add a delete endpoint in the API
      // For now, we'll just remove it from local state
      toast.success('Moodboard deleted');
    } catch (error) {
      console.error('Error deleting moodboard:', error);
      toast.error('Failed to delete moodboard');
    }
  };

  const createQuickMoodboard = async () => {
    if (wardrobeItems.length === 0) {
      toast.error('No wardrobe items available');
      return;
    }

    setIsGenerating(true);

    try {
      // Simulate AI processing
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Categorize items by type
      const tops = wardrobeItems.filter(item => item.category === 'Tops');
      const bottoms = wardrobeItems.filter(item => item.category === 'Bottoms');
      const dresses = wardrobeItems.filter(item => item.category === 'Dresses');
      const shoes = wardrobeItems.filter(item => item.category === 'Shoes');
      const outerwear = wardrobeItems.filter(item => item.category === 'Outerwear');
      const accessories = wardrobeItems.filter(item => 
        item.category === 'Accessories' || item.category === 'Jewelry'
      );

      const selectedItems: WardrobeItem[] = [];

      // Build a complete outfit
      // Decide: dress OR top + bottom
      const useDress = dresses.length > 0 && Math.random() > 0.5;
      
      if (useDress) {
        // Select a dress
        const randomDress = dresses[Math.floor(Math.random() * dresses.length)];
        selectedItems.push(randomDress);
      } else {
        // Select top and bottom
        if (tops.length > 0) {
          const randomTop = tops[Math.floor(Math.random() * tops.length)];
          selectedItems.push(randomTop);
        }
        if (bottoms.length > 0) {
          const randomBottom = bottoms[Math.floor(Math.random() * bottoms.length)];
          selectedItems.push(randomBottom);
        }
      }

      // Always add shoes if available
      if (shoes.length > 0) {
        const randomShoes = shoes[Math.floor(Math.random() * shoes.length)];
        selectedItems.push(randomShoes);
      }

      // Add outerwear (50% chance)
      if (outerwear.length > 0 && Math.random() > 0.5) {
        const randomOuterwear = outerwear[Math.floor(Math.random() * outerwear.length)];
        selectedItems.push(randomOuterwear);
      }

      // Add 1-2 accessories
      if (accessories.length > 0) {
        const accessoryCount = Math.min(accessories.length, Math.random() > 0.5 ? 2 : 1);
        const shuffledAccessories = [...accessories].sort(() => 0.5 - Math.random());
        selectedItems.push(...shuffledAccessories.slice(0, accessoryCount));
      }

      if (selectedItems.length === 0) {
        toast.error('Not enough items to create a complete outfit');
        setIsGenerating(false);
        return;
      }

      // Generate a descriptive name based on the items
      const categories = [...new Set(selectedItems.map(item => item.category))];
      const topBrand = selectedItems
        .map(item => item.brand)
        .reduce((acc, brand) => {
          acc[brand] = (acc[brand] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);
      const dominantBrand = Object.entries(topBrand).sort(([,a], [,b]) => b - a)[0]?.[0];

      const styleNames = [
        'Luxury Outfit',
        'Curated Look',
        'Styled Ensemble',
        'Designer Edit',
        'Elevated Outfit',
        'Signature Look',
        'Complete Look',
        'Style Statement'
      ];
      
      const randomStyleName = styleNames[Math.floor(Math.random() * styleNames.length)];
      const moodboardName = dominantBrand 
        ? `${dominantBrand} ${randomStyleName}`
        : randomStyleName;

      const newMoodboard = {
        id: Date.now(),
        name: moodboardName,
        createdAt: new Date().toISOString(),
        inspirationImages: savedInspiration || [],
        wardrobeItems: selectedItems,
        totalValue: selectedItems.reduce((sum, item) => sum + item.price, 0),
        itemCount: selectedItems.length,
        categories: categories,
        dominantBrand: dominantBrand || 'Mixed Brands'
      };

      // Save to backend first
      await api.saveMoodboard(userId, newMoodboard);

      // Update local state
      const updatedMoodboards = [...generatedMoodboards, newMoodboard];
      setGeneratedMoodboards(updatedMoodboards);

      toast.success(`"${moodboardName}" created with ${selectedItems.length} items!`);
    } catch (error) {
      console.error('Error creating moodboard:', error);
      toast.error('Failed to create moodboard');
    } finally {
      setIsGenerating(false);
    }
  };

  const saveInspirationSet = async () => {
    if (inspirationImages.length === 0) {
      toast.error('Add at least one inspiration image first');
      return;
    }

    setIsSavingInspiration(true);

    try {
      await api.saveInspiration(userId, inspirationImages);
      setSavedInspiration(inspirationImages);
      toast.success(`Saved ${inspirationImages.length} inspiration images`);
    } catch (error) {
      console.error('Error saving inspiration:', error);
      toast.error('Failed to save inspiration');
    } finally {
      setIsSavingInspiration(false);
    }
  };

  const addQuickInspirationSet = (theme: 'minimalist' | 'luxury' | 'bohemian' | 'urban') => {
    const inspirationSets = {
      minimalist: [
        'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&h=800&fit=crop',
        'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&h=800&fit=crop',
        'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&h=800&fit=crop',
      ],
      luxury: [
        'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=600&h=800&fit=crop',
        'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=600&h=800&fit=crop',
        'https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?w=600&h=800&fit=crop',
      ],
      bohemian: [
        'https://images.unsplash.com/photo-1558769132-cb1aea8534d5?w=600&h=800&fit=crop',
        'https://images.unsplash.com/photo-1595341888016-a392ef81b7de?w=600&h=800&fit=crop',
        'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=600&h=800&fit=crop',
      ],
      urban: [
        'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=600&h=800&fit=crop',
        'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=600&h=800&fit=crop',
        'https://images.unsplash.com/photo-1494955464529-790512c65305?w=600&h=800&fit=crop',
      ],
    };

    setInspirationImages([...inspirationImages, ...inspirationSets[theme]]);
    toast.success(`Added ${theme} inspiration set`);
  };

  return (
    <div className="space-y-12">
      <div className="text-center space-y-4">
        <h2 className="text-4xl font-light text-[#e8e3d8]" style={{fontFamily: 'var(--font-serif)'}}>
          Create Your Styled Moodboard
        </h2>
        <p className="text-sm text-[#a39882] max-w-2xl mx-auto">
          Add inspiration images from Pinterest, select items from your wardrobe, and generate beautifully styled moodboards.
        </p>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-center gap-4">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center ${
            activeStep === 'inspiration' ? 'border-[#d4af37] bg-[#d4af37]/10' : 'border-[#2a2a2a]'
          }`}>
            <span className={`text-sm ${activeStep === 'inspiration' ? 'text-[#d4af37]' : 'text-[#a39882]'}`}>1</span>
          </div>
          <span className={`text-xs uppercase tracking-[0.1em] ${
            activeStep === 'inspiration' ? 'text-[#d4af37]' : 'text-[#a39882]'
          }`}>
            Inspiration
          </span>
        </div>

        <div className="w-16 h-px bg-[#2a2a2a]" />

        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center ${
            activeStep === 'wardrobe' ? 'border-[#d4af37] bg-[#d4af37]/10' : 'border-[#2a2a2a]'
          }`}>
            <span className={`text-sm ${activeStep === 'wardrobe' ? 'text-[#d4af37]' : 'text-[#a39882]'}`}>2</span>
          </div>
          <span className={`text-xs uppercase tracking-[0.1em] ${
            activeStep === 'wardrobe' ? 'text-[#d4af37]' : 'text-[#a39882]'
          }`}>
            Your Items
          </span>
        </div>

        <div className="w-16 h-px bg-[#2a2a2a]" />

        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center ${
            activeStep === 'generate' ? 'border-[#d4af37] bg-[#d4af37]/10' : 'border-[#2a2a2a]'
          }`}>
            <span className={`text-sm ${activeStep === 'generate' ? 'text-[#d4af37]' : 'text-[#a39882]'}`}>3</span>
          </div>
          <span className={`text-xs uppercase tracking-[0.1em] ${
            activeStep === 'generate' ? 'text-[#d4af37]' : 'text-[#a39882]'
          }`}>
            Generate
          </span>
        </div>
      </div>

      <Tabs value={activeStep} onValueChange={(value) => setActiveStep(value as any)} className="space-y-8">
        <TabsList className="grid grid-cols-3 w-full max-w-2xl mx-auto bg-[#141414] border border-[#2a2a2a]">
          <TabsTrigger value="inspiration" className="data-[state=active]:bg-[#d4af37] data-[state=active]:text-[#0a0a0a]">
            Inspiration
          </TabsTrigger>
          <TabsTrigger value="wardrobe" className="data-[state=active]:bg-[#d4af37] data-[state=active]:text-[#0a0a0a]">
            Wardrobe ({selectedWardrobeItems.length})
          </TabsTrigger>
          <TabsTrigger value="generate" className="data-[state=active]:bg-[#d4af37] data-[state=active]:text-[#0a0a0a]">
            Moodboards ({generatedMoodboards.length})
          </TabsTrigger>
        </TabsList>

        {/* Step 1: Add Inspiration */}
        <TabsContent value="inspiration" className="space-y-8">
          <Card className="bg-[#141414] border-[#2a2a2a]">
            <CardHeader>
              <CardTitle className="text-[#e8e3d8]">Add Inspiration Images</CardTitle>
              <CardDescription className="text-[#a39882]">
                Add Pinterest moodboard images or use our curated style sets
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-wrap gap-3 items-center">
                <Button
                  onClick={() => document.getElementById('image-upload')?.click()}
                  className="bg-[#d4af37] hover:bg-[#c9a961] text-[#0a0a0a]"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Add Image
                </Button>
                <input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <Button
                  variant="outline"
                  onClick={() => addQuickInspirationSet('minimalist')}
                  className="border-[#2a2a2a] text-[#a39882] hover:border-[#d4af37] hover:text-[#e8e3d8]"
                >
                  <Sparkles className="h-4 w-4 mr-2" />
                  Minimalist Set
                </Button>
                <Button
                  variant="outline"
                  onClick={() => addQuickInspirationSet('luxury')}
                  className="border-[#2a2a2a] text-[#a39882] hover:border-[#d4af37] hover:text-[#e8e3d8]"
                >
                  <Sparkles className="h-4 w-4 mr-2" />
                  Luxury Set
                </Button>
                <Button
                  variant="outline"
                  onClick={() => addQuickInspirationSet('bohemian')}
                  className="border-[#2a2a2a] text-[#a39882] hover:border-[#d4af37] hover:text-[#e8e3d8]"
                >
                  <Sparkles className="h-4 w-4 mr-2" />
                  Bohemian Set
                </Button>
                <Button
                  variant="outline"
                  onClick={() => addQuickInspirationSet('urban')}
                  className="border-[#2a2a2a] text-[#a39882] hover:border-[#d4af37] hover:text-[#e8e3d8]"
                >
                  <Sparkles className="h-4 w-4 mr-2" />
                  Urban Set
                </Button>
              </div>

              {inspirationImages.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {inspirationImages.map((image, index) => (
                    <div key={index} className="relative group">
                      <div className="aspect-[3/4] overflow-hidden bg-[#0a0a0a] border border-[#2a2a2a]">
                        <ImageWithFallback
                          src={image}
                          alt={`Inspiration ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <Button
                        size="icon"
                        variant="destructive"
                        onClick={() => removeInspirationImage(index)}
                        className="absolute top-2 right-2 w-8 h-8 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}

              {inspirationImages.length === 0 && (
                <div className="text-center py-16 border-2 border-dashed border-[#2a2a2a]">
                  <Upload className="h-12 w-12 text-[#666] mx-auto mb-4" />
                  <p className="text-sm text-[#a39882]">No inspiration images yet</p>
                  <p className="text-xs text-[#666] mt-2">Add images or use a curated set</p>
                </div>
              )}

              {inspirationImages.length > 0 && (
                <Button
                  onClick={async () => {
                    // Save inspiration first
                    setIsSavingInspiration(true);
                    try {
                      await api.saveInspiration(userId, inspirationImages);
                      setSavedInspiration(inspirationImages);
                      toast.success(`Saved ${inspirationImages.length} inspiration images`);
                      // Then navigate to wardrobe
                      setActiveStep('wardrobe');
                    } catch (error) {
                      console.error('Error saving inspiration:', error);
                      toast.error('Failed to save inspiration');
                    } finally {
                      setIsSavingInspiration(false);
                    }
                  }}
                  disabled={isSavingInspiration}
                  className="w-full bg-[#d4af37] hover:bg-[#c9a961] text-[#0a0a0a]"
                >
                  {isSavingInspiration ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2" />
                      Saving...
                    </>
                  ) : (
                    'Continue to Select Items'
                  )}
                </Button>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Step 2: Select Wardrobe Items */}
        <TabsContent value="wardrobe" className="space-y-8">
          <Alert className="bg-[#141414] border-[#d4af37]/30">
            <Sparkles className="h-4 w-4 text-[#d4af37]" />
            <AlertDescription className="text-[#a39882]">
              Select items from your wardrobe to include in your styled moodboard. Choose pieces that match or complement your inspiration aesthetic.
            </AlertDescription>
          </Alert>

          {/* Selected Items Preview */}
          {selectedWardrobeItems.length > 0 && (
            <Card className="bg-gradient-to-br from-[#d4af37]/5 to-transparent border-[#d4af37]">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-[#d4af37] flex items-center gap-2">
                      <Check className="h-5 w-5" />
                      Selected Items ({selectedWardrobeItems.length})
                    </CardTitle>
                    <CardDescription className="text-[#a39882] mt-2">
                      Total value: ${selectedWardrobeItems.reduce((sum, item) => sum + item.price, 0).toLocaleString()}
                    </CardDescription>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedWardrobeItems([])}
                    className="text-[#a39882] hover:text-[#e8e3d8]"
                  >
                    Clear All
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2">
                  {selectedWardrobeItems.map((item, index) => (
                    <div
                      key={index}
                      className="aspect-square relative overflow-hidden bg-[#0a0a0a] border-2 border-[#d4af37] cursor-pointer group"
                      onClick={() => toggleWardrobeItem(item)}
                      title={item.name}
                    >
                      <ImageWithFallback
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-[#0a0a0a]/0 group-hover:bg-[#0a0a0a]/70 transition-all flex items-center justify-center">
                        <X className="h-4 w-4 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {Array.from(new Set(selectedWardrobeItems.map(item => item.category))).map((category) => (
                    <Badge key={category} variant="secondary" className="bg-[#d4af37]/20 text-[#d4af37] border-[#d4af37]/30">
                      {category} ({selectedWardrobeItems.filter(item => item.category === category).length})
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {wardrobeItems.length === 0 ? (
            <Card className="bg-[#141414] border-[#2a2a2a]">
              <CardContent className="py-16 text-center">
                <Grid className="h-12 w-12 text-[#666] mx-auto mb-4" />
                <p className="text-sm text-[#a39882]">Your luxury wardrobe is being loaded</p>
                <p className="text-xs text-[#666] mt-2">Visit the Wardrobe tab to view and manage your items</p>
              </CardContent>
            </Card>
          ) : (
            <>
              {/* Category Filter */}
              <div className="flex flex-wrap gap-2">
                <Button
                  size="sm"
                  variant={categoryFilter === 'all' ? 'default' : 'outline'}
                  onClick={() => setCategoryFilter('all')}
                  className={categoryFilter === 'all' 
                    ? 'bg-[#d4af37] text-[#0a0a0a] hover:bg-[#c9a961]' 
                    : 'border-[#2a2a2a] text-[#a39882] hover:border-[#d4af37] hover:text-[#e8e3d8]'}
                >
                  All Items ({wardrobeItems.length})
                </Button>
                {Array.from(new Set(wardrobeItems.map(item => item.category))).map((category) => (
                  <Button
                    key={category}
                    size="sm"
                    variant={categoryFilter === category ? 'default' : 'outline'}
                    onClick={() => setCategoryFilter(category)}
                    className={categoryFilter === category 
                      ? 'bg-[#d4af37] text-[#0a0a0a] hover:bg-[#c9a961]' 
                      : 'border-[#2a2a2a] text-[#a39882] hover:border-[#d4af37] hover:text-[#e8e3d8]'}
                  >
                    {category} ({wardrobeItems.filter(item => item.category === category).length})
                  </Button>
                ))}
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {wardrobeItems
                  .filter(item => categoryFilter === 'all' || item.category === categoryFilter)
                  .map((item, index) => {
                    const selected = isItemSelected(item);
                    return (
                      <Card
                        key={index}
                        onClick={() => toggleWardrobeItem(item)}
                        className={`cursor-pointer transition-all ${
                          selected
                            ? 'bg-[#d4af37]/10 border-2 border-[#d4af37] shadow-lg shadow-[#d4af37]/20'
                            : 'bg-[#141414] border border-[#2a2a2a] hover:border-[#d4af37]/50'
                        }`}
                      >
                        <div className="aspect-square relative overflow-hidden bg-[#0a0a0a]">
                          <ImageWithFallback
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                          {selected && (
                            <div className="absolute inset-0 bg-[#d4af37]/10 border-4 border-[#d4af37] pointer-events-none" />
                          )}
                          {selected && (
                            <div className="absolute top-2 right-2 w-8 h-8 bg-[#d4af37] rounded-full flex items-center justify-center shadow-lg">
                              <Check className="h-5 w-5 text-[#0a0a0a]" />
                            </div>
                          )}
                        </div>
                        <CardHeader className="pb-3">
                          <CardTitle className="text-sm text-[#e8e3d8] line-clamp-1">{item.name}</CardTitle>
                          <CardDescription className="text-xs text-[#a39882]">{item.brand}</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="flex items-center justify-between">
                            <Badge variant="secondary" className="bg-[#2a2a2a] text-[#a39882] border-none text-xs">
                              {item.category}
                            </Badge>
                            <span className="text-xs text-[#d4af37]">${item.price}</span>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
              </div>
            </>
          )}

          <div className="flex gap-3 justify-center pt-4">
            <Button
              variant="outline"
              onClick={() => setActiveStep('inspiration')}
              className="border-[#2a2a2a] text-[#a39882] hover:border-[#666] hover:text-[#e8e3d8]"
            >
              Back to Inspiration
            </Button>
            {selectedWardrobeItems.length > 0 && (
              <Button
                onClick={generateMoodboard}
                disabled={isGenerating}
                className="bg-[#d4af37] hover:bg-[#c9a961] text-[#0a0a0a] px-8"
              >
                {isGenerating ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2" />
                    Creating Your Moodboard...
                  </>
                ) : (
                  <>
                    <Wand2 className="h-4 w-4 mr-2" />
                    Create Moodboard with {selectedWardrobeItems.length} Items
                  </>
                )}
              </Button>
            )}
          </div>
          
          {selectedWardrobeItems.length === 0 && (
            <Card className="bg-[#141414] border-[#2a2a2a]">
              <CardContent className="py-8 text-center">
                <p className="text-sm text-[#a39882]">Select at least one item from your wardrobe to create a moodboard</p>
                <p className="text-xs text-[#666] mt-2">Click on any item above to add it to your selection</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Step 3: View Generated Moodboards */}
        <TabsContent value="generate" className="space-y-8">
          {generatedMoodboards.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-[#141414] border-[#2a2a2a]">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 marble-texture border border-[#2a2a2a] flex items-center justify-center">
                      <LayoutGrid className="h-5 w-5 text-[#d4af37]" />
                    </div>
                    <div>
                      <p className="text-3xl font-light text-[#e8e3d8]" style={{fontFamily: 'var(--font-serif)'}}>{generatedMoodboards.length}</p>
                      <p className="text-xs uppercase tracking-[0.1em] text-[#666]">Moodboards</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-[#141414] border-[#2a2a2a]">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 marble-texture border border-[#2a2a2a] flex items-center justify-center">
                      <Grid className="h-5 w-5 text-[#d4af37]" />
                    </div>
                    <div>
                      <p className="text-3xl font-light text-[#e8e3d8]" style={{fontFamily: 'var(--font-serif)'}}>
                        {generatedMoodboards.reduce((sum, mb) => sum + (mb.wardrobeItems?.length || 0), 0)}
                      </p>
                      <p className="text-xs uppercase tracking-[0.1em] text-[#666]">Total Items</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-[#141414] border-[#2a2a2a]">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 marble-texture border border-[#2a2a2a] flex items-center justify-center">
                      <Sparkles className="h-5 w-5 text-[#d4af37]" />
                    </div>
                    <div>
                      <p className="text-3xl font-light text-[#e8e3d8]" style={{fontFamily: 'var(--font-serif)'}}>
                        ${generatedMoodboards.reduce((sum, mb) => sum + (mb.totalValue || 0), 0).toLocaleString()}
                      </p>
                      <p className="text-xs uppercase tracking-[0.1em] text-[#666]">Total Value</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          <div className="flex justify-between items-center mb-6">
            {generatedMoodboards.length > 0 && (
              <Button
                onClick={async () => {
                  if (confirm('Are you sure you want to delete all moodboards? This cannot be undone.')) {
                    try {
                      await api.deleteAllMoodboards(userId);
                      setGeneratedMoodboards([]);
                      toast.success('All moodboards deleted');
                    } catch (error) {
                      console.error('Error deleting moodboards:', error);
                      toast.error('Failed to delete moodboards');
                    }
                  }
                }}
                variant="outline"
                className="border-[#2a2a2a] text-[#a39882] hover:border-red-500 hover:text-red-500"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Clear All
              </Button>
            )}
            <Button
              onClick={createQuickMoodboard}
              disabled={isGenerating || wardrobeItems.length === 0}
              className="bg-[#d4af37] hover:bg-[#c9a961] text-[#0a0a0a] ml-auto"
            >
              {isGenerating ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2" />
                  Creating...
                </>
              ) : (
                <>
                  <Wand2 className="h-4 w-4 mr-2" />
                  Create Moodboard
                </>
              )}
            </Button>
          </div>

          {generatedMoodboards.length === 0 ? (
            <Card className="bg-[#141414] border-[#2a2a2a]">
              <CardContent className="py-16 text-center">
                <LayoutGrid className="h-12 w-12 text-[#666] mx-auto mb-4" />
                <p className="text-sm text-[#a39882]">No moodboards created yet</p>
                <p className="text-xs text-[#666] mt-2">Click "Create Moodboard" to auto-generate from your wardrobe</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-12">
              {generatedMoodboards.map((moodboard) => (
                <Card key={moodboard.id} className="bg-[#141414] border-[#2a2a2a] overflow-hidden">
                  <CardHeader className="border-b border-[#2a2a2a]">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-2xl text-[#e8e3d8]" style={{fontFamily: 'var(--font-serif)'}}>
                          {moodboard.name}
                        </CardTitle>
                        <CardDescription className="text-[#a39882] mt-2">
                          Created {new Date(moodboard.createdAt).toLocaleDateString()} • {moodboard.wardrobeItems?.length || 0} items • ${(moodboard.totalValue || 0).toLocaleString()} total value
                        </CardDescription>
                      </div>
                      <div className="flex gap-2">
                        <Button size="icon" variant="outline" className="border-[#2a2a2a] text-[#a39882] hover:border-[#d4af37] hover:text-[#d4af37]" title="Save to favorites">
                          <Heart className="h-4 w-4" />
                        </Button>
                        <Button size="icon" variant="outline" className="border-[#2a2a2a] text-[#a39882] hover:border-[#d4af37] hover:text-[#d4af37]" title="Share">
                          <Share2 className="h-4 w-4" />
                        </Button>
                        <Button size="icon" variant="outline" className="border-[#2a2a2a] text-[#a39882] hover:border-[#d4af37] hover:text-[#d4af37]" title="Download">
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button 
                          size="icon" 
                          variant="outline" 
                          className="border-[#2a2a2a] text-[#a39882] hover:border-red-500 hover:text-red-500"
                          onClick={() => deleteMoodboard(moodboard.id)}
                          title="Delete moodboard"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-8">
                    {/* Inspiration Reference */}
                    {moodboard.inspirationImages && moodboard.inspirationImages.length > 0 && (
                      <div className="mb-8">
                        <h3 className="text-xs uppercase tracking-[0.15em] text-[#666] mb-4">Inspiration</h3>
                        <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                          {moodboard.inspirationImages.slice(0, 6).map((img: string, idx: number) => (
                            <div key={idx} className="aspect-square overflow-hidden bg-[#0a0a0a] border border-[#2a2a2a]">
                              <ImageWithFallback
                                src={img}
                                alt={`Inspiration ${idx + 1}`}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Your Selected Items */}
                    {moodboard.userSelectedItems && moodboard.userSelectedItems.length > 0 && (
                      <div className="mb-8">
                        <div className="flex items-center gap-2 mb-4">
                          <h3 className="text-xs uppercase tracking-[0.15em] text-[#d4af37]">Your Selections</h3>
                          <Badge variant="secondary" className="bg-[#d4af37]/20 text-[#d4af37] border-[#d4af37]/30">
                            {moodboard.userSelectedItems.length} items
                          </Badge>
                        </div>
                        <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
                          {moodboard.userSelectedItems.map((item: WardrobeItem, idx: number) => (
                            <Card key={idx} className="break-inside-avoid bg-[#0a0a0a] border-2 border-[#d4af37] relative overflow-hidden">
                              <div className="absolute top-2 left-2 z-10">
                                <Badge className="bg-[#d4af37] text-[#0a0a0a] border-none">
                                  <Heart className="h-3 w-3 mr-1" />
                                  Selected
                                </Badge>
                              </div>
                              <div className="aspect-square overflow-hidden">
                                <ImageWithFallback
                                  src={item.image}
                                  alt={item.name}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <CardHeader className="pb-3">
                                <CardTitle className="text-sm text-[#e8e3d8]">{item.name}</CardTitle>
                                <CardDescription className="text-xs text-[#a39882]">{item.brand}</CardDescription>
                              </CardHeader>
                              <CardContent>
                                <div className="flex items-center justify-between text-xs">
                                  <span className="text-[#666]">{item.category}</span>
                                  <span className="text-[#d4af37]">${item.price}</span>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* AI-Styled Items */}
                    {moodboard.aiGeneratedItems && moodboard.aiGeneratedItems.length > 0 && (
                      <div>
                        <div className="flex items-center gap-2 mb-4">
                          <h3 className="text-xs uppercase tracking-[0.15em] text-[#666]">AI-Styled Additions</h3>
                          <Badge variant="secondary" className="bg-[#2a2a2a] text-[#a39882] border-none">
                            {moodboard.aiGeneratedItems.length} items
                          </Badge>
                        </div>
                        <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
                          {moodboard.aiGeneratedItems.map((item: WardrobeItem, idx: number) => (
                            <Card key={idx} className="break-inside-avoid bg-[#0a0a0a] border-[#2a2a2a] relative overflow-hidden">
                              <div className="absolute top-2 left-2 z-10">
                                <Badge className="bg-[#1a1a1a] text-[#a39882] border border-[#2a2a2a]">
                                  <Sparkles className="h-3 w-3 mr-1" />
                                  AI Styled
                                </Badge>
                              </div>
                              <div className="aspect-square overflow-hidden">
                                <ImageWithFallback
                                  src={item.image}
                                  alt={item.name}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <CardHeader className="pb-3">
                                <CardTitle className="text-sm text-[#e8e3d8]">{item.name}</CardTitle>
                                <CardDescription className="text-xs text-[#a39882]">{item.brand}</CardDescription>
                              </CardHeader>
                              <CardContent>
                                <div className="flex items-center justify-between text-xs">
                                  <span className="text-[#666]">{item.category}</span>
                                  <span className="text-[#d4af37]">${item.price}</span>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Fallback for old moodboards without split items */}
                    {(!moodboard.userSelectedItems && !moodboard.aiGeneratedItems) && moodboard.wardrobeItems && moodboard.wardrobeItems.length > 0 && (
                      <div>
                        <h3 className="text-xs uppercase tracking-[0.15em] text-[#666] mb-4">Your Styled Collection</h3>
                        <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
                          {moodboard.wardrobeItems.map((item: WardrobeItem, idx: number) => (
                            <Card key={idx} className="break-inside-avoid bg-[#0a0a0a] border-[#2a2a2a]">
                              <div className="aspect-square overflow-hidden">
                                <ImageWithFallback
                                  src={item.image}
                                  alt={item.name}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <CardHeader className="pb-3">
                                <CardTitle className="text-sm text-[#e8e3d8]">{item.name}</CardTitle>
                                <CardDescription className="text-xs text-[#a39882]">{item.brand}</CardDescription>
                              </CardHeader>
                              <CardContent>
                                <div className="flex items-center justify-between text-xs">
                                  <span className="text-[#666]">{item.category}</span>
                                  <span className="text-[#d4af37]">${item.price}</span>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </div>
                    )}

                    {!moodboard.wardrobeItems || moodboard.wardrobeItems.length === 0 && (
                      <div className="text-center py-8 border-2 border-dashed border-[#2a2a2a]">
                        <p className="text-sm text-[#a39882]">No items in this moodboard</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {generatedMoodboards.length > 0 && (
            <div className="text-center">
              <Button
                onClick={() => {
                  setInspirationImages([]);
                  setSelectedWardrobeItems([]);
                  setActiveStep('inspiration');
                }}
                className="bg-[#d4af37] hover:bg-[#c9a961] text-[#0a0a0a]"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Another Moodboard
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
