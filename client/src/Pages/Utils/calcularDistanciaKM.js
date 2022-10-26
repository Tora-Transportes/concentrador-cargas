import ServiceCargas from "../../services/ServiceCargas";

export async function calcularDistancia(origem_carga, destino_carga) {
	const [, estado_origem, cidade_origem] = origem_carga.split("/");
	const [, estado_destino, cidade_destino] = destino_carga.split("/");
	try {
		const { data } = await ServiceCargas.getDistance({
			cidade_origem,
			cidade_destino,
			estado_origem,
			estado_destino,
		});
		const distance = data.data;
		return distance;
	} catch (err) {
		console.error(err);
	}
}
