import React from "react";
import PropTypes from "prop-types";
import { Route } from "react-router-dom";

export default function RouteWrapper({ component: Component, ...rest }) {
	if (rest.computedMatch.path === "/") {
		try {
			//limpa permissões do local storages
			localStorage.removeItem("adal.user");
		} catch (error) {
			console.log(error);
		}
	}

	return <Route {...rest} render={(props) => <Component {...props} />} />;
}

RouteWrapper.propTypes = {
	component: PropTypes.oneOfType([PropTypes.element, PropTypes.func])
		.isRequired,
};
