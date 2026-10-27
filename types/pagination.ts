export interface PaginatedResponse<T> {
  items: T[]
  totalCount: number
  page: number
  pageSize: number
  totalPages: number
}

export interface PaginationParams {
  search?: string
  page?: number
  pageSize?: number
}

/**
 * Normalizes different API response formats into a standard PaginatedResponse.
 * Supports:
 * 1. Standard pattern: { items: [...], totalCount: 13, page: 1, pageSize: 20, totalPages: 1 }
 * 2. Nested data pattern: { data: { items: [...], totalCount: ... } }
 * 3. Raw array fallback: [ ... ]
 */
export function normalizePaginatedResponse<T>(
  resData: any,
  defaultPage = 1,
  defaultPageSize = 10
): PaginatedResponse<T> {
  if (!resData) {
    return {
      items: [],
      totalCount: 0,
      page: defaultPage,
      pageSize: defaultPageSize,
      totalPages: 1,
    }
  }

  // Raw array response fallback
  if (Array.isArray(resData)) {
    const startIndex = (defaultPage - 1) * defaultPageSize
    const items = resData.slice(startIndex, startIndex + defaultPageSize)
    return {
      items,
      totalCount: resData.length,
      page: defaultPage,
      pageSize: defaultPageSize,
      totalPages: Math.max(1, Math.ceil(resData.length / defaultPageSize)),
    }
  }

  // Handle { data: { items: [...], ... } } or { data: [...], totalCount: ... }
  const target =
    resData.data && !Array.isArray(resData.data) && (resData.data.items || resData.data.value)
      ? resData.data
      : resData

  const items: T[] = Array.isArray(target.items)
    ? target.items
    : Array.isArray(target.data)
    ? target.data
    : Array.isArray(target.value)
    ? target.value
    : []

  const totalCount =
    typeof target.totalCount === "number"
      ? target.totalCount
      : typeof target.total === "number"
      ? target.total
      : items.length

  const page =
    typeof target.page === "number"
      ? target.page
      : typeof target.currentPage === "number"
      ? target.currentPage
      : defaultPage

  const pageSize =
    typeof target.pageSize === "number"
      ? target.pageSize
      : typeof target.limit === "number"
      ? target.limit
      : defaultPageSize

  const totalPages =
    typeof target.totalPages === "number"
      ? target.totalPages
      : Math.max(1, Math.ceil(totalCount / pageSize))

  return {
    items,
    totalCount,
    page,
    pageSize,
    totalPages,
  }
}
