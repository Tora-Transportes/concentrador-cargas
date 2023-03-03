import { apiApp } from "./apiApp";

class ServiceApp {
	async envioCargaApp(body) {
		return await apiApp.post("/createfreight", body);
	}

	async cancelarCargaApp(body) {
		return await apiApp.patch("/cancel", body);
	}
}

export default new ServiceApp();
