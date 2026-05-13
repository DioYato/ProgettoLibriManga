import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { first } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { UsersService } from '../../services/users.service';
import { User } from '../../models/user.model';

type NotificaTipo = 'success' | 'error' | 'info';

interface Notifica {
  messaggio: string;
  tipo: NotificaTipo;
  visible: boolean;
}

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

  notifica = signal<Notifica | null>(null);
  private notificaTimer: ReturnType<typeof setTimeout> | null = null;

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

  private mostraNotifica(messaggio: string, tipo: NotificaTipo = 'success', durata = 4000) {
    if (this.notificaTimer) clearTimeout(this.notificaTimer);

    this.notifica.set({ messaggio, tipo, visible: true });

    this.notificaTimer = setTimeout(() => {
      this.chiudiNotifica();
    }, durata);
  }

  chiudiNotifica() {
    const current = this.notifica();
    if (current) {
      this.notifica.set({ ...current, visible: false });
      setTimeout(() => this.notifica.set(null), 300);
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
            this.mostraNotifica('Foto aggiornata con successo!');
            this.users.getById(currentUser.id).subscribe((updatedUser: User) => {
              this.auth.user.set(updatedUser);
              localStorage.setItem('user', JSON.stringify(updatedUser));
            });
          },
          error: (err: { error?: { msg?: string } }) => {
            const msg = err.error?.msg || 'Errore del server';
            this.mostraNotifica('Errore nel caricamento: ' + msg, 'error');
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
        next: () => this.mostraNotifica('Dati aggiornati con successo!'),
        error: () => this.mostraNotifica('Errore durante il salvataggio.', 'error')
      });
  }

eliminaAccount() {
  const currentUser = this.auth.user();
  if (!currentUser) return;

  this.mostraNotifica('Clicca di nuovo per confermare l\'eliminazione dell\'account.', 'info', 6000);

  const handler = () => {
    document.removeEventListener('click', handler);
    this.users.delete(currentUser.id).subscribe({
      next: () => {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        this.router.navigate(['/login']).then(() => window.location.reload());
      },
      error: (err) => {
        console.error(err);
        this.mostraNotifica("Errore durante l'eliminazione dell'account.", 'error');
      }
    });
  };

  setTimeout(() => document.addEventListener('click', handler, { once: true }), 100);
}

}