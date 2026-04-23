import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../services/admin.service';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-admin-prodotti',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-prodotti.html',
  styleUrl: './admin-prodotti.css',
})
export class AdminProdotti {
  private adminService = inject(AdminService);
  private http = inject(HttpClient);

  backend = 'http://localhost:8080';

  newProduct = {
    titolo: '',
    descrizione: '',
    tipo: 'libro',
    autoreNome: '',
    autoreCognome: '',
    casaEditrice: '',
    prezzo: 0,
    dataPubblicazione: new Date().toISOString().split('T')[0],
    quantitaDisponibile: 10
  };

  copertina: File | null = null;

  onFileSelected(event: any) {
    this.copertina = event.target.files[0];
  }

  async addProduct() {
    if (!this.newProduct.titolo || !this.copertina) {
      alert("Manca il titolo o l'immagine!");
      return;
    }

    try {
      const autoreId = await this.getOrCreateAutore(
        this.newProduct.autoreNome,
        this.newProduct.autoreCognome
      );

      const casaId = await this.getOrCreateCasaEditrice(
        this.newProduct.casaEditrice
      );

      const categoriaId = this.newProduct.tipo === 'libro' ? 9 : 10;

      const payload = {
        titolo: this.newProduct.titolo,
        descrizione: this.newProduct.descrizione,
        prezzo: Number(this.newProduct.prezzo),
        dataPubblicazione: this.newProduct.dataPubblicazione,
        quantitaDisponibile: Number(this.newProduct.quantitaDisponibile),
        idAutore: autoreId,
        idCasaEditrice: casaId,
        idCategorie: [categoriaId]
      };

      this.adminService.addProduct(payload).subscribe({
        next: (res) => {
          this.adminService.addImageToProduct(res.id, this.copertina!).subscribe();
          alert('PRODOTTO AGGIUNTO!');
          this.resetForm();
        },
        error: () => alert('Errore durante la creazione del prodotto.')
      });

    } catch (err) {
      console.error(err);
      alert('Errore nella gestione autore/casa editrice.');
    }
  }

  async getOrCreateAutore(nome: string, cognome: string): Promise<number> {
    const autori = await firstValueFrom(
      this.http.get<any[]>(`${this.backend}/autori/list`)
    );

    const esistente = autori.find(a =>
      a.nome.toLowerCase() === nome.toLowerCase() &&
      a.cognome.toLowerCase() === cognome.toLowerCase()
    );

    if (esistente) return esistente.id;

    await firstValueFrom(
      this.http.post(`${this.backend}/autori/create`, { nome, cognome })
    );

    const updated = await firstValueFrom(
      this.http.get<any[]>(`${this.backend}/autori/list`)
    );

    return updated.find(a =>
      a.nome.toLowerCase() === nome.toLowerCase() &&
      a.cognome.toLowerCase() === cognome.toLowerCase()
    ).id;
  }

  async getOrCreateCasaEditrice(nome: string): Promise<number> {
    const caseEd = await firstValueFrom(
      this.http.get<any[]>(`${this.backend}/case_editrici/list`)
    );

    const esistente = caseEd.find(c =>
      c.nome.toLowerCase() === nome.toLowerCase()
    );

    if (esistente) return esistente.id;

    await firstValueFrom(
      this.http.post(`${this.backend}/case_editrici/create`, { nome })
    );

    const updated = await firstValueFrom(
      this.http.get<any[]>(`${this.backend}/case_editrici/list`)
    );

    return updated.find(c =>
      c.nome.toLowerCase() === nome.toLowerCase()
    ).id;
  }

  resetForm() {
    this.newProduct = {
      titolo: '',
      descrizione: '',
      tipo: 'libro',
      autoreNome: '',
      autoreCognome: '',
      casaEditrice: '',
      prezzo: 0,
      dataPubblicazione: new Date().toISOString().split('T')[0],
      quantitaDisponibile: 10
    };

    this.copertina = null;

    const fileInput = document.getElementById('img') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  }
}
