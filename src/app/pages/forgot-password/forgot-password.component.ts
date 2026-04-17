import { Component, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css'
})
export class ForgotPasswordComponent {

  email: string = ''
  private http = inject(HttpClient);

  sendReset() {
    if (!this.email) {
      alert("Inserisci un'email valida");
      return;
    }

    this.http.post('http://localhost:8080/utenti/reset-password', {
      email: this.email
    }).subscribe({
      next: () => alert("Email inviata! Controlla la tua casella."),
      error: () => alert("Errore: impossibile inviare la richiesta.")
    });
  }
}
