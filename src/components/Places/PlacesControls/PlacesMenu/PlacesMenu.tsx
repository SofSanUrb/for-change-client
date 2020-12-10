import { makeStyles, Theme } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import Popover from '@material-ui/core/Popover';
import Tab from '@material-ui/core/Tab';
import FilterListIcon from '@material-ui/icons/FilterList';
import { TabContext, TabList, TabPanel } from '@material-ui/lab';
import React, { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';

import { Place, PlaceType } from '../../../../sdk/models';
import { PlacesFilters, PlacesFiltersValues } from './PlacesFilters';
import { PlacesSearchList } from './PlacesSearchList';

export type PlaceTypeFiltersValues = Record<PlaceType, boolean>;

export enum PlacesMenuTab {
    CATEGORIES = 'CATEGORIES',
    PLACES = 'PLACES'
}

export type PlacesMenuOnChange = (filterValues: PlaceTypeFiltersValues, places: Place[]) => void;

export type PlacesMenuProps = {
    className: string;
    onChange: PlacesMenuOnChange;
    onChangeOpen: (open: boolean) => void;
    onChangeTab: (tab: PlacesMenuTab) => void;
    open: boolean;
    originalSelectedPlaces: Place[];
    places: Place[];
    searchQuery: string;
    tab: PlacesMenuTab;
};

const useStyles = makeStyles((theme: Theme) => ({
    placesList: {
        maxHeight: '300px',
        overflow: 'auto',
        padding: `0 ${theme.spacing(3)}px`
    },
    placesListTabPanel: {
        padding: 0
    },
    popoverPaper: {
        maxWidth: `calc(100% - ${theme.spacing(3)}px)`,
        width: '500px'
    }
}));

export const PlacesMenu: React.FunctionComponent<PlacesMenuProps> = (
    {
        className, onChange, onChangeOpen, onChangeTab, open,
        originalSelectedPlaces, places, searchQuery, tab
    }: PlacesMenuProps
): JSX.Element => {
    const { t } = useTranslation();
    const anchorEl = useRef<HTMLButtonElement | null>(null);
    const [selectedPlaces, setSelectedPlaces] = useState<Place[]>([]);
    const [placeTypeFiltersValues, setPlaceTypeFiltersValues] = useState<PlaceTypeFiltersValues>({
        [PlaceType.ASSOCIATION]: true,
        [PlaceType.CAFE]: true,
        [PlaceType.CLOTHING]: true,
        [PlaceType.EVENT]: true,
        [PlaceType.GROCERIES]: true,
        [PlaceType.HOUSING]: true,
        [PlaceType.SHOPPING]: true
    });

    const handleClick = (): void => {
        onChangeOpen(true);
        setSelectedPlaces(originalSelectedPlaces);
    };

    const handleClose = (): void => {
        onChangeOpen(false);
        setSelectedPlaces(originalSelectedPlaces);
    };

    const handleTabChange = (_event: React.ChangeEvent<{}>, newTabValue: string): void => {
        onChangeTab(newTabValue as PlacesMenuTab);
    };

    const onPlaceTypeFilterChange = (mapFiltersValues: PlacesFiltersValues<PlaceTypeFiltersValues>): void => {
        setPlaceTypeFiltersValues(mapFiltersValues);
        handleFilterChange(mapFiltersValues);
    };

    const handleFilterChange = (mapFiltersValues: PlacesFiltersValues<PlaceTypeFiltersValues>): void => {
        onChange(mapFiltersValues, selectedPlaces);
    };

    const onChangeSelectedPlaces = (places: Place[]): void => {
        setSelectedPlaces(places);
    };

    const applySelectedPlaces = (): void => {
        onChange(placeTypeFiltersValues, selectedPlaces);
    };

    const id = open ? 'places-menu' : undefined;

    const classes = useStyles();

    return (
        <>
            <IconButton
                className={className}
                edge="start"
                color="inherit"
                aria-controls="places-menu"
                aria-label={t('places.menu.label')}
                aria-haspopup="true"
                onClick={handleClick}
                ref={anchorEl}
            >
                <FilterListIcon/>
            </IconButton>
            <Popover
                classes={{ paper: classes.popoverPaper }}
                id={id}
                open={open}
                anchorEl={anchorEl.current}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                }}
            >
                <TabContext value={tab}>
                    <TabList onChange={handleTabChange} aria-label={t('places.menu.tabs.label')} variant="fullWidth">
                        <Tab label={t('places.menu.tabs.categories.label')} value={PlacesMenuTab.CATEGORIES}/>
                        <Tab label={t('places.menu.tabs.places.label')} value={PlacesMenuTab.PLACES}/>
                    </TabList>
                    <TabPanel value={PlacesMenuTab.CATEGORIES}>
                        <PlacesFilters
                            placesFiltersValues={placeTypeFiltersValues}
                            onChange={onPlaceTypeFilterChange}
                        />
                    </TabPanel>
                    <TabPanel className={classes.placesListTabPanel} value={PlacesMenuTab.PLACES}>
                        <PlacesSearchList
                            applySelectedPlaces={applySelectedPlaces}
                            className={classes.placesList}
                            handleClose={handleClose}
                            onChangeSelectedPlaces={onChangeSelectedPlaces}
                            places={places}
                            searchQuery={searchQuery}
                            selectedPlaces={selectedPlaces}
                        />
                    </TabPanel>
                </TabContext>
            </Popover>
        </>
    );
}