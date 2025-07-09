// utils/mockUserStorage.ts
interface MockUser {
  id: string
  username: string
  firstName: string
  lastName: string
  email: string
  password: string // In real app, this would be hashed
  role: string
  department: string
  phone?: string
  enabled: boolean
  createdAt: string
}

export const mockUserStorage = {
  // Get all users from localStorage
  getUsers(): MockUser[] {
    if (process.client) {
      const users = localStorage.getItem('mock_users')
      return users ? JSON.parse(users) : []
    }
    return []
  },

  // Save users to localStorage
  saveUsers(users: MockUser[]): void {
    if (process.client) {
      localStorage.setItem('mock_users', JSON.stringify(users))
    }
  },

  // Add a new user
  addUser(userData: Omit<MockUser, 'id' | 'createdAt'>): MockUser {
    const users = this.getUsers()
    const newUser: MockUser = {
      ...userData,
      id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString()
    }

    users.push(newUser)
    this.saveUsers(users)
    return newUser
  },

  // Find user by username
  findByUsername(username: string): MockUser | null {
    const users = this.getUsers()
    return users.find(user => user.username === username) || null
  },

  // Find user by email
  findByEmail(email: string): MockUser | null {
    const users = this.getUsers()
    return users.find(user => user.email === email) || null
  },

  // Authenticate user
  authenticate(username: string, password: string): MockUser | null {
    const users = this.getUsers()
    const user = users.find(u =>
      (u.username === username || u.email === username) &&
      u.password === password &&
      u.enabled
    )
    return user || null
  },

  // Initialize with default admin user
  initializeDefaultUsers(): void {
    const users = this.getUsers()

    // Check if default admin exists
    const adminExists = users.some(user => user.username === 'admin')

    if (!adminExists) {
      const defaultAdmin: MockUser = {
        id: 'admin_default',
        username: 'admin',
        firstName: 'System',
        lastName: 'Administrator',
        email: 'admin@company.com',
        password: 'admin123', // In real app, this would be hashed
        role: 'admin',
        department: 'IT',
        enabled: true,
        createdAt: new Date().toISOString()
      }

      users.push(defaultAdmin)
      this.saveUsers(users)
      console.log('Default admin user created: admin/admin123')
    }
  },

  // Clear all users (for testing)
  clearAll(): void {
    if (process.client) {
      localStorage.removeItem('mock_users')
    }
  }
}