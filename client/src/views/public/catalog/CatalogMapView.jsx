import { Box, Text } from "@chakra-ui/react";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import { Link as RouterLink } from "react-router-dom";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import { formatPrice } from "./catalogData";
import { buildPropertyHref } from "utils/propertyHref";
import { useTranslation } from "react-i18next";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const DEFAULT_CENTER = [55.7558, 37.6173];

const getCoordinates = (property) => {
  const lat = Number(property?.latitude || property?.lat || property?.location?.lat);
  const lng = Number(property?.longitude || property?.lng || property?.location?.lng);
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
  return [lat, lng];
};

export default function CatalogMapView({ properties = [] }) {
  const { t, i18n } = useTranslation();
  const mapped = properties
    .map((property) => ({ property, coords: getCoordinates(property) }))
    .filter((item) => item.coords);

  const center = mapped[0]?.coords || DEFAULT_CENTER;

  if (!mapped.length) {
    return (
      <Box
        borderRadius="28px"
        h={{ base: "420px", md: "560px" }}
        w="100%"
        display="flex"
        alignItems="center"
        justifyContent="center"
        bg="rgba(9,18,32,0.04)"
        px={6}
        textAlign="center"
      >
        <Text color="gray.600">
          {t("publicPages.catalog.mapEmpty", {
            defaultValue: "No listings with map coordinates in this selection yet.",
          })}
        </Text>
      </Box>
    );
  }

  return (
    <Box borderRadius="28px" overflow="hidden" h={{ base: "420px", md: "560px" }} w="100%">
      <MapContainer center={center} zoom={11} style={{ height: "100%", width: "100%" }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {mapped.map(({ property, coords }) => (
          <Marker key={property._id} position={coords}>
            <Popup>
              <Text fontWeight="700" mb={1}>
                {property?.name || property?.propertyAddress}
              </Text>
              <Text fontSize="sm" mb={2}>
                {formatPrice(property?.listingPrice, t, i18n.language)}
              </Text>
              <Text
                as={RouterLink}
                to={buildPropertyHref(property)}
                fontSize="sm"
                color="blue.600"
                fontWeight="600"
              >
                {t("publicListing.viewOffer")}
              </Text>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </Box>
  );
}
