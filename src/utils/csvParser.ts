export interface WardrobeItem {
  name: string;
  brand: string;
  category: string;
  price: number;
  color: string;
  size?: string;
  image?: string;
  date?: string;
}

export interface ParsedCSVData {
  items: WardrobeItem[];
  errors: string[];
}

/**
 * Parse CSV file for wardrobe items
 * Expected CSV format (flexible column names):
 * - Name/Item/Product
 * - Brand/Designer
 * - Category/Type
 * - Price/Cost
 * - Color/Colour
 * - Size (optional)
 * - Image/Image URL/Photo (optional)
 * - Date/Purchase Date/Date Purchased (optional)
 */
export function parseWardrobeCSV(csvText: string): ParsedCSVData {
  const lines = csvText.trim().split('\n');
  const items: WardrobeItem[] = [];
  const errors: string[] = [];

  if (lines.length < 2) {
    errors.push('CSV file must contain at least a header row and one data row');
    return { items, errors };
  }

  // Parse header
  const header = lines[0].split(',').map(h => h.trim().toLowerCase());
  
  // Map column names to standard fields
  const columnMap: { [key: string]: string } = {};
  
  const nameVariants = ['name', 'item', 'product', 'item name', 'product name'];
  const brandVariants = ['brand', 'designer', 'maker'];
  const categoryVariants = ['category', 'type', 'item type', 'product type'];
  const priceVariants = ['price', 'cost', 'amount'];
  const colorVariants = ['color', 'colour'];
  const sizeVariants = ['size'];
  const imageVariants = ['image', 'image url', 'photo', 'picture', 'img'];
  const dateVariants = ['date', 'purchase date', 'date purchased', 'order date'];

  header.forEach((col, index) => {
    if (nameVariants.includes(col)) columnMap['name'] = String(index);
    else if (brandVariants.includes(col)) columnMap['brand'] = String(index);
    else if (categoryVariants.includes(col)) columnMap['category'] = String(index);
    else if (priceVariants.includes(col)) columnMap['price'] = String(index);
    else if (colorVariants.includes(col)) columnMap['color'] = String(index);
    else if (sizeVariants.includes(col)) columnMap['size'] = String(index);
    else if (imageVariants.includes(col)) columnMap['image'] = String(index);
    else if (dateVariants.includes(col)) columnMap['date'] = String(index);
  });

  // Validate required columns
  const requiredFields = ['name', 'brand', 'category', 'price', 'color'];
  const missingFields = requiredFields.filter(field => !columnMap[field]);
  
  if (missingFields.length > 0) {
    errors.push(`Missing required columns: ${missingFields.join(', ')}`);
    return { items, errors };
  }

  // Parse data rows
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue; // Skip empty lines

    try {
      const values = parseCSVLine(line);
      
      if (values.length < header.length) {
        errors.push(`Row ${i + 1}: Insufficient columns`);
        continue;
      }

      const item: WardrobeItem = {
        name: values[parseInt(columnMap['name'])].trim(),
        brand: values[parseInt(columnMap['brand'])].trim(),
        category: values[parseInt(columnMap['category'])].trim(),
        price: parseFloat(values[parseInt(columnMap['price'])].replace(/[^0-9.]/g, '')) || 0,
        color: values[parseInt(columnMap['color'])].trim(),
      };

      // Add optional fields if they exist
      if (columnMap['size'] && values[parseInt(columnMap['size'])]) {
        item.size = values[parseInt(columnMap['size'])].trim();
      }
      if (columnMap['image'] && values[parseInt(columnMap['image'])]) {
        item.image = values[parseInt(columnMap['image'])].trim();
      }
      if (columnMap['date'] && values[parseInt(columnMap['date'])]) {
        item.date = values[parseInt(columnMap['date'])].trim();
      }

      // Validate required fields are not empty
      if (!item.name || !item.brand || !item.category || !item.color) {
        errors.push(`Row ${i + 1}: Missing required field values`);
        continue;
      }

      items.push(item);
    } catch (error) {
      errors.push(`Row ${i + 1}: ${error instanceof Error ? error.message : 'Parse error'}`);
    }
  }

  return { items, errors };
}

/**
 * Parse a single CSV line, handling quoted values
 */
function parseCSVLine(line: string): string[] {
  const values: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    const nextChar = line[i + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        current += '"';
        i++; // Skip next quote
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      values.push(current);
      current = '';
    } else {
      current += char;
    }
  }

  values.push(current);
  return values;
}

/**
 * Convert parsed items to order format
 */
export function convertItemsToOrders(items: WardrobeItem[]) {
  // Group items by date (or create a single order if no dates)
  const ordersByDate: { [key: string]: WardrobeItem[] } = {};
  
  items.forEach(item => {
    const date = item.date || new Date().toISOString().split('T')[0];
    if (!ordersByDate[date]) {
      ordersByDate[date] = [];
    }
    ordersByDate[date].push(item);
  });

  // Convert to order format
  return Object.entries(ordersByDate).map(([date, orderItems], index) => ({
    id: `csv-${Date.now()}-${index}`,
    date: date,
    items: orderItems.map(item => ({
      name: item.name,
      brand: item.brand,
      category: item.category,
      price: item.price,
      color: item.color,
      size: item.size || 'N/A',
      image: item.image || 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=300&h=300&fit=crop'
    })),
    total: orderItems.reduce((sum, item) => sum + item.price, 0),
    status: 'delivered'
  }));
}
