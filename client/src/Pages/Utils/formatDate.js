import moment from "moment";

export const formatDate = (dataValor) => {
	let data = new Date(dataValor);

	let data2 = new Date(data.valueOf() - data.getTimezoneOffset() * 60000);

	return data2.toISOString().replace(/\.\d{3}Z$/, "");
};

export const formatDateAddHours = (dataValor, addHour) => {
	let data1 = new Date(dataValor);

	let data2 = new Date(data1.valueOf() - data1.getTimezoneOffset() * 60000);

	data2.setHours(data2.getHours() + addHour);

	return data2.toISOString().replace(/\.\d{3}Z$/, "");
};

export const formatDateAtual = (dataValor) => {
	return moment(dataValor).format("DD/MM/YYYY HH:mm:ss");
};
