import { Cliente } from './../cliente';

export interface Mensaje {
    mensaje?:         string;
    error?:           string;
    cliente?:         Cliente;
}
