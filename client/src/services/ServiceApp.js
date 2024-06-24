import { apiApp } from "./apiApp";

class ServiceApp {
	async envioCargaApp(body) {
		return await apiApp.post("/freight/createfreight", body);
	}

	async cancelarCargaApp(body) {
		return await apiApp.patch("/freight/cancel", body);
	}

	async motoristaExiste(placa, cpf) {
		const body = {
			driverCpf: cpf,
			licensePlate: placa,
		};
		const response = await apiApp.post("/driverExists", body);

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
