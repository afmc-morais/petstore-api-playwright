import { expect, test } from '@playwright/test';
import {
  expectPetContract,
  expectPetNotFound,
  expectPetsWithStatus,
} from '../src/assertions/pet.assertions';
import { PetClient } from '../src/clients/pet.client';
import { buildPet } from '../src/factories/pet.factory';
import type { Pet } from '../src/types/pet';

test.describe('Petstore - pets', () => {
  test('creates, reads, updates and deletes a pet', async ({ request }) => {
    const client = new PetClient(request);
    const pet = buildPet();
    let deleted = false;

    try {
      const createResponse = await client.create(pet);
      expect(createResponse.status()).toBe(200);
      const createBody: unknown = await createResponse.json();
      expectPetContract(createBody);
      expect(createBody).toEqual(pet);

      const getResponse = await client.getById(pet.id);
      expect(getResponse.status()).toBe(200);
      const createdPet: unknown = await getResponse.json();
      expectPetContract(createdPet);
      expect(createdPet).toEqual(pet);

      const updatedPet: Pet = {
        ...pet,
        name: `${pet.name}-updated`,
        status: 'sold',
      };
      const updateResponse = await client.update(updatedPet);
      expect(updateResponse.status()).toBe(200);
      const updateBody: unknown = await updateResponse.json();
      expectPetContract(updateBody);
      expect(updateBody).toEqual(updatedPet);

      const deleteResponse = await client.delete(pet.id);
      expect(deleteResponse.status()).toBe(200);
      deleted = true;

      const deletedPetResponse = await client.getById(pet.id);
      expect(deletedPetResponse.status()).toBe(404);
    } finally {
      if (!deleted) {
        await client.delete(pet.id);
      }
    }
  });

  test('lists pets filtered by status', async ({ request }) => {
    const client = new PetClient(request);
    const response = await client.findByStatus('available');

    expect(response.status()).toBe(200);
    expectPetsWithStatus(await response.json(), 'available');
  });

  test('returns 404 when a pet does not exist', async ({ request }) => {
    const client = new PetClient(request);
    const response = await client.getById(9_000_000_000_000_000);

    expect(response.status()).toBe(404);
    expectPetNotFound(await response.text());
  });
});
