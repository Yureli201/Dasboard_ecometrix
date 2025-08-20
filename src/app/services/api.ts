import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders  } from '@angular/common/http';
import { Usuario } from './models/modelos';

@Injectable({
  providedIn: 'root'
})
export class Api {

  URL_AUTH = `https://api-ecometrix.onrender.com/api/auth/`
  URL_USER = `https://api-ecometrix.onrender.com/api/user/`
  URL_DATA = `https://api-ecometrix.onrender.com/api/data/`
  URL_FOOTPRINT = `https://api-ecometrix.onrender.com/api/huella/`
  URL_PRED = `https://api-ecometrix.onrender.com/api/prediction/`

  constructor(private http: HttpClient) { }

  //header
    private getHeaders(): HttpHeaders {
    const token = sessionStorage.getItem('authToken');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  // Autenticación
  registrarUsuario(usuario:Usuario){
    return this.http.post(`${this.URL_AUTH}register`, usuario)
  }
  loginUsuario(login:any){
    return this.http.post(`${this.URL_AUTH}login`, login)
  }

  //Actividades
  obtenerActividades(id_usuario: number, mes: number, año: number) {
    return this.http.get(`${this.URL_DATA}actividad/${id_usuario}/month/${mes}/age/${año}`)
  }
  agregarActividad(id_usuario:number, actividad:any){
    return this.http.post(`${this.URL_DATA}actividad/${id_usuario}`, actividad)
  }
  eliminarActividad(id_actividad:number){
    return this.http.delete(`${this.URL_DATA}actividad/${id_actividad}`)
  }

/*
  obtenerUsuario() {
    const headers = this.getHeaders();
    return this.http.get(`${this.URL_USER}profile`, { headers });
  }*/
}
