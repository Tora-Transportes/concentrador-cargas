// // import React, { useEffect } from "react";
// import "./ajuda.css";
// import Menusuperior from "../MenuSuperior/menusuperior";
// import Accordion from "react-bootstrap/Accordion";
// import { Button } from "react-bootstrap";
// import cadastroCSN from "../../../Gif CSN/cadastroCSN.gif";
// import listagemCSN from "../../../Gif CSN/listagemCSN.gif";
// import edicaoCSN from "../../../Gif CSN/edicaoCSN.gif";
// import configTab from "../../../Gif/configTabela.gif";
// import opcoesTab from "../../../Gif/optionsTable.gif";
// import itensPage from "../../../Gif/itensPorPage.gif";
// import coordenadasGif from "../../../Gif/coordenadas.gif";
// import consultaCargas from "../../../Gif/consultarCarga.gif";
// import monitoramentoCSN from "../../../Gif CSN/monitoramentoCSN.gif";
// import telaProdutos from "../../../Gif/produtos.gif";
// import indicadorOperacionalCsn from "../../../Gif CSN/indicadorOperacionalCSN.gif";
// import rotasPendentes from "../../../Gif/rotasPendentesCad.gif";
// import raioEmpresa from "../../../Gif/raioAteEmpresa.gif";
// import veicProximos from "../../../Gif/veiculosXveiculos.gif";
// import veicEmpresa from "../../../Gif/veiculosEmpresa.gif";
// import historicoRota from "../../../Gif/historicoRotaVeic.gif";
// import localizacaoCSN from "../../../Gif CSN/localizacaoCSN.gif";

// function HelperCSN() {
// 	var acc = document.getElementsByClassName("accordion");
// 	var i;

// 	for (i = 0; i < acc.length; i++) {
// 		acc[i].addEventListener("click", function () {
// 			this.classList.toggle("active");
// 			var panel = this.nextElementSibling;
// 			if (panel.style.display === "block") {
// 				panel.style.display = "none";
// 			} else {
// 				panel.style.display = "block";
// 			}
// 		});
// 	}

// 	return (
// 		<div className="class-body mb-4">
// 			<Menusuperior />
// 			<div className="class-body-title">
// 				<h1 className="h1-ajuda">Bem-vindo(a) ao Ajuda CSN!!</h1>
// 				<p className="class-p-ajuda">
// 					<br />
// 					O menu ajuda disponibiliza o passo a passo detalhado das
// 					funcionalidades das Cargas CSN no Concentrador de Cargas, <br />
// 					facilitando a sua navegação na plataforma e melhorando o seu
// 					desempenho no ambiente de trabalho.
// 				</p>
// 			</div>
// 			<div>
// 				<p className="class-p-subtitle">
// 					Selecione a opção desejada e você dará início ao passo a passo
// 					correspondente:
// 				</p>
// 			</div>
// 			<Accordion defaultActiveKey={["0"]} className="class-accordion">
// 				<Accordion.Item eventKey="1">
// 					<Accordion.Header>Cadastrar Cargas CSN</Accordion.Header>
// 					<Accordion.Body className="class-body-accordion">
// 						<p className="p-tela-ajuda-geral">
// 							No menu Cargas, ao clicar em Cadastrar Cargas você terá acesso a
// 							página de Cadastro CSN.
// 						</p>
// 						<p className="p-tela-ajuda-geral">
// 							Exemplo da página de Cadastro CSN:
// 						</p>
// 						<img src={cadastroCSN} id="style-gif2" />
// 						<p className="ajuda-csn-p">
// 							É importante ressaltar que não é permitido cadastrar cargas com
// 							placas de veículos que já possuam <br /> alguma carga vínculada em
// 							nossa plataforma. Para que seja possível o cadastramento, se faz{" "}
// 							<br /> necessária a análise para finalizar a carga que esteja
// 							vínculada a placa, ou, se será preciso <br /> adicionar outra
// 							placa de veículo que esteja disponível no momento do cadastro.
// 						</p>
// 						<div className="class-button-ir">
// 							<Button href="/cargas/cadastro/csn" id="button-cadastro-cargas">
// 								Navegar até Cadastro CSN
// 							</Button>
// 						</div>
// 					</Accordion.Body>
// 				</Accordion.Item>
// 				<Accordion.Item eventKey="2">
// 					<Accordion.Header>Listagem CSN</Accordion.Header>
// 					<Accordion.Body className="class-body-accordion">
// 						<p className="p-tela-ajuda-geral">
// 							Essa página lhe dará acesso ao detalhamento de informações das
// 							cargas já cadastradas em <br /> nossa plataforma.
// 						</p>
// 						<p className="p-tela-ajuda-geral">
// 							Exemplo da Página Listagem CSN:
// 						</p>

// 						<img src={listagemCSN} id="style-gif" />
// 						<div className="class-button-ir">
// 							<Button
// 								href="/cargas/visualizar/csn"
// 								id="style-button-acc"
// 								className="button-helper-ir-para"
// 							>
// 								Navegar até Listagem CSN
// 							</Button>
// 						</div>
// 					</Accordion.Body>
// 				</Accordion.Item>
// 				<Accordion.Item eventKey="3">
// 					<Accordion.Header>Edição de Carga CSN</Accordion.Header>
// 					<Accordion.Body className="class-body-accordion">
// 						<p className="p-tela-ajuda-geral">
// 							Nessa página você terá acesso para editar/corrigir as informações
// 							das cargas, sendo possivel acessar <br /> uma carga por vez e
// 							dessa forma manter as informações atualizadas em nossa plataforma,
// 							a carga é <br /> controlada pelo código, e você terá acesso a essa
// 							ferramenta através da tela de Listagem de Cargas CSN. <br />
// 							<br /> Segue abaixo o exemplo da página Edição CSN:
// 						</p>

// 						<img src={edicaoCSN} id="style-gif" />
// 						<p>
// 							Para acessar a página de edição de cargas, basta clicar no ícone
// 							conforme exemplificado acima.
// 						</p>
// 					</Accordion.Body>
// 				</Accordion.Item>
// 				<Accordion.Item eventKey="4" id="style-button-accordion">
// 					<Accordion.Header>Ferramentas da Plataforma</Accordion.Header>

// 					<Accordion.Body className="class-body-accordion">
// 						<p className="p-tela-ajuda-geral">
// 							Algumas ferramentas permitem configurações nas páginas para que
// 							sejam apresentadas <br /> apenas as informações necessárias no
// 							momento da consulta, facilitando sua utilização da plataforma.
// 							<br /> Essas funcionalidades buscam ajudar e otimizar sua jornada,
// 							dando maior <br /> conforto e interação com os recursos
// 							disponíveis.
// 							<br />
// 							<br /> Veja a seguir os exemplos dessas funcionalidades: <br />
// 							<br />
// 							<b className="style-b-ajuda">Configurar Tabela - </b> Utilizada
// 							para filtrar os itens na página de acordo com a sua <br />{" "}
// 							necessidade no momento da consulta.
// 						</p>
// 						<p className="p-tela-ajuda-geral mb-1">
// 							Exemplo do filtro Configurar Tabela:
// 						</p>
// 						<img src={configTab} id="style-gif2" />
// 						<p className="p-tela-ajuda-geral">
// 							<b className="style-b-ajuda">Opções da Tabela</b> - Legenda das
// 							cargas: mostra o significado de todas as possíveis situações de
// 							cargas <br /> cadastradas no sistema, facilitando o entendimento
// 							das mesmas.
// 							<br /> Importar tabela: Permite filtro por data e código da filial
// 							e oferece o download da tabela em formato excel.
// 							<br /> Redefinir tabela: Possibilita redefinir as configurações
// 							feitas na página, para o formato padrão da ferramenta.
// 						</p>
// 						<p className="p-tela-ajuda-geral mb-1 mt-3">
// 							Exemplo de Opções da Tabela:{" "}
// 						</p>
// 						<img src={opcoesTab} id="style-gif2" />
// 						<p className="p-tela-ajuda-geral">
// 							<b className="style-b-ajuda">Itens por página - </b> Permite que
// 							você visualize de 10 à 500 itens nas páginas de Listagem de Cargas{" "}
// 							<br /> e Coordenadas.
// 						</p>
// 						<p className="p-tela-ajuda-geral mb-1 mt-3">
// 							Exemplo de Itens por Página:
// 						</p>
// 						<img src={itensPage} id="style-gif2" />
// 					</Accordion.Body>
// 				</Accordion.Item>
// 				<Accordion.Item eventKey="5" id="style-button-accordion">
// 					<Accordion.Header>Coordenadas</Accordion.Header>
// 					<Accordion.Body className="class-body-accordion">
// 						<p className="p-tela-ajuda-geral">
// 							A página de Coordenadas disponibiliza detalhes do veículo,
// 							informações de rota e localização, categoria, <br /> placa, dados
// 							do motorista, dentre outras informações sobre os veículos
// 							cadastrados na plataforma.
// 						</p>
// 						<p className="p-tela-ajuda-geral">Exemplo da página Coordenadas:</p>
// 						<img src={coordenadasGif} id="style-gif" />

// 						<div className="class-button-ir">
// 							<Button
// 								href="/veiculos/coordenadas"
// 								id="style-button-acc"
// 								className="button-helper-ir-para"
// 							>
// 								Navegar até Coordenadas
// 							</Button>
// 						</div>
// 					</Accordion.Body>
// 				</Accordion.Item>
// 				<Accordion.Item eventKey="6" id="style-button-accordion">
// 					<Accordion.Header>Consulta de Cargas</Accordion.Header>
// 					<Accordion.Body className="class-body-accordion">
// 						<p className="p-tela-ajuda-geral">
// 							Ao acessar a tela de Consulta de Cargas (presente na página de
// 							Coordenadas), você poderá visualizar <br /> informações de cargas
// 							abertas em nossa plataforma.
// 						</p>
// 						<p className="p-tela-ajuda-geral">Exemplo da página de Consulta:</p>
// 						<img src={consultaCargas} id="style-gif" />
// 						<p>
// 							Para acessar a página de consulta de cargas, basta clicar no ícone
// 							conforme exemplificado acima.
// 						</p>
// 					</Accordion.Body>
// 				</Accordion.Item>
// 				<Accordion.Item eventKey="7" id="style-button-accordion">
// 					<Accordion.Header>Monitoramento CSN</Accordion.Header>
// 					<Accordion.Body className="class-body-accordion">
// 						<p className="p-tela-ajuda-geral">
// 							Nessa opção você será apresentado à página de Monitoramento CSN,
// 							onde conseguirá verificar veículos <br /> pendentes, e aprovar ou
// 							reprovar veículos de acordo com a situação de cada um.
// 						</p>
// 						<p className="p-tela-ajuda-geral">
// 							Exemplo da página de Monitoramento:{" "}
// 						</p>
// 						<img src={monitoramentoCSN} id="style-gif" />

// 						<div className="class-button-ir">
// 							<Button
// 								href="/veiculos/aprovacao/csn"
// 								id="style-button-acc"
// 								className="button-helper-ir-para"
// 							>
// 								Navegar até Monitoramento CSN
// 							</Button>
// 						</div>
// 					</Accordion.Body>
// 				</Accordion.Item>
// 				<Accordion.Item eventKey="8" id="style-button-accordion">
// 					<Accordion.Header>Produtos</Accordion.Header>
// 					<Accordion.Body className="class-body-accordion">
// 						<p className="p-tela-ajuda-geral">
// 							Essa página possibilita visualizar, adicionar, editar e desativar
// 							produtos, e apresenta a situação de cada <br /> um deles, provendo
// 							melhor acompanhamento dos mesmos.
// 						</p>
// 						<p className="p-tela-ajuda-geral">Exemplo da página Produtos: </p>
// 						<img src={telaProdutos} id="style-gif" />
// 						<p className="ajuda-csn-p">
// 							Somente pessoas com permissão são aptas a adicionar, editar e
// 							desativar os produtos na plataforma.
// 						</p>

// 						<div className="class-button-ir">
// 							<Button
// 								href="/produtos"
// 								id="style-button-acc"
// 								className="button-helper-ir-para"
// 							>
// 								Navegar até Produtos
// 							</Button>
// 						</div>
// 					</Accordion.Body>
// 				</Accordion.Item>
// 				<Accordion.Item eventKey="9" id="style-button-accordion">
// 					<Accordion.Header>Relatórios</Accordion.Header>
// 					<Accordion.Body className="class-body-accordion">
// 						<p className="p-tela-ajuda-geral">
// 							<br />
// 							Ao clicar em Relatórios, você terá várias opções de consulta
// 							disponíveis na plataforma, são elas: <br /> <br />{" "}
// 							<b className="style-b-ajuda"> Indicador Operacional CSN - </b>
// 							Mostra a situação e permite acompanhamento das cargas já
// 							cadastradas <br /> na platafoma, essas informações serão
// 							apresentadas de acordo com o preechimento do filtro de data.
// 							<br /> A página conta também com gráfico e tabela, download do
// 							filtro de data, entre outras informações.
// 						</p>
// 						<img src={indicadorOperacionalCsn} id="style-gif2" />

// 						<div className="class-button-ir">
// 							<Button
// 								href="/relatorios/visualizar/csn"
// 								id="style-button-acc"
// 								className="button-helper-ir-para"
// 							>
// 								Ir para Indicador Operacional
// 							</Button>
// 						</div>
// 						<p className="p-tela-ajuda-geral">
// 							<b className="style-b-ajuda"> Rotas Pendentes de Cadastro - </b>
// 							Disponibiliza os nomes das cidades e estados de origem e destino,
// 							<br /> provendo acesso a informações de rotas, e permite também
// 							que você busque uma cidade ou estado
// 							<br /> específico, para melhor acompanhamento.
// 						</p>
// 						<img src={rotasPendentes} id="style-gif" />

// 						<div className="class-button-ir">
// 							<Button
// 								href="/rotas/pendentes"
// 								id="style-button-acc"
// 								className="button-helper-ir-para"
// 							>
// 								Ir para Rotas Pendentes
// 							</Button>
// 						</div>
// 						<p className="p-tela-ajuda-geral ms-1">
// 							<b className="style-b-ajuda">Raio Empresa - </b> Mostra os
// 							veículos no raio da empresa.
// 						</p>
// 						<img src={raioEmpresa} id="style-gif" />
// 						<div className="class-button-ir">
// 							<Button href="/veiculos/raio/empresa" id="style-button-acc">
// 								Ir para Raio Empresa
// 							</Button>
// 						</div>
// 						<p className="p-tela-ajuda-geral ms-1">
// 							<b className="style-b-ajuda"> Veículos x Veículos - </b> Mostra a
// 							distância entre veículos próximos.
// 						</p>
// 						<img src={veicProximos} id="style-gif" />
// 						<div className="class-button-ir">
// 							<Button href="/veiculos/raio" id="style-button-acc">
// 								Ir para Veículos x Veículos
// 							</Button>
// 						</div>
// 						<p className="p-tela-ajuda-geral ms-1">
// 							<b className="style-b-ajuda"> Veículos até Empresa - </b> Mostra a
// 							distância entre um veículo e a empresa.
// 						</p>
// 						<img src={veicEmpresa} id="style-gif" />

// 						<div className="class-button-ir">
// 							<Button href="/veiculos/destino" id="style-button-acc">
// 								Ir para Veículos até Empresa
// 							</Button>
// 						</div>
// 						<p className="p-tela-ajuda-geral">
// 							<br />
// 							Em <b className="style-b-ajuda">Histórico de Rotas do Veículo</b>,
// 							você terá acesso ao histórico de localização do veículo, busque
// 							pela <br /> placa do veículo e datas de início e fim e as
// 							informações serão mostradas no mapa da plataforma, a tela <br />{" "}
// 							oferece também a opção de download do histórico consultado (via
// 							excel).
// 						</p>
// 						<img src={historicoRota} id="style-gif" />

// 						<div className="class-button-ir">
// 							<Button
// 								href="/veiculos/historico"
// 								id="style-button-acc"
// 								className="button-helper-ir-para"
// 							>
// 								Ir para Histórico de Rotas
// 							</Button>
// 						</div>
// 					</Accordion.Body>
// 				</Accordion.Item>
// 				<Accordion.Item eventKey="10" id="style-button-accordion">
// 					<Accordion.Header>Localização</Accordion.Header>
// 					<Accordion.Body className="class-body-accordion">
// 						<p className="p-tela-ajuda-geral">
// 							Essa página possibilita visualizar, adicionar, editar e remover
// 							rotas, e apresenta também descrição, <br /> latitude, longitude,
// 							raio em km, provendo melhoria no gerenciamento das rotas CSN.
// 						</p>
// 						<p className="p-tela-ajuda-geral">
// 							Exemplo da página de Gerenciamento de Rotas:
// 						</p>
// 						<img src={localizacaoCSN} id="style-gif" />
// 						<p className="ajuda-csn-p">
// 							Somente pessoas com permissão são aptas a adicionar, editar e
// 							remover rotas na plataforma.
// 						</p>

// 						<div className="class-button-ir">
// 							<Button
// 								href="/localizacao"
// 								id="style-button-acc"
// 								className="button-helper-ir-para"
// 							>
// 								Navegar até Localização
// 							</Button>
// 						</div>
// 					</Accordion.Body>
// 				</Accordion.Item>
// 				<div>
// 					<p className="message-final-page">
// 						Recado Importante: Todas as informações presentes na página podem
// 						sofrer alterações sem aviso prévio, os gifs disponibilizados são
// 						apenas exemplos para facilitar a utilização da página, sendo que
// 						podem apresentar diferenças mínimas da ferramenta dependendo da
// 						versão, as mudanças que acontecerem futuramente, terão objetivo de
// 						melhorar cada vez mais o tutorial de uso da nossa plataforma,
// 						auxiliando e garantindo melhor desempenho durante a jornada de
// 						trabalho.
// 					</p>
// 				</div>
// 			</Accordion>
// 		</div>
// 	);
// }
// export default HelperCSN;
