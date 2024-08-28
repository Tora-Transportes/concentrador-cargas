import { AuthenticationContext, adalFetch, withAdalLogin } from "react-adal";

const endpoint = process.env.REACT_APP_ENDPOINT;

const redirectUri = `https://${window.location.hostname}${
	window.location.port !== 80 ? ":" + window.location.port : ""
}`;

const adalConfig = {
	tenant: process.env.REACT_APP_TENANT,
	clientId: process.env.REACT_APP_CLIENT_ID,
	endpoints: {
		api: endpoint,
	},
	cacheLocation: "localStorage",
	redirectUri: redirectUri,
};

const authContext = new AuthenticationContext(adalConfig);

const adalApiFetch = (fetch, url, options) => {
	adalFetch(authContext, adalConfig.endpoints.api, fetch, url, options);
};

const withAdalLoginApi = withAdalLogin(authContext, adalConfig.endpoints.api);

export { withAdalLoginApi, adalApiFetch, authContext, adalConfig, endpoint };
