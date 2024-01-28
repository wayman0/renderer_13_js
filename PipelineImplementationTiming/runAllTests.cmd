del *.txt
del *.ppm

node ./Pipeline-func/test.js   >> pipelineFunc.txt
node ./Pipeline-loop/test.js   >> pipelineLoop.txt
node ./Pipeline-struc/test.js  >> pipelineStruc.txt 
node ./Pipeline-static/test.js >> pipelineStatic.txt