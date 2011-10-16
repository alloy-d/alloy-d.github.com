source lessrules.do.sh
redo-ifchange $(lessfile story)
redo-ifchange $(lessfile basic)

lessc $(lessfile story) $3

