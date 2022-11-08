import { useEffect, useState } from 'react';
import { useRoute } from '@react-navigation/native';
import { HStack, useToast, VStack } from 'native-base';
import { Share } from 'react-native';

import { EmptyMyPoolList } from '../components/EmptyMyPoolList';
import { Header } from '../components/Header';
import { Loading } from '../components/Loading';
import { Option } from '../components/Option';
import { PoolCardPros } from '../components/PoolCard';
import { PoolHeader } from '../components/PoolHeader';

import { api } from '../services/api';
import { Guesses } from '../components/Guesses';

interface RouteParams {
	id: string;
}

export function Details() {
	const [pool, setPool] = useState<PoolCardPros>({} as PoolCardPros);
	const [isLoading, setIsLoading] = useState(true);
	const [selectedOption, setSelectedOption] = useState<'guesses' | 'ranking'>('guesses');

	const route = useRoute();
	const { id } = route.params as RouteParams;

	const toast = useToast();

	const fetchPoolDetails = async () => {
		try {
			setIsLoading(true);

			const response = await api.get(`/pools/${id}`);
			setPool(response.data.pool);

		} catch (error) {
			toast.show({
				title: 'Não foi possível carregar os detalhes do bolão',
				placement: 'top',
				bgColor: 'red.500'
			})
		} finally {
			setIsLoading(false);
		}
	};

	const handleCodeShare = async () => {
		await Share.share({
			message: pool.code
		});
	};

	useEffect(() => {
		fetchPoolDetails();
	}, [id])

	if (isLoading) {
		return <Loading />;
	}

	return (
		<VStack flex={1} bgColor="gray.900">
			<Header
				title={pool.title}
				showBackButton
				showShareButton
				onShare={handleCodeShare}
			/>

			{
				pool._count?.participants > 0
					? (
						<VStack px={5} flex={1}>
							<PoolHeader data={pool} />

							<HStack bgColor="gray.800" p={1} rounded="sm" mb={5}>
								<Option
									title="Seus palpites"
									isSelected={selectedOption === 'guesses'}
									onPress={() => setSelectedOption('guesses')}
								/>
								<Option
									title="Ranking do grupo"
									isSelected={selectedOption === 'ranking'}
									onPress={() => setSelectedOption('ranking')}
								/>
							</HStack>

							<Guesses code={pool.code} poolId={pool.id} />
						</VStack>
					)
					: <EmptyMyPoolList code={pool.code} />
			}
		</VStack>
	);
}
