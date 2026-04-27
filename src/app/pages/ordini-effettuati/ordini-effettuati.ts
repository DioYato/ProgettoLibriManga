import { Component, inject, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminService, Order } from '../../services/admin.service';
import { AuthService } from '../../services/auth.service';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-ordini-effettuati',
  imports: [CommonModule],
  templateUrl: './ordini-effettuati.html',
  styleUrl: './ordini-effettuati.css',
})
export class OrdiniEffettuati {

  private readonly adminService = inject(AdminService);
  
  private readonly _user = inject(AuthService).user;
  
  protected readonly orders = signal<Order[]>([]);

  constructor() {
    this.loadOrders(this._user()!.id);
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
