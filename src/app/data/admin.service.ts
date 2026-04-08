import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../models/product';

export interface Order {
  id: number;
  userId: number;
  userName: string;
  products: { id: number; name: string; quantity: number; price: number }[];
  total: number;
  date: string;
  status: string;
}

@Injectable({ providedIn: 'root' })
export class AdminService {

  private api = 'http://localhost:8080/admin';

  constructor(private http: HttpClient) {}

  getOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.api}/orders`);
  }

  updateOrderStatus(orderId: number, status: string): Observable<any> {
    return this.http.put(`${this.api}/orders/${orderId}/status`, { status });
  }

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.api}/products`);
  }

  addProduct(product: Omit<Product, 'id'>): Observable<Product> {
    return this.http.post<Product>(`${this.api}/products`, product);
  }

  deleteProduct(productId: number): Observable<any> {
    return this.http.delete(`${this.api}/products/${productId}`);
  }
}