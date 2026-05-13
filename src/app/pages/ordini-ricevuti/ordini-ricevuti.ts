import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminService, Order } from '../../services/admin.service';

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
        this.orders.update(orders => 
          orders.map(o => o.id === order.id ? { ...o, status } : o)
        );
      },
      error: (err) => console.error('Error updating status', err)
    });
  }

  deleteOrder(id: number) {
    if (confirm('Sei sicuro di voler eliminare definitivamente questo ordine?')) {
      this.adminService.deleteOrder(id).subscribe({
        next: () => {
          this.orders.update(orders => orders.filter(o => o.id !== id));
        },
        error: (err) => console.error('Error deleting order', err)
      });
    }
  }
}