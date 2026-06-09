export const createRoute = ({ name, layout, path, component, icon, under, parentName, both }) => ({
  name,
  layout,
  path,
  component,
  ...(icon ? { icon } : {}),
  ...(under ? { under } : {}),
  ...(parentName ? { parentName } : {}),
  ...(both ? { both } : {}),
});
