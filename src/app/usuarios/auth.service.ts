import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Usuario } from './usuario';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private _usuario: Usuario;
  private _token: string;

  constructor( private httpCliente: HttpClient) { }

  public get usuario(): Usuario {
    if (  this._usuario != null ) {
      return this._usuario;
    } else if (this._usuario == null && sessionStorage.getItem('usuario') != null ) { 
      this._usuario = JSON.parse(sessionStorage.getItem('usuario')) as Usuario;
      return this._usuario;
    }

    return new Usuario();
    
  }

  public get token(): string {
    if (  this._token != null ) {
      return this._token;
    } else if (this._token == null && sessionStorage.getItem('token') != null ) { 
      this._token = JSON.parse(sessionStorage.getItem('token')) as string;
      return this._token;
    }

    return null;
  }

  login( usuario: Usuario ): Observable<any> {
    
    const urlEndpoint: string = 'http://localhost:8080/oauth/token';
    
    const credenciales = btoa('angularapp' + ':' + '12345');
    
    const httpHeaders = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded', 
      'Authorization': 'Basic ' + credenciales
    });

    let params = new URLSearchParams();
    params.set('grant_type', 'password');
    params.set('username', usuario.username);
    params.set('password', usuario.password);

    console.log(params.toString());
    
    return this.httpCliente.post<any>(urlEndpoint, params.toString(), { headers: httpHeaders});
  }

  guardarUsuario(accessToken: string) {

    let payload = this.obtenerDatosToken(accessToken);

    this._usuario = new Usuario();
    this._usuario.nombre = payload.nombre;
    this._usuario.apellidos = payload.apellidos;
    this._usuario.username = payload.user_name;
    this._usuario.roles = payload.authorities;

    sessionStorage.setItem('usuario', JSON.stringify(this._usuario));

  }

  guardarToken(accessToken: string) {
    this._token = accessToken;

    sessionStorage.setItem('token', JSON.stringify(this._token));

  }

  obtenerDatosToken (accessToken: string): any {

    if (accessToken != null) { 
      return JSON.parse(atob(accessToken.split('.')[1]));
    }

    return null;

  }

  isAuthenticated(): boolean {
    let payload = this.obtenerDatosToken(this.token);
    if ( payload != null && payload.user_name && payload.user_name.length > 0 ) {
      return true;
    }

    return false;
  }

}
