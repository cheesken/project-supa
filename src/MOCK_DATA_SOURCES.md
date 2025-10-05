# Complete Mock Data Source Map for StyleSync

## 📍 ALL MOCK DATA LOCATIONS

### 1. **App.tsx (Lines 94-141)**
**Purpose:** Initial order history with wardrobe items  
**Data Type:** Array of orders with items  
**Images:** Unsplash URLs

```typescript
const mockOrders = [
  {
    id: 1,
    date: '2025-09-15',
    items: [
      {
        name: 'Tailored Wool Blazer',
        brand: 'Massimo Dutti',
        category: 'Outerwear',
        price: 245,
        image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=400&fit=crop',
        color: 'Camel',
        size: 'M'
      },
      {
        name: 'Wide-Leg Linen Trousers',
        brand: 'COS',
        category: 'Bottoms',
        price: 135,
        image: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=400&h=400&fit=crop',
        color: 'Ivory',
        size: '28'
      },
      {
        name: 'Silk Camisole',
        brand: 'Vince',
        category: 'Tops',
        price: 185,
        image: 'https://images.unsplash.com/photo-1578587018452-892bacefd3f2?w=400&h=400&fit=crop',
        color: 'Champagne',
        size: 'S'
      }
    ],
    total: 565,
    status: 'delivered'
  },
  {
    id: 2,
    date: '2025-08-22',
    items: [
      {
        name: 'Cashmere Crew Neck Sweater',
        brand: 'Everlane',
        category: 'Tops',
        price: 120,
        image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop',
        color: 'Oatmeal',
        size: 'M'
      },
      {
        name: 'Leather Crossbody Bag',
        brand: 'Polène',
        category: 'Accessories',
        price: 350,
        image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&h=400&fit=crop',
        color: 'Tan',
        size: 'One Size'
      }
    ],
    total: 470,
    status: 'delivered'
  }
];
```

**Also in App.tsx (Line 157):**
```typescript
const mockUserData = {
  name: userName,
  avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=f43f5e&color=fff`,
  connectedAccounts: Object.values(isConnected).filter(Boolean).length,
  totalOrders: orders.length,
  styleScore: 92,
  dominantStyles: ["Minimalist", "Contemporary", "Elegant"]
};
```

---

### 2. **MoodboardCreator.tsx (Lines 19-76)**
**Purpose:** Wardrobe items for moodboard creation  
**Data Type:** Array of clothing items  
**Images:** Unsplash URLs

```typescript
const wardrobeItems = [
  {
    id: 1,
    name: 'Tailored Wool Blazer',
    image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=400&fit=crop',
    category: 'Outerwear',
    colors: ['camel']
  },
  {
    id: 2,
    name: 'Wide-Leg Linen Trousers',
    image: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=400&h=400&fit=crop',
    category: 'Bottoms',
    colors: ['ivory']
  },
  {
    id: 3,
    name: 'Silk Slip Dress',
    image: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400&h=400&fit=crop',
    category: 'Dresses',
    colors: ['sage']
  },
  {
    id: 4,
    name: 'Classic Trench Coat',
    image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=400&fit=crop',
    category: 'Outerwear',
    colors: ['sand']
  },
  {
    id: 5,
    name: 'Leather Ankle Boots',
    image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=400&h=400&fit=crop',
    category: 'Shoes',
    colors: ['cognac']
  },
  {
    id: 6,
    name: 'Cashmere Sweater',
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop',
    category: 'Tops',
    colors: ['oatmeal']
  },
  {
    id: 7,
    name: 'Leather Crossbody Bag',
    image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&h=400&fit=crop',
    category: 'Accessories',
    colors: ['tan']
  },
  {
    id: 8,
    name: 'Ribbed Knit Tank',
    image: 'https://images.unsplash.com/photo-1578587018452-892bacefd3f2?w=400&h=400&fit=crop',
    category: 'Tops',
    colors: ['white']
  }
];
```

**Also in MoodboardCreator.tsx (Lines 78-99):**
```typescript
const inspirationImages = [
  {
    id: 'insp1',
    url: 'https://images.unsplash.com/photo-1523754182607-2ff5903ec1e2?w=300&h=300&fit=crop',
    title: 'Minimalist Flatlay'
  },
  {
    id: 'insp2',
    url: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=300&h=300&fit=crop',
    title: 'Street Style'
  },
  {
    id: 'insp3',
    url: 'https://images.unsplash.com/photo-1558769132-cb1aea27c2c0?w=300&h=300&fit=crop',
    title: 'Neutral Palette'
  },
  {
    id: 'insp4',
    url: 'https://images.unsplash.com/photo-1569388330338-53ecda03dfa1?w=300&h=300&fit=crop',
    title: 'Accessories'
  }
];
```

---

### 3. **Recommendations.tsx (Lines 32-129)**
**Purpose:** Product recommendations with match scores  
**Data Type:** Array of recommended products  
**Images:** Unsplash URLs

```typescript
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
```

---

### 4. **StyleAnalysis.tsx (Lines 8-33)**
**Purpose:** User style breakdown and analysis  
**Data Type:** Object with nested arrays  
**Images:** None (uses color hex values)

```typescript
const styleData = {
  dominantStyles: [
    { name: 'Minimalist', percentage: 45, color: 'bg-gray-500' },
    { name: 'Contemporary', percentage: 30, color: 'bg-purple-500' },
    { name: 'Street Style', percentage: 15, color: 'bg-pink-500' },
    { name: 'Classic', percentage: 10, color: 'bg-blue-500' }
  ],
  colorPalette: [
    { name: 'Neutral', hex: '#F5F5F5', percentage: 40 },
    { name: 'Black', hex: '#000000', percentage: 25 },
    { name: 'Navy', hex: '#1E3A8A', percentage: 15 },
    { name: 'Camel', hex: '#C19A6B', percentage: 10 },
    { name: 'Forest Green', hex: '#228B22', percentage: 10 }
  ],
  patterns: [
    { name: 'Solid Colors', percentage: 70 },
    { name: 'Subtle Textures', percentage: 20 },
    { name: 'Minimal Prints', percentage: 10 }
  ],
  occasions: [
    { name: 'Professional', percentage: 40, items: 12 },
    { name: 'Casual', percentage: 35, items: 10 },
    { name: 'Evening', percentage: 15, items: 4 },
    { name: 'Weekend', percentage: 10, items: 3 }
  ]
};
```

---

### 5. **SocialMediaConnect.tsx (Lines 44-65)**
**Purpose:** Social media platform configuration  
**Data Type:** Array of platform objects  
**Images:** None (uses icons)

```typescript
const platforms = [
  {
    id: 'instagram',
    name: 'Instagram',
    icon: Instagram,
    description: 'Analyze your outfit posts and style preferences',
    color: 'from-pink-500 to-purple-600',
    mockData: 'Latest: 12 outfit posts analyzed'
  },
  {
    id: 'tiktok',
    name: 'TikTok',
    icon: MessageCircle,
    description: 'Track trending styles you engage with',
    color: 'from-black to-gray-800',
    mockData: 'Saved: 45 fashion videos'
  },
  {
    id: 'pinterest',
    name: 'Pinterest',
    icon: Grid,
    description: 'Import your fashion boards and pins',
    color: 'from-red-500 to-red-700',
    mockData: 'Boards: 8 fashion collections'
  }
];
```

---

### 6. **OrderHistory.tsx (Lines 20-99)**
**Purpose:** Fallback order data if user has no orders  
**Data Type:** Array of orders (duplicates App.tsx data)  
**Images:** Unsplash URLs

This is essentially a duplicate of the data in App.tsx for fallback purposes.

---

## 🔄 Data Flow

1. **On First Login:** User has no data in Supabase
2. **App.tsx loads:** Checks Supabase for orders → finds none → populates `mockOrders`
3. **Each Component:** Uses its own hardcoded mock data arrays
4. **User Interactions:** Save real data to Supabase (wishlist, moodboards, social connections)
5. **CSV Import:** Users can upload CSV files to populate their wardrobe with real data

## 📸 Image Sources

**ALL images come from Unsplash with specific photo IDs:**
- Blazer: `photo-1594633312681-425c7b97ccd1`
- Trousers: `photo-1624378439575-d8705ad7ae80`
- Dresses: `photo-1515372039744-b8f02a3ae446`
- Sweaters: `photo-1578662996442-48f60103fc96`
- Bags: `photo-1548036328-c9fa89d128fa`
- And more...

## ✅ What IS Saved to Supabase

- ✅ Wishlist (liked items)
- ✅ Moodboards
- ✅ Social media connections (boolean flags)
- ✅ User orders (when explicitly added)
- ✅ **CSV imported wardrobe items** (parsed and stored as orders)

## ❌ What is NOT Saved (Hardcoded)

- ❌ Product recommendations (always shows same 6 items)
- ❌ Style analysis data (always shows same percentages)
- ❌ Wardrobe items for moodboard (always shows same 8 items)
- ❌ Inspiration images (always shows same 4 images)
- ❌ Social platform descriptions (always shows same 3 platforms)

---

## 📤 CSV Import Feature (NEW!)

**Location:** `/utils/csvParser.ts` + `/components/OrderHistory.tsx`

### How It Works:
1. User clicks "Import CSV" button in Wardrobe tab
2. Selects a CSV file with columns: Name, Brand, Category, Price, Color, Size (optional), Image (optional), Date (optional)
3. CSV is parsed client-side using custom parser
4. Valid items are converted to order format
5. Orders are saved to Supabase backend
6. UI updates immediately with new items

### Sample CSV Files:
- **wardrobe_template.csv** - Empty template for users
- **sample_wardrobe.csv** - 20 pre-filled luxury items

### Documentation:
- **WARDROBE_CSV_TEMPLATE.md** - Column specifications
- **CSV_IMPORT_GUIDE.md** - Complete user guide
- **EXAMPLE_CSV_USAGE.md** - Real-world examples

### Benefits:
- ✅ Bulk import wardrobe in seconds vs hours of manual entry
- ✅ Flexible column name matching
- ✅ Error handling for partial imports
- ✅ Backend persistence
- ✅ Automatic grouping by purchase date

---

## 🎯 To Replace Mock Data with Real Images

You would need to:

1. **Build an image upload system** that stores images in Supabase Storage
2. **Replace the hardcoded arrays** with data fetched from Supabase
3. **Create admin interfaces** to add/edit products, wardrobe items, etc.
4. **OR use the CSV import** to quickly populate with real data (image URLs supported!)

The CSV import feature is the fastest way to populate real data right now!
