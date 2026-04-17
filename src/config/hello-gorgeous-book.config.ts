/**
 * Hello Gorgeous — THE BOOK (24 chapters, merged PDF).
 * Single patient-facing digital product on the public site; checkout via Square.
 *
 * After `npm run book:pdf`, copy the output into delivery:
 *   cp "$HOME/Desktop/chapters/output/HelloGorgeous-THE-BOOK.pdf" \
 *      delivery-assets/deliverables/HelloGorgeous-THE-BOOK.pdf
 */

export const HELLO_GORGEOUS_BOOK_SLUG = "hello-gorgeous-the-book" as const;

export const HELLO_GORGEOUS_BOOK_TITLE = "Hello Gorgeous — THE BOOK";

/** Square + shop price (USD cents). */
export const HELLO_GORGEOUS_BOOK_PRICE_CENTS = 4700;

/**
 * Gated file under delivery-assets/ — served only via /api/delivery/pdf?token=…
 * (not publicly listed; do not put the full book in public/).
 */
export const HELLO_GORGEOUS_BOOK_DELIVERABLE_REL = "deliverables/HelloGorgeous-THE-BOOK.pdf" as const;
