/**
 * A reference-counted scroll lock.
 *
 * Several overlays (cart drawer, mobile nav, search, checkout) can be open at
 * the same time, so a simple boolean would release the lock too early.
 */
let lockCount = 0;
let previousOverflow = "";

export function lockScroll(): () => void {
  if (lockCount === 0) {
    previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
  }
  lockCount += 1;

  let released = false;
  return () => {
    if (released) return;
    released = true;
    lockCount = Math.max(0, lockCount - 1);
    if (lockCount === 0) {
      document.body.style.overflow = previousOverflow;
    }
  };
}
