/* eslint-disable no-prototype-builtins */
import decode from "jwt-decode";
import { authContext, endpoint } from "./adalConfig";

const login = () => {
	return authContext.login();
};

const logout = () => {
	for (const key in localStorage) {
		if (key.indexOf("adal") !== -1) {
			localStorage.removeItem(key);
		}
	}
	return authContext.logOut();
};

const getToken = () => {
	return authContext.getCachedToken(endpoint);
};

const getUser = () => {
	return authContext.getCachedUser();
};

const getClaims = () => {
	let t;
	try {
		t = getToken();
		return decode(t);
	} catch (error) {
		throw new Error(
			"erro ao chamar getClaims" +
				error.message +
				JSON.stringify(t) +
				localStorage.getItem("adal.idtoken")
		);
	}
};

const loggedIn = () => {
	return !!getUser();
};

const getRoles = () => {
	const claims = getClaims();

	if (claims.hasOwnProperty("roles")) {
		return claims.roles;
	}

	return null;
};

const isInRole = (role) => {
	if (getRoles()) {
		for (let i = 0; i < getRoles().length; i++) {
			if (getRoles()[i] === role) return true;
		}
	}
	return false;
};

export {
	isInRole,
	getRoles,
	loggedIn,
	getClaims,
	getUser,
	getToken,
	logout,
	login,
};
