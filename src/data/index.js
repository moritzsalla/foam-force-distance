const iterations = 10;
const nGroups = 4;

export const data = {
  nodes: [...Array(iterations)].map((a, i) => {
    return {
      id: `name${i}`,
      group: Math.floor(Math.random() * nGroups),
    };
  }),
  links: [...Array(iterations)].map((_, i) => {
    return {
      source: `name${Math.floor(Math.random() * iterations)}`,
      target: `name${Math.floor(Math.random() * iterations)}`,
      value: Math.floor(Math.random() * nGroups),
    };
  }),
};
