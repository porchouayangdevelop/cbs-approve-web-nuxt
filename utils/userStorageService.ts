export interface StoredUser {
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  enabled: boolean;
  emailVerified: boolean;
  credentials: Array<{
    type: string;
    value: string;
    temporary: boolean;
  }>;

  userType?: string;
  department?: string;
  phone?: string;
  createdAt?: string;
  id?: string;
}

interface User {
  userType: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  department: string;
  phone?: string;
  password: string;
}

export const userStorageService = {
  STORAGE_KEY: 'registered_users',

  getUsers(): StoredUser[] {
    if (process.client) {
      const users = localStorage.getItem(this.STORAGE_KEY);
      console.log(users)
      return users ? JSON.parse(users) : [];
    }
    return [];
  },

  saveUser(users: StoredUser): void {
    if (process.client) {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(users, null, 2));
    }
  },
  saveUsers(users: StoredUser[]): void {
    if (process.client) {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(users, null, 2));
    }
  },


  addUserFromRegistration(formData: User): StoredUser {
    const users = this.getUsers();

    const newUser: StoredUser = {
      username: formData.username,
      firstName: formData.username,
      lastName: formData.lastName,
      email: formData.email,
      enabled: true,
      emailVerified: false,
      credentials: [
        {
          type: 'password',
          value: formData.password,
          temporary: false
        }
      ],
      userType: formData.userType,
      department: formData.department,
      phone: formData.phone || '',
      createdAt: new Date().toISOString(),
      id: `user_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
    };

    users.push(newUser);
    this.saveUser(newUser);
    console.log(`Registered User :`, newUser);
    return newUser;
  },

  findByUsername(username: string): StoredUser | null {
    const users = this.getUsers();
    return users.find(user => user.username === username) || null;
  },

  findByEmail(email: string): StoredUser | null {
    const users = this.getUsers();
    return users.find(user => user.email === email) || null;
  },

  authenticate(username: string, password: string): StoredUser | null {
    const users = this.getUsers();
    const user = users.find(user => (user.username === username || user.email === username) &&
      user.credentials[0]?.value === password && user.enabled);
    return user ? user : null;
  },

  initializedDefaultUsers: function (): void {
    const users = this.getUsers();

    const defaultUserExists = users.some(user => user.username === 'APB01398');

    if (!defaultUserExists) {
      const defaultUser: StoredUser = {
        username: 'APB01398',
        firstName: 'Por',
        lastName: 'Yang',
        email: 'apb.por@hotmail.com',
        enabled: true,
        emailVerified: false,
        credentials: [
          {
            type: "password",
            value: 'Por78951',
            temporary: false
          }
        ],
        userType: 'admin',
        department: 'IT',
        phone: '02091255475',
        createdAt: new Date().toISOString(),
        id: 'user_default_apb01398',
      };

      users.push(defaultUser);
      this.saveUsers(users);
      console.log(`Default User ${JSON.stringify(defaultUser)}`);
    }
  },

  convertToAppUser(storedUser: StoredUser) {
    return {
      id: storedUser.id || storedUser.username,
      username: storedUser.username,
      firstName: storedUser.firstName,
      lastName: storedUser.lastName,
      email: storedUser.email,
      role: storedUser.userType || 'user',
      department: storedUser.department,
      permissions: this.getPermissionsForRole(storedUser.userType || 'user'),
      avatar: `https://ui-avatars.com/api/?name=${storedUser.firstName}+${storedUser.lastName}`
    };
  },

  getPermissionsForRole(role: string): string[] {
    const permissionMatrix: Record<string, string[]> = {
      'admin': [
        'admin:access',
        'users:create',
        'users:read',
        'users:edit',
        'users:delete',
        'settings:manage',
        'dashboard:read',
        'profile:read',
        'profile:edit',
        'reports:read',
        'reports:create'
      ],
      'checker': [
        'checker:access',
        'requests:review',
        'requests:approve',
        'requests:reject',
        'dashboard:read',
        'profile:read',
        'profile:edit'
      ],
      'user': [
        'users:read',
        'users:create',
        'dashboard:read',
        'profile:read',
        'profile:edit',
        'requests:create',
        'requests:read'
      ]
    };

    return permissionMatrix[role.toLowerCase()] || permissionMatrix['admin'];
  },

  clearAll(): void {
    if (process.client) {
      localStorage.removeItem(this.STORAGE_KEY);
    }
  },

  getUsersCount(): number {
    return this.getUsers().length;
  },

  exportUsers(): string {
    return JSON.stringify(this.getUsers(), null, 2);
  }

}