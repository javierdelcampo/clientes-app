import { Component, OnInit } from '@angular/core';
import { Cliente } from '../cliente';
import { ClienteService } from '../cliente.service';
import { Router, ActivatedRoute } from '@angular/router';
import swal from 'sweetalert2';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styles: [
  ]
})
export class FormComponent implements OnInit {

  public cliente: Cliente = new Cliente();
  public titulo: string = 'Crear Cliente';

  constructor( private clienteService: ClienteService,
               private router: Router,
               private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    //this.cliente =  this.clienteService.getClientes()[0];
    this.cargarCliente();
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

  public create() {
    this.clienteService.create(this.cliente)
      .subscribe(
        response => {
          this.router.navigate(['/clientes']);
          swal.fire('Nuevo cliente', `El cliente ${ this.cliente.nombre } se ha creado con éxito`, 'success');
        }
      );
    
  }

  public update(): void {
    this.clienteService.update(this.cliente)
      .subscribe ( cliente => {
        this.router.navigate(['/clientes']);
          swal.fire('Cliente actualizado', `El cliente ${ this.cliente.nombre } se ha actualizado con éxito`, 'success');
      });
  }

}
