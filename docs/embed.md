You can embed the URL using an iframe in your website.

Optionally append `?readonly` to make the editor read-only.

Use `show` with `widths` to control which panes are visible and how much
horizontal space each pane gets:

```html
<iframe src="https://codepan.net/?readonly&show=js,console,output&widths=25,25,50"></iframe>
```

The `widths` value is a comma-separated list that matches the visible pane
order: HTML, CSS, JS, Console, Output. Values are relative, so `1,1,2` and
`25,25,50` produce the same layout.

For order-independent embeds, use named pane widths:

```html
<iframe src="https://codepan.net/?readonly&show=js,console,output&widths=js:25,console:25,output:50"></iframe>
```

If `widths` is missing, invalid, or does not cover every visible pane, CodePan
keeps the default equal-width layout.
