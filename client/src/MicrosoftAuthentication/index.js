import { runWithAdal } from "react-adal";
import {
	authContext,
	adalApiFetch,
	withAdalLoginApi,
	adalConfig,
} from "./adalConfig";
import {
	isInRole,
	getRoles,
	loggedIn,
	getClaims,
	getUser,
	getToken,
	logout,
	login,
} from "./adalService";

function requireMicrosoftAuthentication(reactRender) {
	return runWithAdal(authContext, reactRender, true);
}

export { authContext, adalApiFetch, withAdalLoginApi, adalConfig };
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
export default requireMicrosoftAuthentication;
