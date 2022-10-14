// react
import { useContext, useEffect, useMemo, useState } from "react";
// mui
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { Typography, useMediaQuery, useTheme } from "@mui/material";
// internal
import CarSpaceListItem from "components/CarSpaceListItem";
import Pin from "components/Pin";
import CarSpace from "models/CarSpace";
import useApplicationContext from "hooks/useApplicationContext";
import { MAPBOX_TOKEN } from "utils/constants";
// third-party
import Map, {
  Marker,
  Popup,
  NavigationControl,
  FullscreenControl,
  ScaleControl,
  GeolocateControl,
} from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";

interface MapViewProps {
  latitude: number;
  longitude: number;
  zoom: number;
  pinLocation?: number[];
  pinsList?: CarSpace[];
  readonly?: boolean;
  height?: number;
}

const MapView: React.FC<MapViewProps> = (props) => {
  const theme = useTheme();
  const xsMatches = useMediaQuery(theme.breakpoints.down("sm"));
  const { darkMode } = useApplicationContext();
  const {
    latitude,
    longitude,
    zoom,
    pinLocation,
    pinsList,
    readonly = false,
    height,
  } = props;

  const [popupInfo, setPopupInfo] = useState<CarSpace | null>(null);
  const [viewState, setViewState] = useState({
    longitude: -100,
    latitude: 40,
    zoom: 3.5,
  });

  useEffect(() => {
    setViewState({
      longitude,
      latitude,
      zoom,
    });
  }, [latitude, longitude, zoom]);

  const pins = useMemo(() => {
    if (pinsList) {
      const ls = pinsList.map((carSpace: CarSpace, index: number) => (
        <Marker
          key={`marker-${index}`}
          longitude={carSpace.longitude}
          latitude={carSpace.latitude}
          anchor='bottom'
          onClick={(e) => {
            e.originalEvent.stopPropagation();
            setPopupInfo(carSpace);
          }}
        >
          <Pin />
        </Marker>
      ));
      ls.push(
        <Marker
          key={`marker-current-location`}
          longitude={longitude}
          latitude={latitude}
          anchor='bottom'
        >
          <LocationOnIcon color='primary' />
        </Marker>
      );

      return ls;
    } else if (pinLocation) {
      return (
        <Marker
          latitude={pinLocation[0]}
          longitude={pinLocation[1]}
          anchor='bottom'
        >
          <Pin />
        </Marker>
      );
    }
  }, [latitude, longitude, pinLocation, pinsList]);

  return (
    <Map
      mapStyle={
        darkMode
          ? "mapbox://styles/mapbox/dark-v9"
          : "mapbox://styles/mapbox/light-v9"
      }
      mapboxAccessToken={MAPBOX_TOKEN}
      {...viewState}
      onMove={(evt) => {
        if (!readonly) {
          setViewState(evt.viewState);
        }
      }}
      style={height ? { height } : undefined}
    >
      {!readonly && (
        <>
          <GeolocateControl position='top-left' />
          <FullscreenControl position='top-left' />
          <NavigationControl position='top-left' />
          <ScaleControl />
        </>
      )}

      {pins}

      {popupInfo && (
        <Popup
          anchor='top'
          longitude={popupInfo.longitude}
          latitude={popupInfo.latitude}
          onClose={() => setPopupInfo(null)}
          maxWidth={xsMatches ? "300px" : "600px"}
        >
          <CarSpaceListItem carSpace={popupInfo} />
        </Popup>
      )}
    </Map>
  );
};

export default MapView;
