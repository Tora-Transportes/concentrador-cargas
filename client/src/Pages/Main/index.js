import React from "react";
import { Container, Button, Navbar } from "react-bootstrap";
import "./index.css";
import logo from "../../assets/tora.ico";

import { useSidebar } from "../Components/Sidebar";
import { GiHamburgerMenu } from "react-icons/gi";

function Main() {
	const [Sidebar, toggle] = useSidebar();
	return (
		<>
			<Navbar id="navbar-tora">
				<Button className="btn-toggle" onClick={toggle}>
					<GiHamburgerMenu />
				</Button>
				<Container fluid>
					<Navbar.Brand className="w-100 text-end">
						<img
							src={logo}
							width="30"
							height="30"
							className="d-inline-block align-top"
						/>
					</Navbar.Brand>
				</Container>
			</Navbar>
			<Sidebar />

			<Container>Lorem Ipsum</Container>
		</>
	);
}

export default Main;
