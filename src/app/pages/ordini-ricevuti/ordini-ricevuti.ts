import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminService, Order } from '../../data/admin.service';

@Component({
  selector: 'app-ordini-ricevuti',
  imports: [CommonModule],
  templateUrl: './ordini-ricevuti.html',
  styleUrl: './ordini-ricevuti.css',
})
export class OrdiniRicevuti implements OnInit {

  private adminService = inject(AdminService);

  orders: Order[] = [];

  ngOnInit() {
    this.loadOrders();
  }

  loadOrders() {
    this.adminService.getOrders().subscribe({
      next: (orders) => this.orders = orders,
      error: (err) => console.error('Error loading orders', err)
    });
  }

  updateStatus(order: Order, status: string) {
    this.adminService.updateOrderStatus(order.id, status).subscribe({
      next: () => {
        order.status = status;
      },
      error: (err) => console.error('Error updating status', err)
    });
  }
}