import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
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
    return this.http.get<any>('http://localhost:8080/ordini/list').pipe(
      map(response => {
        return (Array.isArray(response) ? response : []).map(order => ({
          id: order.id,
          userId: order.utente?.id || 0,
          userName: `${order.utente?.nome || ''} ${order.utente?.cognome || ''}`.trim(),
          products: (order.dettagliOrdine || []).map((detail: any) => ({
            id: detail.libro?.id || 0,
            name: detail.libro?.titolo || 'Prodotto sconosciuto',
            quantity: detail.quantita || 0,
            price: detail.libro?.prezzo || 0
          })),
          total: order.dettagliOrdine?.reduce((sum: number, d: any) => sum + (d.costoTotale || 0), 0) || 0,
          date: order.dettagliOrdine?.[0]?.data || '',
          status: order.dettagliOrdine?.[0]?.stato || 'PENDING'
        }));
      })
    );
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