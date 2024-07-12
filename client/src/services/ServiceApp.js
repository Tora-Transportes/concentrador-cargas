import { apiApp } from "./apiApp";
import api from "./api";

class ServiceApp {
	async envioCargaApp(body) {
		const response = await apiApp.post("/freight/createfreight", body);

		const bodyLog = {
			metodo: "POST - CRIAR CARGA",
			status: response.status.toString(),
			json_envio: JSON.stringify(body),
			json_retorno: JSON.stringify(response.data),
			erro: response.status == 200 ? 0 : 1,
		};

		await api.post("/logs/app/integracao", bodyLog);

		return response;
	}

	async cancelarCargaApp(body) {
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
	}

	async motoristaExiste(placa, cpf) {
		const body = {
			driverCpf: cpf,
			licensePlate: placa,
		};
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
	}

	async motoristaPossuiViagem(cpf) {
		const body = {
			driverCpf: cpf,
		};
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
			response.data.response.message == true
		) {
			return {
				err: true,
				message:
					"Motorista possui alguma viagem em andamento ou não iniciada, favor contatá-lo!",
			};
		} else if (
			response.data &&
			response.status == 200 &&
			response.data.response.message == false
		) {
			return {
				err: false,
				message: response.data.response.message,
			};
		} else {
			return {
				err: false,
				message:
					"Não foi possivel buscar as informações de viagem desse motorista",
			};
		}
	}
}

export default new ServiceApp();
