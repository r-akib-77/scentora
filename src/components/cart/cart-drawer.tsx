"use client";

import Link from "next/link";
import { ArrowRight, ShieldCheck, ShoppingBag, Truck } from "lucide-react";
import { useState } from "react";

import { CartItem } from "@/components/cart/cart-item";
import { Drawer } from "@/components/ui/drawer";
import { siteConfig } from "@/config/site";
import { cn, formatPrice } from "@/lib/utils";
import { useCart } from "@/providers/cart-provider";
import { useToast } from "@/providers/toast-provider";

/**
 * The shopping bag drawer.
 */
export function CartDrawer() {
  const {
    lines,
    itemCount,
    subtotal,
    isCartOpen,
    closeCart,
    clearCart,
    hydrated,
  } = useCart();
  const { pushToast } = useToast();
  const [showCheckout, setShowCheckout] = useState(false);

  const remainingForFreeDelivery = Math.max(
    0,
    siteConfig.delivery.freeDeliveryThreshold - subtotal,
  );
  const progress = Math.min(
    100,
    (subtotal / siteConfig.delivery.freeDeliveryThreshold) * 100,
  );

  return (
    <>
      <Drawer
        open={isCartOpen}
        onClose={closeCart}
        title="Your Bag"
        description={
          hydrated
            ? itemCount === 0
              ? "Your bag is currently empty"
              : `${itemCount} item${itemCount === 1 ? "" : "s"} · demo bag stored in this browser`
            : "Loading your bag…"
        }
        footer={
          lines.length > 0 ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-[13px] text-[var(--sc-muted)]">
                <span>Subtotal</span>
                <span className="price font-serif text-[18px] text-[var(--sc-charcoal)]">
                  {formatPrice(subtotal)}
                </span>
              </div>
              <p className="text-[11px] leading-relaxed text-[var(--sc-muted)]">
                Delivery is calculated at checkout. Cash on delivery is available nationwide.
              </p>
              <button
                type="button"
                onClick={() => setShowCheckout(true)}
                className="btn-primary w-full"
              >
                Proceed to demo checkout
                <ArrowRight className="size-3.5" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={closeCart}
                className="btn-ghost w-full py-1"
              >
                Continue shopping
              </button>
            </div>
          ) : null
        }
      >
        {lines.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center px-6 py-16 text-center">
            <span className="flex size-16 items-center justify-center rounded-full border border-[var(--sc-line)] text-[var(--sc-muted)]">
              <ShoppingBag className="size-6" aria-hidden="true" />
            </span>
            <h3 className="mt-5 font-serif text-[22px] text-[var(--sc-charcoal)]">
              Your bag is empty
            </h3>
            <p className="mt-2 max-w-xs text-[13px] leading-relaxed text-[var(--sc-muted)]">
              Start with a 3 ml trial and find the fragrance that stays with you all day.
            </p>
            <Link href="/shop" onClick={closeCart} className="btn-primary mt-6">
              Explore the collection
            </Link>
          </div>
        ) : (
          <div className="px-5 sm:px-6">
            <div className="border-b border-[var(--sc-line)] py-4">
              <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.14em] text-[var(--sc-muted)]">
                <span className="flex items-center gap-1.5">
                  <Truck className="size-3.5" aria-hidden="true" />
                  {remainingForFreeDelivery > 0
                    ? `${formatPrice(remainingForFreeDelivery)} to free delivery`
                    : "Free delivery unlocked"}
                </span>
              </div>
              <div className="mt-2 h-[3px] w-full bg-[var(--sc-line)]">
                <div
                  className="h-full bg-[var(--sc-gold)] transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            <ul className="divide-y divide-[var(--sc-line)]">
              {lines.map((line) => (
                <CartItem key={line.key} line={line} />
              ))}
            </ul>

            <button
              type="button"
              onClick={() => {
                clearCart();
                pushToast({
                  title: "Bag cleared",
                  description: "All items have been removed from your demo bag.",
                  variant: "info",
                });
              }}
              className="btn-ghost mt-4 mb-6 py-1"
            >
              Empty bag
            </button>
          </div>
        )}
      </Drawer>

      <DemoCheckout
        open={showCheckout}
        onClose={() => setShowCheckout(false)}
        subtotal={subtotal}
        itemCount={itemCount}
      />
    </>
  );
}

/**
 * A clearly-labelled demo checkout.
 *
 * IMPORTANT: this interface does not create an order, contact a payment
 * provider or collect any real payment details. It exists to demonstrate the
 * final step of the storefront flow.
 */
function DemoCheckout({
  open,
  onClose,
  subtotal,
  itemCount,
}: {
  open: boolean;
  onClose: () => void;
  subtotal: number;
  itemCount: number;
}) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [payment, setPayment] = useState("cod");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [done, setDone] = useState(false);
  const { pushToast } = useToast();

  const validate = () => {
    const next: Record<string, string> = {};
    if (name.trim().length < 2) next.name = "Please enter your name";
    if (!/^[\d+\-\s]{10,}$/.test(phone.trim())) next.phone = "Enter a valid phone number";
    if (address.trim().length < 8) next.address = "Enter a delivery address";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!validate()) return;
    setDone(true);
    pushToast({
      title: "Demo order captured",
      description: "No payment was taken and no order was created.",
      variant: "info",
    });
  };

  const close = () => {
    onClose();
    window.setTimeout(() => {
      setDone(false);
      setErrors({});
    }, 300);
  };

  return (
    <Drawer
      open={open}
      onClose={close}
      title="Demo checkout"
      description="Demonstration only — no order is created and no payment is taken."
      footer={
        done ? (
          <button type="button" onClick={close} className="btn-primary w-full">
            Return to the store
          </button>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-[13px] text-[var(--sc-muted)]">
              <span>
                {itemCount} item{itemCount === 1 ? "" : "s"} · Demo total
              </span>
              <span className="price font-serif text-[18px] text-[var(--sc-charcoal)]">
                {formatPrice(subtotal)}
              </span>
            </div>
            <p className="text-[11px] leading-relaxed text-[var(--sc-muted)]">
              Delivery fee shown at confirmation: {formatPrice(siteConfig.delivery.deliveryFee)}
            </p>
          </div>
        )
      }
    >
      <div className="px-5 py-5 sm:px-6">
        <div className="flex items-start gap-2.5 border border-[var(--sc-gold)]/40 bg-[var(--sc-paper)] p-3.5">
          <ShieldCheck className="mt-0.5 size-4 shrink-0 text-[var(--sc-gold)]" aria-hidden="true" />
          <p className="text-[12px] leading-relaxed text-[var(--sc-muted)]">
            This is a <strong className="font-medium text-[var(--sc-charcoal)]">demo checkout</strong>.
            The form validates in your browser only — nothing is transmitted, no order is placed and
            no payment details are collected.
          </p>
        </div>

        {done ? (
          <div className="mt-6 border border-dashed border-[var(--sc-line)] px-5 py-10 text-center">
            <p className="font-serif text-[22px] text-[var(--sc-charcoal)]">Demo order ready</p>
            <p className="mx-auto mt-2 max-w-sm text-[13px] leading-relaxed text-[var(--sc-muted)]">
              In a live store this step would create an order for {name || "the customer"} and hand
              it to the courier. Here it simply demonstrates the flow.
            </p>
            <dl className="mx-auto mt-5 max-w-xs space-y-1.5 text-left text-[12px] text-[var(--sc-muted)]">
              <div className="flex justify-between gap-4">
                <dt>Payment method</dt>
                <dd className="text-[var(--sc-charcoal)]">
                  {payment === "cod" ? "Cash on delivery" : "Mobile wallet (demo)"}
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt>Demo total</dt>
                <dd className="text-[var(--sc-charcoal)]">{formatPrice(subtotal)}</dd>
              </div>
            </dl>
          </div>
        ) : (
          <form onSubmit={submit} noValidate className="mt-6 space-y-4">
            <div>
              <label className="field-label" htmlFor="checkout-name">
                Full name
              </label>
              <input
                id="checkout-name"
                className={cn("field", errors.name && "border-red-400")}
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="e.g. Nusrat Jahan"
                autoComplete="name"
              />
              {errors.name ? (
                <p className="mt-1 text-[11px] text-red-500">{errors.name}</p>
              ) : null}
            </div>

            <div>
              <label className="field-label" htmlFor="checkout-phone">
                Phone number
              </label>
              <input
                id="checkout-phone"
                className={cn("field", errors.phone && "border-red-400")}
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                placeholder="+880 1XXX-XXXXXX"
                inputMode="tel"
                autoComplete="tel"
              />
              {errors.phone ? (
                <p className="mt-1 text-[11px] text-red-500">{errors.phone}</p>
              ) : null}
            </div>

            <div>
              <label className="field-label" htmlFor="checkout-address">
                Delivery address
              </label>
              <textarea
                id="checkout-address"
                rows={3}
                className={cn("field resize-none", errors.address && "border-red-400")}
                value={address}
                onChange={(event) => setAddress(event.target.value)}
                placeholder="House, road, area, district"
              />
              {errors.address ? (
                <p className="mt-1 text-[11px] text-red-500">{errors.address}</p>
              ) : null}
            </div>

            <fieldset>
              <legend className="field-label">Payment method (demo)</legend>
              <div className="flex flex-col gap-2">
                {[
                  { value: "cod", label: "Cash on delivery" },
                  { value: "wallet", label: "bKash / Nagad (demo)" },
                ].map((option) => (
                  <label
                    key={option.value}
                    className={cn(
                      "flex cursor-pointer items-center gap-3 border px-3.5 py-2.5 text-[13px] transition-colors",
                      payment === option.value
                        ? "border-[var(--sc-charcoal)] bg-[var(--sc-paper)] text-[var(--sc-charcoal)]"
                        : "border-[var(--sc-line)] text-[var(--sc-muted)] hover:border-[var(--sc-gold)]",
                    )}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value={option.value}
                      checked={payment === option.value}
                      onChange={() => setPayment(option.value)}
                      className="accent-[var(--sc-gold)]"
                    />
                    {option.label}
                  </label>
                ))}
              </div>
            </fieldset>

            <button type="submit" className="btn-primary w-full">
              Place demo order
            </button>
            <p className="text-center text-[11px] leading-relaxed text-[var(--sc-muted)]">
              This button does not contact any payment provider or create a real order.
            </p>
          </form>
        )}
      </div>
    </Drawer>
  );
}
