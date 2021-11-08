import { useState } from "react";
import { Offcanvas, ListGroup } from "react-bootstrap";
import { getClaims, logout } from "../../../MicrosoftAuthentication";
import { FaSignOutAlt } from "react-icons/fa";

import "./index.css";

function Sidebar({ show, onClose }) {
	const userData = getClaims();
	const initialsName = `${userData.given_name.charAt(
		0
	)}${userData.given_name.charAt(1)}`.toUpperCase();

	return (
		<Offcanvas show={show} onHide={onClose}>
			<Offcanvas.Header closeButton className="text-center w-100">
				<Offcanvas.Title className="text-center">
					<div className="card-user rounded-circle mx-auto">{initialsName}</div>
					<br />
					<div>{userData.name}</div>
				</Offcanvas.Title>
			</Offcanvas.Header>
			<Offcanvas.Body>
				<ListGroup className="sidebar-links">
					<ListGroup.Item action>Option 1</ListGroup.Item>
					<ListGroup.Item action>Option 2</ListGroup.Item>
					<ListGroup.Item action>Option 3</ListGroup.Item>
					<ListGroup.Item action>Option 4</ListGroup.Item>
					<ListGroup.Item action onClick={logout}>
						Sair <FaSignOutAlt />
					</ListGroup.Item>
				</ListGroup>
			</Offcanvas.Body>
		</Offcanvas>
	);
}

function useSidebar() {
	const [status, setStatus] = useState(false);
	const toggle = () => {
		setStatus(!status);
	};
	const component = <Sidebar show={status} onClose={toggle} />;
	return [() => component, toggle, setStatus, status];
}

export default Sidebar;
export { useSidebar };
