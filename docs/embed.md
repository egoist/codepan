You can embed the URL using an iframe in your website.

Optionally append `?readonly` to make the editor read-only.

## Choose visible panels and widths

Use `show` to choose panels and `widths` to set their relative widths:

```html
<iframe src="https://codepan.net/?readonly&show=js,console,output&widths=40,15,45"></iframe>
```

The panels always render left to right as `html`, `css`, `js`, `console`,
`output`, with hidden panels skipped. Widths are matched to that rendered order,
even if `show` lists the names in a different order. The example allocates 40%
to JavaScript, 15% to the console and 45% to the output.

Values are positive finite numbers separated by commas. They are relative
weights: `2,1,7` is equivalent to `20,10,70`. There must be exactly one value for
each visible panel. Omitted, repeated or malformed `widths` parameters, zero or
negative values and mismatched counts fall back to equal widths. If a panel is
toggled and the count no longer matches, the layout also falls back to equal
widths. Changing or removing the query parameter updates the layout immediately.
Manual dragging of panel dividers continues to work until the visible panels or
width query changes.

The standalone layout checks run with `npm run test:layout` (Node.js 14.8+).
