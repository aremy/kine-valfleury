Simple website for a physiotherapy practice.

Used as a playground for:
* build a one page layout using [bootstrap](http://getbootstrap.com/getting-started/#examples)
* scripted S3 deployment
* using Jekyll to:
    * reduce maintenance on multilingual aspects (see also [here](https://www.sylvaindurand.org/making-jekyll-multilingual/))
    * ["compress"](https://github.com/penibelst/jekyll-compress-html) (minify) the html
    * explore some other features Jekyll features along the way (constraint, no)

* checking how to achieve [pagespeed](https://developers.google.com/speed/pagespeed/) optimizations and [google search console](https://www.google.com/webmasters/tools/home?hl=en) recommendations with the above, for mobile & pc usage

## Prerequisites
* Install [Ruby](https://www.ruby-lang.org/en/documentation/installation/)
* Install [Jekyll](https://jekyllrb.com/docs/quickstart/)
* Clone the repository
* [for the S3 deployment] install [Aws cli](http://docs.aws.amazon.com/cli/latest/userguide/installing.html) and [configure it](http://docs.aws.amazon.com/cli/latest/userguide/cli-chap-getting-started.html) with your AWS key

## Generate
From the repository:
* Run `jekyll build` to generate _site - all static files

## Deploy
* Run deploy.sh to:
    * gzip the resources
    * upload to Amazon S3 with appropriate headers



