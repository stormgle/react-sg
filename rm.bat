@echo off
set linuxPath=%2
set word=\
call set windowPath=%%linuxPath:/=%word%%%
rmdir /S /Q %windowPath%