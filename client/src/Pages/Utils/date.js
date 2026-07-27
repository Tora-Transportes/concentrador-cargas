import moment from "moment";
export default {
	convertDateToReadableTime: (seconds) => {
		let secs = Number(seconds);
		let days = Math.trunc(secs / 86400);
		secs -= days * 86400;

		let hours = Math.trunc(secs / 3600);
		secs -= hours * 3600;

		let minutes = Math.trunc(secs / 60);

		return `${days} dia(s), ${hours} hora(s), ${minutes} minuto(s)`;
	},

	formatDate: (value) => {
		if (value == null) return " ";
		const [data, time] = value?.split("T");
		return `${data.split("-").reverse().join("-")} - ${time.split(".")[0]}`;
	},

	formatDateTresHorasMenos: (value) => {
		if (value == null) return " ";
		return moment(value).format("DD/MM/YYYY - HH:mm:ss");
	},
};

export function formatDateForColumns(date) {
	return date?.split("T")[0].split("-").reverse().join("/");
}

export function formatDateAndHourForColumns(date) {
	if (!date) return "";
	const [day, time] = date?.split("T");
	const daysFormatted = day.split("-").reverse().join("/");
	const timeFormatted = time.split(".")[0];
	return `${daysFormatted} ${timeFormatted}`;
}
