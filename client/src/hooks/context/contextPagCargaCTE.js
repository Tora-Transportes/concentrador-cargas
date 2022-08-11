import { createContext, useState } from "react";

export const ContextUseDefault = createContext();

export const DefaultUserProvider = ({ children }) => {
	const [valuePagCargaCTE, setValuePagCargaCTE] = useState();
	return (
		<ContextUseDefault.Provider
			value={{ valuePagCargaCTE, setValuePagCargaCTE }}
		>
			{children}
		</ContextUseDefault.Provider>
	);
};
