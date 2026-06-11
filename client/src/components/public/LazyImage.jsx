import { Box, Image, Skeleton } from "@chakra-ui/react";
import { useState } from "react";

export default function LazyImage({
  src,
  alt = "",
  fallbackSrc,
  borderRadius,
  objectFit = "cover",
  w = "100%",
  h,
  loading = "lazy",
  ...props
}) {
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  const resolvedSrc = failed && fallbackSrc ? fallbackSrc : src;

  return (
    <Box position="relative" w={w} h={h} overflow="hidden" borderRadius={borderRadius}>
      {!loaded ? (
        <Skeleton position="absolute" inset={0} borderRadius={borderRadius} startColor="gray.100" endColor="gray.300" />
      ) : null}
      <Image
        src={resolvedSrc}
        alt={alt}
        w="100%"
        h="100%"
        objectFit={objectFit}
        loading={loading}
        decoding="async"
        opacity={loaded ? 1 : 0}
        filter={loaded ? "none" : "blur(12px)"}
        transform={loaded ? "scale(1)" : "scale(1.04)"}
        transition="opacity 0.45s ease, filter 0.45s ease, transform 0.45s ease"
        onLoad={() => setLoaded(true)}
        onError={() => {
          if (!failed && fallbackSrc) {
            setFailed(true);
            setLoaded(false);
            return;
          }
          setLoaded(true);
        }}
        {...props}
      />
    </Box>
  );
}
