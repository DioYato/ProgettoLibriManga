import { Component, computed, inject, OnInit, PLATFORM_ID, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { first } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { UsersService } from '../../services/users.service';

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

  userSignal = signal<any>(null);
  welcomeMessage = computed(() => this.userSignal() ? `Ciao ${this.userSignal().nome}` : '');

  form = this.fb.nonNullable.group({
    nome: ['', Validators.required],
    cognome: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['']
  });

  ngOnInit() {
    this.loadUserData();
  }

  private loadUserData() {
    const user = this.auth.user();
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
      // Assicurati che l'URL punti alla cartella del tuo backend
      return `http://localhost:8080/images/${photo}`;
    }
    // Immagine di default se l'utente non ne ha una
    return 'https://cdn-icons-png.flaticon.com/512/149/149071.png';
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    const currentUser = this.auth.user();

    if (file && currentUser) {
      this.users.addImage(currentUser.id, file)
        .subscribe({
          next: (res: any) => {
            alert("Foto aggiornata con successo!");
            // Ricarichiamo i dati utente aggiornati per vedere la nuova immagine
            this.users.getById(currentUser.id).subscribe((updatedUser: any) => {
              this.userSignal.set(updatedUser);
              localStorage.setItem('user', JSON.stringify(updatedUser));
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
    if (this.form.invalid) return;
    const currentUser = this.auth.user();
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