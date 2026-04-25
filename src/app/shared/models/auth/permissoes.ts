export class Permissoes {
    permissoes_usuario: PermissoesUsuario;
    menus_liberados: string[];
}

export class PermissoesCadastrosUsuario {
    id: string;
    id_usuario: string;
    ver_dados_empresa: boolean;
    gerenciar_dados_empresa: boolean;
    ver_usuarios: boolean;
    gerenciar_usuarios: boolean;
    ver_contas_bancarias: boolean;
    gerenciar_contas_bancarias: boolean;
    ver_categorias_financeiras: boolean;
    gerenciar_categorias_financeiras: boolean;
    ver_parceiros: boolean;
    gerenciar_parceiros: boolean;
}

export class PermissoesFinanceiroUsuario {
    id: string;
    id_usuario: string;
    ver_lancamentos: boolean;
    gerenciar_lancamentos: boolean;
    ver_saldos_e_resultados: boolean;
}

export class PermissoesUsuario {
    id: string;
    ver_apenas_clientes_da_carteira: boolean;
}