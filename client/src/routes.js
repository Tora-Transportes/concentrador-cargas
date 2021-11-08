import React from "react";
import Main from "./Pages/Main";

function Deslogado() {
	return <h1>Deslogado</h1>;
}

const routes = () => [
	{
		path: "/",
		element: <Main />,
		children: [{ path: "logado", element: <Deslogado /> }],
	},
];

export default routes;
