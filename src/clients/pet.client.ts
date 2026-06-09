import type { APIRequestContext, APIResponse } from '@playwright/test';
import type { Pet, PetStatus } from '../types/pet';

export class PetClient {
  constructor(private readonly request: APIRequestContext) {}

  create(pet: Pet): Promise<APIResponse> {
    return this.request.post('pet', { data: pet });
  }

  getById(petId: number): Promise<APIResponse> {
    return this.request.get(`pet/${petId}`);
  }

  findByStatus(status: PetStatus): Promise<APIResponse> {
    return this.request.get('pet/findByStatus', { params: { status } });
  }

  update(pet: Pet): Promise<APIResponse> {
    return this.request.put('pet', { data: pet });
  }

  delete(petId: number): Promise<APIResponse> {
    return this.request.delete(`pet/${petId}`);
  }
}
