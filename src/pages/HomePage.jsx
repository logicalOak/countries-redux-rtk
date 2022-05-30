import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';

import { List } from '../components/List';
import { Card } from '../components/Card';
import { Controls } from '../components/Controls';
import { selectControls } from '../features/controls/controlsSlice';
import {
	loadCountries,
	selectCountriersInfo,
	selectVisibleCountries,
} from '../features/countries/countriesSlice';

export const HomePage = () => {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const { search, region } = useSelector(selectControls);

	const countries = useSelector((state) =>
		selectVisibleCountries(state, { search, region })
	);
	const { status, error, qty } = useSelector(selectCountriersInfo);

	useEffect(() => {
		if (!qty) {
			dispatch(loadCountries());
		}
	}, [qty, dispatch]);

	return (
		<>
			<Controls />

			{error && <h2>Can't get data</h2>}
			{status === 'loading' && <h2>Loading...</h2>}

			{status === 'received' && (
				<List>
					{countries.map((c) => {
						const countryInfo = {
							img: c.flags.png,
							name: c.name,
							info: [
								{
									title: 'Population',
									description: c.population.toLocaleString(),
								},
								{
									title: 'Region',
									description: c.region,
								},
								{
									title: 'Capital',
									description: c.capital,
								},
							],
						};

						return (
							<Card
								key={c.name}
								onClick={() => navigate(`/country/${c.name}`)}
								{...countryInfo}
							/>
						);
					})}
				</List>
			)}
		</>
	);
};
