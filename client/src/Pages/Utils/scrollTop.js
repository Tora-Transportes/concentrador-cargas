export const funcScrollTop = (indexTop, indexLeft) => {
	return window.scrollTo({
		top: indexTop,
		left: indexLeft,
		behavior: "smooth",
	});
};
