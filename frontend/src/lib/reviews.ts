import { apiClient } from './api';

export interface Review {
  id: string;
  authorName: string;
  authorEmail?: string;
  rating: number;
  text: string;
  liked: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateReviewRequest {
  authorName: string;
  authorEmail?: string;
  rating: number;
  text: string;
}

// Get all reviews for a specific space
export async function getReviews(spaceId: string): Promise<Review[]> {
  return apiClient.getReviews(spaceId);
}

// Create a new review (public endpoint)
export async function createReview(slug: string, reviewData: CreateReviewRequest): Promise<void> {
  await apiClient.createReview(slug, reviewData);
}

// Like/unlike a review
export async function toggleReviewLike(reviewId: string): Promise<Review> {
  return apiClient.toggleReviewLike(reviewId);
}

// Delete a review
export async function deleteReview(reviewId: string): Promise<void> {
  await apiClient.deleteReview(reviewId);
}
