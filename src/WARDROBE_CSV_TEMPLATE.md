# Wardrobe CSV Import Guide

## CSV Format

Your CSV file should include the following columns (column names are case-insensitive):

### Required Columns:
- **Name** (or Item, Product): The name of the clothing item
- **Brand** (or Designer): The brand or designer name
- **Category** (or Type): The category (e.g., Tops, Bottoms, Outerwear, Dresses, Shoes, Accessories)
- **Price** (or Cost): The price of the item (numbers only, $ symbols will be stripped)
- **Color** (or Colour): The color of the item

### Optional Columns:
- **Size**: The size (e.g., S, M, L, 28, 32, etc.)
- **Image** (or Image URL, Photo): Direct URL to an image of the item
- **Date** (or Purchase Date, Date Purchased): Date you purchased the item (YYYY-MM-DD format)

## Example CSV Format

```csv
Name,Brand,Category,Price,Color,Size,Date
Tailored Wool Blazer,Massimo Dutti,Outerwear,245,Camel,M,2025-09-15
Wide-Leg Linen Trousers,COS,Bottoms,135,Ivory,28,2025-09-15
Silk Camisole,Vince,Tops,185,Champagne,S,2025-09-15
Cashmere Crew Neck Sweater,Everlane,Tops,120,Oatmeal,M,2025-08-22
Leather Crossbody Bag,Polène,Accessories,350,Tan,One Size,2025-08-22
Ankle Boots,Acne Studios,Shoes,450,Black,38,2025-07-10
Silk Slip Dress,Reformation,Dresses,218,Sage Green,S,2025-07-10
```

## CSV Template (Copy and Paste)

```csv
Name,Brand,Category,Price,Color,Size,Date
```

## Tips

1. **Column Names**: The system is flexible with column names. For example, "Name", "Item", or "Product" will all work for the item name.

2. **Price Format**: You can include currency symbols (e.g., "$245" or "245"), but only the numbers will be used.

3. **Categories**: Common categories include:
   - Tops
   - Bottoms
   - Outerwear
   - Dresses
   - Shoes
   - Accessories
   - Bags
   - Jewelry

4. **Images**: If you don't have image URLs, leave this column empty or omit it. The system will use a default fashion image.

5. **Date Format**: Use YYYY-MM-DD format (e.g., 2025-10-04) for best results.

6. **Quotes**: If any field contains commas, wrap it in double quotes:
   ```csv
   "Silk Slip Dress, Midi Length",Reformation,Dresses,218,Sage Green,S,2025-07-10
   ```

## How to Import

1. Navigate to the **Wardrobe** tab
2. Click the **Import CSV** button in the top right
3. Select your CSV file
4. Wait for the upload to complete
5. Your items will appear in your wardrobe immediately

## Error Handling

If some rows have errors, the system will:
- Import all valid rows
- Display a warning message with the number of rows that had errors
- Skip any rows that are missing required fields

## Need Help?

Make sure your CSV file:
- Has a header row with column names
- Contains at least the 5 required columns
- Has at least one data row
- Is saved as a `.csv` file (not `.xlsx` or `.xls`)
