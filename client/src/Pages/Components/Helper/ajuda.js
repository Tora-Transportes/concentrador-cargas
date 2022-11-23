import React from "react";
import "./ajuda.css";
import Menusuperior from "../MenuSuperior/menusuperior";
import Accordion from "react-bootstrap/Accordion";
import { Button } from "react-bootstrap";
import caminhaogif from "../../../assets/helperTelaInicialCadastro.gif";
import telacad from "../../../assets/helperTelaCadastroManual.gif";
import telaCoordenadas from "../../../assets/helperTelaCoordenadas.gif";
import telaMonitoramento from "../../../assets/helperTelaMonitoramento.gif";
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

						<img src={caminhaogif} id="style-gif" />
						<p>
							Escolhido o modo de cadastro da carga, você será direcionado até a
							página de cadastro correspondente.
						</p>
						<p>Exemplo da página de Cadastro Manual: </p>
						<img src={telacad} id="style-gif" />
						<p>Exemplo da página de Importação em Lote: </p>
						<img src={telacad} id="style-gif" />
						<div className="class-button-ir">
							{/* <p className="class-p-nav">Navegar até a Página de Cadastro</p> */}
							<Button
								href="/cargas/menu"
								id="style-button-acc"
								className="class-button1"
							>
								Navegar até Cadastro de Cargas
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

						<img src={caminhaogif} id="style-gif" />

						<p>Exemplo do filtro Configurar Tabela: </p>
						<img src={telacad} id="style-gif" />
						<p>Exemplo de Opções da Tabela: </p>
						<img src={telacad} id="style-gif" />
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

						<img src={caminhaogif} id="style-gif" />
						<p>Exemplo do filtro Configurar Tabela: </p>
						<img src={telacad} id="style-gif" />
						<p>Exemplo de Opções da Tabela: </p>
						<img src={telacad} id="style-gif" />
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
					<Accordion.Header>Coordenadas</Accordion.Header>
					<Accordion.Body className="class-body-accordion">
						<p>
							A opção Coordenadas disponibiliza localização, destino, categoria,
							placa, dentre outras informações <br /> sobre os veículos
							cadastrados.
						</p>
						<p>Exemplo da página Coordenadas:</p>
						<img src={telaCoordenadas} id="style-gif" />

						<div className="class-button-ir">
							{/* <p className="class-p-nav">Navegar até a Página de Coordenadas</p> */}
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
				<Accordion.Item eventKey="5" id="style-button-accordion">
					<Accordion.Header>Monitoramento</Accordion.Header>
					<Accordion.Body className="class-body-accordion">
						<p>
							Nessa opção você será direcionado para a página de Monitoramento,
							onde conseguirá verificar a situação <br /> dos veículos
							pendentes, e aprovar ou reprovar veículos de acordo com a situação
							de cada um.
						</p>
						<p>Exemplo da página de Monitoramento: </p>
						<img src={telaMonitoramento} id="style-gif" />

						<div className="class-button-ir">
							{/* <p className="class-p-nav">
								Navegar até a Página de Monitoramento
							</p> */}
							<Button
								href="/veiculos/aprovacao"
								id="style-button-acc"
								className="class-button1"
							>
								Navegar até Monitoramento
							</Button>
						</div>
					</Accordion.Body>
				</Accordion.Item>
				<Accordion.Item eventKey="6" id="style-button-accordion">
					<Accordion.Header>Permissões</Accordion.Header>
					<Accordion.Body className="class-body-accordion">
						<p>
							Essa página disponibiliza as permissões que cada usuário deve ou
							não ter para utilizar a plataforma, <br /> possibilitando
							adicionar e deletar permissões dos usuários conforme necessário.
						</p>
						<p>Exemplo da página de Permissões: </p>
						<img src={telaMonitoramento} id="style-gif" />

						<div className="class-button-ir">
							{/* <p className="class-p-nav">
								Navegar até a Página de Monitoramento
							</p> */}
							<Button
								href="/usuarios/permissoes"
								id="style-button-acc"
								className="class-button1"
							>
								Navegar até Permissões
							</Button>
						</div>
					</Accordion.Body>
				</Accordion.Item>
				<Accordion.Item eventKey="7" id="style-button-accordion">
					<Accordion.Header>Produtos</Accordion.Header>
					<Accordion.Body className="class-body-accordion">
						<p>
							Essa página possibilita adicionar, editar e desativar produtos, e
							apresenta a situação de cada um desses <br /> produtos para melhor
							acompanhamento dos mesmos.
						</p>
						<p>Exemplo da página Produtos: </p>
						<img src={telaMonitoramento} id="style-gif" />

						<div className="class-button-ir">
							{/* <p className="class-p-nav">
								Navegar até a Página de Monitoramento
							</p> */}
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
				<Accordion.Item eventKey="8" id="style-button-accordion">
					<Accordion.Header>Relatórios</Accordion.Header>
					<Accordion.Body className="class-body-accordion">
						<p>
							<br />
							Ao clicar em Relatórios, você terá várias opções de consulta
							disponíveis na plataforma, são elas: <br /> <br /> Indicador
							Operacional - Permite o acompanhamento das cargas e lotes,
							apresentando de acordo com o <br /> filtro de data utilizado,
							situação gráfica das cargas em geral, porcentagem de cargas
							ativadas e <br /> desativadas, entre outras informações presentes
							na página.
						</p>
						<img src={telaMonitoramento} id="style-gif" />

						<div className="class-button-ir">
							{/* <p className="class-p-nav">
								Navegar até a Página de Monitoramento
							</p> */}
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
						<img src={telaMonitoramento} id="style-gif" />

						<div className="class-button-ir">
							{/* <p className="class-p-nav">
								Navegar até a Página de Monitoramento
							</p> */}
							<Button
								href="/rotas/pendentes"
								id="style-button-acc"
								className="class-button1"
							>
								Ir para Rotas pendentes
							</Button>
						</div>
						<p>
							As páginas que serão citadas a seguir representam funcionalidades
							similares: <br />
							Raio empresa - Mostra os veículos no raio da empresa. <br />{" "}
							Veículos x Veículos - Mostra a distância entre veículos que
							estejam próximos. <br /> Veículos até empresa - Mostra a distância
							entre um veículo e a empresa.
						</p>
						<img src={telaMonitoramento} id="style-gif" />

						<p>
							Abaixo estará disponível botões que irão te direcionar para as
							páginas abordadas acima, para acessá-las <br /> basta clicar em
							cada um dos botões e você será direcionado para a página
							escolhida.
						</p>

						<div className="class-button-ir">
							{/* <p className="class-p-nav">
								Navegar até a Página de Monitoramento
							</p> */}
							<Button href="/relatorios" id="button-acc-veic">
								Ir para Raio Empresa
							</Button>
							<Button href="/relatorios" id="button-acc-veic2">
								Ir para Veículos x Veículos
							</Button>{" "}
							<Button href="/relatorios" id="button-acc-veic3">
								Ir para Veículos até Empresa
							</Button>
						</div>
					</Accordion.Body>
				</Accordion.Item>
			</Accordion>
		</div>
	);
}
export default Helper;
