# CSV Import - Example Usage

## Scenario: New User Setup

Sarah just signed up for StyleSync and wants to add her entire wardrobe of 50+ items. Instead of manually entering each item, she creates a CSV file.

## Step 1: Create CSV in Spreadsheet

Sarah opens Google Sheets and creates a spreadsheet:

| Name | Brand | Category | Price | Color | Size | Date |
|------|-------|----------|-------|-------|------|------|
| Tailored Wool Blazer | Massimo Dutti | Outerwear | 245 | Camel | M | 2025-09-15 |
| Wide-Leg Linen Trousers | COS | Bottoms | 135 | Ivory | 28 | 2025-09-15 |
| Silk Camisole | Vince | Tops | 185 | Champagne | S | 2025-09-15 |
| Cashmere Sweater | Everlane | Tops | 120 | Oatmeal | M | 2025-08-22 |
| Leather Crossbody Bag | Polène | Accessories | 350 | Tan | One Size | 2025-08-22 |

## Step 2: Export as CSV

She exports the spreadsheet as `my_wardrobe.csv`:

```csv
Name,Brand,Category,Price,Color,Size,Date
Tailored Wool Blazer,Massimo Dutti,Outerwear,245,Camel,M,2025-09-15
Wide-Leg Linen Trousers,COS,Bottoms,135,Ivory,28,2025-09-15
Silk Camisole,Vince,Tops,185,Champagne,S,2025-09-15
Cashmere Sweater,Everlane,Tops,120,Oatmeal,M,2025-08-22
Leather Crossbody Bag,Polène,Accessories,350,Tan,One Size,2025-08-22
```

## Step 3: Import to StyleSync

1. Sarah navigates to the **Wardrobe** tab
2. Clicks the **Import CSV** button (gold button, top right)
3. Selects `my_wardrobe.csv` from her computer
4. Waits 2-3 seconds for processing

## Step 4: Success!

She sees a success message:
```
✓ Successfully imported 5 item(s) from CSV
```

Her wardrobe now shows:
- **2 Orders** (grouped by date)
  - Order from Sep 15, 2025 (3 items, $565 total)
  - Order from Aug 22, 2025 (2 items, $470 total)

## Real-World Examples

### Example 1: Minimalist Wardrobe (20 items)

```csv
Name,Brand,Category,Price,Color,Size
White T-Shirt,Everlane,Tops,30,White,M
Black T-Shirt,Everlane,Tops,30,Black,M
Grey T-Shirt,Everlane,Tops,30,Grey,M
Black Jeans,Levi's,Bottoms,98,Black,32
Blue Jeans,Levi's,Bottoms,98,Medium Blue,32
Black Hoodie,Reigning Champ,Tops,165,Black,M
Grey Sweatshirt,Reigning Champ,Tops,145,Grey,M
White Sneakers,Common Projects,Shoes,450,White,43
Black Chelsea Boots,Story et Fall,Shoes,285,Black,43
Leather Jacket,Schott,Outerwear,795,Black,M
...
```

**Result:** All 20 items imported in seconds, organized and searchable.

### Example 2: Seasonal Wardrobe Refresh

Moving apartments and wants to catalog spring/summer items:

```csv
Name,Brand,Category,Price,Color,Size,Date
Linen Shirt,Uniqlo,Tops,39,White,S,2025-03-15
Linen Shirt,Uniqlo,Tops,39,Blue,S,2025-03-15
Linen Shorts,J.Crew,Bottoms,68,Khaki,30,2025-03-15
Canvas Sneakers,Vans,Shoes,65,White,9,2025-03-20
Straw Hat,Lack of Color,Accessories,89,Natural,One Size,2025-04-01
Sunglasses,Warby Parker,Accessories,95,Black,One Size,2025-04-01
Swim Trunks,Orlebar Brown,Swimwear,245,Navy,M,2025-04-10
Cotton T-Shirt Pack,Uniqlo,Tops,30,Multi,M,2025-04-10
```

**Result:** Spring wardrobe catalogued, ready for mixing and matching in the moodboard creator.

### Example 3: Luxury Capsule Wardrobe

High-end pieces with detailed information:

```csv
Name,Brand,Category,Price,Color,Size,Image,Date
Cashmere Coat,Max Mara,Outerwear,2495,Camel,IT 40,https://images.unsplash.com/photo-coat.jpg,2024-11-15
Silk Blouse,The Row,Tops,890,Ivory,XS,https://images.unsplash.com/photo-blouse.jpg,2024-11-15
Wide-Leg Trousers,The Row,Bottoms,790,Black,XS,https://images.unsplash.com/photo-pants.jpg,2024-11-15
Leather Loafers,Hermès,Shoes,1250,Black,37,https://images.unsplash.com/photo-shoes.jpg,2024-12-01
Leather Tote,Celine,Bags,3200,Tan,One Size,https://images.unsplash.com/photo-bag.jpg,2024-12-01
Cashmere Sweater,Loro Piana,Tops,1295,Grey,S,https://images.unsplash.com/photo-sweater.jpg,2024-12-10
```

**Result:** Luxury items with images, perfectly organized and ready for outfit planning.

## Common Use Cases

### 1. **Digital Wardrobe Inventory**
Create a complete inventory for insurance purposes or personal organization.

### 2. **Moving/Decluttering**
Document items before a move or Marie Kondo-style declutter.

### 3. **Fashion Budget Tracking**
Import purchases throughout the year to track spending by category.

### 4. **Capsule Wardrobe Planning**
Import your planned capsule wardrobe to visualize combinations.

### 5. **Seasonal Rotation**
Separate winter and summer wardrobes with date-based imports.

### 6. **Shared Wardrobes**
Roommates or partners can each import their items separately.

## Time Savings

**Manual Entry:**
- 2-3 minutes per item
- 50 items = 100-150 minutes (1.5-2.5 hours)

**CSV Import:**
- 10 minutes to create CSV
- 5 seconds to import
- **Total: ~10 minutes**

**Time saved: 90-140 minutes!**

## Tips from Real Users

### "Start with email receipts"
> "I went through my email receipts from the past year and copied the info into a spreadsheet. Easy!" - Jessica

### "Use shopping history"
> "Most fashion sites let you export order history. I used that as a starting point." - Marcus

### "Photo + spreadsheet"
> "I took photos of items laid out, then typed the info while looking at them." - Aisha

### "Export from Stylebook"
> "I was using another app called Stylebook. Exported my data and reformatted it for StyleSync." - Chen

## Advanced: Batch Processing

For power users managing large wardrobes:

1. **Create master spreadsheet** with all items
2. **Add columns** for: Season, Occasion, Fit Notes, Care Instructions
3. **Filter and export** different CSVs for different purposes
4. **Import by season** or category as needed
5. **Keep master updated** and re-import when needed

## Next Steps After Import

Once your wardrobe is imported:

1. **Verify items** - Check that everything imported correctly
2. **Add missing images** - Update items without photos
3. **Create moodboards** - Use your items to plan outfits
4. **Get recommendations** - See what pieces would complement your style
5. **Track style stats** - View your wardrobe analytics

## Questions?

- See **WARDROBE_CSV_TEMPLATE.md** for column specifications
- See **CSV_IMPORT_GUIDE.md** for troubleshooting
- Use **wardrobe_template.csv** as a starting point
- Check **sample_wardrobe.csv** for a complete example
