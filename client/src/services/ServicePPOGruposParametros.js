import api from "./api";
class ServicePPOGruposParametros {
	async list(grupo_id) {
		return api.get(`/ppo/grupos/parametros?grupo_id=${grupo_id}`);
	}

	async create({
		grupo_id,
		parametro_id,
		operador_logico_primario,
		valor_primario,
		operador_logico_secundaria,
		valor_secundario,
		premio,
		tabela,
		campo,
		faixa_valores,
		ativo,
	}) {
		return api.post("/ppo/grupos/parametros", {
			grupo_id,
			parametro_id,
			operador_logico_primario,
			valor_primario,
			operador_logico_secundaria,
			valor_secundario,
			premio,
			tabela,
			campo,
			faixa_valores,
			ativo,
		});
	}

	async update(id, values) {
		return api.patch(`/ppo/grupos/parametros/${id}`, values);
	}

	async delete({ id }) {
		return api.delete(`/ppo/grupos/parametros/${id}`);
	}
}

export default new ServicePPOGruposParametros();
