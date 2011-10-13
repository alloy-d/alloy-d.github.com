lessfile() { echo "../_less/$1.less"; }
redo-ifchange $(lessfile home)
redo-ifchange $(lessfile basic)

lessc $(lessfile home) $3

