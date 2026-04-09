import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../data/admin.service';

@Component({
  selector: 'app-admin-prodotti',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-prodotti.html',
  styleUrl: './admin-prodotti.css',
})
export class AdminProdotti {
  private adminService = inject(AdminService);

  newProduct = {
    titolo: '',
    descrizione: '',
    copertina: '', 
    prezzo: 0,
    dataPubblicazione: new Date().toISOString().split('T')[0],
    quantitaDisponibile: 10,
    idAutore: 1,      // DEVE essere un numero di un autore esistente
    idCasaEditrice: 1, // DEVE essere un numero di una casa editrice esistente
    idCategorie: [1]   // DEVE essere un array di numeri di categorie esistenti
  };

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        let base64String = reader.result as string;
        // Puliamo la stringa: togliamo "data:image/jpeg;base64," se presente
        // Molti backend preferiscono la stringa "pulita"
        this.newProduct.copertina = base64String.split(',')[1]; 
      };
      reader.readAsDataURL(file);
    }
  }

  addProduct() {
    // Verifichiamo che i campi fondamentali ci siano
    if (!this.newProduct.titolo || !this.newProduct.copertina) {
      alert("Manca il titolo o l'immagine!");
      return;
    }

    // Assicuriamoci che i numeri siano davvero numeri e non stringhe
    const payload = {
      ...this.newProduct,
      prezzo: Number(this.newProduct.prezzo),
      idAutore: Number(this.newProduct.idAutore),
      idCasaEditrice: Number(this.newProduct.idCasaEditrice),
      quantitaDisponibile: Number(this.newProduct.quantitaDisponibile)
    };

    this.adminService.addProduct(payload).subscribe({
      next: (res) => {
        alert('PRODOTTO AGGIUNTO! Ora è visibile nella pagina Prodotti per tutti i clienti.');
        this.resetForm();
      },
      error: (err) => {
        console.error('ERRORE 400 - Dettagli:', err);
        alert('Errore 400: Controlla che gli ID (Autore, Casa Editrice, Categoria) siano numeri validi ed esistenti nel database.');
      }
    });
  }

  resetForm() {
    this.newProduct = {
      titolo: '', descrizione: '', copertina: '', prezzo: 0,
      dataPubblicazione: new Date().toISOString().split('T')[0],
      quantitaDisponibile: 10, idAutore: 1, idCasaEditrice: 1, idCategorie: [1]
    };
    const fileInput = document.getElementById('img') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  }
}