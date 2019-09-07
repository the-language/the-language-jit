#!/bin/sh

up(){
  yarn
  node -e 'dep=JSON.parse(fs.readFileSync("package.json","utf8")).dependencies;if(dep){console.log(Object.keys(dep).reduce((x,y)=>`${x} ${y}`))}' | xargs -r yarn add
  node -e 'dep=JSON.parse(fs.readFileSync("package.json","utf8")).devDependencies;if(dep){console.log(Object.keys(dep).reduce((x,y)=>`${x} ${y}`))}' | xargs -r yarn add --dev
  touch node_modules/
}
for d in */; do
  cd "$d"
  if [ -f package.json ]; then
    up &
  fi
  cd ..
done

wait
