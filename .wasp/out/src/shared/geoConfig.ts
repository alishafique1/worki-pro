export type CityZone = {
  name: string;
  prefixes: string[];
  active: boolean;
};

export const SERVICE_ZONES: CityZone[] = [
  {
    name: 'Oakville',
    prefixes: ['L6H', 'L6J', 'L6K', 'L6L', 'L6M'],
    active: true,
  },
  {
    name: 'Burlington',
    prefixes: ['L7L', 'L7M', 'L7N', 'L7P', 'L7R', 'L7S', 'L7T'],
    active: true,
  },
  {
    name: 'Milton',
    prefixes: ['L9T', 'L0P'],
    active: true,
  },
  {
    name: 'Mississauga',
    prefixes: ['L4T', 'L4W', 'L4X', 'L4Y', 'L4Z', 'L5A', 'L5B', 'L5C', 'L5E', 'L5G', 'L5H', 'L5J', 'L5K', 'L5L', 'L5M', 'L5N', 'L5R', 'L5S', 'L5T', 'L5V', 'L5W', 'L4H', 'L4K', 'L4L'],
    active: true,
  },
  // Future zones — set active: true to enable
  {
    name: 'Hamilton',
    prefixes: ['L8E', 'L8G', 'L8H', 'L8J', 'L8K', 'L8L', 'L8M', 'L8N', 'L8P', 'L8R', 'L8S', 'L8T', 'L8V', 'L8W'],
    active: false,
  },
];

export const ACTIVE_PREFIXES: Set<string> = new Set(
  SERVICE_ZONES.filter(z => z.active).flatMap(z => z.prefixes)
);

export const getCityForPrefix = (prefix: string): string | null => {
  const zone = SERVICE_ZONES.find(z => z.active && z.prefixes.includes(prefix));
  return zone?.name ?? null;
};
