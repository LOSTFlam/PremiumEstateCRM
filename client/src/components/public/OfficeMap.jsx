import { Box, Text } from "@chakra-ui/react";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import { publicBrand } from "views/public/publicBrand";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const DEFAULT_CENTER = [55.7558, 37.6173];

export default function OfficeMap({
  center = DEFAULT_CENTER,
  zoom = 14,
  label = "Premium Estate Office",
  height = "360px",
}) {
  return (
    <Box
      borderRadius="28px"
      overflow="hidden"
      border={`1px solid ${publicBrand.colors.line}`}
      h={height}
      w="100%"
    >
      <MapContainer
        center={center}
        zoom={zoom}
        scrollWheelZoom={false}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={center}>
          <Popup>
            <Text fontWeight="600">{label}</Text>
          </Popup>
        </Marker>
      </MapContainer>
    </Box>
  );
}
