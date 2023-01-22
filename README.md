Simple website for a physiotherapy practice.

Used as a playground for:
* building a one page layout using [bootstrap](http://getbootstrap.com/getting-started/#examples)
* scripted [Amazon S3](https://aws.amazon.com/fr/s3/) deployment
* using Jekyll to:
    * reduce maintenance on multilingual aspects (see also [here](https://www.sylvaindurand.org/making-jekyll-multilingual/))
    * ["compress"](https://github.com/penibelst/jekyll-compress-html) (minify) the html
    * explore some other features Jekyll features along the way (constraint, no)

* checking how to achieve [pagespeed](https://developers.google.com/speed/pagespeed/insights/?url=kine-valfleury.fr) optimizations and [google search console](https://www.google.com/webmasters/tools/home?hl=en) recommendations with the above, for mobile & pc usage

## Prerequisites
* Install [Ruby](https://www.ruby-lang.org/en/documentation/installation/)
* Install [Jekyll](https://jekyllrb.com/docs/quickstart/)
* Clone the repository
* [for the S3 deployment] install [Aws cli](http://docs.aws.amazon.com/cli/latest/userguide/installing.html) and [configure it](http://docs.aws.amazon.com/cli/latest/userguide/cli-chap-getting-started.html) with your AWS key

* Install bootsrap4

** install [Yarn](https://yarnpkg.com/lang/en/docs/install/#windows-stable)
** `yarn add bootstrap@next`

For the generic approach, see ([how to use bootstrap4 with jekyll from scratch](https://simpleit.rocks/how-to-add-bootstrap-4-to-jekyll-the-right-way/))


## Generate
From the repository:
* Run `bundle exec jekyll build` to generate `_site` folder containing the files to deploy (the website itself)

## Deploy
* Run deploy.sh to:
    * gzip the resources (js, css)
    * upload to target Amazon S3 bucket with appropriate http headers with which they will be served (cache-control, content-enconding, content-type)


## Misc
* `bundle exec jekyll clean` to clean the site
* `bundle exec jekyll serve --incremental` to test locally (http://localshot:4000)
* `bundle update` to update all dependencies


