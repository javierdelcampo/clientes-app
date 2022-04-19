import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Cliente } from './cliente';
import { ClienteService } from './cliente.service';


@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html'
})
export class ClientesComponent implements OnInit {

  clientes: Cliente[];

  constructor( private clienteService: ClienteService ) { }

  ngOnInit(): void {
    this.clienteService.getClientes()
      .subscribe(
        clientes => { 
          this.clientes = clientes; 
        }

        // Lo mismo:
        // function (clientes) { 
        //   this.clientes = clientes; 
        // }
      );
  }

}
