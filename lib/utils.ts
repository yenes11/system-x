import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Active, DataRef, Over } from '@dnd-kit/core';
import { ColumnDragData } from '@/components/kanban/board-column';
import { TaskDragData } from '@/components/kanban/task-card';
import { Category, SubcategoryInfo } from './types';
import JsBarcode from 'jsbarcode';

type DraggableData = ColumnDragData | TaskDragData;

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function hasDraggableData<T extends Active | Over>(
  entry: T | null | undefined
): entry is T & {
  data: DataRef<DraggableData>;
} {
  if (!entry) {
    return false;
  }

  const data = entry.data.current;

  if (data?.type === 'Column' || data?.type === 'Task') {
    return true;
  }

  return false;
}

// Function to base64Url decode a string
function base64UrlDecode(str: string) {
  // Add padding if necessary
  str = str.replace(/-/g, '+').replace(/_/g, '/');
  switch (str.length % 4) {
    case 0:
      break;
    case 2:
      str += '==';
      break;
    case 3:
      str += '=';
      break;
    default:
      throw 'Illegal base64url string!';
  }
  return decodeURIComponent(
    atob(str)
      .split('')
      .map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join('')
  );
}

// Function to decode JWT
export function decodeJWT(token: string) {
  const parts = token.split('.');
  if (parts.length !== 3) {
    throw new Error('JWT does not have 3 parts');
  }
  const payload = parts[1];
  return JSON.parse(base64UrlDecode(payload));
}

export function getAllSubcategories(categories: Category[]): SubcategoryInfo[] {
  let result: SubcategoryInfo[] = [];

  categories.forEach((category) => {
    // Add the current category to the result
    result.push({ id: category.id, name: category.name });

    // Recursively process the subcategories
    if (category.subCategories && category.subCategories.length > 0) {
      result = result.concat(getAllSubcategories(category.subCategories));
    }
  });

  return result;
}

export function generateBarcode(length = 8): string {
  const timestamp = Date.now().toString(36).toUpperCase(); // Convert timestamp to base36 (A-Z, 0-9)
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let randomPart = '';

  for (let i = 0; i < length; i++) {
    randomPart += chars[Math.floor(Math.random() * chars.length)];
  }

  return timestamp + randomPart;
}

export function printBarcode(
  data: {
    info: string;
    amount: number;
    incomingDate: string;
    supplier: string;
    supplierCode: string;
  },
  barcode: string
) {
  if (typeof window === 'undefined') return;

  const canvas = document.createElement('canvas');
  JsBarcode(canvas, barcode, { format: 'CODE128', displayValue: false });

  // Convert canvas to image
  const img = new Image();
  img.src = canvas.toDataURL('image/png');

  img.onload = () => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head><title>Print Barcode</title></head>
          <body style="text-align:center">
            <img src="${img.src}" />
            <p>${data}</p>
            <script>
              window.onload = function () {
                window.print();
                window.onafterprint = function () { window.close(); };
              };
            </script>
          </body>
        </html>
      `);
      printWindow.document.close();
    }
  };
}
