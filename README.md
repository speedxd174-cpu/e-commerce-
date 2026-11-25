# WF Galaxy Ladies Wear

A responsive, static clothing storefront with product browsing, category filters, size selection, a persistent shopping bag, and WhatsApp order handoff. No build step or package installation is required.

## Open the storefront

Open `index.html` in a browser. Product and style photos load from Unsplash; a network connection is needed to display those images and the optional web fonts.

## Prepare it for real sales

The initial product names, descriptions, sizes, photos, and prices in `app.js` are sample entries because the shop's inventory was not supplied. Replace them with confirmed catalog details before accepting orders. The storefront labels those entries as samples and prompts customers to confirm the final price and stock in WhatsApp.

The WhatsApp number is configured at the top of `app.js` as `WHATSAPP_NUMBER`. It is currently set to Nepal's country calling code plus the number supplied: `9779767740629`. Update that constant and the direct WhatsApp links in `index.html` together if the shop's contact changes.

Orders are sent as a prefilled WhatsApp message. This starter storefront does not process online card payments or calculate shipping, taxes, or returns.

