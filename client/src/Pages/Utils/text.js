export default {
	normalize: (text) =>
		text
			.toUpperCase()
			.normalize("NFD")
			.replace(/[\u0300-\u036f]/g, ""),
};
