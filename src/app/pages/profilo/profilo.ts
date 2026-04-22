import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { UsersService } from '../../services/users.service';

@Component({
  selector: 'app-profilo',
  imports: [ReactiveFormsModule],
  templateUrl: './profilo.html',
  styleUrl: './profilo.css'
})
export class Profilo {

  auth = inject(AuthService);
  users = inject(UsersService);

  welcomeMessage = '';

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
    if (!this.isBrowser()) return;

    // Recupero utente dal tuo AuthService (più pulito)
    const user = this.auth.getCurrentUser();

    if (user) {
      // Messaggio di benvenuto
      this.welcomeMessage = `Ciao ${user.nome}!`;

      // Precompila il form
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

    const user = this.auth.getCurrentUser();
    if (!user) {
      alert('Utente non trovato.');
      return;
    }

    this.users.update(user.id, this.form.value).subscribe({
      next: () => {
        alert("Dati aggiornati");
      },
      error: (err: any) => alert('Errore: ' + (err?.message || 'impossibile registrare'))
    });
  }
}
