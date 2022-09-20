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
		return `${data.split("-").reverse().join("-")} às ${time.split(".")[0]}`;
	},
};
