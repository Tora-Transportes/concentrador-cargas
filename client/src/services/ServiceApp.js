import { apiApp } from "./apiApp";

class ServiceApp {
	async envioCargaApp(body) {
		return await apiApp.post("/createfreight", body);
	}
}

export default new ServiceApp();
