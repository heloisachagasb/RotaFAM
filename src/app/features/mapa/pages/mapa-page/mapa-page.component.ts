import { Component, OnInit } from '@angular/core';

interface InfoNo {
  nome: string;
  artigo: string;
  descPassagem: string;
  descChegada: string;
}

@Component({
  selector: 'app-mapa-page',
  templateUrl: './mapa-page.component.html',
  styleUrl: './mapa-page.component.scss'
})
export class MapaPageComponent implements OnInit {

  origem: string = '';
  destino: string = '';
  instrucoes: string[] = [];
  erroNavegacao: string = '';
  segmentosSVG: { x1: number; y1: number; x2: number; y2: number }[] = [];

  ngOnInit(): void {}

  obterGruposUnicos(): string[] {
    const grupos = this.locaisMapa.map(local => local.grupo);
    return [...new Set(grupos)];
  }

  gerarInstrucoes(): void {
    this.instrucoes = [];
    this.segmentosSVG = [];
    this.erroNavegacao = '';

    if (!this.origem || !this.destino) {
      this.erroNavegacao = 'Selecione a origem e o destino para ver as instruções.';
      return;
    }

    if (this.origem === this.destino) {
      this.instrucoes = ['Você já está no local desejado!'];
      return;
    }

    const caminho = this.bfs(this.origem, this.destino);

    if (caminho.length === 0) {
      this.erroNavegacao = 'Não foi possível encontrar um caminho entre os locais selecionados.';
      return;
    }

    this.instrucoes = this.construirInstrucoes(caminho);
    this.segmentosSVG = this.calcularSegmentosSVG(caminho);
  }

  private readonly nodePoints: Record<string, [number, number]> = {
    portaria_p1:          [47,  500],
    portaria_p2:          [167, 617],
    portaria_p3:          [930, 717],
    portaria_p4:          [590,  19],
    portaria_p5:          [1125, 19],
    estacionamento:       [1125,340],
    b1_salas:             [75,  500],
    b1_convivencia:       [240, 500],
    b1_nicom:             [303, 591],
    b1_direcao:           [351, 676],
    b1_ead:               [437, 676],
    b1_cpa:               [516, 676],
    b1_diploma:           [593, 676],
    b2_praticas_juridicas:[412, 559],
    b2_tribunal_juri:     [412, 616],
    b2_cafeteria:         [895, 570],
    b3_salas:             [590, 255],
    b3_ambulatorio:       [364, 255],
    b3_coord_labs:        [475, 255],
    b4_salas:             [264, 340],
    b5_salas:             [480, 380],
    b5_sala_vip:          [388, 420],
    b5_secretaria:        [490, 420],
    b5_cfa:               [590, 420],
    b5_praca_academica:   [713, 420],
    b6_biblioteca:        [865, 420],
    b6_auditorio:         [1016,420],
    b6_museu:             [941, 469],
    b6_professores:       [388, 469],
    b6_coordenadores:     [490, 469],
    b6_dep_social:        [590, 469],
    sala_danca:           [248,  65],
    academia:             [248, 115],
    piscina:              [190, 165],
    ti:                   [248, 165],
    mantenedora:          [360, 115],
    portaria_principal:   [474, 115],
    recursos_humanos:     [360, 165],
    recepcao_matricula:   [660,  75],
    quadra_poliesportiva: [870, 175],
    vestiario:            [1014,175],
  };

  private calcularSegmentosSVG(caminho: string[]): { x1: number; y1: number; x2: number; y2: number }[] {
    const segs: { x1: number; y1: number; x2: number; y2: number }[] = [];
    for (let i = 0; i < caminho.length - 1; i++) {
      const from = this.nodePoints[caminho[i]];
      const to   = this.nodePoints[caminho[i + 1]];
      if (from && to) segs.push({ x1: from[0], y1: from[1], x2: to[0], y2: to[1] });
    }
    return segs;
  }

  private bfs(inicio: string, fim: string): string[] {
    if (!this.grafo[inicio] || !this.grafo[fim]) return [];
    const fila: string[][] = [[inicio]];
    const visitados = new Set<string>([inicio]);
    while (fila.length > 0) {
      const caminho = fila.shift()!;
      const atual = caminho[caminho.length - 1];
      if (atual === fim) return caminho;
      for (const viz of (this.grafo[atual] || [])) {
        if (!visitados.has(viz)) {
          visitados.add(viz);
          fila.push([...caminho, viz]);
        }
      }
    }
    return [];
  }

  private construirInstrucoes(caminho: string[]): string[] {
    const passos: string[] = [];

    passos.push(this.descEntrada(caminho[0]));

    for (let i = 1; i < caminho.length; i++) {
      const chave = `${caminho[i - 1]}→${caminho[i]}`;
      const transicao = this.transicoes[chave];
      const noAtual = this.infoNos[caminho[i]];
      const isDestino = i === caminho.length - 1;

      if (transicao) {
        passos.push(transicao);
      } else if (noAtual) {
        passos.push(noAtual.descPassagem);
      }

      if (isDestino && noAtual) {
        passos.push(noAtual.descChegada);
      }
    }

    return passos;
  }

  private descEntrada(id: string): string {
    const entradas: Record<string, string> = {
      portaria_p1: 'Entre pela Portaria 1 (P1), a entrada principal do Bloco 1.',
      portaria_p2: 'Entre pela Portaria 2 (P2), a entrada lateral do Bloco 1.',
      portaria_p3: 'Entre pela Portaria 3 (P3), acesso ao Bloco 2.',
      portaria_p4: 'Entre pela Portaria 4 (P4), acesso pela área esportiva.',
      portaria_p5: 'Entre pela Portaria 5 (P5), acesso pelo estacionamento.',
      estacionamento: 'Parta do Estacionamento, na lateral direita do campus.',
    };
    if (entradas[id]) return entradas[id];
    const info = this.infoNos[id];
    if (!info) return `Parta do local: ${id}.`;
    const prep = info.artigo === 'a' || info.artigo === 'as' ? 'da' : 'do';
    return `Parta ${prep} ${info.nome}.`;
  }

  private readonly infoNos: Record<string, InfoNo> = {
    portaria_p1: { nome: 'Portaria 1 (P1)', artigo: 'a', descPassagem: 'Passe pela Portaria 1 (P1).', descChegada: 'Você chegou à Portaria 1 (P1), a entrada principal do Bloco 1.' },
    portaria_p2: { nome: 'Portaria 2 (P2)', artigo: 'a', descPassagem: 'Passe pela Portaria 2 (P2).', descChegada: 'Você chegou à Portaria 2 (P2), entrada lateral do Bloco 1.' },
    portaria_p3: { nome: 'Portaria 3 (P3)', artigo: 'a', descPassagem: 'Passe pela Portaria 3 (P3).', descChegada: 'Você chegou à Portaria 3 (P3), saída do Bloco 2.' },
    portaria_p4: { nome: 'Portaria 4 (P4)', artigo: 'a', descPassagem: 'Passe pela Portaria 4 (P4).', descChegada: 'Você chegou à Portaria 4 (P4), acesso à área esportiva.' },
    portaria_p5: { nome: 'Portaria 5 (P5)', artigo: 'a', descPassagem: 'Passe pela Portaria 5 (P5).', descChegada: 'Você chegou à Portaria 5 (P5), acesso pelo estacionamento.' },
    estacionamento: { nome: 'Estacionamento', artigo: 'o', descPassagem: 'Passe pelo Estacionamento, na lateral direita do campus.', descChegada: 'Você chegou ao Estacionamento, na lateral direita do campus.' },
    b1_salas: { nome: 'Salas do Bloco 1', artigo: 'as', descPassagem: 'Siga pelo corredor do Bloco 1, com as salas de aula à esquerda.', descChegada: 'Você chegou às Salas do Bloco 1. As salas ficam ao longo do corredor, à esquerda de quem entra pela Portaria 1.' },
    b1_convivencia: { nome: 'Área de Convivência', artigo: 'a', descPassagem: 'Continue pelo corredor passando pela Área de Convivência.', descChegada: 'Você chegou à Área de Convivência, localizada no corredor principal do Bloco 1, à direita de quem entra pela P1.' },
    b1_nicom: { nome: 'NICOM', artigo: 'o', descPassagem: 'Passe pelo NICOM, no corredor interno do Bloco 1.', descChegada: 'Você chegou ao NICOM. Ele fica no corredor interno do Bloco 1, após a Área de Convivência.' },
    b1_direcao: { nome: 'Direção Acadêmica', artigo: 'a', descPassagem: 'Passe pela Direção Acadêmica.', descChegada: 'Você chegou à Direção Acadêmica, no corredor administrativo do Bloco 1.' },
    b1_ead: { nome: 'Núcleo EAD', artigo: 'o', descPassagem: 'Passe pelo Núcleo EAD.', descChegada: 'Você chegou ao Núcleo EAD, no corredor administrativo do Bloco 1.' },
    b1_cpa: { nome: 'CPA', artigo: 'a', descPassagem: 'Passe pela CPA.', descChegada: 'Você chegou à CPA, no corredor administrativo do Bloco 1.' },
    b1_diploma: { nome: 'Diploma', artigo: 'o', descPassagem: 'Passe pelo setor de Diploma.', descChegada: 'Você chegou ao setor de Diploma, ao final do corredor administrativo do Bloco 1.' },
    b2_praticas_juridicas: { nome: 'Núcleo de Práticas Jurídicas', artigo: 'o', descPassagem: 'Passe pelo Núcleo de Práticas Jurídicas (Bloco 2).', descChegada: 'Você chegou ao Núcleo de Práticas Jurídicas, no Bloco 2.' },
    b2_tribunal_juri: { nome: 'Tribunal do Júri', artigo: 'o', descPassagem: 'Passe pelo Tribunal do Júri.', descChegada: 'Você chegou ao Tribunal do Júri, no Bloco 2.' },
    b2_cafeteria: { nome: 'Cafeteria (Bloco 2)', artigo: 'a', descPassagem: 'Passe pela Cafeteria do Bloco 2.', descChegada: 'Você chegou à Cafeteria, no corredor do Bloco 2.' },
    b3_salas: { nome: 'Salas do Bloco 3', artigo: 'as', descPassagem: 'Percorra o corredor do Bloco 3, com salas nos dois lados.', descChegada: 'Você chegou às Salas do Bloco 3. As salas ficam ao longo do corredor central deste bloco.' },
    b3_coord_labs: { nome: 'Coordenação de Laboratórios', artigo: 'a', descPassagem: 'Passe pela Coordenação de Laboratórios.', descChegada: 'Você chegou à Coordenação de Laboratórios (Coord. Labs.), no Bloco 3.' },
    b3_ambulatorio: { nome: 'Ambulatório', artigo: 'o', descPassagem: 'Passe pelo Ambulatório, identificado pelo ícone de saúde.', descChegada: 'Você chegou ao Ambulatório, na entrada esquerda do Bloco 3.' },
    b4_salas: { nome: 'Salas do Bloco 4', artigo: 'as', descPassagem: 'Passe pelas Salas do Bloco 4.', descChegada: 'Você chegou às Salas do Bloco 4, entre o Bloco 1 e o corredor do Bloco 3.' },
    b5_salas: { nome: 'Salas (Corredor Central)', artigo: 'as', descPassagem: 'Continue pelo corredor central, com salas de aula ao longo do caminho.', descChegada: 'Você chegou às salas de aula do corredor central, localizadas na fileira superior esquerda do corredor.' },
    b5_sala_vip: { nome: 'Sala VIP', artigo: 'a', descPassagem: 'Continue pelo corredor — a Sala VIP fica na fileira superior, à esquerda.', descChegada: 'Você chegou à Sala VIP, na fileira superior esquerda do corredor central.' },
    b5_secretaria: { nome: 'Secretaria', artigo: 'a', descPassagem: 'Continue pelo corredor — a Secretaria fica na fileira superior, ao centro.', descChegada: 'Você chegou à Secretaria, no trecho central da fileira superior do corredor.' },
    b5_cfa: { nome: 'CFA', artigo: 'o', descPassagem: 'Continue pelo corredor — o CFA fica na fileira superior, antes da Praça Acadêmica.', descChegada: 'Você chegou ao CFA, na fileira superior do corredor central, logo antes da Praça Acadêmica.' },
    b5_praca_academica: { nome: 'Praça Acadêmica', artigo: 'a', descPassagem: 'Passe pela Praça Acadêmica, o espaço central aberto do corredor.', descChegada: 'Você chegou à Praça Acadêmica, o espaço central aberto do corredor que divide as duas alas.' },
    b6_biblioteca: { nome: 'Biblioteca', artigo: 'a', descPassagem: 'Continue pelo corredor — a Biblioteca fica na fileira superior direita, após a Praça Acadêmica.', descChegada: 'Você chegou à Biblioteca e Salas de Estudo, na fileira superior direita do corredor central.' },
    b6_auditorio: { nome: 'Auditório Jamil Salomão', artigo: 'o', descPassagem: 'Continue pelo corredor até o final — o Auditório fica na última sala à direita.', descChegada: 'Você chegou ao Auditório Jamil Salomão, ao final do corredor central, na fileira superior direita.' },
    b6_museu: { nome: 'Museu do Atleta', artigo: 'o', descPassagem: 'Continue pelo corredor — o Museu do Atleta fica na fileira inferior direita.', descChegada: 'Você chegou ao Museu do Atleta e Laboratórios, na fileira inferior direita do corredor central.' },
    b6_professores: { nome: 'Sala dos Professores', artigo: 'a', descPassagem: 'Continue pelo corredor — a Sala dos Professores fica na fileira inferior, à esquerda.', descChegada: 'Você chegou à Sala dos Professores, na fileira inferior esquerda do corredor central.' },
    b6_coordenadores: { nome: 'Sala dos Coordenadores', artigo: 'a', descPassagem: 'Continue pelo corredor — a Sala dos Coordenadores está ao centro da fileira inferior.', descChegada: 'Você chegou à Sala dos Coordenadores, no trecho central da fileira inferior do corredor.' },
    b6_dep_social: { nome: 'Departamento Social', artigo: 'o', descPassagem: 'Continue pelo corredor — o Departamento Social fica na fileira inferior, antes da Praça Acadêmica.', descChegada: 'Você chegou ao Departamento Social, na fileira inferior do corredor central, logo antes da Praça Acadêmica.' },
    sala_danca: { nome: 'Sala de Dança', artigo: 'a', descPassagem: 'Passe pela Sala de Dança.', descChegada: 'Você chegou à Sala de Dança, na área esportiva.' },
    academia: { nome: 'Academia', artigo: 'a', descPassagem: 'Passe pela Academia.', descChegada: 'Você chegou à Academia, na área esportiva.' },
    piscina: { nome: 'Piscina', artigo: 'a', descPassagem: 'Passe pela Piscina.', descChegada: 'Você chegou à Piscina, na área esportiva.' },
    ti: { nome: 'TI', artigo: 'o', descPassagem: 'Passe pelo setor de TI.', descChegada: 'Você chegou ao setor de TI, na área esportiva.' },
    mantenedora: { nome: 'Mantenedora', artigo: 'a', descPassagem: 'Passe pela Mantenedora.', descChegada: 'Você chegou à Mantenedora, próximo à Portaria 4.' },
    portaria_principal: { nome: 'Portaria Principal', artigo: 'a', descPassagem: 'Passe pela Portaria Principal.', descChegada: 'Você chegou à Portaria Principal, na área esportiva.' },
    recursos_humanos: { nome: 'Recursos Humanos', artigo: 'o', descPassagem: 'Passe pelo setor de Recursos Humanos.', descChegada: 'Você chegou ao setor de Recursos Humanos, próximo à Portaria 4.' },
    recepcao_matricula: { nome: 'Recepção e Matrícula', artigo: 'a', descPassagem: 'Passe pela Recepção e Matrícula.', descChegada: 'Você chegou à Recepção e Matrícula, na área esportiva.' },
    quadra_poliesportiva: { nome: 'Quadra Poliesportiva', artigo: 'a', descPassagem: 'Passe pela Quadra Poliesportiva.', descChegada: 'Você chegou à Quadra Poliesportiva, na área esportiva.' },
    vestiario: { nome: 'Vestiário', artigo: 'o', descPassagem: 'Passe pelo Vestiário.', descChegada: 'Você chegou ao Vestiário, ao lado da Quadra Poliesportiva.' },
  };

  private readonly grafo: Record<string, string[]> = {
    portaria_p1: ['b1_salas', 'b1_convivencia', 'portaria_p2'],
    portaria_p2: ['portaria_p1', 'b1_nicom', 'b1_direcao'],
    portaria_p3: ['b2_tribunal_juri', 'b2_praticas_juridicas'],
    portaria_p4: ['portaria_principal', 'b3_salas', 'sala_danca'],
    portaria_p5: ['estacionamento', 'recepcao_matricula'],
    estacionamento: ['portaria_p5', 'b6_auditorio', 'b6_museu', 'b3_salas'],
    b1_salas: ['portaria_p1', 'b1_convivencia', 'b4_salas'],
    b1_convivencia: ['portaria_p1', 'b1_salas', 'b1_nicom', 'b5_praca_academica', 'b6_professores'],
    b1_nicom: ['b1_convivencia', 'b1_direcao', 'portaria_p2', 'b2_praticas_juridicas'],
    b1_direcao: ['b1_nicom', 'b1_ead', 'portaria_p2'],
    b1_ead: ['b1_direcao', 'b1_cpa'],
    b1_cpa: ['b1_ead', 'b1_diploma'],
    b1_diploma: ['b1_cpa', 'b2_praticas_juridicas'],
    b2_praticas_juridicas: ['b1_nicom', 'b1_diploma', 'b2_tribunal_juri', 'b2_cafeteria'],
    b2_tribunal_juri: ['b2_praticas_juridicas', 'portaria_p3'],
    b2_cafeteria: ['b2_praticas_juridicas', 'b6_museu'],
    b4_salas: ['b1_salas', 'b3_salas', 'b3_ambulatorio'],
    b3_salas: ['b4_salas', 'b3_ambulatorio', 'b3_coord_labs', 'portaria_p4', 'b5_salas', 'estacionamento'],
    b3_ambulatorio: ['b4_salas', 'b3_salas'],
    b3_coord_labs: ['b3_salas'],
    b5_salas: ['b3_salas', 'b5_sala_vip', 'b5_secretaria', 'b5_cfa', 'b5_praca_academica', 'b6_professores'],
    b5_sala_vip: ['b5_salas', 'b5_secretaria', 'b6_professores'],
    b5_secretaria: ['b5_salas', 'b5_sala_vip', 'b5_cfa', 'b6_coordenadores'],
    b5_cfa: ['b5_salas', 'b5_secretaria', 'b5_praca_academica', 'b6_dep_social'],
    b5_praca_academica: ['b5_salas', 'b5_cfa', 'b1_convivencia', 'b6_biblioteca', 'b6_auditorio'],
    b6_biblioteca: ['b5_praca_academica', 'b6_auditorio', 'b6_museu'],
    b6_auditorio: ['b5_praca_academica', 'b6_biblioteca', 'b6_museu', 'estacionamento'],
    b6_museu: ['b6_biblioteca', 'b6_auditorio', 'b6_coordenadores', 'b2_cafeteria', 'estacionamento'],
    b6_professores: ['b1_convivencia', 'b5_salas', 'b5_sala_vip', 'b6_coordenadores'],
    b6_coordenadores: ['b6_professores', 'b5_secretaria', 'b6_dep_social', 'b6_museu'],
    b6_dep_social: ['b6_coordenadores', 'b5_cfa', 'b5_salas'],
    portaria_principal: ['portaria_p4', 'mantenedora', 'recursos_humanos'],
    mantenedora: ['portaria_principal', 'recursos_humanos'],
    recursos_humanos: ['portaria_principal', 'mantenedora'],
    sala_danca: ['portaria_p4', 'academia'],
    academia: ['sala_danca', 'piscina', 'ti'],
    piscina: ['academia'],
    ti: ['academia'],
    recepcao_matricula: ['portaria_p5', 'quadra_poliesportiva'],
    quadra_poliesportiva: ['recepcao_matricula', 'vestiario'],
    vestiario: ['quadra_poliesportiva'],
  };

  private readonly transicoes: Record<string, string> = {
    'portaria_p1→b1_salas': 'Siga em frente pelo corredor principal do Bloco 1 — as salas de aula ficam à sua esquerda.',
    'portaria_p1→b1_convivencia': 'Siga em frente pelo corredor principal do Bloco 1 — a Área de Convivência estará à sua direita.',
    'portaria_p1→portaria_p2': 'Siga pelo lado externo do prédio à esquerda até a Portaria 2.',
    'portaria_p2→portaria_p1': 'Siga pelo lado externo do prédio à direita até a Portaria 1.',
    'portaria_p2→b1_nicom': 'Entre pela Portaria 2 e siga em frente pelo corredor — o NICOM está logo à frente.',
    'portaria_p2→b1_direcao': 'Entre pela Portaria 2 e siga pelo corredor à direita em direção ao setor administrativo.',
    'portaria_p3→b2_tribunal_juri': 'Entre pela Portaria 3 — o Tribunal do Júri está logo à frente.',
    'portaria_p3→b2_praticas_juridicas': 'Entre pela Portaria 3 e siga pelo corredor do Bloco 2 em direção ao Núcleo de Práticas Jurídicas.',
    'portaria_p4→portaria_principal': 'Após entrar pela P4, siga em frente — a Portaria Principal está logo à frente.',
    'portaria_p4→b3_salas': 'Após entrar pela P4, vire à direita e acesse o corredor do Bloco 3.',
    'portaria_p4→sala_danca': 'Após entrar pela P4, siga à esquerda — a Sala de Dança é a primeira sala do bloco esportivo.',
    'portaria_p5→estacionamento': 'Após entrar pela P5, siga em frente — o Estacionamento está logo à direita.',
    'portaria_p5→recepcao_matricula': 'Após entrar pela P5, siga em frente e vire à esquerda — a Recepção e Matrícula fica no início da área esportiva.',
    'b1_salas→portaria_p1': 'Volte pelo corredor em direção à entrada — a Portaria 1 estará à sua frente.',
    'b1_salas→b1_convivencia': 'Avance pelo corredor deixando as salas para trás — a Área de Convivência está à frente.',
    'b1_salas→b4_salas': 'Ao final do corredor de salas, suba as escadas para acessar o Bloco 4.',
    'b1_convivencia→portaria_p1': 'Retorne pelo corredor principal em direção à entrada — a Portaria 1 estará à sua frente.',
    'b1_convivencia→b1_salas': 'Retorne pelo corredor principal — as salas de aula ficam à sua esquerda.',
    'b1_convivencia→b1_nicom': 'Continue pelo corredor principal em direção ao fundo do bloco — o NICOM estará à frente.',
    'b1_convivencia→b5_praca_academica': 'Da Área de Convivência, entre no corredor central e siga em frente — a Praça Acadêmica fica no centro do corredor.',
    'b1_convivencia→b6_professores': 'Da Área de Convivência, entre no corredor central — a Sala dos Professores fica logo à direita, na fileira inferior.',
    'b1_nicom→b1_convivencia': 'Retorne pelo corredor em direção à Área de Convivência.',
    'b1_nicom→b1_direcao': 'Do NICOM, vire à direita e siga pelo corredor administrativo — a Direção Acadêmica é a primeira sala.',
    'b1_nicom→portaria_p2': 'Do NICOM, siga em frente até o final do corredor e saia pela Portaria 2.',
    'b1_nicom→b2_praticas_juridicas': 'Do NICOM, siga pelo corredor à direita que leva ao Bloco 2.',
    'b1_direcao→b1_nicom': 'Retorne pelo corredor em direção ao NICOM.',
    'b1_direcao→b1_ead': 'Continue pelo corredor administrativo — o Núcleo EAD é a próxima sala à direita.',
    'b1_direcao→portaria_p2': 'Siga em frente pelo corredor e saia pela Portaria 2.',
    'b1_ead→b1_direcao': 'Retorne pelo corredor em direção à Direção Acadêmica.',
    'b1_ead→b1_cpa': 'Continue pelo corredor administrativo — a CPA é a próxima sala.',
    'b1_cpa→b1_ead': 'Retorne pelo corredor em direção ao Núcleo EAD.',
    'b1_cpa→b1_diploma': 'Continue pelo corredor — o setor de Diploma é a próxima sala à frente.',
    'b1_diploma→b1_cpa': 'Retorne pelo corredor em direção à CPA.',
    'b1_diploma→b2_praticas_juridicas': 'Ao final do corredor administrativo, siga em frente e acesse o Bloco 2.',
    'b2_praticas_juridicas→b1_nicom': 'Retorne pelo corredor em direção ao Bloco 1 e ao NICOM.',
    'b2_praticas_juridicas→b1_diploma': 'Siga pelo corredor em direção ao Bloco 1.',
    'b2_praticas_juridicas→b2_tribunal_juri': 'Siga pelo corredor do Bloco 2 em direção ao Tribunal do Júri.',
    'b2_praticas_juridicas→b2_cafeteria': 'Siga pelo corredor do Bloco 2 — a Cafeteria está à sua direita.',
    'b2_tribunal_juri→b2_praticas_juridicas': 'Retorne pelo corredor do Bloco 2 em direção ao Núcleo de Práticas Jurídicas.',
    'b2_tribunal_juri→portaria_p3': 'Siga ao final do corredor — a Portaria 3 está na saída do Bloco 2.',
    'b2_cafeteria→b2_praticas_juridicas': 'Retorne pelo corredor do Bloco 2.',
    'b2_cafeteria→b6_museu': 'Suba as escadas ao final do corredor — o Museu do Atleta fica logo acima, na fileira inferior direita do corredor central.',
    'b4_salas→b1_salas': 'Desça as escadas para retornar ao Bloco 1.',
    'b4_salas→b3_salas': 'Siga pelo corredor interno em direção ao Bloco 3.',
    'b4_salas→b3_ambulatorio': 'Siga pelo corredor em direção ao Ambulatório, próximo à entrada do Bloco 3.',
    'b3_salas→b4_salas': 'Siga pelo corredor do Bloco 3 em direção ao Bloco 4.',
    'b3_salas→b3_ambulatorio': 'Siga à esquerda no corredor do Bloco 3 — o Ambulatório está logo à frente.',
    'b3_salas→b3_coord_labs': 'No corredor do Bloco 3, siga em direção à Coordenação de Laboratórios.',
    'b3_salas→portaria_p4': 'Siga pelo corredor do Bloco 3 até o final, em direção à saída pela Portaria 4.',
    'b3_salas→b5_salas': 'Descendo pelo Bloco 3, entre no corredor central pelo lado esquerdo — as salas de aula ficam logo ao início.',
    'b3_salas→estacionamento': 'Ao final do corredor do Bloco 3, siga à direita em direção ao Estacionamento.',
    'b3_ambulatorio→b4_salas': 'Do Ambulatório, siga pelo corredor em direção ao Bloco 4.',
    'b3_ambulatorio→b3_salas': 'Siga pelo corredor do Bloco 3.',
    'b3_coord_labs→b3_salas': 'Retorne pelo corredor do Bloco 3.',
    // Corredor central (B5+B6 = um único corredor)
    // --- fileira superior, sentido esquerda→direita ---
    'b5_salas→b5_sala_vip': 'Continue pelo corredor central — a Sala VIP está logo à frente, na fileira superior.',
    'b5_salas→b5_secretaria': 'Continue pelo corredor — a Secretaria fica um pouco mais à frente, na fileira superior.',
    'b5_salas→b5_cfa': 'Continue pelo corredor — o CFA está mais adiante, na fileira superior, antes da Praça Acadêmica.',
    'b5_salas→b5_praca_academica': 'Siga pelo corredor passando pelas salas — a Praça Acadêmica está à frente, no centro.',
    'b5_salas→b6_professores': 'Ao entrar no corredor, a Sala dos Professores fica logo à direita, na fileira inferior.',
    'b5_sala_vip→b5_secretaria': 'Continue pelo corredor — a Secretaria está logo ao lado da Sala VIP.',
    'b5_secretaria→b5_cfa': 'Continue pelo corredor — o CFA está logo ao lado da Secretaria.',
    'b5_cfa→b5_praca_academica': 'Continue pelo corredor — a Praça Acadêmica está logo à frente.',
    'b5_praca_academica→b6_biblioteca': 'Da Praça Acadêmica, continue pelo corredor à direita — a Biblioteca está logo à frente.',
    'b5_praca_academica→b6_auditorio': 'Da Praça Acadêmica, continue pelo corredor até o final — o Auditório Jamil Salomão é a última sala à direita.',
    'b6_biblioteca→b6_auditorio': 'Da Biblioteca, continue pelo corredor — o Auditório Jamil Salomão está logo ao lado.',
    // --- fileira superior, sentido direita→esquerda ---
    'b6_auditorio→b6_biblioteca': 'Do Auditório, volte pelo corredor — a Biblioteca está logo ao lado.',
    'b6_biblioteca→b5_praca_academica': 'Da Biblioteca, retorne pelo corredor — a Praça Acadêmica está logo antes.',
    'b5_praca_academica→b5_cfa': 'Da Praça Acadêmica, retorne pelo corredor — o CFA está logo à esquerda.',
    'b5_cfa→b5_secretaria': 'Retorne pelo corredor — a Secretaria está logo ao lado do CFA.',
    'b5_secretaria→b5_sala_vip': 'Retorne pelo corredor — a Sala VIP está logo ao lado da Secretaria.',
    'b5_sala_vip→b5_salas': 'Continue pelo corredor em direção ao início — as salas de aula ficam mais adiante.',
    'b5_praca_academica→b5_salas': 'Da Praça Acadêmica, retorne pelo corredor — as salas de aula ficam ao longo do caminho.',
    'b5_praca_academica→b1_convivencia': 'Da Praça Acadêmica, siga pelo corredor até o final esquerdo e acesse a Área de Convivência no Bloco 1.',
    'b5_salas→b3_salas': 'Saia pelo início do corredor e suba em direção ao Bloco 3.',
    // --- fileira inferior, sentido esquerda→direita ---
    'b5_sala_vip→b6_professores': 'A Sala dos Professores fica logo abaixo da Sala VIP, na fileira inferior do corredor.',
    'b5_secretaria→b6_coordenadores': 'A Sala dos Coordenadores fica logo abaixo da Secretaria, na fileira inferior do corredor.',
    'b5_cfa→b6_dep_social': 'O Departamento Social fica logo abaixo do CFA, na fileira inferior do corredor.',
    'b6_professores→b6_coordenadores': 'Continue pelo corredor — a Sala dos Coordenadores está logo ao lado da Sala dos Professores.',
    'b6_coordenadores→b6_dep_social': 'Continue pelo corredor — o Departamento Social está logo ao lado da Sala dos Coordenadores.',
    'b6_coordenadores→b6_museu': 'Continue pelo corredor até o final — o Museu do Atleta fica na fileira inferior direita.',
    'b6_dep_social→b5_cfa': 'O CFA fica logo acima do Departamento Social, na fileira superior do corredor.',
    // --- fileira inferior, sentido direita→esquerda ---
    'b6_museu→b6_coordenadores': 'Do Museu, retorne pelo corredor — a Sala dos Coordenadores está à esquerda.',
    'b6_coordenadores→b6_professores': 'Retorne pelo corredor — a Sala dos Professores está logo ao lado.',
    'b6_dep_social→b6_coordenadores': 'Retorne pelo corredor — a Sala dos Coordenadores está logo ao lado.',
    'b6_professores→b5_sala_vip': 'A Sala VIP fica logo acima da Sala dos Professores, na fileira superior do corredor.',
    'b6_professores→b5_salas': 'Retorne pelo corredor — as salas de aula ficam mais ao início.',
    'b6_dep_social→b5_salas': 'Retorne pelo corredor em direção ao início — as salas de aula ficam mais à esquerda.',
    // --- cruzamentos verticais (superior ↔ inferior) ---
    'b6_biblioteca→b6_museu': 'O Museu do Atleta fica logo abaixo da Biblioteca, na fileira inferior do corredor.',
    'b6_museu→b6_biblioteca': 'A Biblioteca fica logo acima do Museu, na fileira superior do corredor.',
    'b6_auditorio→b6_museu': 'O Museu do Atleta fica logo abaixo do Auditório, na fileira inferior do corredor.',
    'b6_museu→b6_auditorio': 'O Auditório Jamil Salomão fica logo acima do Museu, na fileira superior do corredor.',
    // --- saídas do corredor ---
    'b6_professores→b1_convivencia': 'Da Sala dos Professores, siga pelo corredor até o final esquerdo e acesse a Área de Convivência no Bloco 1.',
    'b6_auditorio→estacionamento': 'Do Auditório, siga pela saída ao final direito do corredor — o Estacionamento fica do lado externo.',
    'b6_museu→estacionamento': 'Do Museu, siga pela saída ao final do corredor — o Estacionamento fica do lado externo.',
    'b6_museu→b2_cafeteria': 'Do Museu, desça as escadas ao lado direito do corredor — a Cafeteria do Bloco 2 está logo abaixo.',
    'portaria_principal→portaria_p4': 'Da Portaria Principal, siga em direção à P4.',
    'portaria_principal→mantenedora': 'Da Portaria Principal, vire à esquerda — a Mantenedora é a primeira sala.',
    'portaria_principal→recursos_humanos': 'Da Portaria Principal, vire à esquerda e siga até o final — Recursos Humanos está logo abaixo.',
    'mantenedora→portaria_principal': 'Da Mantenedora, retorne à Portaria Principal.',
    'mantenedora→recursos_humanos': 'Da Mantenedora, desça pelo corredor — Recursos Humanos está logo abaixo.',
    'recursos_humanos→portaria_principal': 'De Recursos Humanos, suba o corredor em direção à Portaria Principal.',
    'recursos_humanos→mantenedora': 'De Recursos Humanos, suba o corredor — a Mantenedora está logo acima.',
    'sala_danca→portaria_p4': 'Da Sala de Dança, retorne à entrada pela P4.',
    'sala_danca→academia': 'Da Sala de Dança, siga pelo corredor esportivo — a Academia está logo abaixo.',
    'academia→sala_danca': 'Da Academia, suba o corredor — a Sala de Dança está logo acima.',
    'academia→piscina': 'Da Academia, siga à esquerda — a Piscina está no final do bloco esportivo.',
    'academia→ti': 'Da Academia, siga em frente — o setor de TI está ao lado.',
    'piscina→academia': 'Da Piscina, retorne pelo corredor — a Academia está ao lado.',
    'ti→academia': 'Do setor de TI, retorne pelo corredor — a Academia está ao lado.',
    'recepcao_matricula→portaria_p5': 'Da Recepção, retorne à Portaria 5.',
    'recepcao_matricula→quadra_poliesportiva': 'Da Recepção, siga ao fundo da área esportiva — a Quadra Poliesportiva está à direita.',
    'quadra_poliesportiva→recepcao_matricula': 'Da Quadra, retorne em direção à Recepção e Matrícula.',
    'quadra_poliesportiva→vestiario': 'Da Quadra, siga ao fundo — o Vestiário está logo ao lado.',
    'vestiario→quadra_poliesportiva': 'Do Vestiário, retorne à Quadra Poliesportiva.',
    'estacionamento→portaria_p5': 'Do Estacionamento, acesse a Portaria 5 (P5).',
    'estacionamento→b6_auditorio': 'Do Estacionamento, entre pelo lado direito do corredor central — o Auditório Jamil Salomão está logo à esquerda ao entrar.',
    'estacionamento→b6_museu': 'Do Estacionamento, entre pelo lado direito do corredor central — o Museu do Atleta fica logo à esquerda, na fileira inferior.',
    'estacionamento→b3_salas': 'Do Estacionamento, siga pelo corredor à esquerda — o Bloco 3 está ao final.',
  };

  locaisMapa = [
    { id: 'portaria_p1', nome: 'Portaria 1', grupo: 'Acessos' },
    { id: 'portaria_p2', nome: 'Portaria 2', grupo: 'Acessos' },
    { id: 'portaria_p3', nome: 'Portaria 3', grupo: 'Acessos' },
    { id: 'portaria_p4', nome: 'Portaria 4', grupo: 'Acessos' },
    { id: 'portaria_p5', nome: 'Portaria 5', grupo: 'Acessos' },
    { id: 'estacionamento', nome: 'Estacionamento', grupo: 'Acessos' },
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
    { id: 'b1_salas', nome: 'Salas', grupo: 'Bloco 1' },
    { id: 'b1_convivencia', nome: 'Área de Convivência', grupo: 'Bloco 1' },
    { id: 'b1_nicom', nome: 'NICOM', grupo: 'Bloco 1' },
    { id: 'b1_direcao', nome: 'Direção Acadêmica', grupo: 'Bloco 1' },
    { id: 'b1_ead', nome: 'Núcleo EAD', grupo: 'Bloco 1' },
    { id: 'b1_cpa', nome: 'CPA', grupo: 'Bloco 1' },
    { id: 'b1_diploma', nome: 'Diploma', grupo: 'Bloco 1' },
    { id: 'b2_praticas_juridicas', nome: 'Núcleo de Práticas Jurídicas', grupo: 'Bloco 2' },
    { id: 'b2_tribunal_juri', nome: 'Tribunal do Júri', grupo: 'Bloco 2' },
    { id: 'b2_cafeteria', nome: 'Cafeteria', grupo: 'Bloco 2' },
    { id: 'b3_salas', nome: 'Salas (Bloco 3)', grupo: 'Bloco 3' },
    { id: 'b3_coord_labs', nome: 'Coord. Labs.', grupo: 'Bloco 3' },
    { id: 'b3_ambulatorio', nome: 'Ambulatório', grupo: 'Bloco 3' },
    { id: 'b4_salas', nome: 'Salas (Bloco 4)', grupo: 'Bloco 4' },
    { id: 'b5_salas', nome: 'Salas', grupo: 'Bloco 5' },
    { id: 'b5_sala_vip', nome: 'Sala VIP', grupo: 'Bloco 5' },
    { id: 'b5_secretaria', nome: 'Secretaria', grupo: 'Bloco 5' },
    { id: 'b5_cfa', nome: 'CFA', grupo: 'Bloco 5' },
    { id: 'b5_praca_academica', nome: 'Praça Acadêmica', grupo: 'Bloco 5' },
    { id: 'b6_biblioteca', nome: 'Biblioteca e Salas de Estudo', grupo: 'Bloco 6' },
    { id: 'b6_auditorio', nome: 'Auditório Jamil Salomão', grupo: 'Bloco 6' },
    { id: 'b6_museu', nome: 'Museu do Atleta', grupo: 'Bloco 6' },
    { id: 'b6_professores', nome: 'Sala dos Professores', grupo: 'Bloco 6' },
    { id: 'b6_coordenadores', nome: 'Sala dos Coordenadores', grupo: 'Bloco 6' },
    { id: 'b6_dep_social', nome: 'Departamento Social', grupo: 'Bloco 6' },
  ];
}
