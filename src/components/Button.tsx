import { Button as NativeBaseButton, Text, IButtonProps } from 'native-base';

interface Props extends IButtonProps {
	title: string;
	type?: 'PRIMARY' | 'SECONDARY';
}

export function Button({ title, type = 'PRIMARY', ...rest }: Props) {
	return (
		<NativeBaseButton
			w="full"
			h={14}
			rounded="sm"
			fontSize="md"
			bg={type === 'SECONDARY' ? 'red.500' : 'yellow.500'}
			_pressed={{
				bg: type === 'SECONDARY' ? 'red.600' : 'yellow.600'
			}}
			_loading={{
				_spinner: {
					color: 'black'
				}
			}}
			{...rest}
		>
			<Text
				fontSize="sm"
				fontFamily="heading"
				textTransform="uppercase"
				color={type === 'SECONDARY' ? 'white' : 'black'}
			>
				{title}
			</Text>
		</NativeBaseButton>
	);
}

