import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../data/admin.service';
import { Product } from '../../models/product';

@Component({
  selector: 'app-admin-prodotti',
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-prodotti.html',
  styleUrl: './admin-prodotti.css',
})
export class AdminProdotti implements OnInit {

  private adminService = inject(AdminService);

  products: Product[] = [];
  newProduct: Omit<Product, 'id'> = {
    name: '',
    author: '',
    img: '',
    price: 0,
    availableNow: true
  };

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    this.adminService.getProducts().subscribe({
      next: (products) => this.products = products,
      error: (err) => console.error('Error loading products', err)
    });
  }

  addProduct() {
    if (this.newProduct.name && this.newProduct.author && this.newProduct.price > 0) {
      this.adminService.addProduct(this.newProduct).subscribe({
        next: (product) => {
          this.products.push(product);
          this.resetForm();
        },
        error: (err) => console.error('Error adding product', err)
      });
    }
  }

  deleteProduct(productId: number) {
    if (confirm('Sei sicuro di voler eliminare questo prodotto?')) {
      this.adminService.deleteProduct(productId).subscribe({
        next: () => {
          this.products = this.products.filter(p => p.id !== productId);
        },
        error: (err) => console.error('Error deleting product', err)
      });
    }
  }

  private resetForm() {
    this.newProduct = {
      name: '',
      author: '',
      img: '',
      price: 0,
      availableNow: true
    };
  }
}