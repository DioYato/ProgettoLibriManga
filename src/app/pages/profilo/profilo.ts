import { Component, computed, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { first } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { UsersService } from '../../services/users.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-profilo',
  imports: [ReactiveFormsModule],
  templateUrl: './profilo.html',
  styleUrl: './profilo.css'
})
export class Profilo implements OnInit {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private users = inject(UsersService);
  private router = inject(Router);

  welcomeMessage = computed(() => this.auth.user() ? `Ciao ${this.auth.user()!.nome}` : '');

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
      this.form.patchValue(user);
    }
  }

  getProfileImage() {
    const photo = this.auth.user()?.immagineProfilo;
    if (photo && photo !== 'default-avatar.png') {
      return `http://localhost:8080/images/${photo}`;
    }
    return 'https://cdn-icons-png.flaticon.com/512/149/149071.png';
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    const currentUser = this.auth.user();

    if (file && currentUser) {
      this.users.addImage(currentUser.id, file)
        .subscribe({
          next: () => {
            alert("Foto aggiornata con successo!");
            this.users.getById(currentUser.id).subscribe((updatedUser: User) => {
              this.auth.user.set(updatedUser);
              localStorage.setItem('user', JSON.stringify(updatedUser));
            });
          },
          error: (err: { error?: { msg?: string } }) => {
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
    if (!updateData.password) delete (updateData as Partial<typeof updateData>).password;

    this.users.update(currentUser.id, updateData)
      .pipe(first())
      .subscribe({
        next: () => alert("Dati aggiornati con successo!"),
        error: (err: { error?: { msg?: string } }) => alert('Errore durante il salvataggio')
      });
  }

  eliminaAccount() {
    const currentUser = this.auth.user();
    if (!currentUser) return;

    const conferma = confirm("Sei sicuro di voler eliminare il tuo account? Questa azione è irreversibile e verrai disconnesso.");

    if (conferma) {
      this.users.delete(currentUser.id).subscribe({
        next: () => {
          alert("Account eliminato correttamente.");
          localStorage.removeItem('user');
          localStorage.removeItem('token');
          this.router.navigate(['/login']).then(() => {
            window.location.reload();
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