import { Component } from '@angular/core';
import { Usuario } from '../../services/models/modelos';
import { Api } from '../../services/api';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { routes } from '../../app.routes';

@Component({
  selector: 'app-sign-up',
  imports: [RouterModule, FormsModule, HttpClientModule], // <-- Agrega HttpClientModule aquí
  providers: [Api, Router],

  templateUrl: './sign-up.html',
  styleUrl: './sign-up.css'
})
export class SignUp {
  openModal = false;
  estadosMexico: string[] = [ "Aguascalientes", "Baja California", "Baja California Sur", "Campeche", "Chiapas", "Chihuahua", "Ciudad de México", "Coahuila", "Colima", "Durango", "Estado de México", "Guanajuato", "Guerrero", "Hidalgo", "Jalisco", "Michoacán", "Morelos", "Nayarit", "Nuevo León", "Oaxaca", "Puebla", "Querétaro", "Quintana Roo", "San Luis Potosí", "Sinaloa", "Sonora", "Tabasco", "Tamaulipas", "Tlaxcala", "Veracruz", "Yucatán", "Zacatecas" ];
  sectores: string[] = [ "Manufactura", "Alimentos", "Textil", "Servicios", "Agricultura", "Construcción", "Energía (Electricidad)", "Transporte", "Minería", "Tecnología", "Salud", "Turismo", "Energías Renovables", "Biotecnología", "Economía Circular", "Acuicultura/Salmonicultura", "Finanzas Sostenibles", "Educación Digital", "Ciberseguridad", "Logística y Cadena Suministro", "Farmacéutico" ];

  nombre_empresa: string = ''
  gmail: string = ''
  contrasena: string = ''
  confirmar_contrasena: string = ''
  estado: string = ''
  sector: string = ''
  num_empleados: number = 0
  actividad_principal: string = ''
  acepta_terminos: boolean = false

  constructor(private router: Router,private apiService: Api) {}

  registrarUsuario(){
    if (!this.nombre_empresa || !this.gmail || !this.contrasena || !this.confirmar_contrasena || !this.estado || !this.sector || this.num_empleados <= 0 || !this.actividad_principal){
       alert('Favor de llenar todos los campos') 
       return
      }
    if (this.contrasena !== this.confirmar_contrasena){
      alert('Las contraseñas no coinciden')
      return
    }
    if (!this.acepta_terminos){
      alert('Debe aceptar los términos y condiciones')
      return
    }

    const usuario: any = {
      nombre_empresa: this.nombre_empresa,
      gmail: this.gmail,
      contraseña: this.contrasena,
      estado: this.estado,
      sector: this.sector,
      num_empleados: this.num_empleados,
      actividad_principal: this.actividad_principal,
    };

    console.log('Datos del usuario:', usuario);

    this.apiService.registrarUsuario(usuario).subscribe({
      next: (response:any) => {
        console.log('Registro exitoso:', response);
        alert('Registro exitoso, por favor inicia sesión');
        setTimeout(()=> {this.router.navigate(['/login'])},1000)
      },
      error: (error) => {
        console.error('Error en el registro:', error);
        alert('Error en el registro, por favor intente nuevamente');
      }
    });
  }


}
