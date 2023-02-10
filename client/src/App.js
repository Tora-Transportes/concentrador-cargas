import "leaflet/dist/leaflet.css";
import AllRoutes from "./routes";
import L from "leaflet";
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";
import { v4 as uuidv4 } from "uuid";
import { Helmet } from "react-helmet";

const DefaultIcon = L.icon({
	iconUrl: icon,
	shadowUrl: iconShadow,
});
L.Marker.prototype.options.icon = DefaultIcon;

const App = () => {
	const pathCss = `/fake.css?v=${uuidv4()}`;
	return (
		<>
			<Helmet>
				<link
					rel="stylesheet"
					id="limpa_cache"
					type="text/css"
					href={pathCss}
				/>
			</Helmet>
			<AllRoutes />
		</>
	);
};

export default App;
