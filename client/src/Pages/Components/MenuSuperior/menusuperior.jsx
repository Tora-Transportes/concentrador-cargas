/* eslint-disable prettier/prettier */
import React, { useContext, useEffect, useRef, useState } from "react";
import Logo from "../../../assets/logotoraico.png";
import "./menuSuperior.css";
import "primeicons/primeicons.css";
import { NavbarBrand } from "react-bootstrap";
import { FaSignOutAlt } from "react-icons/fa";
import { logout } from "../../../MicrosoftAuthentication";
import { validationPermissionUser } from "src/Pages/Utils/validationPermissionUser";
import { ContextUseDefault } from "src/hooks/context/contextPagCargaCTE";

function Menusuperior() {
  const [isNavExpanded, setIsNavExpanded] = useState(false);
  const hamburgerRef = useRef(null);
  const [isPermissionCsn, setPermissionCsn] = useState(false);
  const [isPermissionPadrao, setPermissionPadrao] = useState(false);
  const [isPermAlterarPerm, setPermAlterarPerm] = useState(false);
  const [isColorHeader, setColorHeader] = useState("header");
  const { setPermissionUser } = useContext(ContextUseDefault);
  const [permissoes, setPermissoes] = useState(null);
  const currentPath = window.location.pathname.replace(/\/+$/, "") || "/";

  const isPathActive = (path, exact = true) => {
    const normalizedPath = path.replace(/\/+$/, "") || "/";

    if (exact) return currentPath === normalizedPath;

    return (
      currentPath === normalizedPath ||
      currentPath.startsWith(`${normalizedPath}/`)
    );
  };

  const getMenuItemClass = (isActive, baseClass = "") =>
    [baseClass, isActive ? "menu-item-active" : ""].filter(Boolean).join(" ");

  const getSubmenuItemClass = (path, exact = true) =>
    isPathActive(path, exact) ? "submenu-item-active" : "";

  useEffect(() => {
    (async () => {
      const userPermission = await validationPermissionUser();
      setPermissoes(userPermission);
      setPermissionUser(userPermission?.permissoes);
      if (userPermission?.permissoes?.includes("CARGAS_PADRAO"))
        setPermissionPadrao(true);

      if (userPermission?.permissoes?.includes("CARGAS_CSN"))
        setPermissionCsn(true);

      if (userPermission?.permissoes?.includes("ALTERAR_PERMISSOES"))
        setPermAlterarPerm(true);
    })();
    const tipoCorHeader =
      process.env.REACT_APP_COR_NAVEBAR === "DEV" ? "headerDev" : "header";
    setColorHeader(tipoCorHeader);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.id) {
        if (
          hamburgerRef.current &&
          !hamburgerRef.current.contains(event.target)
        ) {
          setIsNavExpanded(false);
        }
      }
    };
    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [hamburgerRef]);

  return (
    <div id={isColorHeader}>
      <NavbarBrand href="/">
        <img src={Logo} alt="Logo Tora" id="logo" />
      </NavbarBrand>
      <nav id="nav" className={isNavExpanded ? "active" : "inactive"}>
        <button
          aria-label="Abrir Menu"
          id="btn-mobile"
          aria-haspopup="true"
          aria-controls="menu"
          aria-expanded={isNavExpanded}
          onClick={() => {
            setIsNavExpanded(!isNavExpanded);
          }}
          ref={hamburgerRef}
        >
          <span id="hamburguer"></span>
        </button>
        <ul id="menu" role="menu" className="class-ul">
          <li className="class-li">
            <a
              id="style-a"
              href="/"
              className={getMenuItemClass(isPathActive("/"))}
              aria-current={isPathActive("/") ? "page" : undefined}
            >
              Início
            </a>
          </li>
          <div className="class-li">
            <div className="dropdown">
              {permissoes?.permissoes?.includes("GESTAO_MULTAS") && (
                <button
                  id="style-button-drop"
                  className={getMenuItemClass(
                    isPathActive("/gestao-multas", false),
                    "dropbtn",
                  )}
                  aria-current={
                    isPathActive("/gestao-multas", false) ? "page" : undefined
                  }
                >
                  Gestão de Multas
                </button>
              )}
              <div id="myDropdown" className="dropdown-content">
                {permissoes?.permissoes?.includes("GM_MULTAS") && (
                  <a
                    href="/gestao-multas/multas"
                    className={getSubmenuItemClass(
                      "/gestao-multas/multas",
                      false,
                    )}
                  >
                    Multas
                  </a>
                )}
                {permissoes?.permissoes?.includes("GM_NOTIFICACOES") && (
                  <a
                    href="/gestao-multas/notificacoes"
                    className={getSubmenuItemClass(
                      "/gestao-multas/notificacoes",
                      false,
                    )}
                  >
                    Notificações
                  </a>
                )}
                {permissoes?.permissoes?.includes("GM_PERMISSOES") && (
                  <a
                    href="/gestao-multas/permissoes"
                    className={getSubmenuItemClass(
                      "/gestao-multas/permissoes",
                      false,
                    )}
                  >
                    Permissões do Módulo
                  </a>
                )}
                {permissoes?.permissoes?.includes("GM_EMPRESAS") && (
                  <a
                    href="/gestao-multas/empresas"
                    className={getSubmenuItemClass(
                      "/gestao-multas/empresas",
                      false,
                    )}
                  >
                    Empresas
                  </a>
                )}
                {permissoes?.permissoes?.includes("GM_IMPEDIMENTOS") && (
                  <a
                    href="/gestao-multas/impedimentos"
                    className={getSubmenuItemClass(
                      "/gestao-multas/impedimentos",
                      false,
                    )}
                  >
                    Impedimentos
                  </a>
                )}
              </div>
            </div>
          </div>
          <div className="class-li">
            <div className="dropdown">
              {permissoes?.permissoes?.includes("PPO_EVENTOS") && (
                <button
                  id="style-button-drop"
                  className={getMenuItemClass(
                    isPathActive("/ppo_eventos", false),
                    "dropbtn",
                  )}
                  aria-current={
                    isPathActive("/ppo_eventos", false) ? "page" : undefined
                  }
                >
                  PPO Eventos
                </button>
              )}
              <div id="myDropdown" className="dropdown-content">
                {permissoes?.permissoes?.includes("PPO_EVENTOS_PERMISSOES") && (
                  <a
                    href="/ppo_eventos/permissoes"
                    className={getSubmenuItemClass(
                      "/ppo_eventos/permissoes",
                      false,
                    )}
                  >
                    Permissões Aprovação
                  </a>
                )}
                {permissoes?.permissoes?.includes(
                  // eslint-disable-next-line prettier/prettier
                  "PPO_EVENTOS_APROVACAO_SUPERVISOR",
                ) && (
                  <a
                    href="/ppo_eventos/aprovacao/supervisor"
                    className={getSubmenuItemClass(
                      "/ppo_eventos/aprovacao/supervisor",
                      false,
                    )}
                  >
                    Aprovação de Eventos Supervisor
                  </a>
                )}
                {permissoes?.permissoes?.includes(
                  // eslint-disable-next-line prettier/prettier
                  "PPO_EVENTOS_APROVACAO_GERENTE",
                ) && (
                  <a
                    href="/ppo_eventos/aprovacao/gerente"
                    className={getSubmenuItemClass(
                      "/ppo_eventos/aprovacao/gerente",
                      false,
                    )}
                  >
                    Aprovação de Eventos Gerente
                  </a>
                )}
                {permissoes?.permissoes?.includes("PPO_EVENTOS_RELATORIO") && (
                  <a
                    href="/ppo_eventos/relatorios/eventos"
                    className={getSubmenuItemClass(
                      "/ppo_eventos/relatorios/eventos",
                      false,
                    )}
                  >
                    Relatório Eventos
                  </a>
                )}
                {permissoes?.permissoes?.includes(
                  // eslint-disable-next-line prettier/prettier
                  "PPO_EVENTOS_RELATORIO_APROVACOES",
                ) && (
                  <a
                    href="/ppo_eventos/relatorios/aprovacoes"
                    className={getSubmenuItemClass(
                      "/ppo_eventos/relatorios/aprovacoes",
                      false,
                    )}
                  >
                    Relatório Aprovações
                  </a>
                )}
              </div>
            </div>
          </div>
          <div className="class-li">
            <div className="dropdown">
              {permissoes?.permissoes?.includes("PPO_MENU") && (
                <button
                  id="style-button-drop"
                  className={getMenuItemClass(
                    isPathActive("/ppo", false),
                    "dropbtn",
                  )}
                  aria-current={
                    isPathActive("/ppo", false) ? "page" : undefined
                  }
                >
                  PPO
                </button>
              )}
              <div id="myDropdown" className="dropdown-content">
                {permissoes?.permissoes?.includes("PPO_CAD_MANUAL") && (
                  <a
                    href="/ppo/manual"
                    className={getSubmenuItemClass("/ppo/manual", false)}
                  >
                    PPO Manual
                  </a>
                )}
                {permissoes?.permissoes?.includes("PPO_RASTREABILIDADE") && (
                  <a
                    href="/ppo/rastreabilidade"
                    className={getSubmenuItemClass(
                      "/ppo/rastreabilidade",
                      false,
                    )}
                  >
                    PPO Rastreabilidade
                  </a>
                )}
                {permissoes?.permissoes?.includes("PPO_ESTATISTICA") && (
                  <a
                    href="/ppo/estatisticas"
                    className={getSubmenuItemClass("/ppo/estatisticas", false)}
                  >
                    PPO Estátisticas
                  </a>
                )}
                {permissoes?.permissoes?.includes("PPO_CAD_GRUPO") && (
                  <a
                    href="/ppo/grupos"
                    className={getSubmenuItemClass("/ppo/grupos")}
                  >
                    PPO Cadastro Grupo
                  </a>
                )}
                {permissoes?.permissoes?.includes(
                  // eslint-disable-next-line prettier/prettier
                  "PPO_LOG_MOVIMENTACAO_MOTORISTA",
                ) && (
                  <a
                    href="/ppo/grupos/motoristas/historico"
                    className={getSubmenuItemClass(
                      "/ppo/grupos/motoristas/historico",
                      false,
                    )}
                  >
                    Movimentações Motorista Grupo
                  </a>
                )}
                {permissoes?.permissoes?.includes("PPO_CAD_PARAMETROS") && (
                  <a
                    href="/ppo/parametros"
                    className={getSubmenuItemClass("/ppo/parametros", false)}
                  >
                    PPO Cadastro Parâmetros
                  </a>
                )}
                {permissoes?.permissoes?.includes("PPO_RELATORIO") && (
                  <a
                    href="/ppo/relatorio/motoristas"
                    className={getSubmenuItemClass(
                      "/ppo/relatorio/motoristas",
                      false,
                    )}
                  >
                    Relatório de Motoristas
                  </a>
                )}
                {permissoes?.permissoes?.includes(
                  // eslint-disable-next-line prettier/prettier
                  "PPO_RELATORIO_DOCUMENTOS",
                ) && (
                  <a
                    href="/ppo/relatorio/documentos"
                    className={getSubmenuItemClass(
                      "/ppo/relatorio/documentos",
                      false,
                    )}
                  >
                    Relatório de Documentos Assinados
                  </a>
                )}
                {permissoes?.permissoes?.includes("PPO_DEMONSTRATIVO") && (
                  <a
                    href="/ppo/demonstrativos"
                    className={getSubmenuItemClass(
                      "/ppo/demonstrativos",
                      false,
                    )}
                  >
                    Demonstrativo Motoristas
                  </a>
                )}
                {permissoes?.permissoes?.includes("PPO_EXPORTA_PROTHEUS") && (
                  <a
                    href="/ppo/exportar/protheus"
                    className={getSubmenuItemClass(
                      "/ppo/exportar/protheus",
                      false,
                    )}
                  >
                    Exportação Protheus
                  </a>
                )}
                {permissoes?.permissoes?.includes("PPO_CALCULADOR") && (
                  <a
                    href="/ppo/calculador"
                    className={getSubmenuItemClass("/ppo/calculador", false)}
                  >
                    Calculador PPO
                  </a>
                )}
                {permissoes?.permissoes?.includes(
                  // eslint-disable-next-line prettier/prettier
                  "PPO_PERMISSOES_VISUALIZACAO",
                ) && (
                  <a
                    href="/ppo/permissoes-visualizacao"
                    className={getSubmenuItemClass(
                      "/ppo/permissoes-visualizacao",
                      false,
                    )}
                  >
                    Permissões para Visualização
                  </a>
                )}
              </div>
            </div>
          </div>

          <div className="class-li">
            <div className="dropdown">
              {permissoes?.permissoes?.includes("PPA_MENU") && (
                <button
                  id="style-button-drop"
                  className={getMenuItemClass(
                    isPathActive("/ppa", false),
                    "dropbtn",
                  )}
                  aria-current={
                    isPathActive("/ppa", false) ? "page" : undefined
                  }
                >
                  PPA
                </button>
              )}
              <div id="myDropdown" className="dropdown-content">
                {permissoes?.permissoes?.includes("PPA_RELATORIO") && (
                  <a
                    href="/ppa/reports"
                    className={getSubmenuItemClass("/ppa/reports", false)}
                  >
                    Relatório de motoristas
                  </a>
                )}
                {permissoes?.permissoes?.includes(
                  // eslint-disable-next-line prettier/prettier
                  "PPA_MOTORISTAS_BLOQUEIO",
                ) && (
                  <a
                    href="/ppa/blockedDrivers"
                    className={getSubmenuItemClass(
                      "/ppa/blockedDrivers",
                      false,
                    )}
                  >
                    Motoristas para bloqueio
                  </a>
                )}
                {permissoes?.permissoes?.includes("PPA_BLOQUEIO_RELATORIO") && (
                  <a
                    href="/ppa/blockedDriversSummary"
                    className={getSubmenuItemClass(
                      "/ppa/blockedDriversSummary",
                      false,
                    )}
                  >
                    Histórico de bloqueios
                  </a>
                )}
              </div>
            </div>
          </div>
          <div className="class-li">
            <div className="dropdown">
              {(isPermissionCsn || isPermissionPadrao) && (
                <button
                  id="style-button-drop"
                  className={getMenuItemClass(
                    isPathActive("/cargas", false) ||
                      isPathActive("/lotes", false),
                    "dropbtn",
                  )}
                  aria-current={
                    isPathActive("/cargas", false) ||
                    isPathActive("/lotes", false)
                      ? "page"
                      : undefined
                  }
                >
                  Cargas
                </button>
              )}
              <div id="myDropdown" className="dropdown-content">
                <a
                  href="/cargas/menu"
                  className={getSubmenuItemClass("/cargas/menu")}
                >
                  Cadastrar Cargas
                </a>
                {isPermissionPadrao && (
                  <>
                    <a
                      href="/cargas/visualizar"
                      className={getSubmenuItemClass("/cargas/visualizar")}
                    >
                      Listagem de Cargas
                    </a>
                    <a
                      href="/lotes/visualizar"
                      className={getSubmenuItemClass(
                        "/lotes/visualizar",
                        false,
                      )}
                    >
                      Listagem de Lotes
                    </a>
                  </>
                )}
                {isPermissionCsn && (
                  <a
                    href="/cargas/visualizar/csn"
                    className={getSubmenuItemClass(
                      "/cargas/visualizar/csn",
                      false,
                    )}
                  >
                    Listagem CSN
                  </a>
                )}
                {permissoes?.permissoes?.includes("PRE_REQUISITOS_CARGAS") && (
                  <a
                    href="/cargas/pre-requisitos"
                    className={getSubmenuItemClass(
                      "/cargas/pre-requisitos",
                      false,
                    )}
                  >
                    Pré-requisitos
                  </a>
                )}
                {permissoes?.permissoes?.includes("INTEGRACAO_APP") && (
                  <a
                    href="/cargas/integracao"
                    className={getSubmenuItemClass("/cargas/integracao", false)}
                  >
                    Integração Concentrador vs App
                  </a>
                )}
              </div>
            </div>
          </div>
          <li className="class-li">
            <a
              id="style-a"
              href="/veiculos/coordenadas"
              className={getMenuItemClass(
                isPathActive("/veiculos/coordenadas", false),
              )}
              aria-current={
                isPathActive("/veiculos/coordenadas", false)
                  ? "page"
                  : undefined
              }
            >
              Coordenadas
            </a>
          </li>
          <div className="class-li">
            <div className="dropdown">
              <button
                id="style-button-drop"
                className={getMenuItemClass(
                  isPathActive("/veiculos/aprovacao", false),
                  "dropbtn",
                )}
                aria-current={
                  isPathActive("/veiculos/aprovacao", false)
                    ? "page"
                    : undefined
                }
              >
                Monitoramento
              </button>
              <div id="myDropdown" className="dropdown-content">
                {isPermissionPadrao && (
                  <a
                    href="/veiculos/aprovacao/padrao"
                    className={getSubmenuItemClass(
                      "/veiculos/aprovacao/padrao",
                      false,
                    )}
                  >
                    Padrão
                  </a>
                )}
                {isPermissionCsn && (
                  <a
                    href="/veiculos/aprovacao/csn"
                    className={getSubmenuItemClass(
                      "/veiculos/aprovacao/csn",
                      false,
                    )}
                  >
                    CSN
                  </a>
                )}
              </div>
            </div>
          </div>
          {isPermAlterarPerm && (
            <li className="class-li">
              <a
                id="style-a"
                href="/usuarios/permissoes"
                className={getMenuItemClass(
                  isPathActive("/usuarios/permissoes", false),
                )}
                aria-current={
                  isPathActive("/usuarios/permissoes", false)
                    ? "page"
                    : undefined
                }
              >
                Permissões
              </a>
            </li>
          )}
          <li className="class-li">
            <a
              id="style-a"
              href="/produtos"
              className={getMenuItemClass(isPathActive("/produtos", false))}
              aria-current={
                isPathActive("/produtos", false) ? "page" : undefined
              }
            >
              Produtos
            </a>
          </li>
          <li className="class-li">
            <a
              href="/relatorios/visualizar"
              className={getMenuItemClass(
                isPathActive("/relatorios/visualizar", false),
                "dropbtn-veic",
              )}
              aria-current={
                isPathActive("/relatorios/visualizar", false)
                  ? "page"
                  : undefined
              }
              id="link-rel"
            >
              Relatórios
            </a>
          </li>
          {isPermissionCsn && (
            <li className="class-li">
              <a
                id="style-a"
                href="/localizacao"
                className={getMenuItemClass(
                  isPathActive("/localizacao", false),
                )}
                aria-current={
                  isPathActive("/localizacao", false) ? "page" : undefined
                }
              >
                Localização
              </a>
            </li>
          )}
          {/* {isPermissionPadrao && isPermissionCsn ? (
            <div className="class-li">
              <div className="dropdown">
                <button id="style-button-drop" className="dropbtn">
                  Ajuda
                </button>
                <div id="myDropdown" className="dropdown-content">
                  <>
                    <a href="/ajuda">Ajuda Padrão</a>
                    <a href="/ajuda/CSN">Ajuda CSN</a>
                  </>
                </div>
              </div>
            </div>
          ) : isPermissionCsn ? (
            <li className="class-li">
              <a id="style-a" href="/ajuda/CSN">
                Ajuda CSN
              </a>
            </li>
          ) : (
            isPermissionPadrao && (
              <li className="class-li">
                <a id="style-a" href="/ajuda">
                  Ajuda
                </a>
              </li>
            )
          )} */}

          <li className="class-li">
            <a
              id="style-a"
              onClick={() => {
                setTimeout(() => {
                  logout();
                }, 200);
              }}
            >
              Sair <FaSignOutAlt />
            </a>
          </li>
        </ul>
      </nav>
    </div>
  );
}
export default Menusuperior;
