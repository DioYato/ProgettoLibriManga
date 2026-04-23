import { Component, inject, OnInit, PLATFORM_ID, signal, computed } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { UsersService } from '../../services/users.service';
import { first } from 'rxjs';

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
  private platformId = inject(PLATFORM_ID);

  // Signal per gestire lo stato dell'utente in modo reattivo
  userSignal = signal<any>(null);
  welcomeMessage = computed(() => this.userSignal() ? `Ciao ${this.userSignal().nome}` : '');

  // Form fortemente tipizzato usando FormBuilder
  form = this.fb.nonNullable.group({
    nome: ['', Validators.required],
    cognome: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['']
  });

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.loadUserData();
    }
  }

  private loadUserData() {
    const user = this.auth.getCurrentUser();
    if (user) {
      this.userSignal.set(user);
      // patchValue è sicuro con nonNullable
      this.form.patchValue(user);
    }
  }

  salva() {
    if (this.form.invalid || !isPlatformBrowser(this.platformId)) return;

    const currentUser = this.auth.getCurrentUser();
    if (!currentUser) return;

    // Estraiamo i dati dal form (senza password se vuota)
    const updateData = { ...this.form.getRawValue() };
    if (!updateData.password) delete (updateData as any).password;

    this.users.update(currentUser.id, updateData)
      .pipe(first()) 
      .subscribe({
        next: () => alert("Dati aggiornati con successo!"),
        error: (err) => {
          console.error(err);
          alert('Errore durante il salvataggio');
        }
      });
  }
}