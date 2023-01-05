import { createContext, useState } from "react";

export const ContextUseDefault = createContext();

export const DefaultUserProvider = ({ children }) => {
	const [isPermissionUser, setPermissionUser] = useState("");
	console.log("Context", isPermissionUser);
	return (
		<ContextUseDefault.Provider value={{ isPermissionUser, setPermissionUser }}>
			{children}
		</ContextUseDefault.Provider>
	);
};
