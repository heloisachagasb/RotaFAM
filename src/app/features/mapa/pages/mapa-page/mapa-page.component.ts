import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-mapa-page',
  templateUrl: './mapa-page.component.html',
  styleUrl: './mapa-page.component.scss'
})
export class MapaPageComponent implements OnInit {

  localSelecionado: string = '';

  ngOnInit(): void {
  }

  obterGruposUnicos(): string[] {
    const grupos = this.locaisMapa.map(local => local.grupo);
    return [...new Set(grupos)];
  }

  obterNomeLocalSelecionado(): string {
    const local = this.locaisMapa.find(l => l.id === this.localSelecionado);
    return local ? local.nome : '';
  }

  locaisMapa = [
    // Acessos
    { id: 'portaria_p1', nome: 'Portaria 1', grupo: 'Acessos' },
    { id: 'portaria_p2', nome: 'Portaria 2', grupo: 'Acessos' },
    { id: 'portaria_p3', nome: 'Portaria 3', grupo: 'Acessos' },
    { id: 'portaria_p4', nome: 'Portaria 4', grupo: 'Acessos' },
    { id: 'portaria_p5', nome: 'Portaria 5', grupo: 'Acessos' },
    { id: 'estacionamento', nome: 'Estacionamento', grupo: 'Acessos' },

    // Setores Administrativos (Próximos à P4)
    { id: 'sala_danca', nome: 'Sala de Dança', grupo: 'Área Externa' },
    { id: 'academia', nome: 'Academia', grupo: 'Área Externa' },
    { id: 'piscina', nome: 'Piscina', grupo: 'Área Externa' },
    { id: 'ti', nome: 'TI', grupo: 'Área Externa' },
    { id: 'mantenedora', nome: 'Mantenedora', grupo: 'Área Externa' },
    { id: 'portaria_principal', nome: 'Portaria Principal', grupo: 'Área Externa' },
    { id: 'recursos_humanos', nome: 'Recursos Humanos', grupo: 'Área Externa' },
    { id: 'recepcao_matricula', nome: 'Recepção e Matrícula', grupo: 'Área Externa' },
    { id: 'quadra_poliesportiva', nome: 'Quadra Poliesportiva', grupo: 'Área Externa' },
    { id: 'vestiario', nome: 'Vestiário', grupo: 'Área Externa' },

    // Bloco 1 (B1)
    { id: 'b1_salas', nome: 'Salas', grupo: 'Bloco 1' },
    { id: 'b1_convivencia', nome: 'Área de Convivência', grupo: 'Bloco 1' },
    { id: 'b1_nicom', nome: 'NICOM', grupo: 'Bloco 1' },
    { id: 'b1_direcao', nome: 'Direção Acadêmica', grupo: 'Bloco 1' },
    { id: 'b1_ead', nome: 'Núcleo EAD', grupo: 'Bloco 1' },
    { id: 'b1_cpa', nome: 'CPA', grupo: 'Bloco 1' },
    { id: 'b1_diploma', nome: 'Diploma', grupo: 'Bloco 1' },

    // Bloco 2 (B2)
    { id: 'b2_praticas_juridicas', nome: 'Núcleo de Práticas Jurídicas', grupo: 'Bloco 2' },
    { id: 'b2_tribunal_juri', nome: 'Tribunal do Júri', grupo: 'Bloco 2' },
    { id: 'b2_cafeteria', nome: 'Cafeteria', grupo: 'Bloco 2' },

    // Bloco 3 (B3)
    { id: 'b3_salas', nome: 'Salas (Bloco 3)', grupo: 'Bloco 3' },
    { id: 'b3_coord_labs', nome: 'Coord. Labs.', grupo: 'Bloco 3' },
    { id: 'b3_ambulatorio', nome: 'Ambulatório', grupo: 'Bloco 3' },

    // Bloco 4 (B4)
    { id: 'b4_salas', nome: 'Salas (Bloco 4)', grupo: 'Bloco 4' },

    // Bloco 5 (B5)
    { id: 'b5_salas', nome: 'Salas', grupo: 'Bloco 5' },
    { id: 'b5_sala_vip', nome: 'Sala VIP', grupo: 'Bloco 5' },
    { id: 'b5_secretaria', nome: 'Secretaria', grupo: 'Bloco 5' },
    { id: 'b5_cfa', nome: 'CFA', grupo: 'Bloco 5' },
    { id: 'b5_praca_academica', nome: 'Praça Acadêmica', grupo: 'Bloco 5' },

    // Bloco 6 (B6)
    { id: 'b6_biblioteca', nome: 'Biblioteca e Salas de Estudo', grupo: 'Bloco 6' },
    { id: 'b6_auditorio', nome: 'Auditório Jamil Salomão', grupo: 'Bloco 6' },
    { id: 'b6_museu', nome: 'Museu do Atleta', grupo: 'Bloco 6' },
    { id: 'b6_professores', nome: 'Sala dos Professores', grupo: 'Bloco 6' },
    { id: 'b6_coordenadores', nome: 'Sala dos Coordenadores', grupo: 'Bloco 6' },
    { id: 'b6_dep_social', nome: 'Departamento Social', grupo: 'Bloco 6' },
  ];
}