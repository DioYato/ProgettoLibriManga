import { Component, inject, OnInit, PLATFORM_ID, signal, computed } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import { UsersService } from '../../services/users.service';
import { first } from 'rxjs';

@Component({
  selector: 'app-profilo',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './profilo.html',
  styleUrl: './profilo.css'
})
export class Profilo implements OnInit {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private users = inject(UsersService);
  private platformId = inject(PLATFORM_ID);
  private http = inject(HttpClient);

  userSignal = signal<any>(null);
  welcomeMessage = computed(() => this.userSignal() ? `Ciao ${this.userSignal().nome}` : '');

  form = this.fb.nonNullable.group({
    nome: ['', Validators.required],
    cognome: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['']
  });

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.loadUserData();
    }
  }

  private loadUserData() {
    const user = this.auth.getCurrentUser();
    if (user) {
      this.userSignal.set(user);
      this.form.patchValue(user);
    }
  }

  // Costruisce l'URL dell'immagine prendendola dal backend
  getProfileImage() {
    const photo = this.userSignal()?.immagineProfilo;
    // Se la foto esiste e non è quella di default
    if (photo && photo !== 'default-avatar.png') {
<<<<<<< HEAD
      // Usiamo /images/ perché è il path definito nel buildUrl del tuo backend
      return `http://localhost:8080/images/${photo}`;
    }
    // Immagine di default
=======
      // Assicurati che l'URL punti alla cartella del tuo backend
      return `http://localhost:8080/images/${photo}`;
    }
    // Immagine di default se l'utente non ne ha una
>>>>>>> 5d0fbdbcdb758a08cbfff6b5ec84d2f2ece91647
    return 'https://cdn-icons-png.flaticon.com/512/149/149071.png';
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    const currentUser = this.auth.getCurrentUser();

    if (file && currentUser) {
<<<<<<< HEAD
      const formData = new FormData();
      formData.append('file', file);
      formData.append('id', currentUser.id.toString());
      
      formData.append('tipo', 'utente'); 

      this.http.post('http://localhost:8080/rest/upload/image', formData)
=======
      this.users.addImage(currentUser.id, file)
>>>>>>> 5d0fbdbcdb758a08cbfff6b5ec84d2f2ece91647
        .subscribe({
          next: (res: any) => {
            alert("Foto aggiornata con successo!");
            // Ricarichiamo i dati utente aggiornati per vedere la nuova immagine
            this.users.getById(currentUser.id).subscribe((updatedUser: any) => {
              this.userSignal.set(updatedUser);
              if (isPlatformBrowser(this.platformId)) {
                localStorage.setItem('user', JSON.stringify(updatedUser));
              }
            });
          },
          error: (err: any) => {
            console.error("Dettaglio errore:", err);
            // Mostriamo il messaggio d'errore specifico se presente
            const msg = err.error?.msg || "Errore del server";
            alert("Errore nel caricamento: " + msg);
          }
        });
    }
  }

  salva() {
    if (this.form.invalid || !isPlatformBrowser(this.platformId)) return;
    const currentUser = this.auth.getCurrentUser();
    if (!currentUser) return;

    const updateData = { ...this.form.getRawValue() };
    if (!updateData.password) delete (updateData as any).password;

    this.users.update(currentUser.id, updateData)
      .pipe(first())
      .subscribe({
        next: () => alert("Dati aggiornati con successo!"),
        error: (err: any) => alert('Errore durante il salvataggio')
      });
  }
}