import {combineReducers} from 'redux';

import config from './r_config';
import maps from './r_maps';

export default combineReducers({
    config: config,
    maps: maps
});