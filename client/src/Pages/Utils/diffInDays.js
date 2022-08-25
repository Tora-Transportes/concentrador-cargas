export default function diffiInDays(dateInicio, dateFim) {
	const diffInMs = new Date(dateFim) - new Date(dateInicio);
	return diffInMs / (1000 * 60 * 60 * 24);
}
