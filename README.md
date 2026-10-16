# Wedding RSVP Website

A responsive, single-page wedding invitation built with HTML, CSS, and vanilla JavaScript.

## Files
- `index.html` — page structure and editable sample content
- `css/style.css` — responsive styling and Burgundy / Olive Green / Warm Ivory design
- `js/script.js` — countdown, mobile navigation, gallery lightbox, reveal effects, and RSVP validation
- `assets/images/` — place local photos here if you prefer local assets

## Run locally
Open `index.html` in a browser. For best results, use a local static server (for example, VS Code Live Server).

## Customize
Replace sample names, dates, venue details, entourage members, FAQs, and image URLs in `index.html`. Update the wedding countdown date, guest limit, and RSVP endpoint in `js/script.js`.

## RSVP demo mode
The form intentionally defaults to demo mode. It validates fields but does not save or transmit guest data, and clearly says so. To collect real responses, set `demoMode: false` and configure `rsvpEndpoint` with a secure, working backend endpoint that accepts JSON POST requests. Do not put private API keys in front-end code. Test your endpoint separately before publishing.
