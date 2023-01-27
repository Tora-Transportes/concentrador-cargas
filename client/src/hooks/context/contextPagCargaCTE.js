import { createContext, useEffect, useState } from "react";
import useLocalStorage from "src/Pages/Components/useLocalstorage";
import { validationPermissionUser } from "src/Pages/Utils/validationPermissionUser";

export const ContextUseDefault = createContext();

export const DefaultUserProvider = ({ children }) => {
	const [storage, setStorage] = useLocalStorage("permissions_user", []);
	const [isPermissionUser, setPermissionUser] = useState(storage);

	useEffect(() => {
		const buscarPermissao = async () => {
			if (!storage.length) {
				const userPermission = await validationPermissionUser();
				setStorage(userPermission?.permissoes);
				setPermissionUser(userPermission?.permissoes);
			}
		};
		buscarPermissao();
	}, []);

	return (
		<ContextUseDefault.Provider value={{ isPermissionUser, setPermissionUser }}>
			{children}
		</ContextUseDefault.Provider>
	);
};
