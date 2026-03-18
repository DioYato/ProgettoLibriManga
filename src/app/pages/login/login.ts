import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../../app/data/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {

  private auth = inject(AuthService);
  private router = inject(Router);

  form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', Validators.required)
  });

  onSubmit() {
    if (this.form.invalid) {
      alert('Inserisci email e password');
      return;
    }

    const payload = {
      email: this.form.value.email!,
      password: this.form.value.password!
    };

    this.auth.login(payload).subscribe({
      next: (res: any) => {
        // Se il backend ritorna un token:
        if (res.token) {
          localStorage.setItem('token', res.token);
        }

        alert('Login effettuato');
        this.router.navigate(['/']);
      },
      error: (err) => alert('Credenziali errate')
    });
  }
}
