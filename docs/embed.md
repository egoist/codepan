You can embed the URL using an iframe in your website.

Optionally append `?readonly` to make the editor read-only.

You can set the initial panel widths for embeds with query parameters. Widths are
percentages and are normalized across the visible panels:

```html
<iframe src="https://codepan.net/?readonly&show=js,console,output&panWidths=js:35,console:15,output:50"></iframe>
```

You can also use individual parameters:

```html
<iframe src="https://codepan.net/?jsWidth=40&consoleWidth=15&outputWidth=45"></iframe>
```
