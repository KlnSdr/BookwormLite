cd .. || exit
rm -rf out
mkdir out

cd src || exit

echo "building / ======================"
cd home || exit
ed pack

perl -i -pe 'next if /src="https/; next if /src="{{/; s/src="/src="{{CONTEXT}}\//g' index.html
perl -i -pe 'next if /src="https/; next if /src="{{/; s/src="/src="{{CONTEXT}}\//g' docs/index.html

perl -i -pe 'next if /href="https/; next if /href="{{/; s/href="/href="{{CONTEXT}}\//g' index.html
perl -i -pe 'next if /href="https/; next if /href="{{/; s/href="/href="{{CONTEXT}}\//g' docs/index.html

cp -r docs/* ../../out
rm -rf docs

echo "building /students ======================"
cd ../students || exit
ed pack

perl -i -pe 'next if /src="https/; next if /src="{{/; s/src="/src="{{CONTEXT}}\/students\//g' index.html
perl -i -pe 'next if /src="https/; next if /src="{{/; s/src="/src="{{CONTEXT}}\/students\//g' docs/index.html

perl -i -pe 'next if /href="https/; next if /href="{{/; s/href="/href="{{CONTEXT}}\/students\//g' index.html
perl -i -pe 'next if /href="https/; next if /href="{{/; s/href="/href="{{CONTEXT}}\/students\//g' docs/index.html

mkdir ../../out/students
cp -r docs/* ../../out/students
rm -rf docs

echo "building /books ======================"
cd ../books || exit
ed pack

perl -i -pe 'next if /src="https/; next if /src="{{/; s/src="/src="{{CONTEXT}}\/books\//g' index.html
perl -i -pe 'next if /src="https/; next if /src="{{/; s/src="/src="{{CONTEXT}}\/books\//g' docs/index.html

perl -i -pe 'next if /href="https/; next if /href="{{/; s/href="/href="{{CONTEXT}}\/books\//g' index.html
perl -i -pe 'next if /href="https/; next if /href="{{/; s/href="/href="{{CONTEXT}}\/books\//g' docs/index.html

mkdir ../../out/books
cp -r docs/* ../../out/books
rm -rf docs

echo "building /evaluation ======================"
cd ../evaluation || exit
ed pack

perl -i -pe 'next if /src="https/; next if /src="{{/; s/src="/src="{{CONTEXT}}\/evaluation\//g' index.html
perl -i -pe 'next if /src="https/; next if /src="{{/; s/src="/src="{{CONTEXT}}\/evaluation\//g' docs/index.html

perl -i -pe 'next if /href="https/; next if /href="{{/; s/href="/href="{{CONTEXT}}\/evaluation\//g' index.html
perl -i -pe 'next if /href="https/; next if /href="{{/; s/href="/href="{{CONTEXT}}\/evaluation\//g' docs/index.html

mkdir ../../out/evaluation
cp -r docs/* ../../out/evaluation
rm -rf docs

echo "building /info ======================"
cd ../info || exit
ed pack

perl -i -pe 'next if /src="https/; next if /src="{{/; s/src="/src="{{CONTEXT}}\/info\//g' index.html
perl -i -pe 'next if /src="https/; next if /src="{{/; s/src="/src="{{CONTEXT}}\/info\//g' docs/index.html

perl -i -pe 'next if /href="https/; next if /href="{{/; s/href="/href="{{CONTEXT}}\/info\//g' index.html
perl -i -pe 'next if /href="https/; next if /href="{{/; s/href="/href="{{CONTEXT}}\/info\//g' docs/index.html

mkdir ../../out/info
cp -r docs/* ../../out/info
rm -rf docs

echo "building /settings ======================"
cd ../settings || exit
ed pack

perl -i -pe 'next if /src="https/; next if /src="{{/; s/src="/src="{{CONTEXT}}\/settings\//g' index.html
perl -i -pe 'next if /src="https/; next if /src="{{/; s/src="/src="{{CONTEXT}}\/settings\//g' docs/index.html

perl -i -pe 'next if /href="https/; next if /href="{{/; s/href="/href="{{CONTEXT}}\/settings\//g' index.html
perl -i -pe 'next if /href="https/; next if /href="{{/; s/href="/href="{{CONTEXT}}\/settings\//g' docs/index.html

mkdir ../../out/settings
cp -r docs/* ../../out/settings
rm -rf docs

echo "building /logout ======================"
cd ../logout || exit
ed pack

perl -i -pe 'next if /src="https/; next if /src="{{/; s/src="/src="{{CONTEXT}}\/logout\//g' index.html
perl -i -pe 'next if /src="https/; next if /src="{{/; s/src="/src="{{CONTEXT}}\/logout\//g' docs/index.html

perl -i -pe 'next if /href="https/; next if /href="{{/; s/href="/href="{{CONTEXT}}\/logout\//g' index.html
perl -i -pe 'next if /href="https/; next if /href="{{/; s/href="/href="{{CONTEXT}}\/logout\//g' docs/index.html

mkdir ../../out/logout
cp -r docs/* ../../out/logout
rm -rf docs

echo "building /hades/login ======================"
cd ../login || exit
ed pack

perl -i -pe 'next if /src="https/; next if /src="{{/; s/src="/src="{{CONTEXT}}\/hades\/login\//g' index.html
perl -i -pe 'next if /src="https/; next if /src="{{/; s/src="/src="{{CONTEXT}}\/hades\/login\//g' docs/index.html

perl -i -pe 'next if /href="https/; next if /href="{{/; s/href="/href="{{CONTEXT}}\/hades\/login\//g' index.html
perl -i -pe 'next if /href="https/; next if /href="{{/; s/href="/href="{{CONTEXT}}\/hades\/login\//g' docs/index.html

mkdir ../../out/hades
mkdir ../../out/hades/login
cp -r docs/* ../../out/hades/login
rm -rf docs

echo "building /hades/signup ======================"
cd ../signup || exit
ed pack

perl -i -pe 'next if /src="https/; next if /src="{{/; s/src="/src="{{CONTEXT}}\/hades\/signup\//g' index.html
perl -i -pe 'next if /src="https/; next if /src="{{/; s/src="/src="{{CONTEXT}}\/hades\/signup\//g' docs/index.html

perl -i -pe 'next if /href="https/; next if /href="{{/; s/href="/href="{{CONTEXT}}\/hades\/signup\//g' index.html
perl -i -pe 'next if /href="https/; next if /href="{{/; s/href="/href="{{CONTEXT}}\/hades\/signup\//g' docs/index.html

mkdir ../../out/hades/signup
cp -r docs/* ../../out/hades/signup
rm -rf docs

echo "building /hades overrides ======================"
cd ../hades || exit
cp -r * ../../out/hades
echo "done!"

echo "building /user ======================"
cd ../user || exit
mkdir ../../out/user
cp -r * ../../out/user
echo "done!"
