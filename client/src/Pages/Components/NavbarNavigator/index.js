import React from "react";
import { Container, ListGroup, Navbar, Offcanvas } from "react-bootstrap";
import { FaSignOutAlt } from "react-icons/fa";
import { Link } from "react-router-dom";
import logo from "../../../assets/logotora.png";
import { getClaims, logout } from "../../../MicrosoftAuthentication";

import "./index.css";

function NavbarNavigator(props) {
	let userData;
	let initialsName;
	try {
		userData = getClaims();
		initialsName = `${userData.given_name.charAt(
			0
		)}${userData.given_name.charAt(1)}`.toUpperCase();
	} catch (error) {
		userData = {
			name: "  ",
		};
		initialsName = "  ";
	}

	return (
		<>
			<Navbar variant="dark" id="navbar-tora" expand={false} {...props}>
				<Container fluid>
					<Link to="/">
						<img
							src={logo}
							width="30"
							height="30"
							className="d-inline-block align-top"
						/>
					</Link>
					<Navbar.Toggle aria-controls="offcanvasNavbar" />
					<Navbar.Offcanvas
						id="offcanvasNavbar"
						aria-labelledby="offcanvasNavbarLabel"
						placement="end"
					>
						<Offcanvas.Header closeButton className="text-center w-100">
							<Offcanvas.Title className="text-center">
								<div className="card-user rounded-circle mx-auto">
									{initialsName}
								</div>
								<br />
								<div>{userData.name}</div>
							</Offcanvas.Title>
						</Offcanvas.Header>
						<Offcanvas.Body>
							<ListGroup className="sidebar-links">
								<Link to="/cargas/menu">
									<ListGroup.Item action>Cadastro de Cargas</ListGroup.Item>
								</Link>
								<hr />
								<Link to="/cargas/visualizar">
									<ListGroup.Item action>Listagem de Cargas</ListGroup.Item>
								</Link>
								<Link to="/lotes/visualizar">
									<ListGroup.Item action>Listagem de Lotes</ListGroup.Item>
								</Link>
								<hr />
								<Link to="/produtos">
									<ListGroup.Item action>Produtos</ListGroup.Item>
								</Link>
								<Link to="/rotas/pendentes">
									<ListGroup.Item action>Rotas Pendentes</ListGroup.Item>
								</Link>
								<Link to="/usuarios/permissoes">
									<ListGroup.Item action>Permissões</ListGroup.Item>
								</Link>
								<Link to="/veiculos/aprovacao/padrao">
									<ListGroup.Item action>Monitoramento</ListGroup.Item>
								</Link>
								<Link to="/veiculos/coordenadas">
									<ListGroup.Item action>Coordenadas</ListGroup.Item>
								</Link>
								<Link to="/relatorios/visualizar/padrao">
									<ListGroup.Item action>Relatórios</ListGroup.Item>
								</Link>
								<Link to="/producao">
									<ListGroup.Item action>Produção</ListGroup.Item>
								</Link>
								<hr />
								<Link to="/veiculos/raio">
									<ListGroup.Item action>Veículos X Veículos</ListGroup.Item>
								</Link>
								<Link to="/veiculos/destino">
									<ListGroup.Item action>Veículo até Empresa</ListGroup.Item>
								</Link>
								<Link to="/veiculos/raio/empresa">
									<ListGroup.Item action>Raio Empresa</ListGroup.Item>
								</Link>
								<hr />
								<Link to="/">
									<ListGroup.Item
										action
										onClick={() => {
											setTimeout(() => {
												logout();
											}, 200);
										}}
									>
										Sair <FaSignOutAlt />
									</ListGroup.Item>
								</Link>
							</ListGroup>
						</Offcanvas.Body>
					</Navbar.Offcanvas>
				</Container>
			</Navbar>
		</>
	);
}

export default NavbarNavigator;
