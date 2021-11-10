import axios from "axios";
import swal from "sweetalert";
import { getToken } from "../MicrosoftAuthentication";
const api = axios.create({
	baseURL: process.env.REACT_APP_API_URL,
});

api.interceptors.request.use((config) => {
	config.headers.authorization = getToken();
	return config;
});

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
		if (allErrors.length > 0) {
			swal("Detalhes", allErrors);
		}
		throw error;
	}
);

export default api;
