import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminService, Order } from '../../data/admin.service';

@Component({
  selector: 'app-ordini-ricevuti',
  imports: [CommonModule],
  templateUrl: './ordini-ricevuti.html',
  styleUrl: './ordini-ricevuti.css',
})
export class OrdiniRicevuti {

  private adminService = inject(AdminService);

  orders = signal<Order[]>([]);

  constructor() {
    this.loadOrders();
  }

  loadOrders() {
    this.adminService.getOrders().subscribe({
      next: (orders) => this.orders.set(orders),
      error: (err) => console.error('Error loading orders', err)
    });
  }

  updateStatus(order: Order, status: string) {
    this.adminService.updateOrderStatus(order.id, status).subscribe({
      next: () => {
        const updated = this.orders().map(o => 
          o.id === order.id ? { ...o, status } : o
        );
        this.orders.set(updated);
      },
      error: (err) => console.error('Error updating status', err)
    });
  }
}