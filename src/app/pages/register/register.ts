import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../../app/data/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {

  private auth = inject(AuthService);

  form = new FormGroup({
    nome: new FormControl('', Validators.required),
    cognome: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', Validators.required),
    confermaPassword: new FormControl('', Validators.required),
  });

  onSubmit() {
    if (this.form.invalid) {
      alert('Compila tutti i campi');
      return;
    }

    if (this.form.value.password !== this.form.value.confermaPassword) {
      alert('Le password non coincidono');
      return;
    }

    const payload = {
      nome: this.form.value.nome!,
      cognome: this.form.value.cognome!,
      email: this.form.value.email!,
      password: this.form.value.password!
    };

    this.auth.register(payload).subscribe({
      next: () => alert('Registrazione completata'),
      error: (err) => alert('Errore: ' + err.message)
    });
  }
}
