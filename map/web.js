import React from "react"
import { withScriptjs, withGoogleMap, GoogleMap, Marker } from "react-google-maps"
import { unstable_createElement } from 'react-native-web';
// import { View } from "react-native";
console.log('QQQ',GoogleMap);
// var GoogleMapX = unstable_createElement(GoogleMap);
// var MarkerX = unstable_createElement(Marker);
var Map = withScriptjs(withGoogleMap(function Map() {
  return (
    <GoogleMap
      defaultZoom={8}
      defaultCenter={{ lat: -34.397, lng: 150.644 }}
    >
      {<Marker position={{ lat: -34.397, lng: 150.644 }} />}
    </GoogleMap>
  )
}))

export default function WebMap() {
  return (
    <Map
      googleMapURL="https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places"
      loadingElement={<div style={{ height: `100%` }} />}
      containerElement={<div style={{ height: `100%` }} />}
      mapElement={<div style={{ height: `100%` }} />}
    />
  )
}