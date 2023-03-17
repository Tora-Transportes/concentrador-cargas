export const funcScrollTop = (indexLeft, indexTop) => {
	return window.scrollTo({
		left: indexLeft,
		top: indexTop,
		behavior: "smooth",
	});
};
