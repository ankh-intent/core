
case ${1:-minor} in
  major)
    diff="1.-x.!"
    ;;

  minor)
    diff="0.1.!"
    ;;

  patch)
    diff="0.0.1"
    ;;

  *)
    diff=$1
esac

diff=(${diff//./ })
tag=$2

if [[ -z $tag ]]; then
  tag=$(git tag)
  lines=(${tag//\n/ })
  tag=${lines[@]:1}
fi

portions=(${tag//./ })
base=()
result=()

for idx in ${!portions[@]}; do
  base[$idx]=$idx
done

for idx in ${!diff[@]}; do
  base[$idx]=$idx
done

for idx in ${base[@]}; do
  a=${diff[$idx]:-0}

  if [[ $a == '!' ]]; then
    break
  fi

  tag=${portions[$idx]:-0}
  rest=(${tag//-/ })
  x=${rest[0]}
  r=${rest[@]:1}

  p=$(($a))
  u=$(($x + $p))
  [[ -z $r ]]; u=( "$u ${r[@]}" )

  s=${u[@]}
  s=${s// /-}
  result+=($s)
done

result=${result[@]}

bumped="${result// /.}$3"

if $(git tag $bumped); then
  git commit --allow-empty -m "Bump version to $bumped"
fi
