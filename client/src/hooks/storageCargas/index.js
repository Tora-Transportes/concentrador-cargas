import { createContext, useContext, useCallback, useReducer } from "react";

export const storageContext = createContext(null);

export default function StorageCargaProvider({ children }) {
	const defaultValues = {
		page: 1,
		total_pages: 1,
		results: [],
	};
	const reducer = useCallback((state = defaultValues, { type, payload }) => {
		switch (type) {
			case "SET":
				return payload;
			case "ADD_CARGA":
				return { ...state, results: [...state.results, payload] };
			case "DELETE_CARGA":
				return {
					...state,
					results: state.results.filter((i) => i.id !== payload.id),
				};
			case "UPDATE_CARGA":
				return {
					...state,
					results: state.results.map((i) => {
						return payload.id === i.id ? payload : i;
					}),
				};
			default:
				throw new Error("Invalid dispatch action " + type);
		}
	}, []);

	const [storage, dispatch] = useReducer(reducer, defaultValues);

	return (
		<storageContext.Provider value={[storage, dispatch]}>
			{children}
		</storageContext.Provider>
	);
}

export function useCargaStore() {
	return useContext(storageContext);
}
