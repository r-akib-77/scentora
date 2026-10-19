"use client";

import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, ArrowRight, RotateCcw, Sparkles } from "lucide-react";
import { useMemo, useState } from "react";

import { ProductSizeSelector } from "@/components/product/product-size-selector";
import { Rating } from "@/components/ui/rating";
import { SmartImage } from "@/components/ui/smart-image";
import { quizQuestions } from "@/data/guide";
import { products } from "@/data/products";
import { recommendProducts, summariseAnswers } from "@/lib/finder";
import { cn, familyLabels, formatPrice } from "@/lib/utils";
import { productFromPrice } from "@/lib/filters";
import { useCart } from "@/providers/cart-provider";
import { useToast } from "@/providers/toast-provider";
import type { BottleSize, QuizAnswers } from "@/types";

type Step = "quiz" | "results";

/**
 * The personalised fragrance finder.
 *
 * Five questions, a progress indicator, local scoring and explained results.
 * No network calls and no AI — the ranking is a transparent weighted model.
 */
export function FragranceFinder({ compact = false }: { compact?: boolean }) {
  const [step, setStep] = useState<Step>("quiz");
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswers>({
    occasion: null,
    season: null,
    scent: null,
    budget: null,
    style: null,
  });
  const reduceMotion = useReducedMotion();

  const question = quizQuestions[questionIndex];
  const currentValue = answers[question.id];
  const isLast = questionIndex === quizQuestions.length - 1;
  const progress = ((questionIndex + (currentValue ? 1 : 0)) / quizQuestions.length) * 100;

  const results = useMemo(
    () => (step === "results" ? recommendProducts(products, answers, 6) : []),
    [step, answers],
  );

  const select = (value: string) => {
    setAnswers((current) => ({ ...current, [question.id]: value }) as QuizAnswers);
  };

  const next = () => {
    if (!currentValue) return;
    if (isLast) {
      setStep("results");
      return;
    }
    setQuestionIndex((index) => index + 1);
  };

  const back = () => {
    if (step === "results") {
      setStep("quiz");
      setQuestionIndex(quizQuestions.length - 1);
      return;
    }
    setQuestionIndex((index) => Math.max(0, index - 1));
  };

  const restart = () => {
    setAnswers({
      occasion: null,
      season: null,
      scent: null,
      budget: null,
      style: null,
    });
    setQuestionIndex(0);
    setStep("quiz");
  };

  const slideDirection = questionIndex >= 0 ? 1 : -1;

  return (
    <div
      className={cn(
        "border border-[var(--sc-line)] bg-[var(--sc-ivory)]",
        compact ? "" : "p-5 sm:p-8 lg:p-10",
      )}
    >
      {step === "quiz" ? (
        <>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="eyebrow">
              Step {questionIndex + 1} of {quizQuestions.length}
            </p>
            <p className="text-[11px] uppercase tracking-[0.14em] text-[var(--sc-muted)]">
              {summariseAnswers(answers) || "Five quick questions"}
            </p>
          </div>

          <div
            className="mt-3 h-[2px] w-full bg-[var(--sc-line)]"
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(progress)}
            aria-label="Fragrance finder progress"
          >
            <motion.div
              className="h-full bg-[var(--sc-gold)]"
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            />
          </div>

          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={question.id}
              initial={reduceMotion ? { opacity: 0 } : { opacity: 0, x: 28 * slideDirection }}
              animate={{ opacity: 1, x: 0 }}
              exit={reduceMotion ? { opacity: 0 } : { opacity: 0, x: -28 * slideDirection }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="mt-7"
            >
              <h3 className="font-serif text-[24px] leading-snug text-[var(--sc-charcoal)] sm:text-[28px]">
                {question.title}
              </h3>
              <p className="mt-1.5 text-[13px] text-[var(--sc-muted)]">{question.helper}</p>

              <div
                role="radiogroup"
                aria-label={question.title}
                className="mt-6 grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3"
              >
                {question.options.map((option) => {
                  const selected = currentValue === option.value;
                  return (
                    <button
                      key={option.value}
                      type="button"
                      role="radio"
                      aria-checked={selected}
                      onClick={() => select(option.value)}
                      className={cn(
                        "group flex flex-col items-start gap-1 border p-4 text-left transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--sc-gold)]",
                        selected
                          ? "border-[var(--sc-charcoal)] bg-[var(--sc-charcoal)] text-[var(--sc-ivory)]"
                          : "border-[var(--sc-line)] bg-[var(--sc-ivory)] text-[var(--sc-charcoal)] hover:border-[var(--sc-gold)]",
                      )}
                    >
                      <span className="font-serif text-[17px] leading-tight">{option.label}</span>
                      <span
                        className={cn(
                          "text-[12px] leading-relaxed",
                          selected ? "text-white/65" : "text-[var(--sc-muted)]",
                        )}
                      >
                        {option.hint}
                      </span>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="mt-8 flex items-center justify-between gap-3 border-t border-[var(--sc-line)] pt-5">
            <button
              type="button"
              onClick={back}
              disabled={questionIndex === 0}
              className="btn-ghost disabled:pointer-events-none disabled:opacity-35"
            >
              <ArrowLeft className="size-3.5" aria-hidden="true" />
              Back
            </button>

            <button
              type="button"
              onClick={next}
              disabled={!currentValue}
              className="btn-primary disabled:opacity-40"
            >
              {isLast ? "See my matches" : "Next"}
              <ArrowRight className="size-3.5" aria-hidden="true" />
            </button>
          </div>
        </>
      ) : (
        <div>
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="eyebrow">Your matches</p>
              <h3 className="mt-2 font-serif text-[26px] leading-snug text-[var(--sc-charcoal)] sm:text-[30px]">
                Six fragrances picked for you
              </h3>
              <p className="mt-1.5 text-[13px] text-[var(--sc-muted)]">
                Matched on {summariseAnswers(answers)}.
              </p>
            </div>
            <button type="button" onClick={restart} className="btn-outline">
              <RotateCcw className="size-3.5" aria-hidden="true" />
              Start over
            </button>
          </div>

          <ul className="mt-8 space-y-4">
            {results.map((result, index) => (
              <RecommendationRow
                key={result.product.id}
                rank={index + 1}
                product={result.product}
                score={result.score}
                reasons={result.reasons}
              />
            ))}
          </ul>

          <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-[var(--sc-line)] pt-5">
            <button type="button" onClick={back} className="btn-ghost">
              <ArrowLeft className="size-3.5" aria-hidden="true" />
              Change my answers
            </button>
            <Link href="/shop" className="btn-outline">
              Browse everything
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

/** One recommendation row with its own size selector and add-to-bag action. */
function RecommendationRow({
  rank,
  product,
  score,
  reasons,
}: {
  rank: number;
  product: (typeof products)[number];
  score: number;
  reasons: string[];
}) {
  const [size, setSize] = useState<BottleSize>(product.variants[0]?.size ?? 5);
  const { addItem, openCart } = useCart();
  const { pushToast } = useToast();

  const price =
    product.variants.find((variant) => variant.size === size)?.price ??
    productFromPrice(product);

  const handleAdd = () => {
    addItem(product, size, 1);
    pushToast({
      title: "Added to your bag",
      description: `${product.brand} ${product.name} · ${size} ml`,
      variant: "success",
    });
    openCart();
  };

  return (
    <li className="grid gap-4 border border-[var(--sc-line)] p-4 sm:grid-cols-[auto_1fr] sm:p-5">
      <div className="relative aspect-square w-full shrink-0 overflow-hidden bg-[var(--sc-paper)] sm:size-32">
        <SmartImage
          src={product.image}
          alt={`${product.brand} ${product.name}`}
          fill
          sizes="128px"
          className="object-cover"
        />
        <span className="absolute left-0 top-0 flex size-7 items-center justify-center bg-[var(--sc-charcoal)] text-[11px] text-[var(--sc-ivory)]">
          {rank}
        </span>
      </div>

      <div className="min-w-0">
        <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-1">
          <div className="min-w-0">
            <p className="text-[10px] uppercase tracking-[0.18em] text-[var(--sc-muted)]">
              {product.brand}
            </p>
            <h4 className="mt-0.5 font-serif text-[20px] leading-tight text-[var(--sc-charcoal)]">
              <Link
                href={`/product/${product.slug}`}
                className="transition-colors hover:text-[var(--sc-gold)]"
              >
                {product.name}
              </Link>
            </h4>
          </div>
          <div className="text-right">
            <p className="text-[10px] uppercase tracking-[0.14em] text-[var(--sc-muted)]">
              {score}% match
            </p>
            <p className="price font-serif text-[19px] leading-tight text-[var(--sc-charcoal)]">
              {formatPrice(price)}
            </p>
          </div>
        </div>

        <p className="mt-1 text-[12px] text-[var(--sc-muted)]">
          {familyLabels[product.family]} · {product.gender === "unisex" ? "Unisex" : product.gender}
        </p>

        <ul className="mt-2.5 flex flex-wrap gap-1.5">
          {reasons.map((reason) => (
            <li
              key={reason}
              className="inline-flex items-center gap-1.5 border border-[var(--sc-line)] px-2.5 py-1 text-[11px] text-[var(--sc-muted)]"
            >
              <Sparkles className="size-3 text-[var(--sc-gold)]" aria-hidden="true" />
              {reason}
            </li>
          ))}
        </ul>

        <div className="mt-3.5">
          <Rating value={product.rating} count={product.reviewCount} />
        </div>

        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <ProductSizeSelector product={product} value={size} onChange={setSize} compact />
          <div className="flex gap-2">
            <button type="button" onClick={handleAdd} className="btn-primary flex-1 sm:flex-none">
              Add to Bag
            </button>
            <Link href={`/product/${product.slug}`} className="btn-outline flex-1 sm:flex-none">
              Details
            </Link>
          </div>
        </div>
      </div>
    </li>
  );
}
