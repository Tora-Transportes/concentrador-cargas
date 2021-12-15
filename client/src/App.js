import AllRoutes from "./routes";
import StorageCargaProvider from "./hooks/storageCargas";

const App = () => {
	return (
		<StorageCargaProvider>
			<AllRoutes />;
		</StorageCargaProvider>
	);
};

export default App;
