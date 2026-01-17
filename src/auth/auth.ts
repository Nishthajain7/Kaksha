export type User = {
  name: string;
  email: string;
  picture?: string;
};

const KEY = "auth_user";

export function setUser(user: User) {
  localStorage.setItem(KEY, JSON.stringify(user));
}

export function getUser(): User | null {
  const raw = localStorage.getItem(KEY);
  return raw ? JSON.parse(raw) : null;
}

export function signOut() {
  localStorage.removeItem(KEY);
}
