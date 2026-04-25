import { Subject } from 'rxjs';

export class PassoPasso {
    etapas: EtapaPassoPasso[] = [];
    numero_etapa_ativa: number;

    numero_etapa_ativa_subject = new Subject<number>();
    public numero_etapa_ativa$ = this.numero_etapa_ativa_subject.asObservable()

    adicionarEtapa(titulo: string, descricao: string) {
        let numeroEtapa = this.etapas.length + 1;

        this.etapas.push(new EtapaPassoPasso(numeroEtapa, titulo, descricao))
    }

    adicionarEtapaComNumero(numeroEtapa: number, titulo: string, descricao: string) {
        this.etapas.push(new EtapaPassoPasso(numeroEtapa, titulo, descricao))
    }

    alterarPaginaAtiva(numeroEtapaAtiva: number) {
        this.numero_etapa_ativa = numeroEtapaAtiva;
        this.numero_etapa_ativa_subject.next(this.numero_etapa_ativa);
    }


    passarEtapa() {
        let quantidadeEtapasASeremPassadas = 1;

        let indexAtual = this.numero_etapa_ativa - 1;

        while (this.etapas[indexAtual + quantidadeEtapasASeremPassadas] &&
            !this.etapas[indexAtual + quantidadeEtapasASeremPassadas].visivel) {
            quantidadeEtapasASeremPassadas++;
        }

        this.numero_etapa_ativa += quantidadeEtapasASeremPassadas;
        this.numero_etapa_ativa_subject.next(this.numero_etapa_ativa);
    }

    voltarEtapa() {
        let quantidadeEtapasASeremVoltadas = 1;
        let indexAtual = this.numero_etapa_ativa - 1;

        while (this.etapas[indexAtual - quantidadeEtapasASeremVoltadas] &&
            !this.etapas[indexAtual - quantidadeEtapasASeremVoltadas].visivel) {
            quantidadeEtapasASeremVoltadas++;
        }

        this.numero_etapa_ativa -= quantidadeEtapasASeremVoltadas;
        this.numero_etapa_ativa_subject.next(this.numero_etapa_ativa);
    }

    mostrarEtapa(indexDaEtapa: number) {
        this.etapas[indexDaEtapa].visivel = true;
    }

    mostrarTodasAsAbas() {
        this.etapas.forEach((etapa: EtapaPassoPasso) => {
            etapa.visivel = true;
        });
    }

    esconderEtapa(indexDaEtapa: number) {
        this.etapas[indexDaEtapa].visivel = false;
    }

    esconderEtapas(indexDaEtapa: number[]) {
        for (let i = 0; i < indexDaEtapa.length; i++)
            this.esconderEtapa(indexDaEtapa[i]);

        this.alterarNumeracaoEtapas();
    }

    alterarNumeracaoEtapas() {
        let numeracaoEtapasVisiveis = 1;

        this.etapas.forEach((etapa: EtapaPassoPasso) => {

            if (etapa.visivel) {
                etapa.descricao_numero_etapa = numeracaoEtapasVisiveis;
                numeracaoEtapasVisiveis++;
            }
        });
    }

    quantidadeEtapas() {

        return this.etapas.filter((etapa: EtapaPassoPasso) => etapa.visivel).length;
    }

    atualizarTitulo(indice: number, novoTitulo: string): void {
        if (this.etapas[indice - 1]) {
            this.etapas[indice - 1].titulo = novoTitulo;
        }
    }
}

export class EtapaPassoPasso {
    numero_etapa: number;
    descricao_numero_etapa: number;
    titulo: string;
    descricao: string;
    visivel: boolean;

    constructor(numeroEtapa: number, titulo: string, descricao: string) {
        this.numero_etapa = numeroEtapa;
        this.descricao_numero_etapa = numeroEtapa;
        this.titulo = titulo;
        this.descricao = descricao;
        this.visivel = true;
    }
}