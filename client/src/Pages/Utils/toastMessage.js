export const showToastMessage = (toast, severity, summary, life) => {
	return toast.current.show({
		severity,
		summary,
		life,
	});
};
