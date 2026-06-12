import { Box, HStack, Icon, Image, Stack, Text, IconButton } from "@chakra-ui/react";
import useEmblaCarousel from "embla-carousel-react";
import { useCallback, useEffect, useState } from "react";
import { FiChevronLeft, FiChevronRight, FiStar } from "react-icons/fi";
import { useTranslation } from "react-i18next";
import PublicPageShell from "components/public/PublicPageShell";
import ScrollReveal from "components/public/ScrollReveal";
import { publicBrand } from "views/public/publicBrand";

const StarRating = ({ value = 5 }) => (
  <HStack spacing={1}>
    {Array.from({ length: 5 }).map((_, index) => (
      <Icon
        key={index}
        as={FiStar}
        color={index < value ? publicBrand.colors.gold : "gray.300"}
        fill={index < value ? publicBrand.colors.gold : "transparent"}
      />
    ))}
  </HStack>
);

export default function TestimonialsPage() {
  const { t } = useTranslation();
  const testimonials = t("publicPages.testimonials.items", { returnObjects: true }) || [];
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: "start" });
  const [selectedIndex, setSelectedIndex] = useState(0);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return undefined;
    const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap());
    emblaApi.on("select", onSelect);
    onSelect();
    return () => emblaApi.off("select", onSelect);
  }, [emblaApi]);

  return (
    <PublicPageShell
      title={t("publicPages.testimonials.title")}
      subtitle={t("publicPages.testimonials.subtitle")}
      badge={t("publicPages.testimonials.badge")}
      breadcrumbs={[
        { label: t("publicListing.homeNav"), href: "/" },
        { label: t("publicPages.testimonials.title") },
      ]}
      seo={{
        title: t("publicPages.testimonials.title"),
        description: t("publicPages.testimonials.subtitle"),
        path: "/testimonials",
      }}
    >
      <Stack spacing={6}>
        <HStack justify="flex-end" spacing={2}>
          <IconButton
            aria-label="Previous"
            icon={<FiChevronLeft />}
            onClick={scrollPrev}
            borderRadius="full"
            variant="outline"
          />
          <IconButton
            aria-label="Next"
            icon={<FiChevronRight />}
            onClick={scrollNext}
            borderRadius="full"
            bg={publicBrand.gradients.brass}
            color={publicBrand.colors.ink}
          />
        </HStack>

        <Box overflow="hidden" ref={emblaRef}>
          <Box display="flex" gap={4}>
            {Array.isArray(testimonials)
              ? testimonials.map((item, index) => (
                  <Box
                    key={item.name}
                    flex="0 0 100%"
                    maxW={{ base: "100%", md: "calc(50% - 8px)", xl: "calc(33.333% - 11px)" }}
                    minW={{ base: "100%", md: "calc(50% - 8px)", xl: "calc(33.333% - 11px)" }}
                  >
                    <ScrollReveal delay={index * 0.05}>
                      <Box
                        borderRadius="28px"
                        p={6}
                        bg="white"
                        border="1px solid rgba(9,18,32,0.08)"
                        boxShadow={publicBrand.shadows.soft}
                        h="100%"
                      >
                        <HStack spacing={4} mb={4}>
                          <Image
                            src={item.photo}
                            alt={item.name}
                            borderRadius="full"
                            boxSize="56px"
                            objectFit="cover"
                            loading="lazy"
                          />
                          <Stack spacing={1}>
                            <Text fontWeight="700">{item.name}</Text>
                            <Text fontSize="sm" color={publicBrand.colors.textSoft}>
                              {item.role}
                            </Text>
                            <StarRating value={item.rating || 5} />
                          </Stack>
                        </HStack>
                        <Text
                          color={publicBrand.colors.textSoft}
                          lineHeight="1.8"
                          fontStyle="italic"
                        >
                          &ldquo;{item.text}&rdquo;
                        </Text>
                      </Box>
                    </ScrollReveal>
                  </Box>
                ))
              : null}
          </Box>
        </Box>

        <HStack justify="center" spacing={2}>
          {Array.isArray(testimonials)
            ? testimonials.map((_, index) => (
                <Box
                  key={index}
                  w="8px"
                  h="8px"
                  borderRadius="full"
                  bg={selectedIndex === index ? publicBrand.colors.gold : "gray.300"}
                />
              ))
            : null}
        </HStack>
      </Stack>
    </PublicPageShell>
  );
}
