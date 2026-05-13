import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { RouterLink } from '@angular/router';


@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink],
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

  // LOGIN SEMPLICE SENZA TOKEN
  onLoginSubmit() {
    if (this.loginForm.invalid) {
      alert('Inserisci email e password');
      return;
    }

    const payload = {
      email: this.loginForm.value.email!,
      password: this.loginForm.value.password!
    };

    this.auth.login(payload).subscribe({
      next: () => {
        alert('Login effettuato');
        this.router.navigate(['/']);
      },
      error: () => alert('Credenziali errate')
    });
  }

  // REGISTRAZIONE
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
      password: this.registerForm.value.password!,
      ruolo: 'USER',
    };

    this.auth.register(payload).subscribe({
      next: () => {
        alert('Registrazione completata');
        this.switchMode('login');
      },
      error: (err: { message?: string }) => alert('Errore: ' + (err?.message || 'impossibile registrare'))
    });
  }

  close() {
    this.router.navigate(['/']);
  }
}
