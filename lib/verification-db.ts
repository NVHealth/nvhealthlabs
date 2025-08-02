// Mock database operations for verification
interface User {
  id: number
  email: string
  phone?: string
  first_name: string
  last_name: string
  email_verified: boolean
  phone_verified: boolean
  is_active: boolean
  verification_attempts: number
  last_verification_attempt?: string
  created_at: string
  updated_at: string
}

interface VerificationCode {
  id: number
  user_id: number
  code: string
  type: "email" | "phone"
  contact_info: string
  expires_at: string
  attempts: number
  is_used: boolean
  created_at: string
  updated_at: string
}

class VerificationDB {
  private static users: User[] = [
    {
      id: 1,
      email: "john.doe@example.com",
      phone: "+1234567890",
      first_name: "John",
      last_name: "Doe",
      email_verified: true,
      phone_verified: false,
      is_active: true,
      verification_attempts: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 2,
      email: "jane.smith@example.com",
      phone: "+1987654321",
      first_name: "Jane",
      last_name: "Smith",
      email_verified: false,
      phone_verified: true,
      is_active: true,
      verification_attempts: 1,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ]

  private static verificationCodes: VerificationCode[] = []

  static async createUser(userData: Partial<User>): Promise<User> {
    const newUser: User = {
      id: this.users.length + 1,
      email: userData.email!,
      phone: userData.phone,
      first_name: userData.first_name!,
      last_name: userData.last_name!,
      email_verified: false,
      phone_verified: false,
      is_active: false,
      verification_attempts: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    this.users.push(newUser)
    return newUser
  }

  static async getUserById(id: number): Promise<User | null> {
    return this.users.find((user) => user.id === id) || null
  }

  static async getUserByEmail(email: string): Promise<User | null> {
    return this.users.find((user) => user.email === email) || null
  }

  static async updateUser(id: number, updates: Partial<User>): Promise<User | null> {
    const userIndex = this.users.findIndex((user) => user.id === id)
    if (userIndex === -1) return null

    this.users[userIndex] = {
      ...this.users[userIndex],
      ...updates,
      updated_at: new Date().toISOString(),
    }

    return this.users[userIndex]
  }

  static async createVerificationCode(
    codeData: Omit<VerificationCode, "id" | "created_at" | "updated_at">,
  ): Promise<VerificationCode> {
    const newCode: VerificationCode = {
      ...codeData,
      id: this.verificationCodes.length + 1,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    this.verificationCodes.push(newCode)
    return newCode
  }

  static async getVerificationCode(code: string, type: "email" | "phone"): Promise<VerificationCode | null> {
    return (
      this.verificationCodes.find(
        (vc) => vc.code === code && vc.type === type && !vc.is_used && new Date(vc.expires_at) > new Date(),
      ) || null
    )
  }

  static async updateVerificationCode(
    id: number,
    updates: Partial<VerificationCode>,
  ): Promise<VerificationCode | null> {
    const codeIndex = this.verificationCodes.findIndex((code) => code.id === id)
    if (codeIndex === -1) return null

    this.verificationCodes[codeIndex] = {
      ...this.verificationCodes[codeIndex],
      ...updates,
      updated_at: new Date().toISOString(),
    }

    return this.verificationCodes[codeIndex]
  }

  static async cleanupExpiredCodes(): Promise<void> {
    const now = new Date()
    this.verificationCodes = this.verificationCodes.filter((code) => new Date(code.expires_at) > now)
  }
}

export { VerificationDB, type User, type VerificationCode }
