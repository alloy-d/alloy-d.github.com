source sassrules.do.sh

SASS="../_sass/$1.scss"
redo-ifchange $SASS
sass_compile $SASS $3
