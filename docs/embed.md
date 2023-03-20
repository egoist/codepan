You can embed the URL using an iframe in your website.

Optionally append `?readonly` to make the editor read-only.

You can specify which tabs are to be active at start, and their width. Tab names are `html`, `css`, `js`, `console`, and `output`. Once specifying a tab to be active, none of defaults tabs will be active. You may specify a tab to be just active with average/standard width by passing `1` or specify custom width with any larger number which be parsed as percentage of window width to take.

For example:
`<iframe src='/?html=30&js=1&console=10&output=30&css=1' width=100% height=500 frameborder='0'></iframe>`
