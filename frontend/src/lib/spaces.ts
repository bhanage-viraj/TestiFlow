import { apiClient } from './api';

export interface Space {
  id: string;
  name: string;
  redirectUrl: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSpaceRequest {
  name: string;
  redirectUrl: string;
}

export interface UpdateSpaceRequest {
  name: string;
  redirectUrl: string;
}

// Get all spaces for the authenticated user
export async function getSpaces(): Promise<Space[]> {
  console.log('Fetching spaces from API...');
  const data = await apiClient.getSpaces();
  console.log('Spaces data:', data);
  return data;
}

// Get a specific space by ID
export async function getSpace(spaceId: string): Promise<Space> {
  return apiClient.getSpace(spaceId);
}

// Create a new space
export async function createSpace(spaceData: CreateSpaceRequest): Promise<Space> {
  return apiClient.createSpace(spaceData);
}

// Update an existing space
export async function updateSpace(spaceId: string, spaceData: UpdateSpaceRequest): Promise<Space> {
  return apiClient.updateSpace(spaceId, spaceData);
}

// Delete a space
export async function deleteSpace(spaceId: string): Promise<void> {
  await apiClient.deleteSpace(spaceId);
}
