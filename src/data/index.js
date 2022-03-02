const nodes = [
  // group 1
  {
    group: 1,
    type: 'button',
    id: 'article-alec-soth',
  },
  {
    group: 1,
    type: 'image',
    id: 'podcast-my-podcast',
  },
  {
    group: 1,
    type: 'quote',
    id: 'quote-alec-soth',
  },
  // group 2
  {
    group: 2,
    type: 'image',
    id: 'image-purgatory-1',
  },
  {
    group: 2,
    type: 'image',
    id: 'image-purgatory-2',
  },
  {
    group: 2,
    type: 'image',
    id: 'image-foam',
  },
];

const links = [
  // group 1
  {
    group: 1,
    source: 'article-alec-soth',
    target: 'podcast-my-podcast',
  },
  {
    group: 1,
    source: 'article-alec-soth',
    target: 'quote-alec-soth',
  },
  // group 2
  {
    group: 2,
    source: 'image-purgatory-1',
    target: 'image-foam',
  },
  {
    group: 2,
    source: 'image-purgatory-1',
    target: 'image-purgatory-2',
  },
];

export const data = {
  nodes,
  links,
};
