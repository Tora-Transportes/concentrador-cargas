export default function (defaultValues) {
	return (state = defaultValues, { type, payload }) => {
		const cargaExists = state.results.find((i) => i.id === payload.id);
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
			case "UPDATE_OR_ADD_CARGA":
				return cargaExists
					? {
							...state,
							results: state.results.map((i) => {
								return payload.id === i.id ? payload : i;
							}),
					  }
					: {
							...state,
							results: [...state.results, payload],
					  };
			default:
				throw new Error("Invalid dispatch action " + type);
		}
	};
}
