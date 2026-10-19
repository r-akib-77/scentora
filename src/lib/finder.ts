import type { Product, QuizAnswers, Recommendation } from "@/types";
import { familyLabels, occasionLabels, seasonLabels, tierLabels } from "@/lib/utils";
import { productFromPrice } from "./filters";

/**
 * ---------------------------------------------------------------------------
 *  LOCAL RECOMMENDATION ENGINE
 * ---------------------------------------------------------------------------
 *  A deterministic, explainable scoring model. No network calls, no AI API —
 *  every product is scored against the five quiz answers using the structured
 *  tags already present in the catalogue.
 *
 *  Score weights:
 *    occasion  28   season   18   family   30
 *    budget    12   style    12
 */

const WEIGHTS = {
  occasion: 28,
  season: 18,
  family: 30,
  budget: 12,
  style: 12,
} as const;

const MAX_SCORE = Object.values(WEIGHTS).reduce((sum, value) => sum + value, 0);

/** Season compatibility — a winter pick still works in autumn, etc. */
const SEASON_AFFINITY: Record<string, string[]> = {
  summer: ["all-season", "spring", "summer"],
  spring: ["all-season", "spring", "summer", "rainy"],
  autumn: ["all-season", "autumn", "winter", "spring"],
  winter: ["all-season", "winter", "autumn"],
  rainy: ["all-season", "rainy", "spring", "winter"],
};

/** How a fragrance's projection maps onto the requested intensity. */
function styleMatch(projection: number, style: "subtle" | "balanced" | "bold"): number {
  if (style === "subtle") {
    if (projection <= 2) return 1;
    if (projection === 3) return 0.7;
    if (projection === 4) return 0.35;
    return 0.1;
  }
  if (style === "balanced") {
    if (projection === 3) return 1;
    if (projection === 4) return 0.85;
    if (projection === 2) return 0.7;
    return 0.45;
  }
  // bold
  if (projection >= 5) return 1;
  if (projection === 4) return 0.8;
  if (projection === 3) return 0.45;
  return 0.15;
}

/** Does the product's price sit inside the requested budget bracket? */
function budgetMatch(
  product: Product,
  budget: "affordable" | "mid-range" | "premium",
): number {
  const price = productFromPrice(product);
  if (budget === "affordable") return price <= 1000 ? 1 : price <= 1500 ? 0.5 : 0.1;
  if (budget === "mid-range") {
    if (price > 1000 && price <= 2000) return 1;
    if (price <= 1000) return 0.6;
    return price <= 2800 ? 0.5 : 0.2;
  }
  // premium
  if (price > 2000) return 1;
  if (price > 1200) return 0.45;
  return 0.15;
}

/** Score a single product against the quiz answers. */
export function scoreProduct(product: Product, answers: QuizAnswers): Recommendation {
  const reasons: string[] = [];
  let score = 0;

  if (answers.occasion) {
    if (product.occasions.includes(answers.occasion)) {
      score += WEIGHTS.occasion;
      reasons.push(`Built for ${occasionLabels[answers.occasion].toLowerCase()}`);
    } else {
      score += WEIGHTS.occasion * 0.15;
    }
  }

  if (answers.season) {
    const affinities = SEASON_AFFINITY[answers.season] ?? [];
    if (product.seasons.includes(answers.season)) {
      score += WEIGHTS.season;
      reasons.push(`A ${seasonLabels[answers.season].toLowerCase()} performer`);
    } else if (product.seasons.some((season) => affinities.includes(season))) {
      score += WEIGHTS.season * 0.65;
      reasons.push(`Also suits ${seasonLabels[answers.season].toLowerCase()}`);
    } else {
      score += WEIGHTS.season * 0.2;
    }
  }

  if (answers.scent) {
    if (product.family === answers.scent) {
      score += WEIGHTS.family;
      reasons.push(`Sits in the ${familyLabels[answers.scent]} family you chose`);
    } else if (product.tags.includes(answers.scent)) {
      score += WEIGHTS.family * 0.7;
      reasons.push(`Shares notes with the ${familyLabels[answers.scent]} family`);
    } else {
      score += WEIGHTS.family * 0.15;
    }
  }

  if (answers.budget) {
    const match = budgetMatch(product, answers.budget);
    score += WEIGHTS.budget * match;
    if (match >= 1) reasons.push(`Within the ${tierLabels[answers.budget].toLowerCase()} budget`);
  }

  if (answers.style) {
    const match = styleMatch(product.projection, answers.style);
    score += WEIGHTS.style * match;
    if (match >= 0.8) {
      reasons.push(
        answers.style === "subtle"
          ? "Sits close to the skin, as you prefer"
          : answers.style === "bold"
            ? "Makes a confident entrance"
            : "Sits right in the middle of the scale",
      );
    }
  }

  // A small bonus for well-rated demo products so ties break sensibly.
  score += (product.rating - 4) * 6;

  const normalised = Math.round((score / MAX_SCORE) * 100);
  return {
    product,
    score: Math.max(0, Math.min(100, normalised)),
    reasons: reasons.slice(0, 3),
  };
}

/** Rank the whole catalogue against the quiz answers. */
export function recommendProducts(
  catalogue: Product[],
  answers: QuizAnswers,
  limit = 6,
): Recommendation[] {
  return catalogue
    .map((product) => scoreProduct(product, answers))
    .sort((a, b) => b.score - a.score || b.product.popularity - a.product.popularity)
    .slice(0, limit);
}

/** A short human summary of the quiz result. */
export function summariseAnswers(answers: QuizAnswers): string {
  const parts: string[] = [];
  if (answers.occasion) parts.push(occasionLabels[answers.occasion].toLowerCase());
  if (answers.season) parts.push(`${seasonLabels[answers.season].toLowerCase()} wear`);
  if (answers.scent) parts.push(`${familyLabels[answers.scent].toLowerCase()} notes`);
  if (answers.budget) parts.push(`${tierLabels[answers.budget].toLowerCase()} budget`);
  if (answers.style) parts.push(`${answers.style} projection`);
  return parts.join(" · ");
}
