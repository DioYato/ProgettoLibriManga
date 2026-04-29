import { Component, computed, inject, OnInit, PLATFORM_ID, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router'; // <--- Importa il Router
import { first } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { UsersService } from '../../services/users.service';

@Component({
  selector: 'app-profilo',
  standalone: true, // Assicurati che sia standalone se usi gli imports
  imports: [ReactiveFormsModule],
  templateUrl: './profilo.html',
  styleUrl: './profilo.css'
})
export class Profilo implements OnInit {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private users = inject(UsersService);
  private platformId = inject(PLATFORM_ID);
  private router = inject(Router); // <--- Inject del Router

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

  getProfileImage() {
    const photo = this.userSignal()?.immagineProfilo;
    if (photo && photo !== 'default-avatar.png') {
      return `http://localhost:8080/images/${photo}`;
    }
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
            this.users.getById(currentUser.id).subscribe((updatedUser: any) => {
              this.userSignal.set(updatedUser);
              localStorage.setItem('user', JSON.stringify(updatedUser));
            });
          },
          error: (err: any) => {
            console.error("Dettaglio errore:", err);
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

  // --- NUOVA FUNZIONE ELIMINA ACCOUNT ---
  eliminaAccount() {
    const currentUser = this.auth.user();
    if (!currentUser) return;

    // Chiedi conferma all'utente
    const conferma = confirm("Sei sicuro di voler eliminare il tuo account? Questa azione è irreversibile e verrai disconnesso.");

    if (conferma) {
      this.users.delete(currentUser.id).subscribe({
        next: () => {
          alert("Account eliminato correttamente.");
          
          // Esegui il logout (pulisci localStorage e stato)
          // Nota: Assicurati che il tuo AuthService abbia un metodo logout()
          // Altrimenti puoi farlo manualmente:
          localStorage.removeItem('user');
          localStorage.removeItem('token'); // Se lo usi
          
          // Reindirizza l'utente alla home o al login
          this.router.navigate(['/login']).then(() => {
            window.location.reload(); // Opzionale: forza il refresh per resettare tutti i signal
          });
        },
        error: (err) => {
          console.error(err);
          alert("Errore durante l'eliminazione dell'account.");
        }
      });
    }
  }
}