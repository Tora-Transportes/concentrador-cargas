import ServiceApp from "src/services/ServiceApp";
import ServiceLogs from "src/services/ServiceLogs";

export const envioCargaApp = async (cargas, oid, cpf_motorista) => {
	const saveError = (error) => {
		ServiceLogs.run({
			message: String(error),
			descricao: "Erro ao enviar cargas para o App",
			level: "error",
			nameFile: "error-envio-cargas-app",
		});
	};

	try {
		// Construir o array com todas as cargas
		const bodyEnvioAppList = cargas.map((body) => {
			let {
				id,
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
				placa_veiculo,
				janela_coleta,
				janela_entrega,
				data_limite_oferta,
				estilo_carga,
				forca_trabalho,
				carga_mae_id,
				carga_filha,
			} = body;

			if (!janela_coleta) {
				janela_coleta = "00:00";
			}

			if (!janela_entrega) {
				janela_entrega = "00:00";
			}

			// Validar e verificar valores de data
			if (!data_coleta || !data_entrega || !janela_coleta || !janela_entrega) {
				throw new Error(
					`Valores inválidos de data ou janela: data_coleta=${data_coleta}, data_entrega=${data_entrega}, janela_coleta=${janela_coleta}, janela_entrega=${janela_entrega}`
				);
			}

			const cidadeEstadoOrigem = origem_carga.split("/");
			const cidadeEstadoDestino = destino_carga.split("/");

			const data_inicio = new Date(
				`${data_coleta.substring(0, 10)}T${janela_coleta}:00`
			);
			const data_fim = new Date(
				`${data_entrega.substring(0, 10)}T${janela_entrega}:00`
			);

			console.log(data_inicio, data_fim);

			// Verificar se as datas são válidas
			if (isNaN(data_inicio.getTime()) || isNaN(data_fim.getTime())) {
				throw new Error(
					`Datas inválidas: data_inicio=${data_inicio}, data_fim=${data_fim}`
				);
			}

			const nameClient = cliente.split("-")[0];

			// Ajustar o fuso horário
			const offset = -3; // Offset em horas para GMT-3
			const offsetInMs = offset * 60 * 60 * 1000;

			// Ajustar as datas
			const localDateInicio = new Date(data_inicio.getTime() + offsetInMs);
			const localDateFim = new Date(data_fim.getTime() + offsetInMs);

			// Formatar datas em ISO
			const isoDateStringInicio =
				localDateInicio.toISOString().split(".")[0] + "Z";
			const isoDateStringFim = localDateFim.toISOString().split(".")[0] + "Z";

			return {
				requestCode: id,
				operatorNumber: oid,
				creationDate: new Date(),
				product: tipo_carga,
				originUF: cidadeEstadoOrigem[1],
				originCity: cidadeEstadoOrigem[2],
				originCollection: nameClient?.trim(),
				deliveryUF: cidadeEstadoDestino[1],
				deliveryCity: cidadeEstadoDestino[2],
				estimatedStartDate: isoDateStringInicio,
				estimatedEndDate: isoDateStringFim,
				observacao: observacao || "",
				acessorios_requisitos: acessorios_requisitos || "",
				informacoes_restritivas: informacoes_restritivas || "",
				weight: String(quantidade) + " KG",
				valueFreight: valor_frete,
				placa_veiculo: placa_veiculo,
				cpf_motorista: cpf_motorista,
				data_limite_oferta: data_limite_oferta,
				estilo_carga: estilo_carga,
				forca_trabalho: forca_trabalho,
				carga_mae_id: carga_mae_id,
				carga_filha: carga_filha,
			};
		});

		// Enviar todas as cargas em uma única requisição
		console.log(bodyEnvioAppList);
		if (bodyEnvioAppList[0].estilo_carga == 1) {
			await ServiceApp.envioCargaApp(bodyEnvioAppList[0]);
		} else {
			await ServiceApp.envioCargaLoteApp({
				freights: bodyEnvioAppList,
			});
		}
	} catch (error) {
		console.log(error);
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
