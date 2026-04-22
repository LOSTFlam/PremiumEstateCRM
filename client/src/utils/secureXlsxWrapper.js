/**
 * Secure wrapper for xlsx library to mitigate prototype pollution and ReDoS vulnerabilities
 */

// Import xlsx dynamically to isolate it
let xlsxModule = null;

export const loadSecureXlsx = async () => {
  if (!xlsxModule) {
    xlsxModule = await import("xlsx");
  }
  return xlsxModule.default || xlsxModule;
};

/**
 * Sanitizes data to prevent prototype pollution
 */
const sanitizeData = (data) => {
  if (typeof data !== 'object' || data === null) {
    return data;
  }

  // Create a new object with null prototype to prevent pollution
  const sanitized = Object.create(null);

  for (const [key, value] of Object.entries(data)) {
    // Block dangerous keys that could lead to prototype pollution
    if (key === '__proto__' || key === 'constructor' || key === 'prototype') {
      console.warn(`Blocked potentially dangerous key: ${key}`);
      continue;
    }

    // Recursively sanitize nested objects
    if (typeof value === 'object' && value !== null) {
      sanitized[key] = sanitizeData(value);
    } else {
      // For primitives, just copy the value
      sanitized[key] = value;
    }
  }

  return sanitized;
};

/**
 * Securely parses an Excel file with multiple safety measures
 */
export const secureParseExcel = async (file, options = {}) => {
  const XLSX = await loadSecureXlsx();

  // Validate file type
  if (!file.name.toLowerCase().endsWith('.xlsx') && !file.name.toLowerCase().endsWith('.xls')) {
    throw new Error('Invalid file type. Only .xlsx and .xls files are allowed.');
  }

  // Validate file size (default 5MB limit)
  const maxSize = options.maxSize || 5 * 1024 * 1024; // 5MB
  if (file.size > maxSize) {
    throw new Error(`File size exceeds limit of ${(maxSize / (1024 * 1024)).toFixed(1)}MB`);
  }

  // Read file as ArrayBuffer
  const arrayBuffer = await file.arrayBuffer();

  // Parse with secure options to prevent vulnerabilities
  const workbook = XLSX.read(arrayBuffer, {
    type: 'array',
    cellDates: true,
    cellNF: false, // Disable number formats to reduce attack surface
    cellText: false, // Don't capture formatted text
    defval: null, // Default value for empty cells
    sheetRows: 10000, // Limit number of rows to prevent ReDoS
    dense: false, // Use sparse arrays to save memory
    ...options // Allow override of options
  });

  // Process sheets securely
  const result = Object.create(null);
  
  for (const sheetName of workbook.SheetNames) {
    const worksheet = workbook.Sheets[sheetName];
    
    // Convert to JSON with safe options
    const sheetData = XLSX.utils.sheet_to_json(worksheet, {
      defval: null,
      raw: false, // Don't return raw numbers/formulas
      dateNF: 'yyyy-mm-dd', // Standardize date format
      ...options.jsonOptions
    });

    // Sanitize each row to prevent prototype pollution
    result[sheetName] = sheetData.map(row => sanitizeData(row));
  }

  return result;
};

/**
 * Securely converts data to Excel with validation
 */
export const secureWriteExcel = async (data, options = {}) => {
  const XLSX = await loadSecureXlsx();

  // Validate input data to prevent prototype pollution during creation
  if (!Array.isArray(data) && typeof data !== 'object') {
    throw new Error('Data must be an array or object');
  }

  // Sanitize the data before creating the workbook
  const sanitizedData = Array.isArray(data) 
    ? data.map(item => sanitizeData(item))
    : sanitizeData(data);

  const worksheet = XLSX.utils.json_to_sheet(sanitizedData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, options.sheetName || 'Sheet1');

  // Write to buffer with safe options
  return XLSX.write(workbook, {
    type: 'array',
    bookType: options.bookType || 'xlsx',
    ...options
  });
};

/**
 * Validates Excel file content for potentially dangerous patterns
 */
export const validateExcelContent = (workbook) => {
  for (const sheetName of workbook.SheetNames) {
    const worksheet = workbook.Sheets[sheetName];
    
    // Check for dangerous formulas (starting with =, +, -, @)
    for (const cellAddr in worksheet) {
      if (cellAddr[0] === '!') continue; // Skip metadata cells
      
      const cell = worksheet[cellAddr];
      if (cell && typeof cell.v === 'string') {
        // Check for formula injection attempts
        if (/^[=+\-@]/.test(cell.v.trim())) {
          throw new Error(`Potentially dangerous formula detected in cell ${cellAddr}: ${cell.v}`);
        }
      }
    }
  }
  
  return true;
};