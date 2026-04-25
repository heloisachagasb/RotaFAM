import { Permissoes } from "./permissoes";


export class LoginResponse {
    id_usuario: string;
    token: string;
    nome_usuario: string;
    id_cliente: string;
    chave_tela_inicial: string | null;
    id_usuario_mpm: number | null;
    permissoes: Permissoes;
}
