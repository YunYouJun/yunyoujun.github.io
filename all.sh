info=$1?$1:"update"
npm run deploy
./backup.sh "$info"
