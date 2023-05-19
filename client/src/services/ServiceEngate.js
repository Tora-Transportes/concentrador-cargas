import api from "./api";

class ServiceEngate {
	async list(data) {
		return await api.get("/avisos", { params: { data } });
	}

	async create(data) {
		const formData = new FormData();
		formData.append("fileName", data.file);
		formData.append("info", JSON.stringify(data.info));
		const response = await api.post("/engate", formData);
		return response;
	}
}
export default new ServiceEngate();
