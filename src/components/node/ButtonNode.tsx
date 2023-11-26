import styled from "styled-components";
import { base } from "components/node/base-styles";

const ButtonNode = () => {
	return (
		<StyledButton
			type="button"
			aria-label="Click to check out more"
			onClick={() => {
				alert("clicked");
			}}
		>
			Check out more
		</StyledButton>
	);
};

const StyledButton = styled.button`
	${base};
	border-radius: 0;
	cursor: pointer;
`;

export default ButtonNode;
