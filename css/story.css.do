source sassrules.do.sh
redo-ifchange $(sass_file story)
redo-ifchange $(sass_file basic)

sass_compile $(sass_file story) $3

