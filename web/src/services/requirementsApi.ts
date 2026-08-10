import { createLogger } from "../utils/logger";
const __ykLog = createLogger("requirementsApi");
export type ProductItem = {
  id: number;
  name: string;
  description?: string;
  price: number;
  stock: number;
  category: string;
  brand?: string;
  unit?: string;
  imageUrl?: string;
};
export type CategoryGroup = {
  category: string;
  items: ProductItem[];
};
export type BulkOrderLine = {
  productId: number;
  productName: string;
  brand?: string;
  unitPrice: number;
  quantity: number;
};
const PRODUCT_API = 'http://localhost:8002/api/products';
const ORDER_API = 'http://localhost:8004/api/orders';
export async function fetchProductsByCategory(): Promise<CategoryGroup[]> {
  const __ykStart = Date.now();
  const __ykOp = "requirementsApi.fetchProductsByCategory";
  __ykLog.info("METHOD_START", {
    op: __ykOp
  });
  let __ykOk = true;
  try {
    const response = await fetch(`${PRODUCT_API}/by-category`);
    if (!response.ok) {
      const __ykBlockStart1 = Date.now();
      __ykLog.info("BLOCK_START", {
        op: "requirementsApi#if1"
      });
      try {
        throw new Error('Failed to load products by category');
      } finally {
        __ykLog.info("BLOCK_END", {
          op: "requirementsApi#if1",
          durationMs: Date.now() - __ykBlockStart1
        });
      }
    }
    return response.json();
  } catch (__ykErr) {
    __ykOk = false;
    __ykLog.error("METHOD_END", {
      op: __ykOp,
      status: "failure",
      durationMs: Date.now() - __ykStart
    });
    throw __ykErr;
  } finally {
    if (__ykOk) __ykLog.info("METHOD_END", {
      op: __ykOp,
      status: "success",
      durationMs: Date.now() - __ykStart
    });
  }
}
export async function submitBulkOrder(payload: {
  userId: number;
  shippingAddress: string;
  paymentMethod?: string;
  items: BulkOrderLine[];
}) {
  const __ykStart = Date.now();
  const __ykOp = "requirementsApi.submitBulkOrder";
  __ykLog.info("METHOD_START", {
    op: __ykOp
  });
  let __ykOk = true;
  try {
    const response = await fetch(`${ORDER_API}/bulk`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });
    if (!response.ok) {
      const __ykBlockStart2 = Date.now();
      __ykLog.info("BLOCK_START", {
        op: "requirementsApi#if2"
      });
      try {
        const text = await response.text();
        throw new Error(text || 'Failed to submit requirements order');
      } finally {
        __ykLog.info("BLOCK_END", {
          op: "requirementsApi#if2",
          durationMs: Date.now() - __ykBlockStart2
        });
      }
    }
    return response.json();
  } catch (__ykErr) {
    __ykOk = false;
    __ykLog.error("METHOD_END", {
      op: __ykOp,
      status: "failure",
      durationMs: Date.now() - __ykStart
    });
    throw __ykErr;
  } finally {
    if (__ykOk) __ykLog.info("METHOD_END", {
      op: __ykOp,
      status: "success",
      durationMs: Date.now() - __ykStart
    });
  }
}