import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { NgIf } from '@angular/common';
import { AuthService } from '../../app/data/auth.service';
import { Home } from '../home/home';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf, Home],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private auth = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  mode: 'login' | 'register' = 'login';

  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', Validators.required)
  });

  registerForm = new FormGroup({
    nome: new FormControl('', Validators.required),
    cognome: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', Validators.required),
    confermaPassword: new FormControl('', Validators.required)
  });

  constructor() {
    const dataMode = this.route.snapshot.data?.['mode'];
    if (dataMode === 'register') {
      this.mode = 'register';
    }
  }

  switchMode(newMode: 'login' | 'register') {
    this.mode = newMode;
    if (newMode === 'login') {
      this.router.navigate(['/login']);
    } else {
      this.router.navigate(['/register']);
    }
  }

  onLoginSubmit() {
    if (this.loginForm.invalid) {
      alert('Inserisci email e password');
      return;
    }

    const payload = {
      email: this.loginForm.value.email!,
      password: this.loginForm.value.password!
    };

    // TODO: domani il backend deve restituire un oggetto login con token + utente.
    // Qui puoi poi salvare uno user context in un service giusto per tenere l'utente loggato.
    this.auth.login(payload).subscribe({
      next: (res: any) => {
        if (res.token) {
          localStorage.setItem('token', res.token);
        }

        alert('Login effettuato');
        this.router.navigate(['/']);
      },
      error: () => alert('Credenziali errate')
    });
  }

  onRegisterSubmit() {
    if (this.registerForm.invalid) {
      alert('Compila tutti i campi');
      return;
    }

    if (this.registerForm.value.password !== this.registerForm.value.confermaPassword) {
      alert('Le password non coincidono');
      return;
    }

    const payload = {
      nome: this.registerForm.value.nome!,
      cognome: this.registerForm.value.cognome!,
      email: this.registerForm.value.email!,
      password: this.registerForm.value.password!
    };

    // TODO: qui si chiama /api/users/create, poi si può navigare su /login.
    // In futuro: mostra feedback più dettagliati degli errori (es. email già usata).

    this.auth.register(payload).subscribe({
      next: () => {
        alert('Registrazione completata');
        this.switchMode('login');
      },
      error: (err: any) => alert('Errore: ' + (err?.message || 'impossibile registrare'))
    });
  }

  close() {
    this.router.navigate(['/']);
  }
}

