import clientAxios from "@/lib/axios/clientAxios"
import {
  ApiParent,
  CreateParentPayload,
  UpdateParentPayload,
} from "../types/parent.types"

export const getParents = async (
  params: { search?: string } = {}
): Promise<ApiParent[]> => {
  const res = await clientAxios.get("/parents", { params })
  if (Array.isArray(res.data)) {
    return res.data
  }
  if (res.data && Array.isArray(res.data.data)) {
    return res.data.data
  }
  return []
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
