import ServiceApp from "src/services/ServiceApp";
import ServiceLogs from "src/services/ServiceLogs";

export const envioCargaApp = async (body) => {
	const {
		idCarga, // cogigo carga
		oid,
		cliente,
		origem_carga,
		destino_carga,
		data_entrega,
		data_coleta,
		tipo_carga,
		quantidade,
		observacao,
	} = body;

	const cidadeEstadoOrigem = origem_carga.split("/");
	const cidadeEstadoDestino = destino_carga.split("/");
	const nameClient = cliente.split("-")[0];
	const bodyEnvioApp = {
		requestCode: idCarga, //data, //codigo da carga
		operatorNumber: oid, // number user
		creationDate: new Date(), //data cadastro
		product: tipo_carga, // produto da carga
		originUF: cidadeEstadoOrigem[1], // uf origem
		originCity: cidadeEstadoOrigem[2], // cidade origem
		originCollection: nameClient?.trim(), // Origem coleta obs: cliente
		deliveryUF: cidadeEstadoDestino[1], // uf destino
		deliveryCity: cidadeEstadoDestino[2], // cidade destino
		estimatedStartDate: data_coleta, // data coleta
		estimatedEndDate: data_entrega, // data entrega
		notes: observacao, // observação
		weight: quantidade, // peso
	};

	try {
		const result = await ServiceApp.envioCargaApp(bodyEnvioApp);
		if (result.status === 200) {
			ServiceLogs.run({
				message: result.data.response.message,
				descricao: "Envio carga App com sucesso!",
				level: "info",
				nameFile: "sucess-carga-app",
				id: idCarga,
			});
		}

		// "response": {
		// 	"message": "Freight created successfully!",
		// 	"data": {
		// 		"id": 22373
		// 	}
		// }
	} catch (error) {
		ServiceLogs.run({
			message: String(error),
			descricao: "Erro ao enviar carga App",
			level: "error",
			nameFile: "error-carga-app",
			id: idCarga,
		});
	}
};
