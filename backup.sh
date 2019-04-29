info=$1
if ["$info" = "" ];
then $info = "Update Blog"
git add -A
git commit -m "$info"
git push github hexo
git push coding hexo