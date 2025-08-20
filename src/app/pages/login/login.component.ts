import { Component } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http'; // <-- Agrega esto
import { Api } from '../../services/api';

@Component({
  selector: 'app-login',
  imports: [RouterModule, FormsModule, HttpClientModule], // <-- Agrega HttpClientModule aquí
  providers: [Api, Router],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class Login {
  gmail: string = '';
  contrasena: string = '';
  constructor(private apiService: Api, private router:Router) {}

  loginUsuario() {
    const login = { gmail: this.gmail, contraseña: this.contrasena };
    console.log(login);
    
    this.apiService.loginUsuario(login).subscribe({
      next: (data:any) => {
        console.log('Login exitoso', data);
        sessionStorage.setItem('authToken', data.token);
        sessionStorage.setItem('user', data.user);
        // Redirigir al dashboard o a la página deseada
        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        console.error('Error al iniciar sesión', error);
      }
    });
  }
}
