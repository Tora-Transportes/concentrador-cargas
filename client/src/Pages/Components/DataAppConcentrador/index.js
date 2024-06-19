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
		acessorios_requisitos,
		informacoes_restritivas,
		observacao,
		valor_frete,
		forca_trabalho,
		tipo_viagem,
		estilo_carga,
		data_limite_oferta,
		idCargaMae,
	} = body;

	const cidadeEstadoOrigem = origem_carga.split("/");
	const cidadeEstadoDestino = destino_carga.split("/");
	const nameClient = cliente.split("-")[0];
	const bodyEnvioApp = {
		requestCode: idCarga, //codigo da carga
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
		observacao: observacao || "", // observação 3
		acessorios_requisitos: acessorios_requisitos || "", // observação 1
		informacoes_restritivas: informacoes_restritivas || "", // observação 2
		weight: quantidade, // peso
		valueFreight: valor_frete,
		workforce: forca_trabalho,
		typeTravel: tipo_viagem,
		cargoStyle: estilo_carga,
		offerDeadline: data_limite_oferta,
		parentRequesCode: idCargaMae,
	};

	const saveError = (error) => {
		ServiceLogs.run({
			message: String(error),
			descricao: "Erro ao enviar carga App",
			level: "error",
			nameFile: "error-envio-carga-app",
			id: idCarga,
		});
	};

	try {
		await ServiceApp.envioCargaApp(bodyEnvioApp);
	} catch (error) {
		saveError(error);
	}
};
export const cancelarCargaApp = async (
	idCarga,
	oid,
	observacaoCancelamento
) => {
	const bodyEnvioApp = {
		availableFreight: idCarga, //codigo da carga
		concentradorUser: oid, // number user
		cancellationReason: observacaoCancelamento,
	};

	try {
		ServiceApp.cancelarCargaApp(bodyEnvioApp);
	} catch (error) {
		ServiceLogs.run({
			message: String(error),
			descricao: "Erro ao cancelar carga App",
			level: "error",
			nameFile: "error-cancel-carga-app",
			id: idCarga,
		});
	}
};
