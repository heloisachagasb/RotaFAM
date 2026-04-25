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
  // Administrativo e Áreas Externas
  { id: 'portaria_p1', nome: 'Portaria 1 (Av. Unitika)', grupo: 'Acessos e Áreas Externas' },
  { id: 'portaria_p2', nome: 'Portaria 2 (Rua Pedro Perissinoto)', grupo: 'Acessos e Áreas Externas' },
  { id: 'portaria_principal', nome: 'Portaria Principal (P4)', grupo: 'Acessos e Áreas Externas' },
  { id: 'portaria_p5', nome: 'Portaria 5 (Estacionamento)', grupo: 'Acessos e Áreas Externas' },
  { id: 'estacionamento', nome: 'Estacionamento', grupo: 'Acessos e Áreas Externas' },
  { id: 'vestiario', nome: 'Vestiário', grupo: 'Acessos e Áreas Externas' },
  { id: 'praca_academica', nome: 'Praça Acadêmica', grupo: 'Acessos e Áreas Externas' },

  // Setores Administrativos (Próximos à P4)
  { id: 'ti', nome: 'TI', grupo: 'Administrativo Superior' },
  { id: 'mantenedora', nome: 'Mantenedora', grupo: 'Administrativo Superior' },
  { id: 'recursos_humanos', nome: 'Recursos Humanos', grupo: 'Administrativo Superior' },
  { id: 'recepcao_matricula', nome: 'Recepção e Matrícula', grupo: 'Administrativo Superior' },

  // Bloco 1 (B1)
  { id: 'b1_salas', nome: 'Salas (Bloco 1)', grupo: 'Bloco 1' },
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

  // Bloco 4 (B4)
  { id: 'b4_salas', nome: 'Salas (Bloco 4)', grupo: 'Bloco 4' },

  // Bloco 5 (B5)
  { id: 'b5_sala_vip', nome: 'Sala VIP', grupo: 'Bloco 5' },
  { id: 'b5_secretaria', nome: 'Secretaria', grupo: 'Bloco 5' },
  { id: 'b5_cfa', nome: 'CFA', grupo: 'Bloco 5' },
  { id: 'b5_professores', nome: 'Sala dos Professores', grupo: 'Bloco 5' },
  { id: 'b5_coordenadores', nome: 'Sala dos Coordenadores', grupo: 'Bloco 5' },
  { id: 'b5_dep_social', nome: 'Departamento Social', grupo: 'Bloco 5' },

  // Bloco 6 (B6)
  { id: 'b6_biblioteca', nome: 'Biblioteca e Salas de Estudo', grupo: 'Bloco 6' },
  { id: 'b6_auditorio', nome: 'Auditório Jamil Salomão', grupo: 'Bloco 6' },
  { id: 'b6_museu', nome: 'Museu do Atleta', grupo: 'Bloco 6' }
];
}