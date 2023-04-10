import { UsuarioRepository } from "../repositories/UsuarioRepository";
import IUsuario from "../models/IUsuario";
import AppError from "../models/AppError";

type TPermissions = string[];
export interface ISavePermission {
  fk_usuario: string;
  permissao: string;
}

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
export class UseCaseBatchPermissions {
  async run(permissoes: TPermissions): Promise<string> {
    if (!permissoes.length)
      throw new AppError(
        "Dados do body incorretos, adicione uma ou mais permissão.",
        400
      );
    const usuarioRepository = new UsuarioRepository();

    const allFkUsuarios: TPermissions = (
      await usuarioRepository.getAllFkUsuario()
    ).map((item) => item.fk_usuario);

    if (allFkUsuarios.length) {
      await usuarioRepository.deleteAllPermissions(permissoes);
      const permissionSave: ISavePermission[] = [];
      allFkUsuarios.forEach((fk_usuario) => {
        permissoes.map((permissao) => {
          permissionSave.push({ fk_usuario, permissao });
        });
      });

      if (permissionSave.length)
        await usuarioRepository.insertAllPermissions(permissionSave);
    }

    return "Permissões adicionadas com sucesso.";
  }
}
export class UseCaseDeleteAllPermissions {
  async run(permissoes: TPermissions): Promise<string> {
    if (!permissoes.length)
      throw new AppError(
        "Dados do body incorretos, adicione uma ou mais permissão.",
        400
      );
    const usuarioRepository = new UsuarioRepository();

    const allFkUsuarios: TPermissions = (
      await usuarioRepository.getAllFkUsuario()
    ).map((item) => item.fk_usuario);

    if (allFkUsuarios.length) {
      await usuarioRepository.deleteAllPermissions(permissoes);
    }

    return "Permissões deletadas com sucesso.";
  }
}

export class UseCaseViewUsuario {
  async run(filter: Record<string, any>) {
    const usuarioRepository = new UsuarioRepository();
    return usuarioRepository.search(filter);
  }
}
export class UseCaseSearchName {
  async run(filter: Record<string, any>) {
    const usuarioRepository = new UsuarioRepository();
    return usuarioRepository.searchName(filter);
  }
}
