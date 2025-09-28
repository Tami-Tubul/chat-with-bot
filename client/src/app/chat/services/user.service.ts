import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UserService {

  private readonly NAME_KEY = 'chatUserName';
  private readonly ID_KEY = 'chatUserId';

  // --- User Name ---
  getUserName(): string | null {
    return localStorage.getItem(this.NAME_KEY);
  }

  setUserName(name: string) {
    localStorage.setItem(this.NAME_KEY, name);
  }

  // --- User ID ---
  getUserId(): string | null {
    return localStorage.getItem(this.ID_KEY);
  }

  setUserId(id: string) {
    localStorage.setItem(this.ID_KEY, id);
  }
}
