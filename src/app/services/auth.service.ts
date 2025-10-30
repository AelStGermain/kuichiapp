import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private key = 'kuichi_user_v1';

  login(email: string, password: string): boolean {
    if (!email || !password) return false;
    const user = { email, loggedAt: Date.now() };
    localStorage.setItem(this.key, JSON.stringify(user));
    return true;
  }

  logout(): void {
    localStorage.removeItem(this.key);
  }

  getUser(): { email: string; loggedAt: number } | null {
    const raw = localStorage.getItem(this.key);
    return raw ? JSON.parse(raw) : null;
  }

  isAuthenticated(): boolean {
    return !!this.getUser();
  }
}
