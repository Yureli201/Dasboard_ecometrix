import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Usuario, Login } from './models/modelos';

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

  // Autenticación
  registrarUsuario(usuario:Usuario){
    return this.http.post(`${this.URL_AUTH}register`, usuario);
  }
  loginUsuario(login:Login){
    return this.http.post(`${this.URL_AUTH}login`, login);
  }


  /*Usuarios
  obtenerUsuarios(){
    return this.http.get(`${this.URL_USER}profile`);
  }*/

}
