@echo off
set linuxPath=%2
set word=\
call set windowPath=%%linuxPath:/=%word%%%

if exist %windowPath% (
  rmdir /S /Q %windowPath%
)