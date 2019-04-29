info=$1
if ["$info" = ""];
then info="Update Blog"
fi
git add -A
git commit -m "$info"
git push origin hexo
git push coding hexo