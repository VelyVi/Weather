import { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';
import Card from './components/Card.jsx';
import {
	thunderstormSvg,
	drizzleSvg,
	rainSvg,
	snowSvg,
	atmosphereSvg,
	clearSvg,
	cloudSvg,
} from './assets/images/index.js';

const key = '540839817400dda28b77d2ae53252a75';
const url = `https://api.openweathermap.org/data/2.5/weather`;

const initialState = {
	latitude: 0,
	longitude: 0,
};

const conditionCodes = {
	thunderstorm: [200, 201, 202, 210, 211, 212, 221, 230, 231, 232],
	drizzle: [300, 301, 302, 310, 311, 312, 313, 314, 321],
	rain: [500, 501, 502, 503, 504, 511, 520, 521, 522, 531],
	snow: [600, 601, 602, 611, 612, 613, 615, 616, 620, 621, 622],
	atmosphere: [701, 711, 721, 731, 741, 751, 761, 762, 771, 781],
	clear: [800],
	clouds: [801, 802, 803, 804],
};

const icons = {
	thunderstorm: thunderstormSvg,
	drizzle: drizzleSvg,
	rain: rainSvg,
	snow: snowSvg,
	atmosphere: atmosphereSvg,
	clear: clearSvg,
	clouds: cloudSvg,
};

function App() {
	const [coords, setCoords] = useState(initialState);
	const [weather, setWeather] = useState({});
	const [toggle, setToggle] = useState(false);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const [errorApi, setErrorApi] = useState(null);

	useEffect(() => {
		navigator.geolocation.getCurrentPosition(
			(position) => {
				const { latitude, longitude } = position.coords;
				setCoords({ latitude, longitude });
			},
			(error) => {
				setError("User denied ubication, we can't find the weather");
			},
		);
	}, []);

	useEffect(() => {
		if (coords) {
			setLoading(true);
			axios
				.get(
					`${url}?lat=${coords.latitude}&lon=${coords.longitude}&&appid=${key}`,
				)
				.then((res) => {
					console.log(res.data);
					const keys = Object.keys(conditionCodes);
					const iconName = keys.find((key) =>
						conditionCodes[key].includes(res.data?.weather[0]?.id),
					);

					setWeather({
						city: res.data?.name,
						country: res.data?.sys?.country,
						icon: icons[
							Object.keys(conditionCodes).find((key) =>
								conditionCodes[key].includes(res.data?.weather[0]?.id),
							)
						],
						main: res.data?.weather[0]?.main,
						wind: res.data?.wind?.speed,
						clouds: res.data?.clouds?.all,
						pressure: res.data?.main?.pressure,
						temperature: parseInt(res.data?.main?.temp - 273.15),
					});

					setError(null);
				})
				.catch((err) => {
					setErrorApi(err.response?.data?.message || err.message);
				})
				.finally(() => {
					setLoading(false);
				});
		}
	}, [coords]);

	return (
		<div>
			{loading ? (
				<img src="./../public/load-wop.gif" alt="loadwooper" />
			) : error ? (
				<h2 className="errpsy">
					{' '}
					<img
						className="imgpsy"
						src="./../public/err-psy.gif"
						alt="errpsy"
					/>{' '}
					<p className="texterr">{error}</p>
				</h2>
			) : (
				<Card weather={weather} toggle={toggle} setToggle={setToggle} />
			)}
		</div>
	);
}

export default App;
