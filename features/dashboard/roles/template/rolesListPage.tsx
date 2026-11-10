"use client"

import * as React from "react"
import { toast } from "sonner"
import { PageHeader } from "@/components/layout/PageHeader"
import { RolesStats } from "../components/RolesStats"
import { RolesTable } from "../components/RolesTable"
import { PermissionsCatalogTable } from "../components/PermissionsCatalogTable"
import { EditRolePermissionsModal } from "../components/EditRolePermissionsModal"
import {
  useRoles,
  usePermissions,
  useMyPermissions,
  useUpdateRolePermissions,
} from "../hooks/useRoles"
import LoadingSpinner from "@/components/shared/LoadingSpinner"
import GlobalError from "@/components/shared/globalerror"
import { getErrorMessage } from "@/components/shared/globalErrorMessage"
import { RoleItem } from "../types/roles.types"
import { ShieldCheck, KeyRound } from "lucide-react"

export default function RolesListPage() {
  const [activeTab, setActiveTab] = React.useState<"roles" | "catalog">("roles")
  const [selectedRole, setSelectedRole] = React.useState<RoleItem | null>(null)
  const [isModalOpen, setIsModalOpen] = React.useState(false)

  const { data: roles = [], isLoading: isLoadingRoles, isError: isErrorRoles } = useRoles()
  const {
    data: permissions = [],
    isLoading: isLoadingPermissions,
    isError: isErrorPermissions,
  } = usePermissions()
  const { data: myPermissions = [] } = useMyPermissions()

  const { mutateAsync: updatePermissions, isPending: isSaving } = useUpdateRolePermissions()

  const handleManagePermissions = (role: RoleItem) => {
    setSelectedRole(role)
    setIsModalOpen(true)
  }

  const handleSavePermissions = async (roleId: string, updatedPermissions: string[]) => {
    try {
      await updatePermissions({
        roleId,
        payload: { permissions: updatedPermissions },
      })
      toast.success("Role permissions updated successfully")
      setIsModalOpen(false)
      setSelectedRole(null)
    } catch (err) {
      toast.error(getErrorMessage(err) || "Failed to update role permissions")
    }
  }

  const totalUsersAssigned = React.useMemo(() => {
    return roles.reduce((sum, r) => sum + (r.userCount || 0), 0)
  }, [roles])

  const isLoading = isLoadingRoles || isLoadingPermissions
  const isError = isErrorRoles || isErrorPermissions

  return (
    <div className="flex flex-col min-h-full">
      <PageHeader
        title="Roles & Permissions"
        description="Manage system access levels, assign granular permissions, and govern institutional security."
      />

      <main className="flex-1 p-8 flex flex-col gap-6 max-w-[1400px] w-full">
        {/* KPI Stats */}
        <RolesStats
          totalRoles={roles.length}
          totalPermissions={permissions.length}
          totalAssignedUsers={totalUsersAssigned}
          myPermissionsCount={myPermissions.length}
        />

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-zinc-200">
          <button
            type="button"
            onClick={() => setActiveTab("roles")}
            className={`flex items-center gap-2 px-5 py-3 text-xs font-semibold border-b-2 transition-all cursor-pointer ${
              activeTab === "roles"
                ? "border-brand-orange text-brand-orange"
                : "border-transparent text-zinc-500 hover:text-zinc-800"
            }`}
          >
            <ShieldCheck className="size-4" />
            <span>Roles & Access Matrix</span>
            <span
              className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                activeTab === "roles"
                  ? "bg-brand-orange/10 text-brand-orange"
                  : "bg-zinc-100 text-zinc-600"
              }`}
            >
              {roles.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("catalog")}
            className={`flex items-center gap-2 px-5 py-3 text-xs font-semibold border-b-2 transition-all cursor-pointer ${
              activeTab === "catalog"
                ? "border-brand-orange text-brand-orange"
                : "border-transparent text-zinc-500 hover:text-zinc-800"
            }`}
          >
            <KeyRound className="size-4" />
            <span>Permissions Catalog</span>
            <span
              className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                activeTab === "catalog"
                  ? "bg-brand-orange/10 text-brand-orange"
                  : "bg-zinc-100 text-zinc-600"
              }`}
            >
              {permissions.length}
            </span>
          </button>
        </div>

        {/* Content Section */}
        {isLoading ? (
          <LoadingSpinner title="loading roles and permissions" />
        ) : isError ? (
          <GlobalError />
        ) : activeTab === "roles" ? (
          <RolesTable
            roles={roles}
            totalAvailablePermissions={permissions.length}
            onManagePermissions={handleManagePermissions}
          />
        ) : (
          <PermissionsCatalogTable permissions={permissions} />
        )}

        {/* Modal for Permission Management */}
        <EditRolePermissionsModal
          open={isModalOpen}
          onOpenChange={setIsModalOpen}
          role={selectedRole}
          allPermissions={permissions}
          onSave={handleSavePermissions}
          isSaving={isSaving}
        />
      </main>
    </div>
  )
}
