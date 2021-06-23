#git remote rm -rf origin

echo "Enter Folder to Keep"
while read f
do
	if [ "$f" == "done" ]
	then
		break;
	fi
	git filter-branch --subdirectory-filter $f -- --all
done
git reset --hard
git gc --aggressive
git prune
git clean -fd
