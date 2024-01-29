del *.txt
del *.ppm

node ./Pipeline-func/test.js   >> pipelineFunc.txt
node ./Pipeline-loop/test.js   >> pipelineLoop.txt
node ./Pipeline-struc/test.js  >> pipelineStruc.txt 
node ./Pipeline-static-v1/test.js >> pipelineStaticV1.txt
node ./Pipeline-static-v2/test.js >> pipelineStaticV2.txt