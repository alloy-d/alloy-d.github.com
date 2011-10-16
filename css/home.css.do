source lessrules.do.sh
redo-ifchange $(lessfile home)
redo-ifchange $(lessfile basic)

lessc $(lessfile home) $3

