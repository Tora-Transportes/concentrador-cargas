import React from "react";
import "./ajuda.css";
import Menusuperior from "../MenuSuperior/menusuperior";
import Accordion from "react-bootstrap/Accordion";
import { Button } from "react-bootstrap";
import cadastroCarga from "../../../assets/cadastrarCargasPadrao.gif";
import cadastroManual from "../../../assets/cadastroManual.gif";
import importacaoLote from "../../../assets/importacaoLote.gif";
import listagemCargas from "../../../assets/listagemCargas.gif";
import listagemLote from "../../../assets/cargaLote.gif";
import configTab from "../../../assets/configurarTabela.gif";
import opcoesTab from "../../../assets/opcaoTabela.gif";
import coordenadasGif from "../../../assets/coordenadaVeiculos2.gif";
import monitoramentoGif from "../../../assets/monitoramentoVeiculos.gif";
import telaProdutos from "../../../assets/telaprodutos2.gif";
import indicadorOperacional from "../../../assets/indicadorOperacional2.gif";
import rotasPendentes from "../../../assets/rotasPendentes.gif";
import raioEmpresa from "../../../assets/raioEmpresa2.gif";
import veicProximos from "../../../assets/veiculosProximos.gif";
import veicEmpresa from "../../../assets/veiculoEmpresa.gif";
import historicoRota from "../../../assets/historicoVeiculos.gif";

function Helper() {
	var acc = document.getElementsByClassName("accordion");
	var i;

	for (i = 0; i < acc.length; i++) {
		acc[i].addEventListener("click", function () {
			this.classList.toggle("active");
			var panel = this.nextElementSibling;
			if (panel.style.display === "block") {
				panel.style.display = "none";
			} else {
				panel.style.display = "block";
			}
		});
	}
	return (
		<div className="class-body mb-4">
			<Menusuperior />
			<div className="class-body-title">
				<h1 className="h1-ajuda">Bem-vindo(a) ao Ajuda!!</h1>
				<p className="class-p-ajuda">
					<br />
					O menu ajuda disponibiliza o passo a passo detalhado das
					funcionalidades do Concentrador de Cargas, <br /> facilitando a sua
					navegação na plataforma e melhorando o seu desempenho no ambiente de
					trabalho.
				</p>
			</div>
			<div>
				<p className="class-p-subtitle">
					Selecione a opção desejada e você dará início ao passo a passo
					correspondente:
				</p>
			</div>

			<Accordion
				defaultActiveKey={["0"]}
				alwaysOpen
				className="class-accordion"
			>
				<Accordion.Item eventKey="1">
					<Accordion.Header>Cadastrar Cargas</Accordion.Header>
					<Accordion.Body className="class-body-accordion">
						<p>
							No menu Cargas, ao clicar em Cadastrar Cargas você será
							direcionado(a) para a página de seleção, onde <br />
							deverá escolher o modo em que deseja cadastrar a carga.
						</p>
						<p>Exemplo da Página de Seleção: </p>

						<img src={cadastroCarga} id="style-gif2" />
						<p>
							Escolhido o modo de cadastro da carga, você será direcionado até a
							página de cadastro correspondente.
						</p>
						<p>Exemplo da página de Cadastro Manual: </p>
						<img src={cadastroManual} id="style-gif2" />
						<div className="class-button-ir">
							<Button
								href="/cargas/manual"
								id="button-cadastro-cargas"
								className="button-acc-veic"
							>
								Navegar até Cadastro Manual
							</Button>
						</div>

						<p>Exemplo da página de Importação em Lote: </p>
						<img src={importacaoLote} id="style-gif" />
						<div className="class-button-ir">
							<Button
								href="/cargas/importar"
								id="button-cadastro-cargas"
								className="button-acc-veic"
							>
								Navegar até Importação de Cargas
							</Button>
						</div>
					</Accordion.Body>
				</Accordion.Item>
				<Accordion.Item eventKey="2">
					<Accordion.Header>Listagem de Cargas</Accordion.Header>
					<Accordion.Body className="class-body-accordion">
						<p>
							Essa página lhe dará acesso ao detalhamento de informações das
							cargas cadastradas manualmente em <br /> nossa plataforma.
						</p>
						<p>Exemplo da Página Listagem de Cargas: </p>

						<img src={listagemCargas} id="style-gif" />
						<div className="class-button-ir">
							{/* <p className="class-p-nav">Navegar até a Página de Cadastro</p> */}
							<Button
								href="/cargas/visualizar"
								id="style-button-acc"
								className="class-button1"
							>
								Navegar até Listagem de Cargas
							</Button>
						</div>
					</Accordion.Body>
				</Accordion.Item>
				<Accordion.Item eventKey="3">
					<Accordion.Header>Listagem de Cargas em Lote</Accordion.Header>
					<Accordion.Body className="class-body-accordion">
						<p>
							Essa página lhe dará acesso ao detalhamento de informações das
							cargas cadastradas por importação <br /> em lote na plataforma.
						</p>
						<p>Exemplo da página Listagem de Cargas em Lotes: </p>

						<img src={listagemLote} id="style-gif" />
						<div className="class-button-ir">
							{/* <p className="class-p-nav">Navegar até a Página de Cadastro</p> */}
							<Button
								href="/lotes/visualizar"
								id="style-button-acc"
								className="class-button1"
							>
								Navegar até Cargas em Lotes
							</Button>
						</div>
					</Accordion.Body>
				</Accordion.Item>
				<Accordion.Item eventKey="4" id="style-button-accordion">
					<Accordion.Header>
						Configurar Tabela e Opções da Tabela
					</Accordion.Header>

					<Accordion.Body className="class-body-accordion">
						<p>
							Algumas ferramentas da plataforma irão permitir configurações nas
							páginas para que sejam apresentadas <br /> apenas as informações
							necessárias no momento da consulta, facilitando a utilização da
							plataforma. <br /> Essas funcionalidades buscam ajudar e otimizar
							seu uso nas páginas da plataforma, dando maior <br /> conforto e
							interação com as ferramentas disponíveis.
							<br />
							<br /> Veja a seguir os exemplos dessas funcionalidades: <br />{" "}
							<br />
							Configurar Tabela - você poderá filtrar os itens que deseja
							visualizar na página de acordo com a sua <br /> necessidade no
							momento da consulta.
						</p>
						<p className="mb-1">Exemplo do filtro Configurar Tabela: </p>
						<img src={configTab} id="style-gif2" />
						<p>
							Opções da Tabela - Legenda das cargas: explica o significado de
							todas as possíveis situações de cargas <br /> cadastradas no
							sistema, facilitando o entendimento das mesmas.
							<br /> Importar tabela: oferece o download da tabela em formato
							excel.
							<br /> Redefinir tabela: possibilita a redefinição das
							configurações feitas na página, para o formato padrão da
							ferramenta.
						</p>

						<p className="mb-1 mt-3">Exemplo de Opções da Tabela: </p>

						<img src={opcoesTab} id="style-gif2" />
					</Accordion.Body>
				</Accordion.Item>
				<Accordion.Item eventKey="5" id="style-button-accordion">
					<Accordion.Header>Coordenadas</Accordion.Header>
					<Accordion.Body className="class-body-accordion">
						<p>
							A página de Coordenadas disponibiliza detalhes do veículo,
							informações de rota e localização, categoria, <br /> placa, dados
							do motorista, dentre outras informações sobre os veículos
							cadastrados na plataforma.
						</p>
						<p>Exemplo da página Coordenadas:</p>
						<img src={coordenadasGif} id="style-gif" />

						<div className="class-button-ir">
							<Button
								href="/veiculos/coordenadas"
								id="style-button-acc"
								className="class-button1"
							>
								Navegar até Coordenadas
							</Button>
						</div>
					</Accordion.Body>
				</Accordion.Item>
				<Accordion.Item eventKey="6" id="style-button-accordion">
					<Accordion.Header>Monitoramento</Accordion.Header>
					<Accordion.Body className="class-body-accordion">
						<p>
							Nessa opção você será apresentado à página de Monitoramento, onde
							conseguirá verificar veículos <br /> pendentes, e aprovar ou
							reprovar veículos de acordo com a situação de cada um.
						</p>
						<p>Exemplo da página de Monitoramento: </p>
						<img src={monitoramentoGif} id="style-gif" />

						<div className="class-button-ir">
							<Button
								href="/veiculos/aprovacao/padrao"
								id="style-button-acc"
								className="class-button1"
							>
								Navegar até Monitoramento
							</Button>
						</div>
					</Accordion.Body>
				</Accordion.Item>
				<Accordion.Item eventKey="8" id="style-button-accordion">
					<Accordion.Header>Produtos</Accordion.Header>
					<Accordion.Body className="class-body-accordion">
						<p>
							Essa página possibilita visualizar, adicionar, editar e desativar
							produtos, e apresenta a situação de cada <br /> um deles, provendo
							melhor acompanhamento dos mesmos.
						</p>
						<p>Exemplo da página Produtos: </p>
						<img src={telaProdutos} id="style-gif" />
						<p>
							Lembrando que somente pessoas com permissão são aptas a adicionar,
							editar e desativar os produtos <br /> na plataforma.
						</p>

						<div className="class-button-ir">
							<Button
								href="/produtos"
								id="style-button-acc"
								className="class-button1"
							>
								Navegar até Produtos
							</Button>
						</div>
					</Accordion.Body>
				</Accordion.Item>
				<Accordion.Item eventKey="9" id="style-button-accordion">
					<Accordion.Header>Relatórios</Accordion.Header>
					<Accordion.Body className="class-body-accordion">
						<p>
							<br />
							Ao clicar em Relatórios, você terá várias opções de consulta
							disponíveis na plataforma, são elas: <br /> <br /> Indicador
							Operacional - Permite o acompanhamento das cargas e lotes,
							apresentando de acordo com o <br /> filtro de data utilizado, a
							situação gráfica das cargas, porcentagem de cargas ativadas e
							desativadas, <br /> entre outras informações presentes na página.
						</p>
						<img src={indicadorOperacional} id="style-gif2" />

						<div className="class-button-ir">
							<Button
								href="/relatorios"
								id="style-button-acc"
								className="class-button1"
							>
								Ir para Indicador Operacional
							</Button>
						</div>
						<p>
							Rotas Pendentes de Cadastro - Disponibiliza os nomes das cidades e
							estados de origem e destino, <br /> provendo acesso as informações
							de rotas, para um melhor acompanhamento.
						</p>
						<img src={rotasPendentes} id="style-gif" />

						<div className="class-button-ir">
							<Button
								href="/rotas/pendentes"
								id="style-button-acc"
								className="class-button1"
							>
								Ir para Rotas Pendentes
							</Button>
						</div>
						<p className="ms-1">
							As páginas que serão citadas a seguir representam funcionalidades
							similares: <br /> <br />
							Raio Empresa - Mostra os veículos no raio da empresa.
						</p>
						<img src={raioEmpresa} id="style-gif" />
						<p className="ms-1">
							Veículos x Veículos - Mostra a distância entre veículos que
							estejam próximos.
						</p>
						<img src={veicProximos} id="style-gif" />
						<p className="ms-1">
							Veículos até Empresa - Mostra a distância entre um veículo e a
							empresa.
						</p>
						<img src={veicEmpresa} id="style-gif" />
						<p>
							Abaixo estará disponível botões que irão te direcionar para as
							páginas abordadas acima, para acessá-las <br /> basta clicar em
							cada um dos botões e você será direcionado para a página
							escolhida.
						</p>

						<div className="class-button-ir">
							<Button href="/veiculos/raio/empresa" id="button-acc-veic">
								Ir para Raio Empresa
							</Button>
							<Button href="/veiculos/raio" id="button-acc-veic2">
								Ir para Veículos x Veículos
							</Button>{" "}
							<Button href="/veiculos/destino" id="button-acc-veic3">
								Ir para Veículos até Empresa
							</Button>
						</div>
						<p>
							<br />
							Em Histórico de Rotas do Veículo, você terá acesso a localização
							do veículo, filtrando pela placa <br /> do veículo e data a ser
							consultada, as informações serão mostradas no mapa disponibilizado{" "}
							<br /> na plataforma, a tela disponibiliza também a opção de
							download do histórico consultado via excel.
						</p>
						<img src={historicoRota} id="style-gif" />

						<div className="class-button-ir">
							<Button
								href="/veiculos/historico"
								id="style-button-acc"
								className="class-button1"
							>
								Ir para Histórico de Rotas
							</Button>
						</div>
					</Accordion.Body>
				</Accordion.Item>
			</Accordion>
		</div>
	);
}
export default Helper;
