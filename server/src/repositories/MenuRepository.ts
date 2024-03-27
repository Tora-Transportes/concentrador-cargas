import { mssqlConcV2 } from "../database";
//import AppError from "../models/AppError";

interface IPPOParametrosGrupoRepository {
  index(): Promise<any | undefined>;
}

function menuToJson(menuItems: any) {
  const menu: any = [];
  menuItems.forEach((item: any) => {
    console.log(item.id);
    const menuItem = {
      id: item.id,
      nome: item.nome,
      pai: item.pai,
      submenu: item.submenu,
      ordem: item.ordem,
      icon: item.icon,
      iconPath: item.iconPath,
      iconName: item.iconName,
      filhos: [],
    };
    if (item.submenu) {
      menuItem.filhos = menuToJson(item.submenu_itens);
    }
    menu.push(menuItem);
  });
  return menu;
}

export class MenuRepository implements IPPOParametrosGrupoRepository {
  async index(): Promise<any | undefined> {
    const data = await mssqlConcV2.raw("SELECT * FROM Menu");
    const jsonMenu = { menu: menuToJson(data) };
    return jsonMenu;
  }
}
