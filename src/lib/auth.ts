import PocketBaseSingleton from './db'
import type { UsersRecord, UsersResponse } from './db.types'

const pb = PocketBaseSingleton.getInstance()

export type RegisterUser = Pick<UsersRecord, 'email'> & {
  password: string
  passwordConfirm: string
  name?: string
}

export async function register(input: RegisterUser): Promise<UsersResponse> {
  return pb.collection('users').create(input)
}

/**
 * Login In A User
 */
export async function signIn(email: string, password: string): Promise<UsersResponse> {
  const { record } = await pb.collection('users').authWithPassword(email, password)
  return record
}

/**
 * Session Management
 */
export async function restoreSession(): Promise<UsersResponse | null> {
  if (!pb.authStore.isValid) return null

  try {
    const { record } = await pb.collection('users').authRefresh()
    return record
  } catch (error) {
    if (
      typeof error === 'object' &&
      error !== null &&
      'status' in error &&
      (error.status === 401 || error.status === 403)
    ) {
      pb.authStore.clear()
    }
    throw error
  }
}

/**
 * Get User Details and Response
 */
export function getUser(): UsersResponse | null {
  return pb.authStore.model as UsersResponse | null
}

export function signOut(): void {
  pb.authStore.clear()
}

export function isAuthenticated(): boolean {
  return pb.authStore.isValid
}

export function onAuthStateChange(
  listener: (authenticated: boolean, user: UsersResponse | null) => void
): () => void {
  listener(isAuthenticated(), getUser())
  return pb.authStore.onChange(() => listener(isAuthenticated(), getUser()))
}