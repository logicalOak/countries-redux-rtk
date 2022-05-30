import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

const initialState = {
	currentCountry: null,
	status: 'idle',
	error: null,
	neighbors: [],
};

export const loadCountryByName = createAsyncThunk(
	'@@details/loadCountryByName',
	(name, { extra: { client, api } }) => {
		return client.get(api.searchByCountry(name));
	}
);

export const loadNeighborsByBorder = createAsyncThunk(
	'@@details/loadNeighbors',
	(borders, { extra: { client, api } }) => {
		return client.get(api.filterByCode(borders));
	}
);

const detailsSlice = createSlice({
	name: '@@details',
	initialState,
	reducers: {
		clearDetails: () => initialState,
	},
	extraReducers: {
		// loadCountryByName
		[loadCountryByName.pending]: (state) => {
			state.status = 'loading';
			state.error = null;
		},
		[loadCountryByName.fulfilled]: (state, { payload }) => {
			state.status = 'received';
			state.currentCountry = payload.data[0];
		},
		[loadCountryByName.rejected]: (state, { payload }) => {
			state.status = 'rejected';
			state.error = payload;
		},
		// loadNeighborsByBorder

		[loadNeighborsByBorder.fulfilled]: (state, { payload }) => {
			state.neighbors = payload.data.map((country) => country.name);
		},
	},
});

export const { clearDetails } = detailsSlice.actions;
export const detailsReducer = detailsSlice.reducer;

// selectors
export const selectCurrentCountry = (state) => state.details.currentCountry;
export const selectDetails = (state) => state.details;
export const selectNeighbors = (state) => state.details.neighbors;
