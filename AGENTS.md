<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Keep the decorative landing backdrop in a separate aria-hidden component with CSS-only animation and a visibility listener that pauses hidden tabs; glass panels and the SVG node grid share one fixed-aspect stage so nodes stay on panel corners, and phones drop the costly motion.
- Scope liquid-glass role tokens and surfaces to the landing page in the global stylesheet; preserve shared theme tokens for other screens.
- AI recommendations use a same-origin validated public streaming route and server-only Gateway helpers; NDJSON keeps answers live and explicit Stop propagates upstream without automatic retries.
- The AI advisor quota is enforced server-side per SHA-256-hashed client IP through a service-role-only database function with an advisory lock; it fails closed so a broken counter never allows unlimited paid AI calls.
- Upstream AI Gateway error text is logged server-side and mapped by status to fixed visitor phrases; never forward it to the browser.
