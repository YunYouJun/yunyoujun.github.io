info=$1?$1:"backup"
git add -A
git commit -m "$info"
git push github hexo
git push coding hexo