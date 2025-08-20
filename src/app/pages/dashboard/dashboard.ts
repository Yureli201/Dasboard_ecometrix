import { Component } from '@angular/core';
import { NavbarUser } from '../../components/navbar-user/navbar-user';
import { TipoFuente } from '../../services/models/modelos';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http'; // <-- Agrega esto
import { Api } from '../../services/api';

@Component({
  selector: 'app-dashboard',
  imports: [ NavbarUser,RouterModule, FormsModule, HttpClientModule ], // <-- Agrega HttpClientModule aquí
  providers: [Api, Router],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard {
  recursos: TipoFuente[] = [
  { id: 1, nombre: "Electricidad CFE", unidad: "kWh" },
  { id: 2, nombre: "Gasolina Magna/Diesel", unidad: "litro" },
  { id: 4, nombre: "Gas Natural", unidad: "m³" },
  { id: 5, nombre: "GLP", unidad: "kg" },
  { id: 6, nombre: "Residuos Sólidos", unidad: "kg" },
  { id: 7, nombre: "Transporte Aéreo", unidad: "km" },
  { id: 8, nombre: "Agua Potable", unidad: "litros" },
  ];
      // Declara las propiedades necesarias
    user: number = 0;
    mes: number = 0;
    año: number = 0;

    actividades: any[] = []
    resume:any[]=[]

    nuevaActividad:any={}

    // RouterModule no se inyecta, solo Router
    constructor(private router: Router, private api: Api) { }

    ngOnInit(){
      this.actualizarDatos();
    }

    actualizarDatos(){
      this.obtenerFecha();
      const userStorage = sessionStorage.getItem('user');
      this.user = userStorage ? Number(userStorage) : 0;
      
      this.api.obtenerActividades(this.user, 1, this.año).subscribe({
        next: (data:any) => {
          this.actividades = data.data
          this.resume = data.resume
          this.mergeResumeIntoRecursos();
          console.log(this.actividades);
        },
        error: (error) =>{
          console.error(error);
        }
      })
    }

    obtenerFecha() {
      const fecha = new Date();
      this.mes = fecha.getMonth() + 1;  // Asigna a la propiedad de clase
      this.año = fecha.getFullYear();   // Asigna a la propiedad de clase
    }

    eliminarActividad(id:number){
      this.api.eliminarActividad(id).subscribe({
        next: (data:any) => {
          console.log(data);
          this.actualizarDatos(); // Actualiza los datos después de eliminar
        },
        error: (error) =>{
          console.error(error);
        }
      })
    }

    mergeResumeIntoRecursos() {
    this.recursos.forEach(recurso => {
      const match = this.resume.find(r => r.nombre_fuente === recurso.nombre);
      if (match) {
        recurso.total_cantidad = match.total_cantidad;
        recurso.total_costo = match.total_costo;
      } else {
        recurso.total_cantidad = 0;
        recurso.total_costo = 0;
      }
    });
  }

  guardarNuevaActividad(){
    this.nuevaActividad.id_tipo_fuente = Number(this.nuevaActividad.id_tipo_fuente);
    console.log(this.nuevaActividad);
    this.api.agregarActividad(this.user, this.nuevaActividad).subscribe({
      next:(data)=>{
        alert("Actividad registrada correctamente")
        this.actualizarDatos();
      },
      error:(error)=>{
        console.error(error)
      }

    })
  }
}
