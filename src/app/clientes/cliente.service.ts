import { Injectable } from '@angular/core';
import { Cliente } from './cliente';
import { Observable, throwError } from 'rxjs';
import { HttpClient, HttpEvent, HttpHeaders, HttpRequest } from '@angular/common/http';
import { map, catchError, tap } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { Region } from './region';


@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  private urlEndpoint: string = 'http://localhost:8080/api/clientes';
  private httpHeaders: HttpHeaders = new HttpHeaders({'Content-Type': 'application/json'});
  public errores: string[];

  getErrores(): string[] {
    return this.errores;
  }

  constructor( private httpClient: HttpClient,
               private router: Router ) { }

  private isNoAutorizado(e): boolean {
    if (e.status == 401 || e.status == 403) {
      this.router.navigate(['/login']);
      return true;
    }

    return false;
  }

  getRegiones(): Observable<Region[]> {
    return this.httpClient.get<Region[]>( this.urlEndpoint + '/regiones' )
      .pipe(
        catchError( e => {
          this.isNoAutorizado(e);
          throw new Error(e);
        })
      );
  }

  getClientes(): Observable<Cliente[]> { 
    return this.httpClient.get( this.urlEndpoint)
      .pipe(
        tap( response => {
          let clientes = response as Cliente[];
          console.log('------------------\nTAP1\n------------------');
          clientes.forEach( cliente=>{
            console.log(cliente.nombre);
            
          })
          
        }),
        map ( resp => {
          let clientes = resp as Cliente[];
          return clientes.map( cliente => {
            cliente.nombre = cliente.nombre.toLocaleUpperCase();
            //cliente.createAt = formatDate(cliente.createAt, 'dd-MMM-yyyy', 'en-US');

            let datePipe = new DatePipe('es')
            //cliente.createAt = datePipe.transform(cliente.createAt, 'EEEE, dd/MMMM/yyyy');
            return cliente;
          })
        }),
        // aquí el objeto ya es de tipo Cliente
        tap( response => {
          console.log('------------------\nTAP2\n------------------');
          response.forEach( cliente=>{
            console.log(cliente.nombre);
            
          })
        })
      )
  }

  getClientesPaginado(page: number): Observable<any> { 
    return this.httpClient.get(`${this.urlEndpoint}/page/${ page }`)
      .pipe(
        tap( (response: any) => {
          // Recoge sólo la parte "content" del json de respuesta
          console.log('------------------\nTAP1\n------------------');
          (response.content as Cliente[]).forEach( cliente=> { 
            console.log(cliente.nombre);
          })
          
        }),
        map ( (resp: any) => {
          ( resp.content as Cliente[] ).map( cliente => {
            cliente.nombre = cliente.nombre.toLocaleUpperCase();
            return cliente;
          });
          return resp;
        }),
        tap( response => {
          console.log('------------------\nTAP2\n------------------');
          (response.content as Cliente[]).forEach( cliente=>{
            console.log(cliente.nombre);
          })
        })
      )
  }


  create ( cliente: Cliente ): Observable<Cliente> {
    console.log('Create:', cliente.email);
    
    return this.httpClient.post(this.urlEndpoint, cliente, {headers: this.httpHeaders}).pipe( 
        map( (response: any) => response.cliente as Cliente ),
        catchError( e => {

          if (this.isNoAutorizado(e)) {
            throw new Error(e);
          }

          if (e.status == 400) {
            this.errores = e.error.errors as string[];
            throw new Error(e);
          }

          //Swal.fire(e.error.mensaje, e.error.error, 'error');
          Swal.fire('No se ha podido crear el usuario', e.error.mensaje + ': ' + e.error.error, 'error');
          throw new Error(e);
        })
      );
  }

  getCliente(id: number): Observable<Cliente> {
    console.log('getCliente:', id);
    return this.httpClient.get<Cliente>(`${this.urlEndpoint}/${id}`)
      .pipe(
        tap( response => console.log('response: ', response) ),
        map( (response: any) => response as Cliente ),
        catchError( e => {
          if (this.isNoAutorizado(e)) {
            throw new Error(e);
          }
          this.router.navigate(['/clientes']);
          Swal.fire('Error al editar', e.error.mensaje, 'error');
          return throwError( () => e );
        })
      );
  }

  update(cliente: Cliente): Observable<any> {
    console.log('Update:', cliente.email);
    return this.httpClient.put<any>(`${this.urlEndpoint}/${cliente.id}`, cliente, {headers: this.httpHeaders})
      .pipe(
        catchError( e => {

          if (this.isNoAutorizado(e)) {
            throw new Error(e);
          }

          if (e.status == 400) {
            this.errores = e.error.errors as string[];
            console.error('Código de error del backend', e.status);
            console.error(e.error.errors);
            throw new Error(e);
          }

          Swal.fire('No se ha podido actualizar el usuario', e.error.mensaje + ': ' + e.error.error, 'error');
          throw new Error(e);
        })
      );
  }

  delete(id: number): Observable<Cliente> {
    return this.httpClient.delete<Cliente>(`${this.urlEndpoint}/${id}`, {headers: this.httpHeaders})
    .pipe(
      catchError( e => {

        if (this.isNoAutorizado(e)) {
          throw new Error(e);
        } 

        //this.router.navigate(['/clientes']);
        Swal.fire(e.error.mensaje, e.error.error, 'error');
        return throwError( () => e );
      })
    );
  }

  subirFoto(archivo: File, id): Observable<HttpEvent<{}>> {
    let  formData = new FormData();

    formData.append("archivo", archivo);
    formData.append("id", id);
    
    const req = new HttpRequest('POST', `${this.urlEndpoint}/upload`, formData, {
      reportProgress: true
    })

    //Forma 1
    // return this.httpClient.post(`${this.urlEndpoint}/upload`, formData)
    //   .pipe(
    //     map( (response:any) => response.cliente as Cliente),
    //     catchError( e => {
    //       //this.router.navigate(['/clientes']);
    //       Swal.fire(e.error.mensaje, e.error.error, 'error');
    //       return throwError( () => e );
    //     })
    //   );

    //Forma 2 con reportProgress
    return this.httpClient.request(req).pipe(
      catchError( e => {
        this.isNoAutorizado(e);
        throw new Error(e);
      })
    );

  }

}
