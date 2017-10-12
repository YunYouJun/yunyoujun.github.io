hexo clean
hexo g && gulp
hexo deploy
git add .
git commit -m 'update hexo backup'
git push origin hexo