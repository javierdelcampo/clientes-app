import { Component, OnInit } from '@angular/core';
import { Cliente } from '../cliente';
import { ClienteService } from '../cliente.service';
import { Router, ActivatedRoute } from '@angular/router';
import swal from 'sweetalert2';
import { Region } from '../region';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styles: [
  ]
})
export class FormComponent implements OnInit {

  public cliente: Cliente = new Cliente();
  regiones: Region[];
  public titulo: string = 'Crear Cliente';

  public errores: string[];

  constructor( private clienteService: ClienteService,
               private router: Router,
               private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    //this.cliente =  this.clienteService.getClientes()[0];
    this.cargarCliente();

    this.clienteService.getRegiones().subscribe( regiones => this.regiones = regiones );
  }

  cargarCliente(): void {
    this.activatedRoute.params.subscribe(params => {
      let id = params['id'];
      console.log('id', id);
      
      if (id) {
        this.clienteService.getCliente(id).subscribe( (cliente) => this.cliente = cliente)
      }
    })
  }

  create(): void {
    console.log('Create');
    
    this.clienteService.create(this.cliente)
      .subscribe({
        next: cliente => {
          swal.fire('Nuevo cliente', `${ cliente.nombre } ha sido creado con éxito`, 'success');
        },
        error: err => {
          this.errores = this.clienteService.getErrores();
          console.log("Código de error:", JSON.stringify(err));
        },
        complete: () => {
          console.log('Complete');
          this.router.navigate(['/clientes']);
        }
      });
    
  }

  public update(): void {
    console.log('Update');

    this.clienteService.update(this.cliente)
      .subscribe ( cliente => {
        this.router.navigate(['/clientes']);
          swal.fire('Cliente actualizado', `${ cliente.mensaje }: ${ cliente.nombre }`, 'success');
      },
      err => {
        this.errores = err.error.errors as string[];
        console.log("Código de error:", JSON.stringify(err));
      });
  }

  compararRegion(o1: Region, o2: Region): boolean {
    if ( o1 === undefined && o2 === undefined ) {
      return true;  // selecciona el texto genérico "seleccionar una región..." del option
    }
    return o1 === null || o2 === null || o1 === undefined || o2 === undefined ? false: o1.id === o2.id
  }

}
