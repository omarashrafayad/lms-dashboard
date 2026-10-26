import clientAxios from "@/lib/axios/clientAxios"
import {
  ApiParent,
  CreateParentPayload,
  UpdateParentPayload,
  ParentQueryParams,
} from "../types/parent.types"
import { PaginatedResponse, normalizePaginatedResponse } from "@/types/pagination"

export const getParents = async (
  params: ParentQueryParams = {}
): Promise<PaginatedResponse<ApiParent>> => {
  const queryParams: Record<string, any> = {}
  if (params.page !== undefined) queryParams.page = params.page
  if (params.pageSize !== undefined) queryParams.pageSize = params.pageSize
  if (params.search && params.search.trim()) queryParams.search = params.search.trim()
  if (params.status && params.status !== "all") queryParams.status = params.status

  const res = await clientAxios.get("/parents", {
    params: Object.keys(queryParams).length > 0 ? queryParams : undefined,
  })

  return normalizePaginatedResponse<ApiParent>(res.data, params.page, params.pageSize)
}

export const getParentById = async (parentId: string): Promise<ApiParent> => {
  const res = await clientAxios.get(`/parents/${parentId}`)
  return res.data?.data || res.data
}

export const createParent = async (data: CreateParentPayload): Promise<any> => {
  const res = await clientAxios.post("/parents", data)
  return res.data?.data || res.data
}

export const updateParent = async (
  parentId: string,
  data: UpdateParentPayload
): Promise<any> => {
  const res = await clientAxios.put(`/parents/${parentId}`, data)
  return res.data?.data || res.data
}

export const deleteParent = async (parentId: string): Promise<void> => {
  await clientAxios.delete(`/parents/${parentId}`)
}
