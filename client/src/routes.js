import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";

import Main from "./Pages/Main";
import LoadMenu from "./Pages/Load/Menu";

export default function AllRoutes() {
	return (
		<BrowserRouter>
			<Switch>
				<Route path="/" exact component={Main} />
				<Route path="/cargas/menu" exact component={LoadMenu} />
			</Switch>
		</BrowserRouter>
	);
}
