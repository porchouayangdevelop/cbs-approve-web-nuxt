export const routeGuards = {
  routeRules: {
    '/admin': {roles: ['admin'], permissions: ['admin:access']},
    '/admin/users': {roles: ['admin'], permissions: ['admin:access', 'users:manage']},
    '/admin/settings': {roles: ['admin'], permissions: ['admin:access', 'settings:manage']},
    '/users': {roles: ['admin', 'User'], permissions: ['users:read']},
    '/users/create': {roles: ['admin', 'User'], permissions: ['users:create']},
    // '/users/[id]':{roles:['admin','User'],permission:['a:access','users:manage']},
    '/checker': {roles: ['admin', 'Checker'], permissions: ['checker:access']},
    '/checker/request': {roles: ['admin', 'Checker'], permissions: ['checker:access', 'request:review']},
  },


  checkRouteAccess(path: string, userRole: string, userPermission: string[]): boolean {
    const rules = this.routeRules[path as keyof typeof this.routeRules];

    if (!rules) {
      return true;
    }

    if (rules.roles && !rules.roles.includes(userRole)) {
      return false;
    }

    if(rules.permissions){
      const hasRequiredPermission = rules.permissions.some(permission => userPermission.includes(permission));
      if(!hasRequiredPermission) return false;
    }
    return true;
  },

  getAccessibleRoutes(userRole: string, userPermissions: string[]): string[] {
    return Object.keys(this.routeRules).filter(route =>
      this.checkRouteAccess(route, userRole, userPermissions)
    )
  }


}