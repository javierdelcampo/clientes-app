import { Component, OnInit, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { Cliente } from './cliente';
import { ClienteService } from './cliente.service';
import { ActivatedRoute } from '@angular/router';
import { ModalService } from './detalle/modal.service';


@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html'
})
export class ClientesComponent implements OnInit {

  clientes: Cliente[];
  paginador: any;
  clienteSeleccionado: Cliente;

  constructor( private clienteService: ClienteService,
               private activatedRoute: ActivatedRoute,
               private modalService: ModalService ) { }

  ngOnInit(): void {
    this.activatedRoute.paramMap
      .subscribe ( params => {
        let pagina = +params.get('pagina'); // combierte a number

        if (!pagina) {
          pagina = 0;
        }

        this.clienteService.getClientesPaginado(pagina)
          .pipe(
            tap( ( response: any ) => {
              console.log('------------------\nTAP3\n------------------');
              (response.content as Cliente[]).forEach( cliente => {
                console.log(cliente.nombre);
              })
            }
          ))
          .subscribe (
            response => { 
              this.clientes = response.content;
              this.paginador = response;
            }
          );
        }
      )

      this.modalService.notificarUpload.subscribe( cliente => {
        this.clientes = this.clientes.map(clienteOriginal => {
          if (cliente.id === clienteOriginal.id) {
            clienteOriginal.foto = cliente.foto;
          }
          return clienteOriginal;
        })
      })
  }

  delete(cliente: Cliente):void {
    Swal.fire({
      title: '¿Está seguro?',
      text: `Los datos del cliente ${cliente.nombre} ${cliente.apellidos} se borrarán y no se podrán recuperar`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, borrar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.clienteService.delete(cliente.id)
          .subscribe (resp => {
            this.clientes = this.clientes.filter( cli => cli !== cliente )
            Swal.fire(
              '¡Borrado!',
              `El cliente ${cliente.nombre} ha sido borrado.`,
              'success'
            )
          })
      }
    })
  }

  abrirModal(cliente: Cliente) {
    this.clienteSeleccionado = cliente;
    this.modalService.abrirModal();
  }

}
