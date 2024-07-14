import { SafeAreaView, StatusBar } from 'react-native';

import { useTheme } from '@/theme';

import type { PropsWithChildren } from 'react';

function SafeScreen({ children }: PropsWithChildren) {
	const { layout, variant, navigationTheme } = useTheme();

	return (
		<SafeAreaView
			style={[
				layout.flex_1,
				{ backgroundColor: '#fff' },
			]}
		>
			<StatusBar
				barStyle={'dark-content'}
				backgroundColor={"#fff"}
			/>
			{children}
		</SafeAreaView>
	);
}

export default SafeScreen;
