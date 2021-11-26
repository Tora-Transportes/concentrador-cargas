import {
  ViewUsuarioRepository,
  UpdateUsuarioRepository,
} from "../repositories/UsuarioRepository";
import IUsuario from "../models/IUsuario";

export class UseCaseUpdateUsuario {
  async run(usuario: Record<string, unknown>) {
    const { oid, nome, email, permissoes } = usuario;

    const viewRepository = new ViewUsuarioRepository();

    const usuarioCompleto: IUsuario = (await viewRepository.run({ oid }))
      .results[0];
    if (nome) {
      usuarioCompleto.nome = String(nome);
    }

    if (email) {
      usuarioCompleto.email = String(email);
    }

    if (permissoes && Array.isArray(permissoes)) {
      usuarioCompleto.permissoes = permissoes;
    }

    const repository = new UpdateUsuarioRepository();
    await repository.save(String(oid), usuarioCompleto);
    return usuarioCompleto;
  }
}

export class UseCaseViewUsuario {
  async run(filter: Record<string, any>, page = 1) {
    return new ViewUsuarioRepository().run(filter, page);
  }
}
