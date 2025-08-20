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



}
