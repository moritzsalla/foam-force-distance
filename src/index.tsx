import ConnectionsGrid from "components/ConnectionsGrid";
import { StrictMode } from "react";
import ReactDOM from "react-dom";

const rootElement = document.getElementById("root");

const Root = (
	<StrictMode>
		<ConnectionsGrid />
	</StrictMode>
);

ReactDOM.render(Root, rootElement);
