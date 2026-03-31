import React from "react";

export const lazyView = (path) => React.lazy(() => import(`../${path}`));

export const createRoute = ({
  name,
  i18nKey,
  layout,
  path,
  component,
  icon,
  under,
  parentName,
  both,
}) => ({
  name,
  ...(i18nKey ? { i18nKey } : {}),
  layout,
  path,
  component,
  ...(icon ? { icon } : {}),
  ...(under ? { under } : {}),
  ...(parentName ? { parentName } : {}),
  ...(both ? { both } : {}),
});
