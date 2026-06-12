import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, Text } from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import { FiChevronRight } from "react-icons/fi";
import { publicBrand } from "views/public/publicBrand";

export default function Breadcrumbs({ items = [] }) {
  if (!items.length) return null;

  return (
    <Breadcrumb
      spacing={2}
      separator={<FiChevronRight size={14} color={publicBrand.colors.textSoft} />}
      fontSize="sm"
      color={publicBrand.colors.textSoft}
      flexWrap="wrap"
    >
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <BreadcrumbItem key={`${item.label}-${index}`} isCurrentPage={isLast}>
            {isLast || !item.href ? (
              <Text color={publicBrand.colors.ink} fontWeight="600">
                {item.label}
              </Text>
            ) : (
              <BreadcrumbLink
                as={RouterLink}
                to={item.href}
                _hover={{ color: publicBrand.colors.gold }}
              >
                {item.label}
              </BreadcrumbLink>
            )}
          </BreadcrumbItem>
        );
      })}
    </Breadcrumb>
  );
}
