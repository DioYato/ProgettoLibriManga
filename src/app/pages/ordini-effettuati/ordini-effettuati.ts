import { Component, inject, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminService, Order } from '../../data/admin.service';
import { AuthService } from '../../data/auth.service';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-ordini-effettuati',
  imports: [CommonModule],
  templateUrl: './ordini-effettuati.html',
  styleUrl: './ordini-effettuati.css',
})
export class OrdiniEffettuati {

  private adminService = inject(AdminService);
  private authService = inject(AuthService);
  
  readonly user = toSignal(this.authService.user$, { initialValue: null });
  orders = signal<Order[]>([]);

  constructor() {
    effect(() => {
      const user = this.user();
      if (user?.id) {
        this.loadOrders(user.id);
      }
    });
  }

  private loadOrders(userId: number) {
    this.adminService.getUserOrders(userId).subscribe({
      next: (orders) => {
        this.orders.set(orders);
      },
      error: (err) => console.error('Error loading orders', err)
    });
  }
}
