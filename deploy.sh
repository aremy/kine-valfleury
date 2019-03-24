#!/bin/sh
mkdir -p tmp

bundle exec jekyll clean
bundle exec jekyll build

aws s3 cp _site/index.html s3://kine-valfleury.fr --region eu-west-2
aws s3 cp _site/manifest.json s3://kine-valfleury.fr --region eu-west-2
aws s3 cp _site/en/index.html s3://kine-valfleury.fr/en/ --region eu-west-2
aws s3 cp _site/fonts s3://kine-valfleury.fr/fonts --region eu-west-2 --recursive
aws s3 cp _site/node_modules s3://kine-valfleury.fr/node_modules --region eu-west-2 --recursive

aws s3 cp _site/feed.xml s3://kine-valfleury.fr --region eu-west-2
aws s3 cp _site/sitemaps.xml s3://kine-valfleury.fr --region eu-west-2


function gzip_and_upload {
    gzip -c --force -k --best  _site/$3/$1 > tmp/$1
    aws s3 cp tmp/$1 s3://kine-valfleury.fr/$3/ --region eu-west-2 --content-type=$2 --cache-control="max-age=604800" --content-encoding="gzip"
}

jsList=( custom.js )
for js in "${jsList[@]}"
do
    gzip_and_upload $js "text/javascript" "assets/js"
done

gzip_and_upload "jquery.min.js" "text/javascript" "node_modules/jquery/dist/"
gzip_and_upload "popper.min.js" "text/javascript" "node_modules/popper.js/dist/umd"
gzip_and_upload "bootstrap.min.js" "text/javascript" "node_modules/bootstrap/dist/js"

cssList=( main.css font-awesome.min.css )
for css in "${cssList[@]}"
do
    gzip_and_upload $css "text/css" "assets"
done

pngList=( caducee-transparent.png en.png fr.png favicon.png )
for img in "${pngList[@]}"
do
    gzip_and_upload $img "image/png" "img"
done

jpgList=( bg-banner.jpg waitingroom.jpg salle1.jpg salle2.jpg salle3.jpg )
for img in "${jpgList[@]}"
do
    gzip_and_upload $img "image/jpg" "img"
done

rm -rf tmp
