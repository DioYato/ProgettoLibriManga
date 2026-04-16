import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
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

interface LibriResponse {
  msg: string;
  id: number;
}

@Injectable({ providedIn: 'root' })
export class AdminService {

  private api = 'http://localhost:8080';
  private ordiniApi = 'http://localhost:8080/ordini';

  constructor(private http: HttpClient) {}

  // Trasforma i DTO del server nel modello Order per i componenti
  private mapOrders(response: any): Order[] {
    if (!Array.isArray(response)) return [];

    return response.map(order => ({
      id: order.id,
      userId: order.utente?.id || 0,
      userName: `${order.utente?.nome || ''} ${order.utente?.cognome || ''}`.trim() || 'Utente Sconosciuto',
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
  }

  getOrders(): Observable<Order[]> {
    return this.http.get<any>(`${this.ordiniApi}/list`).pipe(
      map(response => this.mapOrders(response)),
      catchError(() => of([])) 
    );
  }

  getUserOrders(userId: number): Observable<Order[]> {
    return this.http.get<any>(`${this.ordiniApi}/findByUtente?idUtente=${userId}`).pipe(
      map(response => this.mapOrders(response)),
      catchError(() => of([]))
    );
  }

  updateOrderStatus(orderId: number, status: string): Observable<any> {
    return this.http.put(`${this.api}/orders/${orderId}/status`, { status });
  }

  // --- Gestione Catalogo Prodotti ---

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.api}/libri/list`).pipe(
      catchError(() => of([]))
    );
  }

  addProduct(libroData: any): Observable<LibriResponse> {
    // Inviando libroData come oggetto, HttpClient imposta automaticamente Content-Type: application/json
    return this.http.post<LibriResponse>(`${this.api}/libri/create`, libroData);
  }

  deleteProduct(productId: number): Observable<any> {
    return this.http.delete(`${this.api}/libri/delete?id=${productId}`);
  }

  addImageToProduct(productId: number, image: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', image);
    formData.append('id', productId.toString());
    return this.http.post(`${this.api}/rest/upload/image`, formData);
  }
}
