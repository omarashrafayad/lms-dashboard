export interface Banner {
  id: string
  title: string | null
  imagePath: string | null
  imageUrl: string | null
  linkUrl: string | null
  order: number
  isActive: boolean
  createdAt: string
  updatedAt: string | null
}

export interface BannerPagedResponse {
  items: Banner[]
  totalCount: number
  page: number
  pageSize: number
  totalPages: number
}

export interface BannerQueryParams {
  page?: number
  pageSize?: number
  active?: boolean
  search?: string
}

export interface CreateBannerPayload {
  title: string
  linkUrl?: string
  order?: number
  isActive?: boolean
  image?: File | null
}

export interface UpdateBannerPayload {
  title?: string
  linkUrl?: string
  order?: number
  isActive?: boolean
  image?: File | null
}

