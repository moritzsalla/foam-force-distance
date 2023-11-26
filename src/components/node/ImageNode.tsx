import { useMemo } from "react";
import styled from "styled-components";
import { base } from "components/node/base-styles";

const WIDTH = 200;
const HEIGHT = 300;

const ImageNode = () => {
	return (
		<StyledImage
			src={useMemo(() => {
				return getRandomImageUrl();
			}, [])}
		/>
	);
};

const getRandomImageUrl = () => {
	const randomId = Math.round(Math.random() * 400);
	const url = `https://picsum.photos/id/${randomId}/${WIDTH}/${HEIGHT}`;

	return url;
};

const StyledImage = styled.img`
	${base};
`;

export default ImageNode;
