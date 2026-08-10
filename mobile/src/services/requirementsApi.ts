import { createLogger } from "../utils/logger";
import axios from 'axios';
import { API } from '../config';
const __ykLog = createLogger("requirementsApi");
export type ProductItem = {
  id: number;
  name: string;
  price: number;
  stock: number;
  category: string;
  brand?: string;
  unit?: string;
};
export type CategoryGroup = {
  category: string;
  items: ProductItem[];
};
export async function fetchProductsByCategory(): Promise<CategoryGroup[]> {
  const __ykStart = Date.now();
  const __ykOp = "requirementsApi.fetchProductsByCategory";
  __ykLog.info("METHOD_START", {
    op: __ykOp
  });
  let __ykOk = true;
  try {
    const response = await axios.get(`${API.products}/by-category`);
    return response.data;
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
  items: Array<{
    productId: number;
    productName: string;
    brand?: string;
    unitPrice: number;
    quantity: number;
  }>;
}) {
  const __ykStart = Date.now();
  const __ykOp = "requirementsApi.submitBulkOrder";
  __ykLog.info("METHOD_START", {
    op: __ykOp
  });
  let __ykOk = true;
  try {
    const response = await axios.post(`${API.orders}/bulk`, payload);
    return response.data;
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