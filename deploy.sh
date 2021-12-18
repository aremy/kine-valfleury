#!/bin/sh
mkdir -p tmp

bundle exec jekyll clean
bundle exec jekyll build

aws s3 cp _site/index.html s3://kine-valfleury.fr --region eu-west-2
aws s3 cp _site/manifest.json s3://kine-valfleury.fr --region eu-west-2
aws s3 cp _site/en/index.html s3://kine-valfleury.fr/en/ --region eu-west-2
aws s3 cp _site/fonts s3://kine-valfleury.fr/fonts --region eu-west-2 --recursive --cache-control="max-age=31536000"
aws s3 cp _site/node_modules s3://kine-valfleury.fr/node_modules --region eu-west-2 --recursive --cache-control="max-age=31536000"

aws s3 cp _site/feed.xml s3://kine-valfleury.fr --region eu-west-2
aws s3 cp _site/sitemaps.xml s3://kine-valfleury.fr --region eu-west-2
aws s3 cp _site/en/manifest-en.json s3://kine-valfleury.fr/en/ --region eu-west-2
aws s3 cp _site/manifest-fr.json s3://kine-valfleury.fr --region eu-west-2


function gzip_and_upload {
    gzip -c --force -k --best  _site/$3/$1 > tmp/$1
    aws s3 cp tmp/$1 s3://kine-valfleury.fr/$3/ --region eu-west-2 --content-type=$2 --cache-control="max-age=31536000" --content-encoding="gzip"
}

jsList=( custom.js )
for js in "${jsList[@]}"
do
    gzip_and_upload $js "text/javascript" "assets/js"
done

gzip_and_upload "bootstrap.min.js" "text/javascript" "node_modules/bootstrap/dist/js"

cssList=( main.css font-awesome.min.css )
for css in "${cssList[@]}"
do
    gzip_and_upload $css "text/css" "assets"
done

pngList=( en.png fr.png favicon.png caducee-48.png caducee-72.png caducee-96.png caducee-144.png caducee-168.png caducee-192.png)
for img in "${pngList[@]}"
do
    gzip_and_upload $img "image/png" "img"
done

webpList=( bg-banner.webp waitingroom.webp salle1.webp salle2.webp salle3.webp caducee-masseurkine.webp caducee-masseurkine-profile.webp )
for img in "${webpList[@]}"
do
    gzip_and_upload $img "image/webp" "img"
done

rm -rf tmp
