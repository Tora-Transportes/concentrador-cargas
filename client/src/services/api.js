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
function arrayBufferToJson(arrayBuffer) {
	// Step 1: Convert ArrayBuffer to a string (UTF-8 encoded)
	const decoder = new TextDecoder("utf-8");
	const decodedString = decoder.decode(arrayBuffer);

	// Step 2: Parse the decoded string as JSON
	try {
		const jsonData = JSON.parse(decodedString);
		console.log("Parsed JSON:", jsonData);
		return jsonData;
	} catch (error) {
		console.error("Failed to parse JSON from ArrayBuffer:", error);
		return null;
	}
}

api.interceptors.response.use(
	(response) => {
		return response;
	},
	async (error) => {
		if (error?.response?.data instanceof ArrayBuffer) {
			const jsonData = arrayBufferToJson(error?.response?.data);
			const allErrors = error?.response?.data?.errors
				?.map((i) => `❌${i}`)
				?.join("\n");
			const message =
				jsonData.message ||
				"Erro desconhecido verifique sua conexão com a rede";
			await swal("Ops!", message, "error");
			if (allErrors?.length > 0) {
				swal("Detalhes", allErrors);
			}
			throw error;
		} else {
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
	}
);

export default api;
