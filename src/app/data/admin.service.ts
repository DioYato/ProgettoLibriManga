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

@Injectable({ providedIn: 'root' })
export class AdminService {

  // Endpoint per gestione prodotti e ordini
  private api = 'http://localhost:8080/admin';
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
      // Calcolo del totale basato sui singoli dettagli ordine
      total: order.dettagliOrdine?.reduce((sum: number, d: any) => sum + (d.costoTotale || 0), 0) || 0,
      date: order.dettagliOrdine?.[0]?.data || '',
      status: order.dettagliOrdine?.[0]?.stato || 'PENDING'
    }));
  }

  // Recupera la lista globale di tutti gli ordini
  getOrders(): Observable<Order[]> {
    return this.http.get<any>(`${this.ordiniApi}/list`).pipe(
      map(response => this.mapOrders(response)),
      catchError(() => of([])) 
    );
  }

  // Recupera lo storico ordini di uno specifico utente tramite ID
  getUserOrders(userId: number): Observable<Order[]> {
    return this.http.get<any>(`${this.ordiniApi}/findByUtente?idUtente=${userId}`).pipe(
      map(response => this.mapOrders(response)),
      catchError(() => of([]))
    );
  }

  // Modifica lo stato (es. Spedito, Consegnato) di un ordine esistente
  updateOrderStatus(orderId: number, status: string): Observable<any> {
    return this.http.put(`${this.api}/orders/${orderId}/status`, { status });
  }

  // --- Gestione Catalogo Prodotti ---

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.api}/products`).pipe(
      catchError(() => of([]))
    );
  }

  addProduct(product: Omit<Product, 'id'>): Observable<Product> {
    return this.http.post<Product>(`${this.api}/products`, product);
  }

  deleteProduct(productId: number): Observable<any> {
    return this.http.delete(`${this.api}/products/${productId}`);
  }
}