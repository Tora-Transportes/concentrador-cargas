import { UsuarioRepository } from "../repositories/UsuarioRepository";
import IUsuario from "../models/IUsuario";
import AppError from "../models/AppError";

export class UseCaseUpdateUsuario {
  async run(usuario: Record<string, unknown>) {
    const { oid, nome, email, permissoes } = usuario;

    const usuarioRepository = new UsuarioRepository();

    const usuarioCompleto: IUsuario | undefined = await usuarioRepository.index(
      String(oid)
    );
    if (!usuarioCompleto) {
      throw new AppError("Usuário não existe", 404);
    }

    if (nome) {
      usuarioCompleto.nome = String(nome);
    }

    if (email) {
      usuarioCompleto.email = String(email);
    }

    if (permissoes && Array.isArray(permissoes)) {
      usuarioCompleto.permissoes = permissoes;
    }

    await usuarioRepository.update(String(oid), usuarioCompleto);
    return usuarioCompleto;
  }
}

export class UseCaseViewUsuario {
  async run(filter: Record<string, any>, page = 1) {
    const usuarioRepository = new UsuarioRepository();
    return usuarioRepository.search(filter, page);
  }
}
