import { expect } from '@playwright/test';
import type { Pet, PetListItem, PetStatus } from '../types/pet';

export function expectPetNotFound(responseBody: string): void {
  try {
    const parsedBody: unknown = JSON.parse(responseBody);

    if (typeof parsedBody === 'string') {
      expect(parsedBody).toBe('Pet not found');
      return;
    }

    expect(parsedBody).toMatchObject({
      type: 'error',
      message: 'Pet not found',
    });
  } catch (error) {
    if (error instanceof SyntaxError) {
      expect(responseBody).toBe('Pet not found');
      return;
    }

    throw error;
  }
}

export function expectPetContract(value: unknown): asserts value is Pet {
  expect(value).toEqual({
    id: expect.any(Number),
    category: {
      id: expect.any(Number),
      name: expect.any(String),
    },
    name: expect.any(String),
    photoUrls: expect.any(Array),
    tags: expect.any(Array),
    status: expect.stringMatching(/^(available|pending|sold)$/),
  });

  const pet = value as Pet;
  expect(pet.photoUrls.every((url) => typeof url === 'string')).toBe(true);
  expect(
    pet.tags.every(
      (tag) => typeof tag.id === 'number' && typeof tag.name === 'string',
    ),
  ).toBe(true);
}

export function expectPetsWithStatus(
  value: unknown,
  status: PetStatus,
): asserts value is PetListItem[] {
  expect(Array.isArray(value)).toBe(true);
  expect((value as unknown[]).length).toBeGreaterThan(0);

  for (const valueItem of value as unknown[]) {
    expect(valueItem).toMatchObject({
      status,
    });

    const pet = valueItem as PetListItem;

    if (pet.id !== undefined) {
      expect(typeof pet.id).toBe('number');
    }

    if (pet.name !== undefined) {
      expect(typeof pet.name).toBe('string');
    }

    if (pet.photoUrls !== undefined) {
      expect(pet.photoUrls.every((url) => typeof url === 'string')).toBe(true);
    }

    if (pet.category !== undefined) {
      expect(pet.category).toEqual({
        id: expect.any(Number),
        name: expect.any(String),
      });
    }

    if (pet.tags !== undefined) {
      expect(
        pet.tags.every(
          (tag) => typeof tag.id === 'number' && typeof tag.name === 'string',
        ),
      ).toBe(true);
    }

    expect(pet.status).toBe(status);
  }
}
