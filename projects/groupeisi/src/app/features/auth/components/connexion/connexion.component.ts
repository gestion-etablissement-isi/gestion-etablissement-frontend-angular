// connexion.component.ts
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { User } from '../../models/user.model';
import { ConnexionService } from '../../services/connexion.service';

@Component({
    selector: 'app-connexion',
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './connexion.component.html',
    styleUrls: ['./connexion.component.scss']
})
export class ConnexionComponent implements OnInit {
  private readonly service = inject(ConnexionService);
  loginForm!: FormGroup;
  submitted = false;
  

  constructor(
    private formBuilder: FormBuilder,
    private router: Router
    ) {}

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  get f() { return this.loginForm.controls; }

  onSubmit() {
    this.submitted = true;

    if (this.loginForm.invalid) {
      return;
    }

    // Envoi du formulaire à l'API
    console.log('SUCCESS', this.loginForm.value);
  }

  navigateToInscription() {
    this.router.navigateByUrl('/inscription');
  }
}