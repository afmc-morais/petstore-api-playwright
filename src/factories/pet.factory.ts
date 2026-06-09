import { randomInt } from 'node:crypto';
import type { Pet } from '../types/pet';

export function buildPet(overrides: Partial<Pet> = {}): Pet {
  const id = Date.now() * 1000 + randomInt(1000);

  return {
    id,
    category: { id: 1, name: 'dogs' },
    name: `playwright-pet-${id}`,
    photoUrls: ['https://example.com/pet.jpg'],
    tags: [{ id: 1, name: 'automated-test' }],
    status: 'available',
    ...overrides,
  };
}
