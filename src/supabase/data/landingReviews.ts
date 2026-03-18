import { supabase } from "../config/supabaseClient";

export interface LandingPageReview {
  id: string;
  reviewer_name: string;
  rating: number;
  comment: string;
  created_at: string;
}

const REVIEWS_TABLE = "landing_page_reviews";

export async function fetchLandingPageReviews(): Promise<{
  data: LandingPageReview[] | null;
  error: string | null;
}> {
  try {
    const { data, error } = await supabase
      .from(REVIEWS_TABLE)
      .select("id, reviewer_name, rating, comment, created_at")
      .order("created_at", { ascending: false })
      .limit(6);

    if (error) {
      return { data: null, error: error.message };
    }

    return { data: (data as LandingPageReview[]) ?? [], error: null };
  } catch (err: any) {
    return { data: null, error: err?.message ?? "Failed to load reviews." };
  }
}

export async function createLandingPageReview(input: {
  reviewer_name?: string;
  rating: number;
  comment: string;
}): Promise<{
  data: LandingPageReview | null;
  error: string | null;
}> {
  try {
    const payload = {
      reviewer_name: input.reviewer_name?.trim() || "Anonymous",
      rating: input.rating,
      comment: input.comment.trim(),
    };

    const { data, error } = await supabase
      .from(REVIEWS_TABLE)
      .insert(payload)
      .select("id, reviewer_name, rating, comment, created_at")
      .single();

    if (error) {
      return { data: null, error: error.message };
    }

    return { data: data as LandingPageReview, error: null };
  } catch (err: any) {
    return { data: null, error: err?.message ?? "Failed to save review." };
  }
}