import React from "react";

import {
	getClaims,
	getToken,
	getUser,
	logout,
} from "./MicrosoftAuthentication";

function Logado() {
	const user = getUser();
	const { family_name, given_name } = user.profile;
	const fullName = `${given_name} ${family_name}`;
	return (
		<>
			<pre>Olá {fullName}</pre>
			<pre>{JSON.stringify(getUser(), null, 2)}</pre>
			<button onClick={() => logout()}>Resetar</button>
			<button onClick={() => alert(getToken())}>ver token</button>
			<pre>{JSON.stringify(getClaims(), null, 2)}</pre>
		</>
	);
}

function Deslogado() {
	return <h1>Deslogado</h1>;
}

const routes = () => [
	{
		path: "/",
		element: <Logado />,
		children: [{ path: "logado", element: <Deslogado /> }],
	},
];

export default routes;
