# laigsinghakkasadvocaten.nl



### in order to build

Install jekyll: https://jekyllrb.com/docs/installation/

Install octopress-minify-html gem  
`gem install octopress-minify-html`;

Run `jekyll build` to build the site files.  
Run `jekyll serve` to spin up a development server and watch files.

### Force a push to gh-pages from master
git push origin `git subtree split --prefix _site master`:gh-pages --force
