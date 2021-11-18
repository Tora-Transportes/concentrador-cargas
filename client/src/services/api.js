import axios from "axios";
import swal from "sweetalert";
import { authContext, adalConfig } from "../MicrosoftAuthentication";

const api = axios.create({
	baseURL: process.env.REACT_APP_API_URL,
});

api.interceptors.request.use(
	(config) => {
		// Check and acquire a token before the request is sent
		return new Promise((resolve, reject) => {
			authContext.acquireToken(adalConfig.endpoints.api, (message, token) => {
				if (token) {
					config.headers.Authorization = token;
					resolve(config);
				} else {
					// Do something with error of acquiring the token
					location.reload();
					reject(config);
				}
			});
		});
	},
	(error) => {
		// Do something with error of the request
		return Promise.reject(error);
	}
);

api.interceptors.response.use(
	(response) => {
		return response;
	},
	async (error) => {
		const allErrors = error?.response?.data?.errors
			?.map((i) => `❌${i}`)
			?.join("\n");
		const message =
			error?.response?.data?.message ||
			"Erro desconhecido verifique sua conexão com a rede";
		await swal("Ops!", message, "error");
		if (allErrors?.length > 0) {
			swal("Detalhes", allErrors);
		}
		throw error;
	}
);

export default api;
