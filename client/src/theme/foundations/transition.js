const transition = {
  property: {
    common:
      "background-color, border-color, color, fill, stroke, opacity, box-shadow, transform",
    colors: "background-color, border-color, color, fill, stroke",
    dimensions: "width, height",
    position: "left, right, top, bottom",
    background: "background-color, background-image, background-position",
  },
  easing: {
    "ease-in": "cubic-bezier(0.32, 0, 0.67, 0)",
    "ease-out": "cubic-bezier(0.22, 1, 0.36, 1)",
    "ease-in-out": "cubic-bezier(0.16, 1, 0.3, 1)",
  },
  duration: {
    "ultra-fast": "50ms",
    faster: "140ms",
    fast: "200ms",
    normal: "260ms",
    slow: "360ms",
    slower: "480ms",
    "ultra-slow": "640ms",
  },
};

export default transition;
