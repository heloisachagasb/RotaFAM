export class Paginacao<T> {
    pagina_atual: number;
    tamanho_pagina: number;
    quantidade_total_registros : number;
    quantidade_total_paginas: number;
    results: T[]; 
  }
