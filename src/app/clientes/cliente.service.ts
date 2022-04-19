import { Injectable } from '@angular/core';
import { Cliente } from './cliente';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  private urlEndpoint: string = 'http://localhost:8080/api/clientes';

  private httpHeaders: HttpHeaders = new HttpHeaders({'Content-Type': 'application/json'});


  constructor( private httpClient: HttpClient ) { }

  getClientes(): Observable<Cliente[]> { 
    return this.httpClient.get( this.urlEndpoint)
      .pipe(
        map ( resp => resp as Cliente[])
        // function(resp) { return resp as Cliente[] }
      );
  }


  create ( cliente: Cliente ): Observable<Cliente> {
    return this.httpClient.post<Cliente>(this.urlEndpoint, cliente, {headers: this.httpHeaders});
  }

  getCliente(id: number): Observable<Cliente> {
    return this.httpClient.get<Cliente>(`${this.urlEndpoint}/${id}`);
  }

  update(cliente: Cliente): Observable<Cliente> {
    return this.httpClient.put<Cliente>(`${this.urlEndpoint}/${cliente.id}`, cliente, {headers: this.httpHeaders});
  }

}
