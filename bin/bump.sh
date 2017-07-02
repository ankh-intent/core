
case ${1:-minor} in
  major)
    diff="1.-x.-x.!"
    ;;

  minor)
    diff="0.1.-x.!"
    ;;

  patch)
    diff="0.0.1"
    ;;

  *)
    diff=$1
esac

diff=(${diff//./ })
tag=$2

if [[ -z $tag || $tag == '--probe' ]]; then
  tag=$(git tag)
  lines=(${tag//\n/ })
  IFS=$'\n' sorted=($(sort -r <<<"${tag[*]}"))
  unset IFS
  tag=${sorted[@]::1}
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

if [[ $2 == '--probe' ]]; then
  echo $bumped

  exit
fi

git stash
npm version ${bumped} -m "Bump version to $bumped"
git stash pop
