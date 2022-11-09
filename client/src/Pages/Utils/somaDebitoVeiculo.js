export default async function somaDebitoVeiculo(values) {
	const arrayDebitos = await values.map((item) => {
		return values, item.DEC_VALOR;
	});
	const totalDebitosVeic = await arrayDebitos.reduce((soma, total) => {
		return soma + total;
	});
	return totalDebitosVeic;
}
