import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

const initialState = {
	status: 'idle',
	error: null,
	list: [],
};
export const loadCountries = createAsyncThunk(
	'@@countries/load',
	(_, { extra: { client, api } }) => {
		return client.get(api.ALL_COUNTRIES);
	}
);

const countriesSlice = createSlice({
	name: '@@countries',
	initialState,
	reducers: {},
	extraReducers: {
		[loadCountries.pending]: (state) => {
			state.status = 'loading';
			state.error = null;
		},
		[loadCountries.fulfilled]: (state, { payload }) => {
			state.status = 'received';
			state.list = payload.data;
		},
		[loadCountries.rejected]: (state, { payload }) => {
			state.status = 'rejected';
			state.error = payload;
		},
	},
});

export const countriesReducer = countriesSlice.reducer;

// selectors
export const selectCountriersInfo = (state) => ({
	status: state.countries.status,
	error: state.countries.error,
	qty: state.countries.list.length,
});

export const selectAllCountries = (state) => state.countries.list;
export const selectVisibleCountries = (state, { search = '', region = '' }) => {
	return state.countries.list.filter(
		(country) =>
			country.name.toLowerCase().includes(search.toLowerCase()) &&
			country.region.includes(region)
	);
};
