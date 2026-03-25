import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../../data/auth.service';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-profilo',
  standalone: true,
  imports: [ReactiveFormsModule,],
  templateUrl: './profilo.html',
  styleUrl: './profilo.css'
})
export class Profilo {

  auth = inject(AuthService);

  form = new FormGroup({
    nome: new FormControl('', Validators.required),
    cognome: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('')
  });

  ngOnInit() {
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

    console.log("Dati aggiornati:", this.form.value);
    alert("Dati aggiornati (frontend)");
  }
}
