# CSV Import Feature - StyleSync Wardrobe

## Overview

The CSV import feature allows you to quickly populate your wardrobe by uploading a CSV file containing all your clothing items. This is perfect for bulk importing your existing wardrobe or transferring data from other fashion tracking apps.

## Quick Start

1. **Navigate to Wardrobe Tab**: Go to the "Wardrobe" section of StyleSync
2. **Click "Import CSV"**: Find the gold button in the top right corner
3. **Select Your CSV File**: Choose a `.csv` file from your computer
4. **Wait for Processing**: The system will parse and import your items
5. **View Your Items**: Your wardrobe will be populated immediately

## CSV File Format

### Required Columns (must be present):
- **Name**: The name/title of the clothing item
- **Brand**: The brand or designer
- **Category**: Type of item (Tops, Bottoms, Outerwear, Dresses, Shoes, Accessories, etc.)
- **Price**: The price (can include $ symbol, will be stripped automatically)
- **Color**: The color of the item

### Optional Columns:
- **Size**: Size information (S, M, L, 28, 32, etc.)
- **Image**: Full URL to an image of the item
- **Date**: Purchase date in YYYY-MM-DD format

### Column Name Flexibility

The parser is flexible with column names. These variations will work:

**For Name:**
- Name, Item, Product, Item Name, Product Name

**For Brand:**
- Brand, Designer, Maker

**For Category:**
- Category, Type, Item Type, Product Type

**For Price:**
- Price, Cost, Amount

**For Color:**
- Color, Colour

**For Size:**
- Size

**For Image:**
- Image, Image URL, Photo, Picture, Img

**For Date:**
- Date, Purchase Date, Date Purchased, Order Date

## Example CSV Files

### Minimal CSV (Required Fields Only)
```csv
Name,Brand,Category,Price,Color
Wool Blazer,Massimo Dutti,Outerwear,245,Camel
Linen Trousers,COS,Bottoms,135,Ivory
Silk Camisole,Vince,Tops,185,Champagne
```

### Complete CSV (All Fields)
```csv
Name,Brand,Category,Price,Color,Size,Image,Date
Wool Blazer,Massimo Dutti,Outerwear,245,Camel,M,https://example.com/image.jpg,2025-09-15
Linen Trousers,COS,Bottoms,135,Ivory,28,https://example.com/image2.jpg,2025-09-15
```

## Sample Files

We've included two sample CSV files you can use:

1. **wardrobe_template.csv** - Empty template with correct headers
2. **sample_wardrobe.csv** - 20 sample luxury fashion items

Download these from the project root to see the format in action.

## Categories

Use these standard categories for best results:
- Tops
- Bottoms
- Outerwear
- Dresses
- Shoes
- Accessories
- Bags
- Jewelry
- Activewear
- Swimwear
- Intimates

## Price Formatting

The parser accepts various price formats:
- `245` → $245
- `$245` → $245
- `245.00` → $245
- `$245.99` → $245.99
- `£245` → $245

Currency symbols are stripped, only numbers are retained.

## Special Characters in CSV

If any field contains commas or special characters, wrap it in double quotes:

```csv
Name,Brand,Category,Price,Color
"Silk Dress, Midi Length",Reformation,Dresses,218,Sage
"Leather Bag, Small Size",Celine,Accessories,1200,Black
```

## Error Handling

The import system is robust and handles errors gracefully:

### What Happens on Error:
1. **Valid rows are imported**: If only some rows have errors, valid rows are still imported
2. **Error notification**: You'll see how many rows had errors
3. **Continue processing**: One bad row won't stop the entire import

### Common Errors:
- **Missing required columns**: CSV must have Name, Brand, Category, Price, and Color columns
- **Empty required fields**: A row with empty Name, Brand, Category, or Color will be skipped
- **Malformed data**: Rows with incorrect number of columns are skipped
- **Invalid price**: Non-numeric price values will default to $0

### Example Error Message:
```
Successfully imported 18 item(s) from CSV (2 rows had errors)
```

## Image URLs

### With Images:
If you have image URLs, include them in the Image column:
```csv
Name,Brand,Category,Price,Color,Image
Blazer,Zara,Outerwear,89,Black,https://images.unsplash.com/photo-123.jpg
```

### Without Images:
If you don't have images, leave the column empty or omit it entirely. The system will use a default fashion placeholder image.

## Date Formats

Recommended date format: **YYYY-MM-DD** (e.g., 2025-10-04)

Also accepts:
- `2025-10-04`
- `10/04/2025`
- `Oct 4, 2025`

Items without dates will be assigned today's date.

## Grouping by Date

Items are automatically grouped into "orders" by purchase date:
- Items with the same date are grouped together
- Each group becomes one "order" in your wardrobe
- If no dates are provided, all items are grouped into one order

## Technical Details

### File Requirements:
- File extension: `.csv`
- Encoding: UTF-8 (recommended)
- Maximum file size: No hard limit, but keep under 10MB for best performance
- Format: Standard CSV with comma separators

### Processing:
- Parser handles quoted fields
- Flexible column mapping (case-insensitive)
- Automatic data cleaning and validation
- Backend storage with Supabase
- Immediate UI update

## Tips for Success

1. **Start with template**: Download the template CSV and fill it in
2. **Use spreadsheet software**: Excel, Google Sheets, or Numbers make it easy
3. **Export as CSV**: If using a spreadsheet, export/save as CSV format
4. **Test with small file first**: Try 5-10 items before importing hundreds
5. **Check column names**: Make sure your headers match the required names
6. **Validate data**: Ensure prices are numbers and categories are consistent
7. **Keep backup**: Keep a copy of your original CSV file

## Exporting from Other Apps

### From Excel/Google Sheets:
1. Open your spreadsheet
2. Arrange data in the correct column format
3. File → Download/Export → CSV

### From Other Fashion Apps:
Many apps allow exporting wardrobe data:
1. Check for "Export" or "Download Data" features
2. Export as CSV if available
3. Rearrange columns to match our format if needed
4. Import into StyleSync

## Troubleshooting

### "No valid items found in CSV"
- Check that column names are correct
- Ensure at least one data row exists
- Verify file is saved as `.csv` format

### "Missing required columns"
- CSV must have: Name, Brand, Category, Price, Color
- Check for typos in column names
- Ensure header row is present

### Items not appearing:
- Check for success message after upload
- Refresh the page
- Check that items aren't filtered out by search/filter

### Partial import:
- Some rows may have been skipped due to errors
- Check the error message for details
- Fix errors in CSV and re-upload if needed

## Privacy & Security

- CSV files are processed in your browser before upload
- Data is stored securely in Supabase with user isolation
- Only you can see your wardrobe items
- CSV files are not stored on our servers

## Need Help?

If you encounter issues:
1. Try the sample CSV file first
2. Check that your CSV format matches the examples
3. Ensure all required columns are present
4. Verify data is clean and properly formatted

## Future Enhancements

Coming soon:
- Excel file support (.xlsx)
- Bulk image upload
- Custom category mapping
- Export wardrobe to CSV
- Import from fashion e-commerce sites
