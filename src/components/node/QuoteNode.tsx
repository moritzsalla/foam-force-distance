import styled from "styled-components";
import { base } from "components/node/base-styles";

const QuoteNode = () => {
	return (
		<StyledRoot>
			Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
			tempor incididunt ut labore et dolore magna aliqua.
		</StyledRoot>
	);
};

const StyledRoot = styled.div`
	${base};
	font-size: 1rem;
	padding: 0.5rem;
	font-style: italic;
`;

export default QuoteNode;
