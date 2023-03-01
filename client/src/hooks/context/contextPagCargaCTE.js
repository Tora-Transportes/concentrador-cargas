import { createContext, useState } from "react";

export const ContextUseDefault = createContext();

export const DefaultUserProvider = ({ children }) => {
	const [isPermissionUser, setPermissionUser] = useState();
	const [isIdAvisos, setIdAvisos] = useState("");
	return (
		<ContextUseDefault.Provider
			value={{ isPermissionUser, setPermissionUser, isIdAvisos, setIdAvisos }}
		>
			{children}
		</ContextUseDefault.Provider>
	);
};
