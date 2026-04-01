import { Injectable, signal, computed } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class FavoritesService {
  private readonly storageKey = 'favorites';

  private readonly _ids = signal<number[]>(this.loadFromStorage());
  readonly ids = computed(() => this._ids());

  private loadFromStorage(): number[] {
    try {
      return JSON.parse(localStorage.getItem(this.storageKey) || '[]');
    } catch {
      return [];
    }
  }

  private saveToStorage(ids: number[]) {
    localStorage.setItem(this.storageKey, JSON.stringify(ids));
  }

  isFavorite(id: number): boolean {
    return this._ids().includes(id);
  }

  toggle(id: number) {
    const current = this._ids();
    const updated = current.includes(id)
      ? current.filter(x => x !== id)
      : [...current, id];

    this._ids.set(updated);
    this.saveToStorage(updated);
  }

  count() {
    return this._ids().length;
  }
}
