import { useEffect } from "react";
export default function useDebouncedFunction(handler, watchedValue, delay) {
	useEffect(() => {
		if (watchedValue !== "") {
			const timeoutHandler = setTimeout(() => {
				handler();
			}, delay);
			return () => {
				clearTimeout(timeoutHandler);
			};
		} else {
			handler();
		}
	}, [watchedValue, delay]);
}
