import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../../data/auth.service';
import { UsersService } from '../../data/users.service';

@Component({
  selector: 'app-profilo',
  imports: [ReactiveFormsModule,],
  templateUrl: './profilo.html',
  styleUrl: './profilo.css'
})
export class Profilo {

  auth = inject(AuthService);
  users = inject(UsersService)

  form = new FormGroup({
    nome: new FormControl('', Validators.required),
    cognome: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('')
  });

  private isBrowser(): boolean {
    return typeof window !== 'undefined';
  }

  ngOnInit() {
    if (!this.isBrowser()) {
      return;
    }

    const user = JSON.parse(localStorage.getItem('user')!);
    if (user) {
      this.form.patchValue({
        nome: user.nome,
        cognome: user.cognome,
        email: user.email
      });
    }
  }

  salva() {
    if (this.form.invalid) {
      alert("Compila correttamente i campi");
      return;
    }

    if (!this.isBrowser()) {
      alert('Impossibile salvare dal server.');
      return;
    }

    const stored = localStorage.getItem('user');
    if (!stored) {
      alert('Utente non trovato.');
      return;
    }

    const user = JSON.parse(stored);

    this.users.update(user.id, this.form.value).subscribe({
      next: () => {
        alert("Dati aggiornati");
      },
      error: (err: any) => alert('Errore: ' + (err?.message || 'impossibile registrare'))
    });
  }
}
