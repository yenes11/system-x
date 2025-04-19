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

type LabelData = {
  barcode: string;
  info: string;
  amount: number;
  date: string;
  supplier: string;
  supplierCode: string;
};

export async function printBarcode(data: LabelData[]) {
  if (typeof window === 'undefined') return;

  const barcodeImages = await Promise.all(
    data.map((item) => {
      const canvas = document.createElement('canvas');
      JsBarcode(canvas, item.barcode, {
        format: 'CODE128',
        displayValue: false,
        height: 40,
        width: 2,
        margin: 0
      });

      return new Promise<{ src: string; item: LabelData }>((resolve) => {
        const img = new Image();
        img.src = canvas.toDataURL('image/png');
        img.onload = () => resolve({ src: img.src, item });
      });
    })
  );

  const printWindow = window.open('', '_blank');
  if (!printWindow) return;

  const { document: doc } = printWindow;

  // Create and append a <style> tag
  const style = doc.createElement('style');
  style.textContent = `
    @media print {
      @page {
        size: 8cm 4cm;
        margin: 0;
      }
      body {
        margin: 0;
        padding: 0;
      }
    }
    body {
      font-family: sans-serif;
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    .label {
      width: 8cm;
      height: 4cm;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      align-items: center;

      page-break-after: always;
    }
    .barcode-img {
      height: 1.3cm;
      object-fit: contain;
      margin-bottom: 0.1cm;
    }
    .barcode-value {
      font-size: 12px;
      margin-bottom: 0.1cm;
    }
    .info-text {
      font-size: 10px;
      line-height: 1.2;
      text-align: center;
    }
  `;
  doc.head.appendChild(style);

  // Create and append each label
  barcodeImages.forEach(({ src, item }) => {
    const label = doc.createElement('div');
    label.className = 'label';

    const img = doc.createElement('img');
    img.className = 'barcode-img';
    img.src = src;

    const barcodeText = doc.createElement('div');
    barcodeText.className = 'barcode-value';
    barcodeText.textContent = item.barcode;

    const infoBlock = doc.createElement('div');
    infoBlock.className = 'info-text';
    infoBlock.innerHTML = `
      <div><strong>Info:</strong> ${item.info}</div>
      <div><strong>Amount:</strong> ${item.amount}</div>
      <div><strong>Date:</strong> ${item.date}</div>
      <div><strong>Supplier:</strong> ${item.supplier}</div>
      <div><strong>Supplier Code:</strong> ${item.supplierCode}</div>
    `;

    label.appendChild(img);
    label.appendChild(barcodeText);
    label.appendChild(infoBlock);
    doc.body.appendChild(label);
  });

  // Wait a little for content to render, then print
  setTimeout(() => {
    printWindow.focus();
    printWindow.print();
    printWindow.onafterprint = () => printWindow.close();
  }, 300);
}
