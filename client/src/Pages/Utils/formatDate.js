import moment from "moment";

const dataAtual = new Date();
// Data atual (string) 2023-01-18T14:44:40
export const formatDate = (dataValor) => {
	let data = new Date(dataValor);

	let data2 = new Date(data.valueOf() - data.getTimezoneOffset() * 60000);

	return data2.toISOString().replace(/\.\d{3}Z$/, "");
};

// Data atual mais 3 horas para conpensar o fuso horario
export const formatDateAtual3HorasMais = (dataValor) => {
	return moment(dataValor).add(3, "hour").format("DD/MM/YYYY HH:mm:ss");
};

//Data com opção de add horas
export const formatDateAddminutes = (dataValor, addHour) => {
	let data1 = new Date(dataValor);

	let data2 = new Date(data1.valueOf() - data1.getTimezoneOffset() * 60000);

	data2.setMinutes(data2.getMinutes() + addHour);

	return data2.toISOString().replace(/\.\d{3}Z$/, "");
};

export const formatDateAddHours = (dataValor, addHour) => {
	let data1 = new Date(dataValor);

	let data2 = new Date(data1.valueOf() - data1.getTimezoneOffset() * 60000);

	data2.setHours(data2.getHours() + addHour);

	return data2.toISOString().replace(/\.\d{3}Z$/, "");
};

//Data com opção add dias
export const formatAddOrSubtracDate = (dataValor, addDay, operacao) => {
	let data1 = new Date(dataValor);

	let data2 = new Date(data1.valueOf() - data1.getTimezoneOffset() * 60000);

	if (operacao === "somar") {
		data2.setDate(data2.getDate() + addDay);
	} else {
		data2.setDate(data2.getDate() - addDay);
	}

	return data2.toISOString().replace(/\.\d{3}Z$/, "");
};

// função para validação de data validas
export const funcValidDate = (date) => {
	const dateNewDate = new Date(date);
	if (dateNewDate instanceof Date && !isNaN(dateNewDate)) {
		return false;
	} else {
		return true;
	}
};

export const funcCompareDateOneYear = (date) => {
	const validandoData = funcValidDate(date);
	if (validandoData)
		return { error: true, message: "Data com formato Incorreta." };
	const dataMaisUmAno = formatAddOrSubtracDate(dataAtual, 366, "somar");
	const dataSubtrairUmAno = formatAddOrSubtracDate(dataAtual, 366, "subtrair");
	if (date > dataMaisUmAno || date < dataSubtrairUmAno) {
		return {
			error: true,
			message: "A data informada não deve ultrapassar o período de 365 dias..",
		};
	} else {
		return { error: false, message: "Ok." };
	}
};

export const funcValidInputDate = (e, quantidadedigito, capiturarDigito) => {
	if (["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"].includes(e.key)) {
		capiturarDigito([e.key]);
	}

	if (quantidadedigito?.length > 10) return true;
};

//const hoje = new Date()
//const dia = hoje.getDate().toString().padStart(2,'0')
//const mes = String(hoje.getMonth() + 1).padStart(2,'0')
//const ano = hoje.getFullYear()
//const dataAtual = `${dia}/${mes}/${ano}`

export const formatDateADD1HoraObject = (dataValues) => {
	if (dataValues) {
		const dateFormate = new Date(dataValues);
		//dateFormate.setHours(dateFormate.getHours() + 1);
		return dateFormate;
	}
};
