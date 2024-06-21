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

		if (response.data && response.data.response.message == placa) {
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
}

export default new ServiceApp();
