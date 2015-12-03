#!/bin/bash

cat ~/Downloads/vertices*.obj > ~/Desktop/thing.obj
cat ~/Downloads/faces*.obj >> ~/Desktop/thing.obj

rm ~/Downloads/vertices*.obj
rm ~/Downloads/faces*.obj