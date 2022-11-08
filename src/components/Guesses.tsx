import { useEffect, useState } from 'react';
import { FlatList, useToast } from 'native-base';

import { Game, GameProps } from './Game';
import { Loading } from './Loading';
import { api } from '../services/api';
import { EmptyMyPoolList } from './EmptyMyPoolList';

interface Props {
	poolId: string;
	code: string;
}

export function Guesses({ poolId, code }: Props) {
	const [isLoading, setIsLoading] = useState(true);
	const [games, setGames] = useState<GameProps[]>([]);
	const [firstTeamPoints, setFirstTeamPoints] = useState('');
	const [secondTeamPoints, setSecondTeamPoints] = useState('');

	const toast = useToast();

	const fetchGames = async () => {
		try {
			setIsLoading(true);

			const response = await api.get(`/pools/${poolId}/games`);
			setGames(response.data.games);
		} catch (error) {
			toast.show({
				title: 'Não foi possível carregar os jogos',
				placement: 'top',
				bgColor: 'red.500'
			})
		} finally {
			setIsLoading(false);
		}
	};

	const handleGuessConfirm = async (gameId: string) => {
		console.log(firstTeamPoints.trim(), secondTeamPoints.trim());

		try {
			setIsLoading(true);

			if (!firstTeamPoints.trim() || !secondTeamPoints.trim()) {
				return toast.show({
					title: 'Informe o placar do palpite',
					placement: 'top',
					bgColor: 'red.500'
				})
			}

			await api.post(`/pools/${poolId}/games/${gameId}/guesses`, {
				firstTeamPoints: Number(firstTeamPoints),
				secondTeamPoints: Number(secondTeamPoints),
			});

			toast.show({
				title: 'Palpite enviado com sucesso',
				placement: 'top',
				bgColor: 'green.500'
			})

			fetchGames();

		} catch (error) {
			console.log(error.response?.data?.message);

			toast.show({
				title: 'Não foi possível enviar o palpite',
				placement: 'top',
				bgColor: 'red.500'
			})
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		fetchGames();
	}, [poolId])

	if (isLoading) {
		return <Loading />;
	}

	return (
		<FlatList
			data={games}
			keyExtractor={item => item.id}
			renderItem={({ item }) => (
				<Game
					data={item}
					setFirstTeamPoints={setFirstTeamPoints}
					setSecondTeamPoints={setSecondTeamPoints}
					onGuessConfirm={() => handleGuessConfirm(item.id)}
				/>
			)}
			ListEmptyComponent={({ item }) => <EmptyMyPoolList code={code} />}
		/>
	);
}
