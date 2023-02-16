// import React, { useEffect } from "react";
import "./ajuda.css";
import Menusuperior from "../MenuSuperior/menusuperior";
import Accordion from "react-bootstrap/Accordion";
import { Button } from "react-bootstrap";
import cadastroCarga from "../../../Gif/cadastrarCargaPadrao.gif";
import cadastroManual from "../../../Gif/cadastrarCargaManual.gif";
import importacaoLote from "../../../Gif/importarLote.gif";
import listagemCargas from "../../../Gif/listagemCargasPadrao.gif";
import listagemLote from "../../../Gif/listCargasLote.gif";
import edicaoCargas from "../../../Gif/editarCarga.gif";
import configTab from "../../../Gif/configTabela.gif";
import opcoesTab from "../../../Gif/optionsTable.gif";
import itensPage from "../../../Gif/itensPorPage.gif";
import coordenadasGif from "../../../Gif/coordenadas.gif";
import consultaCargas from "../../../Gif/consultarCarga.gif";
import monitoramentoGif from "../../../Gif/monitoramentoPadrao.gif";
import telaProdutos from "../../../Gif/produtos.gif";
import indicadorOperacional from "../../../Gif/indicadorOperacionalPadrao.gif";
import rotasPendentes from "../../../Gif/rotasPendentesCad.gif";
import raioEmpresa from "../../../Gif/raioAteEmpresa.gif";
import veicProximos from "../../../Gif/veiculosXveiculos.gif";
import veicEmpresa from "../../../Gif/veiculosEmpresa.gif";
import historicoRota from "../../../Gif/historicoRotaVeic.gif";

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

	// function gifRepeat() {
	// 	const [timeRepeat, setTimeRepeat] = useEffect();
	// }

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

			<Accordion defaultActiveKey={["0"]} className="class-accordion">
				<Accordion.Item eventKey="1">
					<Accordion.Header>Cadastrar Cargas</Accordion.Header>
					<Accordion.Body className="class-body-accordion">
						<p className="p-tela-ajuda">
							No menu Cargas, ao clicar em Cadastrar Cargas você será
							direcionado(a) para a página de seleção, onde <br />
							deverá escolher o modo em que deseja cadastrar a carga.
						</p>
						<p className="p-tela-ajuda">Exemplo da Página de Seleção: </p>

						<img src={cadastroCarga} id="style-gif2" />
						<p className="p-tela-ajuda">
							Ao escolher o modo de cadastro da carga, você será direcionado(a)
							até a página de cadastro correspondente.
						</p>
						<p className="p-tela-ajuda">
							Exemplo da página de Cadastro Manual:
						</p>
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

						<p className="p-tela-ajuda">
							Exemplo da página de Importação de Cargas:
						</p>
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
						<p className="p-tela-ajuda">
							Essa página lhe dará acesso ao detalhamento de informações das
							cargas cadastradas manualmente em <br /> nossa plataforma.
						</p>
						<p className="p-tela-ajuda">
							Exemplo da Página Listagem de Cargas:
						</p>

						<img src={listagemCargas} id="style-gif" />
						<div className="class-button-ir">
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
						<p className="p-tela-ajuda">
							Essa página lhe dará acesso ao detalhamento de informações das
							cargas cadastradas por importação <br /> em lote na plataforma.
						</p>
						<p className="p-tela-ajuda">
							Exemplo da página Listagem de Cargas em Lotes:
						</p>

						<img src={listagemLote} id="style-gif" />
						<div className="class-button-ir">
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
				<Accordion.Item eventKey="4">
					<Accordion.Header>Edição de Cargas</Accordion.Header>
					<Accordion.Body className="class-body-accordion">
						<p className="p-tela-ajuda">
							Ao acessar a página você poderá editar/modificar as informações
							das cargas, sendo possivel editar uma carga por vez, <br />
							mantendo as informações atualizadas em nossa plataforma, as carga
							são controladas pelo código e você terá acesso <br /> a essa
							ferramenta através das telas de Listagem de Cargas e Cargas em
							Lotes. <br /> Segue abaixo o exemplo da página Editar Cargas:
						</p>

						<img src={edicaoCargas} id="style-gif" />
						<p>
							Para acessar a página de edição de cargas, basta clicar no ícone
							conforme exemplificado acima.
						</p>
					</Accordion.Body>
				</Accordion.Item>
				<Accordion.Item eventKey="5" id="style-button-accordion">
					<Accordion.Header>Ferramentas da Plataforma</Accordion.Header>

					<Accordion.Body className="class-body-accordion">
						<p className="p-tela-ajuda">
							Algumas ferramentas da plataforma irão permitir configurações nas
							páginas para que sejam apresentadas <br /> apenas as informações
							necessárias no momento da consulta, facilitando sua utilização da
							plataforma. <br /> Essas funcionalidades buscam ajudar e otimizar
							seu uso nas páginas da plataforma, dando maior <br /> conforto e
							interação com as ferramentas disponíveis.
							<br />
							<br /> Veja a seguir os exemplos dessas funcionalidades: <br />
							<br />
							<b className="style-b-ajuda">Configurar Tabela - </b>você poderá
							filtrar os itens que deseja visualizar na página de acordo com a
							sua <br /> necessidade no momento da consulta.
						</p>
						<p className="p-tela-ajuda mb-1">
							Exemplo do filtro Configurar Tabela:
						</p>
						<img src={configTab} id="style-gif2" />
						<p className="p-tela-ajuda">
							<b className="style-b-ajuda">Opções da Tabela - </b>{" "}
							<b>Legenda das cargas:</b> Mostra o significado de todas as
							possíveis situações de cargas <br /> cadastradas no sistema,
							facilitando o entendimento das mesmas.
							<br />
							<br /> <b>Importar tabela:</b> Permite filtro por data e código da
							filial e oferece o download da tabela em formato excel.
							<br /> <br /> <b>Redefinir tabela:</b> Possibilita a redefinição
							das configurações feitas na página, para o formato padrão da
							ferramenta.
						</p>
						<p className="p-tela-ajuda mb-1 mt-3">
							Exemplo de Opções da Tabela:{" "}
						</p>
						<img src={opcoesTab} id="style-gif2" />
						<p className="p-tela-ajuda">
							<b className="style-b-ajuda">Itens por página - </b> Permite que
							você visualize de 10 à 500 itens nas páginas de Listagem de
							Cargas, <br />
							Listagem de Cargas em Lote e Coordenadas.
						</p>
						<p className="p-tela-ajuda mb-1 mt-3">
							Exemplo de Itens por Página:
						</p>
						<img src={itensPage} id="style-gif2" />
					</Accordion.Body>
				</Accordion.Item>
				<Accordion.Item eventKey="6" id="style-button-accordion">
					<Accordion.Header>Coordenadas</Accordion.Header>
					<Accordion.Body className="class-body-accordion">
						<p className="p-tela-ajuda">
							A página de Coordenadas disponibiliza detalhes do veículo,
							informações de rota e localização, categoria, <br /> placa, dados
							do motorista, dentre outras informações sobre os veículos
							cadastrados na plataforma.
						</p>
						<p className="p-tela-ajuda">Exemplo da página Coordenadas:</p>
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
				<Accordion.Item eventKey="7" id="style-button-accordion">
					<Accordion.Header>Consulta de Cargas</Accordion.Header>
					<Accordion.Body className="class-body-accordion">
						<p className="p-tela-ajuda">
							Ao acessar a tela de Consulta de Cargas (presente na página de
							Coordenadas), você poderá visualizar <br /> informações de cargas
							abertas manualmente em nossa plataforma.
						</p>
						<p className="p-tela-ajuda">Exemplo da página de Consulta:</p>
						<img src={consultaCargas} id="style-gif" />

						<p>
							Para acessar a página de consulta de cargas, basta clicar no ícone
							conforme exemplificado acima.
						</p>
					</Accordion.Body>
				</Accordion.Item>
				<Accordion.Item eventKey="8" id="style-button-accordion">
					<Accordion.Header>Monitoramento</Accordion.Header>
					<Accordion.Body className="class-body-accordion">
						<p className="p-tela-ajuda">
							Nessa opção você será apresentado à página de Monitoramento, onde
							conseguirá verificar veículos <br /> pendentes, e aprovar ou
							reprovar veículos de acordo com a situação de cada um.
						</p>
						<p className="p-tela-ajuda">Exemplo da página de Monitoramento: </p>
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
				<Accordion.Item eventKey="9" id="style-button-accordion">
					<Accordion.Header>Produtos</Accordion.Header>
					<Accordion.Body className="class-body-accordion">
						<p className="p-tela-ajuda">
							Essa página possibilita visualizar, adicionar, editar e desativar
							produtos, e apresenta a situação de cada <br /> um deles, provendo
							melhor acompanhamento dos mesmos.
						</p>
						<p className="p-tela-ajuda">Exemplo da página de Produtos: </p>
						<img src={telaProdutos} id="style-gif" />
						<p className="ajuda-csn-p">
							Somente pessoas com permissão são aptas a adicionar, editar e
							desativar os produtos <br /> na plataforma.
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
				<Accordion.Item eventKey="10" id="style-button-accordion">
					<Accordion.Header>Relatórios</Accordion.Header>
					<Accordion.Body className="class-body-accordion">
						<p className="p-tela-ajuda">
							<br />
							Ao clicar em Relatórios, você terá várias opções de consulta
							disponíveis na plataforma, são elas: <br /> <br />{" "}
							<b className="style-b-ajuda">Indicador Operacional - </b>Mostra a
							situação e permite acompanhamento das cargas já cadastradas na{" "}
							<br /> platafoma, essas informações serão apresentadas de acordo
							com o preechimento do filtro de data, a
							<br /> página conta também com gráfico e tabela,cargas ativadas e
							desativadas, entre outras informações.
						</p>
						<img src={indicadorOperacional} id="style-gif2" />

						<div className="class-button-ir">
							<Button
								href="/relatorios/visualizar/padrao"
								id="style-button-acc"
								className="class-button1"
							>
								Ir para Indicador Operacional
							</Button>
						</div>
						<p className="p-tela-ajuda">
							<b className="style-b-ajuda">Rotas Pendentes de Cadastro - </b>{" "}
							Disponibiliza os nomes das cidades e dos estados de origem e
							<br /> destino, provendo acesso á informações de rotas, e permite
							também que você busque uma cidade ou estado <br /> específico,
							para melhor acompanhamento.
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
						<p className="p-tela-ajuda ms-1">
							<b className="style-b-ajuda">Raio Empresa - </b> Mostra os
							veículos no raio da empresa.
						</p>
						<img src={raioEmpresa} id="style-gif" />
						<div className="class-button-ir">
							<Button href="/veiculos/raio/empresa" id="style-button-acc">
								Ir para Raio Empresa
							</Button>
						</div>
						<p className="p-tela-ajuda ms-1">
							<b className="style-b-ajuda">Veículos x Veículos - </b> Mostra a
							distância entre veículos próximos.
						</p>
						<img src={veicProximos} id="style-gif" />
						<div className="class-button-ir">
							<Button href="/veiculos/raio" id="style-button-acc">
								Ir para Veículos x Veículos
							</Button>
						</div>
						<p className="p-tela-ajuda ms-1">
							<b className="style-b-ajuda">Veículos até Empresa - </b> Mostra a
							distância entre um veículo e a empresa.
						</p>
						<img src={veicEmpresa} id="style-gif" />

						<div className="class-button-ir">
							<Button href="/veiculos/destino" id="style-button-acc">
								Ir para Veículos até Empresa
							</Button>
						</div>
						<p className="p-tela-ajuda">
							<br />
							Em <b className="style-b-ajuda">Histórico de Rotas do Veículo </b>
							, você terá acesso ao histórico de localização do veículo, busque
							pela <br /> placa do veículo e datas de início e fim e as
							informações serão mostradas no mapa da plataforma, a tela <br />{" "}
							oferece também a opção de download do histórico consultado (via
							excel).
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
				<div>
					<p className="ajuda-csn-p-fim">
						Recado Importante: Todas as informações presentes na página podem
						sofrer alterações sem aviso prévio, os gifs disponibilizados são
						apenas exemplos para facilitar a utilização da página, sendo que
						podem apresentar diferenças mínimas da ferramenta dependendo da
						versão, e que as mudanças que acontecerem futuramente, visam
						melhorar cada vez mais o tutorial de uso da nossa plataforma,
						auxiliando e garantindo melhor desempenho durante a jornada de
						trabalho.
					</p>
				</div>
			</Accordion>
		</div>
	);
}
export default Helper;
