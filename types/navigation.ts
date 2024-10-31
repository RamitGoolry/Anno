declare global {
	namespace ReactNavigation {
		interface RootParamList {
			draw: { uri: string };
			index: undefined;
		}
	}
}

export type DrawScreenParams = {
	uri: string;
};
