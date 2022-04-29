import { Component, OnInit, Input } from '@angular/core';
import { Cliente } from '../cliente';
import { ClienteService } from '../cliente.service';
import Swal from 'sweetalert2';
import { HttpEventType } from '@angular/common/http';
import { Mensaje } from '../interfaces/mensaje.interface'
import { ModalService } from './modal.service';

@Component({
  selector: 'app-detalle-cliente',
  templateUrl: './detalle.component.html',
  styleUrls: ['./detalle.component.css'],
  styles: [
  ]
})
export class DetalleComponent implements OnInit {

  @Input() cliente: Cliente;
  titulo: string = 'Detalle del cliente';
  private fotoSeleccionada: File;
  progreso: number = 0;
  servicioModal = this.modalService;

  fotoValida: boolean = false;

  constructor( private clienteService: ClienteService,
               private modalService: ModalService ) { }

  ngOnInit(): void {
    // this.activatedRoute.paramMap.subscribe ( params => {
    //   let id = +params.get('id');
    //   if (id) {
    //     this.clienteService.getCliente(id)
    //       .subscribe( cliente => {
    //         this.cliente = cliente;
    //       })
    //   }
    // })
  }

  seleccionarFoto(event) {
    this.fotoSeleccionada = event.target.files[0];
    this.progreso = 0;

    if ( this.fotoSeleccionada.type.indexOf('image') < 0 ) {// No es una imagen
      Swal.fire('Error', `Debe seleccionar una imagen válida. Fichero seleccionado: ${this.fotoSeleccionada.type} `, 'error');
      this.fotoSeleccionada = null;
      this.fotoValida = false;
    } else {
      this.fotoValida = true;
    }
  }

  subirFoto() {

    if ( !this.fotoSeleccionada ) {
      Swal.fire('Error', `Debe seleccionar una foto`, 'error');
    } else {
          this.clienteService.subirFoto(this.fotoSeleccionada, this.cliente.id)
      .subscribe( event => {

        if (event.type === HttpEventType.UploadProgress) {
          this.progreso = Math.round((event.loaded / event.total) * 100);
        } else if ( event.type === HttpEventType.Response ) {
          let response: Mensaje = event.body;
          this.cliente = response.cliente as Cliente;
          this.modalService.notificarUpload.emit( this.cliente );
          Swal.fire('Foto subida', response.mensaje, 'success'); 
        }
        
      });
    }
  }

  cerrarModal() {
    this.modalService.cerrarModal();
    this.fotoSeleccionada = null;
    this.progreso = 0;
  }


}
