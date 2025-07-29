export type PermissionAction = 'create' | 'read' | 'edit' | 'delete' | 'approve' | 'reject' | 'access' | 'review' | 'manage'
export type PermissionResource =
    | 'users'
    | 'admin'
    | 'checker'
    | 'requests'
    | 'dashboard'
    | 'profile'
    | 'settings'
    | 'reports'
    | 'analytics'
    | 'system'
    | 'audit'
    | 'roles'
    | 'permissions'
    | 'workflows'
    | 'notifications'
    | 'content'
    | 'checkers'
    | 'templates'
    | 'history'
    | 'stats'
    | 'schedule'
    | 'delegation'
    | 'team'
    | 'bulk'


export type Permission = `${PermissionResource}:${PermissionAction}`

export interface UserPermissions {
    roles: string[]
    permissions: Permission[]
}

export interface RouteAccess {
    roles?: string[]
    permissions?: Permission[]
    requireAll?: boolean
  }