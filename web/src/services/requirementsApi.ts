export type ProductItem = {
  id: number
  name: string
  description?: string
  price: number
  stock: number
  category: string
  brand?: string
  unit?: string
  imageUrl?: string
}

export type CategoryGroup = {
  category: string
  items: ProductItem[]
}

export type BulkOrderLine = {
  productId: number
  productName: string
  brand?: string
  unitPrice: number
  quantity: number
}

const PRODUCT_API = 'http://localhost:8002/api/products'
const ORDER_API = 'http://localhost:8004/api/orders'

export async function fetchProductsByCategory(): Promise<CategoryGroup[]> {
  const response = await fetch(`${PRODUCT_API}/by-category`)
  if (!response.ok) {
    throw new Error('Failed to load products by category')
  }
  return response.json()
}

export async function submitBulkOrder(payload: {
  userId: number
  shippingAddress: string
  paymentMethod?: string
  items: BulkOrderLine[]
}) {
  const response = await fetch(`${ORDER_API}/bulk`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  if (!response.ok) {
    const text = await response.text()
    throw new Error(text || 'Failed to submit requirements order')
  }
  return response.json()
}
