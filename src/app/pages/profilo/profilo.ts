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
    if (photo && photo !== 'default-avatar.png') {
      // Assicurati che l'URL punti alla cartella del tuo backend
      return `http://localhost:8080/uploads/${photo}`;
    }
    // Immagine di default se l'utente non ne ha una
    return 'https://cdn-icons-png.flaticon.com/512/149/149071.png';
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    const currentUser = this.auth.getCurrentUser();

    if (file && currentUser) {
      this.users.addImage(currentUser.id, file)
        .subscribe({
          next: (res: any) => {
            alert("Foto aggiornata!");
            // Ricarica i dati utente aggiornati
            this.users.getById(currentUser.id).subscribe((updatedUser: any) => {
              this.userSignal.set(updatedUser);
              if (isPlatformBrowser(this.platformId)) {
                localStorage.setItem('user', JSON.stringify(updatedUser));
              }
            });
          },
          error: (err: any) => {
            console.error(err);
            alert("Errore nel caricamento foto");
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