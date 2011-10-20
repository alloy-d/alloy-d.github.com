sass_file() {
  echo "../_sass/$1.scss";
}

sass_compile() {
  sass --style expanded --scss $1 $2
}
