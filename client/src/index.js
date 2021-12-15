import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import requireMicrosoftAuthentication, {
	withAdalLoginApi,
} from "./MicrosoftAuthentication";
import "bootstrap/dist/css/bootstrap.min.css";

// import io from "./services/socket";

// io.on("@carga-create", console.table);
// io.on("@carga-update", console.table);
// io.on("@carga-delete", console.table);

const LoggedApp = withAdalLoginApi(() => <App />);

requireMicrosoftAuthentication(() => {
	ReactDOM.render(
		<BrowserRouter>
			<LoggedApp />
		</BrowserRouter>,
		document.getElementById("root")
	);
});
