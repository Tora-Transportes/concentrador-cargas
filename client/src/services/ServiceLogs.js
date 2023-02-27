const { default: api } = require("./api");

class ServiceLogs {
	async run(body) {
		return await api.post("/logs", body);
	}
}

export default new ServiceLogs();
