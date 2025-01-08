import { apiApp } from "./apiApp";
import api from "./api";

class ServiceApp {
	async envioCargaApp(body, fk_filial) {
		try {
			const response = await apiApp.post("/freight/createfreight", body);

			const bodyLog = {
				metodo: "POST - CRIAR CARGA",
				status: response.status.toString(),
				json_envio: JSON.stringify(body),
				json_retorno: JSON.stringify(response.data),
				erro: response.status == 200 ? 0 : 1,
				fk_filial: fk_filial,
			};

			await api.post("/logs/app/integracao", bodyLog);

			return response;
		} catch (error) {
			// Captura e log de erros
			const bodyLog = {
				metodo: "POST - CRIAR CARGA",
				status: error.response ? error.response.status.toString() : "500",
				json_envio: JSON.stringify(body),
				json_retorno: error.response
					? JSON.stringify(error.response.data)
					: "Erro de rede",
				erro: 1,
				fk_filial: fk_filial,
			};

			await api.post("/logs/app/integracao", bodyLog);

			return {
				status: error.response ? error.response.status : 500,
				data: error.response
					? error.response.data
					: "Erro de rede ao criar a carga",
			};
		}
	}

	async envioCargaLoteApp(body, fk_filial) {
		try {
			const response = await apiApp.post("/freight/freightBatch", body);

			const bodyLog = {
				metodo: "POST - CRIAR CARGA LOTE",
				status: response.status.toString(),
				json_envio: JSON.stringify(body),
				json_retorno: JSON.stringify(response.data),
				erro: response.status == 200 ? 0 : 1,
				fk_filial: fk_filial,
			};

			await api.post("/logs/app/integracao", bodyLog);

			return response;
		} catch (error) {
			// Captura e log de erros
			const bodyLog = {
				metodo: "POST - CRIAR CARGA LOTE",
				status: error.response ? error.response.status.toString() : "500",
				json_envio: JSON.stringify(body),
				json_retorno: error.response
					? JSON.stringify(error.response.data)
					: "Erro de rede",
				erro: 1,
				fk_filial: fk_filial,
			};

			await api.post("/logs/app/integracao", bodyLog);

			return {
				status: error.response ? error.response.status : 500,
				data: error.response
					? error.response.data
					: "Erro de rede ao criar a carga",
			};
		}
	}

	async cancelarCargaApp(body) {
		try {
			const response = await apiApp.patch("/freight/cancel", body);

			const bodyLog = {
				metodo: "PATCH - CANCELAR CARGA",
				status: response.status.toString(),
				json_envio: JSON.stringify(body),
				json_retorno: JSON.stringify(response.data),
				erro: response.status == 200 ? 0 : 1,
			};

			await api.post("/logs/app/integracao", bodyLog);

			return response;
		} catch (error) {
			const bodyLog = {
				metodo: "PATCH - CANCELAR CARGA",
				status: error.response ? error.response.status.toString() : "500",
				json_envio: JSON.stringify(body),
				json_retorno: error.response
					? JSON.stringify(error.response.data)
					: "Erro de rede",
				erro: 1,
			};

			await api.post("/logs/app/integracao", bodyLog);

			return {
				status: error.response ? error.response.status : 500,
				data: error.response
					? error.response.data
					: "Erro de rede ao cancelar a carga",
			};
		}
	}

	async motoristaExiste(placa, cpf) {
		const body = {
			driverCpf: cpf,
			licensePlate: placa,
		};

		try {
			const response = await apiApp.post("/driverExists", body);

			const bodyLog = {
				metodo: "POST - MOTORISTA EXISTE",
				status: response.status.toString(),
				json_envio: JSON.stringify(body),
				json_retorno: JSON.stringify(response.data),
				erro: response.status == 200 ? 0 : 1,
			};

			await api.post("/logs/app/integracao", bodyLog);

			if (
				response.data &&
				response.status == 200 &&
				response.data.response.message == placa
			) {
				return {
					err: false,
					message: "Motorista encontrado!",
				};
			} else {
				return {
					err: true,
					message: response.data.response.message,
				};
			}
		} catch (error) {
			// Captura e log de erros
			const bodyLog = {
				metodo: "POST - MOTORISTA EXISTE",
				status: error.response ? error.response.status.toString() : "500",
				json_envio: JSON.stringify(body),
				json_retorno: error.response
					? JSON.stringify(error.response.data)
					: "Erro de rede",
				erro: 1,
			};

			await api.post("/logs/app/integracao", bodyLog);

			return {
				err: true,
				message: error.response
					? "Dados insuficientes para verificar se o motorista existe no aplicativo: Placa não possui motorista vinculado no SIT!"
					: "Erro de rede ao verificar motorista",
			};
		}
	}

	async motoristaPossuiViagem(cpf) {
		const body = {
			driverCpf: cpf,
		};

		try {
			const response = await apiApp.post("/driver/cpf/openFreight", body);

			const bodyLog = {
				metodo: "POST - MOTORISTA POSSUI VIAGEM",
				status: response.status.toString(),
				json_envio: JSON.stringify(body),
				json_retorno: JSON.stringify(response.data),
				erro: response.status == 200 ? 0 : 1,
			};

			await api.post("/logs/app/integracao", bodyLog);

			if (
				response.data &&
				response.status == 200 &&
				response.data.response.message === true
			) {
				return {
					err: true,
					message:
						"Motorista possui alguma viagem em andamento ou não iniciada, favor contatá-lo!",
				};
			} else if (
				response.data &&
				response.status == 200 &&
				response.data.response.message === false
			) {
				return {
					err: false,
					message: response.data.response.message,
				};
			} else {
				return {
					err: false,
					message:
						"Não foi possível buscar as informações de viagem desse motorista",
				};
			}
		} catch (error) {
			// Captura e log de erros
			const bodyLog = {
				metodo: "POST - MOTORISTA POSSUI VIAGEM",
				status: error.response ? error.response.status.toString() : "500",
				json_envio: JSON.stringify(body),
				json_retorno: error.response
					? JSON.stringify(error.response.data)
					: "Erro de rede",
				erro: 1,
			};

			await api.post("/logs/app/integracao", bodyLog);

			return {
				err: true,
				message: error.response
					? error.response.data
					: "Erro de rede ao verificar viagem do motorista",
			};
		}
	}
}

export default new ServiceApp();
