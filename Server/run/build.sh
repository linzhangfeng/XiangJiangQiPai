cd ../proto
protoc --cpp_out=./ *.proto
cd ../run/
cd  ../build/
cmake ..
make
cd ../run/
./copy.sh
./restart.sh




