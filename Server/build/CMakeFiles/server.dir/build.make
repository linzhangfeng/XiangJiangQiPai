# CMAKE generated file: DO NOT EDIT!
# Generated by "Unix Makefiles" Generator, CMake Version 3.17

# Delete rule output on recipe failure.
.DELETE_ON_ERROR:


#=============================================================================
# Special targets provided by cmake.

# Disable implicit rules so canonical targets will work.
.SUFFIXES:


# Disable VCS-based implicit rules.
% : %,v


# Disable VCS-based implicit rules.
% : RCS/%


# Disable VCS-based implicit rules.
% : RCS/%,v


# Disable VCS-based implicit rules.
% : SCCS/s.%


# Disable VCS-based implicit rules.
% : s.%


.SUFFIXES: .hpux_make_needs_suffix_list


# Command-line flag to silence nested $(MAKE).
$(VERBOSE)MAKESILENT = -s

# Suppress display of executed commands.
$(VERBOSE).SILENT:


# A target that is always out of date.
cmake_force:

.PHONY : cmake_force

#=============================================================================
# Set environment variables for the build.

# The shell in which to execute make rules.
SHELL = /bin/sh

# The CMake executable.
CMAKE_COMMAND = /usr/bin/cmake.exe

# The command to remove a file.
RM = /usr/bin/cmake.exe -E rm -f

# Escaping for special characters.
EQUALS = =

# The top-level source directory on which CMake was run.
CMAKE_SOURCE_DIR = /cygdrive/d/linzhangfeng/MyGithub/boosttest

# The top-level build directory on which CMake was run.
CMAKE_BINARY_DIR = /cygdrive/d/linzhangfeng/MyGithub/boosttest/build

# Include any dependencies generated for this target.
include CMakeFiles/server.dir/depend.make

# Include the progress variables for this target.
include CMakeFiles/server.dir/progress.make

# Include the compile flags for this target's objects.
include CMakeFiles/server.dir/flags.make

CMakeFiles/server.dir/main.cpp.o: CMakeFiles/server.dir/flags.make
CMakeFiles/server.dir/main.cpp.o: ../main.cpp
	@$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --green --progress-dir=/cygdrive/d/linzhangfeng/MyGithub/boosttest/build/CMakeFiles --progress-num=$(CMAKE_PROGRESS_1) "Building CXX object CMakeFiles/server.dir/main.cpp.o"
	/usr/bin/c++.exe  $(CXX_DEFINES) $(CXX_INCLUDES) $(CXX_FLAGS) -o CMakeFiles/server.dir/main.cpp.o -c /cygdrive/d/linzhangfeng/MyGithub/boosttest/main.cpp

CMakeFiles/server.dir/main.cpp.i: cmake_force
	@$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --green "Preprocessing CXX source to CMakeFiles/server.dir/main.cpp.i"
	/usr/bin/c++.exe $(CXX_DEFINES) $(CXX_INCLUDES) $(CXX_FLAGS) -E /cygdrive/d/linzhangfeng/MyGithub/boosttest/main.cpp > CMakeFiles/server.dir/main.cpp.i

CMakeFiles/server.dir/main.cpp.s: cmake_force
	@$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --green "Compiling CXX source to assembly CMakeFiles/server.dir/main.cpp.s"
	/usr/bin/c++.exe $(CXX_DEFINES) $(CXX_INCLUDES) $(CXX_FLAGS) -S /cygdrive/d/linzhangfeng/MyGithub/boosttest/main.cpp -o CMakeFiles/server.dir/main.cpp.s

CMakeFiles/server.dir/common/config.cpp.o: CMakeFiles/server.dir/flags.make
CMakeFiles/server.dir/common/config.cpp.o: ../common/config.cpp
	@$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --green --progress-dir=/cygdrive/d/linzhangfeng/MyGithub/boosttest/build/CMakeFiles --progress-num=$(CMAKE_PROGRESS_2) "Building CXX object CMakeFiles/server.dir/common/config.cpp.o"
	/usr/bin/c++.exe  $(CXX_DEFINES) $(CXX_INCLUDES) $(CXX_FLAGS) -o CMakeFiles/server.dir/common/config.cpp.o -c /cygdrive/d/linzhangfeng/MyGithub/boosttest/common/config.cpp

CMakeFiles/server.dir/common/config.cpp.i: cmake_force
	@$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --green "Preprocessing CXX source to CMakeFiles/server.dir/common/config.cpp.i"
	/usr/bin/c++.exe $(CXX_DEFINES) $(CXX_INCLUDES) $(CXX_FLAGS) -E /cygdrive/d/linzhangfeng/MyGithub/boosttest/common/config.cpp > CMakeFiles/server.dir/common/config.cpp.i

CMakeFiles/server.dir/common/config.cpp.s: cmake_force
	@$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --green "Compiling CXX source to assembly CMakeFiles/server.dir/common/config.cpp.s"
	/usr/bin/c++.exe $(CXX_DEFINES) $(CXX_INCLUDES) $(CXX_FLAGS) -S /cygdrive/d/linzhangfeng/MyGithub/boosttest/common/config.cpp -o CMakeFiles/server.dir/common/config.cpp.s

CMakeFiles/server.dir/common/common.cpp.o: CMakeFiles/server.dir/flags.make
CMakeFiles/server.dir/common/common.cpp.o: ../common/common.cpp
	@$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --green --progress-dir=/cygdrive/d/linzhangfeng/MyGithub/boosttest/build/CMakeFiles --progress-num=$(CMAKE_PROGRESS_3) "Building CXX object CMakeFiles/server.dir/common/common.cpp.o"
	/usr/bin/c++.exe  $(CXX_DEFINES) $(CXX_INCLUDES) $(CXX_FLAGS) -o CMakeFiles/server.dir/common/common.cpp.o -c /cygdrive/d/linzhangfeng/MyGithub/boosttest/common/common.cpp

CMakeFiles/server.dir/common/common.cpp.i: cmake_force
	@$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --green "Preprocessing CXX source to CMakeFiles/server.dir/common/common.cpp.i"
	/usr/bin/c++.exe $(CXX_DEFINES) $(CXX_INCLUDES) $(CXX_FLAGS) -E /cygdrive/d/linzhangfeng/MyGithub/boosttest/common/common.cpp > CMakeFiles/server.dir/common/common.cpp.i

CMakeFiles/server.dir/common/common.cpp.s: cmake_force
	@$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --green "Compiling CXX source to assembly CMakeFiles/server.dir/common/common.cpp.s"
	/usr/bin/c++.exe $(CXX_DEFINES) $(CXX_INCLUDES) $(CXX_FLAGS) -S /cygdrive/d/linzhangfeng/MyGithub/boosttest/common/common.cpp -o CMakeFiles/server.dir/common/common.cpp.s

CMakeFiles/server.dir/common/log.cc.o: CMakeFiles/server.dir/flags.make
CMakeFiles/server.dir/common/log.cc.o: ../common/log.cc
	@$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --green --progress-dir=/cygdrive/d/linzhangfeng/MyGithub/boosttest/build/CMakeFiles --progress-num=$(CMAKE_PROGRESS_4) "Building CXX object CMakeFiles/server.dir/common/log.cc.o"
	/usr/bin/c++.exe  $(CXX_DEFINES) $(CXX_INCLUDES) $(CXX_FLAGS) -o CMakeFiles/server.dir/common/log.cc.o -c /cygdrive/d/linzhangfeng/MyGithub/boosttest/common/log.cc

CMakeFiles/server.dir/common/log.cc.i: cmake_force
	@$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --green "Preprocessing CXX source to CMakeFiles/server.dir/common/log.cc.i"
	/usr/bin/c++.exe $(CXX_DEFINES) $(CXX_INCLUDES) $(CXX_FLAGS) -E /cygdrive/d/linzhangfeng/MyGithub/boosttest/common/log.cc > CMakeFiles/server.dir/common/log.cc.i

CMakeFiles/server.dir/common/log.cc.s: cmake_force
	@$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --green "Compiling CXX source to assembly CMakeFiles/server.dir/common/log.cc.s"
	/usr/bin/c++.exe $(CXX_DEFINES) $(CXX_INCLUDES) $(CXX_FLAGS) -S /cygdrive/d/linzhangfeng/MyGithub/boosttest/common/log.cc -o CMakeFiles/server.dir/common/log.cc.s

CMakeFiles/server.dir/common/protobuf2json.cpp.o: CMakeFiles/server.dir/flags.make
CMakeFiles/server.dir/common/protobuf2json.cpp.o: ../common/protobuf2json.cpp
	@$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --green --progress-dir=/cygdrive/d/linzhangfeng/MyGithub/boosttest/build/CMakeFiles --progress-num=$(CMAKE_PROGRESS_5) "Building CXX object CMakeFiles/server.dir/common/protobuf2json.cpp.o"
	/usr/bin/c++.exe  $(CXX_DEFINES) $(CXX_INCLUDES) $(CXX_FLAGS) -o CMakeFiles/server.dir/common/protobuf2json.cpp.o -c /cygdrive/d/linzhangfeng/MyGithub/boosttest/common/protobuf2json.cpp

CMakeFiles/server.dir/common/protobuf2json.cpp.i: cmake_force
	@$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --green "Preprocessing CXX source to CMakeFiles/server.dir/common/protobuf2json.cpp.i"
	/usr/bin/c++.exe $(CXX_DEFINES) $(CXX_INCLUDES) $(CXX_FLAGS) -E /cygdrive/d/linzhangfeng/MyGithub/boosttest/common/protobuf2json.cpp > CMakeFiles/server.dir/common/protobuf2json.cpp.i

CMakeFiles/server.dir/common/protobuf2json.cpp.s: cmake_force
	@$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --green "Compiling CXX source to assembly CMakeFiles/server.dir/common/protobuf2json.cpp.s"
	/usr/bin/c++.exe $(CXX_DEFINES) $(CXX_INCLUDES) $(CXX_FLAGS) -S /cygdrive/d/linzhangfeng/MyGithub/boosttest/common/protobuf2json.cpp -o CMakeFiles/server.dir/common/protobuf2json.cpp.s

CMakeFiles/server.dir/common/sql_time.cpp.o: CMakeFiles/server.dir/flags.make
CMakeFiles/server.dir/common/sql_time.cpp.o: ../common/sql_time.cpp
	@$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --green --progress-dir=/cygdrive/d/linzhangfeng/MyGithub/boosttest/build/CMakeFiles --progress-num=$(CMAKE_PROGRESS_6) "Building CXX object CMakeFiles/server.dir/common/sql_time.cpp.o"
	/usr/bin/c++.exe  $(CXX_DEFINES) $(CXX_INCLUDES) $(CXX_FLAGS) -o CMakeFiles/server.dir/common/sql_time.cpp.o -c /cygdrive/d/linzhangfeng/MyGithub/boosttest/common/sql_time.cpp

CMakeFiles/server.dir/common/sql_time.cpp.i: cmake_force
	@$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --green "Preprocessing CXX source to CMakeFiles/server.dir/common/sql_time.cpp.i"
	/usr/bin/c++.exe $(CXX_DEFINES) $(CXX_INCLUDES) $(CXX_FLAGS) -E /cygdrive/d/linzhangfeng/MyGithub/boosttest/common/sql_time.cpp > CMakeFiles/server.dir/common/sql_time.cpp.i

CMakeFiles/server.dir/common/sql_time.cpp.s: cmake_force
	@$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --green "Compiling CXX source to assembly CMakeFiles/server.dir/common/sql_time.cpp.s"
	/usr/bin/c++.exe $(CXX_DEFINES) $(CXX_INCLUDES) $(CXX_FLAGS) -S /cygdrive/d/linzhangfeng/MyGithub/boosttest/common/sql_time.cpp -o CMakeFiles/server.dir/common/sql_time.cpp.s

CMakeFiles/server.dir/network/chttp.cpp.o: CMakeFiles/server.dir/flags.make
CMakeFiles/server.dir/network/chttp.cpp.o: ../network/chttp.cpp
	@$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --green --progress-dir=/cygdrive/d/linzhangfeng/MyGithub/boosttest/build/CMakeFiles --progress-num=$(CMAKE_PROGRESS_7) "Building CXX object CMakeFiles/server.dir/network/chttp.cpp.o"
	/usr/bin/c++.exe  $(CXX_DEFINES) $(CXX_INCLUDES) $(CXX_FLAGS) -o CMakeFiles/server.dir/network/chttp.cpp.o -c /cygdrive/d/linzhangfeng/MyGithub/boosttest/network/chttp.cpp

CMakeFiles/server.dir/network/chttp.cpp.i: cmake_force
	@$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --green "Preprocessing CXX source to CMakeFiles/server.dir/network/chttp.cpp.i"
	/usr/bin/c++.exe $(CXX_DEFINES) $(CXX_INCLUDES) $(CXX_FLAGS) -E /cygdrive/d/linzhangfeng/MyGithub/boosttest/network/chttp.cpp > CMakeFiles/server.dir/network/chttp.cpp.i

CMakeFiles/server.dir/network/chttp.cpp.s: cmake_force
	@$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --green "Compiling CXX source to assembly CMakeFiles/server.dir/network/chttp.cpp.s"
	/usr/bin/c++.exe $(CXX_DEFINES) $(CXX_INCLUDES) $(CXX_FLAGS) -S /cygdrive/d/linzhangfeng/MyGithub/boosttest/network/chttp.cpp -o CMakeFiles/server.dir/network/chttp.cpp.s

CMakeFiles/server.dir/network/ws_client.cpp.o: CMakeFiles/server.dir/flags.make
CMakeFiles/server.dir/network/ws_client.cpp.o: ../network/ws_client.cpp
	@$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --green --progress-dir=/cygdrive/d/linzhangfeng/MyGithub/boosttest/build/CMakeFiles --progress-num=$(CMAKE_PROGRESS_8) "Building CXX object CMakeFiles/server.dir/network/ws_client.cpp.o"
	/usr/bin/c++.exe  $(CXX_DEFINES) $(CXX_INCLUDES) $(CXX_FLAGS) -o CMakeFiles/server.dir/network/ws_client.cpp.o -c /cygdrive/d/linzhangfeng/MyGithub/boosttest/network/ws_client.cpp

CMakeFiles/server.dir/network/ws_client.cpp.i: cmake_force
	@$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --green "Preprocessing CXX source to CMakeFiles/server.dir/network/ws_client.cpp.i"
	/usr/bin/c++.exe $(CXX_DEFINES) $(CXX_INCLUDES) $(CXX_FLAGS) -E /cygdrive/d/linzhangfeng/MyGithub/boosttest/network/ws_client.cpp > CMakeFiles/server.dir/network/ws_client.cpp.i

CMakeFiles/server.dir/network/ws_client.cpp.s: cmake_force
	@$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --green "Compiling CXX source to assembly CMakeFiles/server.dir/network/ws_client.cpp.s"
	/usr/bin/c++.exe $(CXX_DEFINES) $(CXX_INCLUDES) $(CXX_FLAGS) -S /cygdrive/d/linzhangfeng/MyGithub/boosttest/network/ws_client.cpp -o CMakeFiles/server.dir/network/ws_client.cpp.s

CMakeFiles/server.dir/network/ws_server.cpp.o: CMakeFiles/server.dir/flags.make
CMakeFiles/server.dir/network/ws_server.cpp.o: ../network/ws_server.cpp
	@$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --green --progress-dir=/cygdrive/d/linzhangfeng/MyGithub/boosttest/build/CMakeFiles --progress-num=$(CMAKE_PROGRESS_9) "Building CXX object CMakeFiles/server.dir/network/ws_server.cpp.o"
	/usr/bin/c++.exe  $(CXX_DEFINES) $(CXX_INCLUDES) $(CXX_FLAGS) -o CMakeFiles/server.dir/network/ws_server.cpp.o -c /cygdrive/d/linzhangfeng/MyGithub/boosttest/network/ws_server.cpp

CMakeFiles/server.dir/network/ws_server.cpp.i: cmake_force
	@$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --green "Preprocessing CXX source to CMakeFiles/server.dir/network/ws_server.cpp.i"
	/usr/bin/c++.exe $(CXX_DEFINES) $(CXX_INCLUDES) $(CXX_FLAGS) -E /cygdrive/d/linzhangfeng/MyGithub/boosttest/network/ws_server.cpp > CMakeFiles/server.dir/network/ws_server.cpp.i

CMakeFiles/server.dir/network/ws_server.cpp.s: cmake_force
	@$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --green "Compiling CXX source to assembly CMakeFiles/server.dir/network/ws_server.cpp.s"
	/usr/bin/c++.exe $(CXX_DEFINES) $(CXX_INCLUDES) $(CXX_FLAGS) -S /cygdrive/d/linzhangfeng/MyGithub/boosttest/network/ws_server.cpp -o CMakeFiles/server.dir/network/ws_server.cpp.s

CMakeFiles/server.dir/proto/login.pb.cc.o: CMakeFiles/server.dir/flags.make
CMakeFiles/server.dir/proto/login.pb.cc.o: ../proto/login.pb.cc
	@$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --green --progress-dir=/cygdrive/d/linzhangfeng/MyGithub/boosttest/build/CMakeFiles --progress-num=$(CMAKE_PROGRESS_10) "Building CXX object CMakeFiles/server.dir/proto/login.pb.cc.o"
	/usr/bin/c++.exe  $(CXX_DEFINES) $(CXX_INCLUDES) $(CXX_FLAGS) -o CMakeFiles/server.dir/proto/login.pb.cc.o -c /cygdrive/d/linzhangfeng/MyGithub/boosttest/proto/login.pb.cc

CMakeFiles/server.dir/proto/login.pb.cc.i: cmake_force
	@$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --green "Preprocessing CXX source to CMakeFiles/server.dir/proto/login.pb.cc.i"
	/usr/bin/c++.exe $(CXX_DEFINES) $(CXX_INCLUDES) $(CXX_FLAGS) -E /cygdrive/d/linzhangfeng/MyGithub/boosttest/proto/login.pb.cc > CMakeFiles/server.dir/proto/login.pb.cc.i

CMakeFiles/server.dir/proto/login.pb.cc.s: cmake_force
	@$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --green "Compiling CXX source to assembly CMakeFiles/server.dir/proto/login.pb.cc.s"
	/usr/bin/c++.exe $(CXX_DEFINES) $(CXX_INCLUDES) $(CXX_FLAGS) -S /cygdrive/d/linzhangfeng/MyGithub/boosttest/proto/login.pb.cc -o CMakeFiles/server.dir/proto/login.pb.cc.s

CMakeFiles/server.dir/proto/player.pb.cc.o: CMakeFiles/server.dir/flags.make
CMakeFiles/server.dir/proto/player.pb.cc.o: ../proto/player.pb.cc
	@$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --green --progress-dir=/cygdrive/d/linzhangfeng/MyGithub/boosttest/build/CMakeFiles --progress-num=$(CMAKE_PROGRESS_11) "Building CXX object CMakeFiles/server.dir/proto/player.pb.cc.o"
	/usr/bin/c++.exe  $(CXX_DEFINES) $(CXX_INCLUDES) $(CXX_FLAGS) -o CMakeFiles/server.dir/proto/player.pb.cc.o -c /cygdrive/d/linzhangfeng/MyGithub/boosttest/proto/player.pb.cc

CMakeFiles/server.dir/proto/player.pb.cc.i: cmake_force
	@$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --green "Preprocessing CXX source to CMakeFiles/server.dir/proto/player.pb.cc.i"
	/usr/bin/c++.exe $(CXX_DEFINES) $(CXX_INCLUDES) $(CXX_FLAGS) -E /cygdrive/d/linzhangfeng/MyGithub/boosttest/proto/player.pb.cc > CMakeFiles/server.dir/proto/player.pb.cc.i

CMakeFiles/server.dir/proto/player.pb.cc.s: cmake_force
	@$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --green "Compiling CXX source to assembly CMakeFiles/server.dir/proto/player.pb.cc.s"
	/usr/bin/c++.exe $(CXX_DEFINES) $(CXX_INCLUDES) $(CXX_FLAGS) -S /cygdrive/d/linzhangfeng/MyGithub/boosttest/proto/player.pb.cc -o CMakeFiles/server.dir/proto/player.pb.cc.s

CMakeFiles/server.dir/game/game.cpp.o: CMakeFiles/server.dir/flags.make
CMakeFiles/server.dir/game/game.cpp.o: ../game/game.cpp
	@$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --green --progress-dir=/cygdrive/d/linzhangfeng/MyGithub/boosttest/build/CMakeFiles --progress-num=$(CMAKE_PROGRESS_12) "Building CXX object CMakeFiles/server.dir/game/game.cpp.o"
	/usr/bin/c++.exe  $(CXX_DEFINES) $(CXX_INCLUDES) $(CXX_FLAGS) -o CMakeFiles/server.dir/game/game.cpp.o -c /cygdrive/d/linzhangfeng/MyGithub/boosttest/game/game.cpp

CMakeFiles/server.dir/game/game.cpp.i: cmake_force
	@$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --green "Preprocessing CXX source to CMakeFiles/server.dir/game/game.cpp.i"
	/usr/bin/c++.exe $(CXX_DEFINES) $(CXX_INCLUDES) $(CXX_FLAGS) -E /cygdrive/d/linzhangfeng/MyGithub/boosttest/game/game.cpp > CMakeFiles/server.dir/game/game.cpp.i

CMakeFiles/server.dir/game/game.cpp.s: cmake_force
	@$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --green "Compiling CXX source to assembly CMakeFiles/server.dir/game/game.cpp.s"
	/usr/bin/c++.exe $(CXX_DEFINES) $(CXX_INCLUDES) $(CXX_FLAGS) -S /cygdrive/d/linzhangfeng/MyGithub/boosttest/game/game.cpp -o CMakeFiles/server.dir/game/game.cpp.s

CMakeFiles/server.dir/game/player.cpp.o: CMakeFiles/server.dir/flags.make
CMakeFiles/server.dir/game/player.cpp.o: ../game/player.cpp
	@$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --green --progress-dir=/cygdrive/d/linzhangfeng/MyGithub/boosttest/build/CMakeFiles --progress-num=$(CMAKE_PROGRESS_13) "Building CXX object CMakeFiles/server.dir/game/player.cpp.o"
	/usr/bin/c++.exe  $(CXX_DEFINES) $(CXX_INCLUDES) $(CXX_FLAGS) -o CMakeFiles/server.dir/game/player.cpp.o -c /cygdrive/d/linzhangfeng/MyGithub/boosttest/game/player.cpp

CMakeFiles/server.dir/game/player.cpp.i: cmake_force
	@$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --green "Preprocessing CXX source to CMakeFiles/server.dir/game/player.cpp.i"
	/usr/bin/c++.exe $(CXX_DEFINES) $(CXX_INCLUDES) $(CXX_FLAGS) -E /cygdrive/d/linzhangfeng/MyGithub/boosttest/game/player.cpp > CMakeFiles/server.dir/game/player.cpp.i

CMakeFiles/server.dir/game/player.cpp.s: cmake_force
	@$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --green "Compiling CXX source to assembly CMakeFiles/server.dir/game/player.cpp.s"
	/usr/bin/c++.exe $(CXX_DEFINES) $(CXX_INCLUDES) $(CXX_FLAGS) -S /cygdrive/d/linzhangfeng/MyGithub/boosttest/game/player.cpp -o CMakeFiles/server.dir/game/player.cpp.s

CMakeFiles/server.dir/game/table.cpp.o: CMakeFiles/server.dir/flags.make
CMakeFiles/server.dir/game/table.cpp.o: ../game/table.cpp
	@$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --green --progress-dir=/cygdrive/d/linzhangfeng/MyGithub/boosttest/build/CMakeFiles --progress-num=$(CMAKE_PROGRESS_14) "Building CXX object CMakeFiles/server.dir/game/table.cpp.o"
	/usr/bin/c++.exe  $(CXX_DEFINES) $(CXX_INCLUDES) $(CXX_FLAGS) -o CMakeFiles/server.dir/game/table.cpp.o -c /cygdrive/d/linzhangfeng/MyGithub/boosttest/game/table.cpp

CMakeFiles/server.dir/game/table.cpp.i: cmake_force
	@$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --green "Preprocessing CXX source to CMakeFiles/server.dir/game/table.cpp.i"
	/usr/bin/c++.exe $(CXX_DEFINES) $(CXX_INCLUDES) $(CXX_FLAGS) -E /cygdrive/d/linzhangfeng/MyGithub/boosttest/game/table.cpp > CMakeFiles/server.dir/game/table.cpp.i

CMakeFiles/server.dir/game/table.cpp.s: cmake_force
	@$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --green "Compiling CXX source to assembly CMakeFiles/server.dir/game/table.cpp.s"
	/usr/bin/c++.exe $(CXX_DEFINES) $(CXX_INCLUDES) $(CXX_FLAGS) -S /cygdrive/d/linzhangfeng/MyGithub/boosttest/game/table.cpp -o CMakeFiles/server.dir/game/table.cpp.s

CMakeFiles/server.dir/game/table_factory.cpp.o: CMakeFiles/server.dir/flags.make
CMakeFiles/server.dir/game/table_factory.cpp.o: ../game/table_factory.cpp
	@$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --green --progress-dir=/cygdrive/d/linzhangfeng/MyGithub/boosttest/build/CMakeFiles --progress-num=$(CMAKE_PROGRESS_15) "Building CXX object CMakeFiles/server.dir/game/table_factory.cpp.o"
	/usr/bin/c++.exe  $(CXX_DEFINES) $(CXX_INCLUDES) $(CXX_FLAGS) -o CMakeFiles/server.dir/game/table_factory.cpp.o -c /cygdrive/d/linzhangfeng/MyGithub/boosttest/game/table_factory.cpp

CMakeFiles/server.dir/game/table_factory.cpp.i: cmake_force
	@$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --green "Preprocessing CXX source to CMakeFiles/server.dir/game/table_factory.cpp.i"
	/usr/bin/c++.exe $(CXX_DEFINES) $(CXX_INCLUDES) $(CXX_FLAGS) -E /cygdrive/d/linzhangfeng/MyGithub/boosttest/game/table_factory.cpp > CMakeFiles/server.dir/game/table_factory.cpp.i

CMakeFiles/server.dir/game/table_factory.cpp.s: cmake_force
	@$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --green "Compiling CXX source to assembly CMakeFiles/server.dir/game/table_factory.cpp.s"
	/usr/bin/c++.exe $(CXX_DEFINES) $(CXX_INCLUDES) $(CXX_FLAGS) -S /cygdrive/d/linzhangfeng/MyGithub/boosttest/game/table_factory.cpp -o CMakeFiles/server.dir/game/table_factory.cpp.s

CMakeFiles/server.dir/game/table_shetiqi.cpp.o: CMakeFiles/server.dir/flags.make
CMakeFiles/server.dir/game/table_shetiqi.cpp.o: ../game/table_shetiqi.cpp
	@$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --green --progress-dir=/cygdrive/d/linzhangfeng/MyGithub/boosttest/build/CMakeFiles --progress-num=$(CMAKE_PROGRESS_16) "Building CXX object CMakeFiles/server.dir/game/table_shetiqi.cpp.o"
	/usr/bin/c++.exe  $(CXX_DEFINES) $(CXX_INCLUDES) $(CXX_FLAGS) -o CMakeFiles/server.dir/game/table_shetiqi.cpp.o -c /cygdrive/d/linzhangfeng/MyGithub/boosttest/game/table_shetiqi.cpp

CMakeFiles/server.dir/game/table_shetiqi.cpp.i: cmake_force
	@$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --green "Preprocessing CXX source to CMakeFiles/server.dir/game/table_shetiqi.cpp.i"
	/usr/bin/c++.exe $(CXX_DEFINES) $(CXX_INCLUDES) $(CXX_FLAGS) -E /cygdrive/d/linzhangfeng/MyGithub/boosttest/game/table_shetiqi.cpp > CMakeFiles/server.dir/game/table_shetiqi.cpp.i

CMakeFiles/server.dir/game/table_shetiqi.cpp.s: cmake_force
	@$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --green "Compiling CXX source to assembly CMakeFiles/server.dir/game/table_shetiqi.cpp.s"
	/usr/bin/c++.exe $(CXX_DEFINES) $(CXX_INCLUDES) $(CXX_FLAGS) -S /cygdrive/d/linzhangfeng/MyGithub/boosttest/game/table_shetiqi.cpp -o CMakeFiles/server.dir/game/table_shetiqi.cpp.s

CMakeFiles/server.dir/task/task_list.cpp.o: CMakeFiles/server.dir/flags.make
CMakeFiles/server.dir/task/task_list.cpp.o: ../task/task_list.cpp
	@$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --green --progress-dir=/cygdrive/d/linzhangfeng/MyGithub/boosttest/build/CMakeFiles --progress-num=$(CMAKE_PROGRESS_17) "Building CXX object CMakeFiles/server.dir/task/task_list.cpp.o"
	/usr/bin/c++.exe  $(CXX_DEFINES) $(CXX_INCLUDES) $(CXX_FLAGS) -o CMakeFiles/server.dir/task/task_list.cpp.o -c /cygdrive/d/linzhangfeng/MyGithub/boosttest/task/task_list.cpp

CMakeFiles/server.dir/task/task_list.cpp.i: cmake_force
	@$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --green "Preprocessing CXX source to CMakeFiles/server.dir/task/task_list.cpp.i"
	/usr/bin/c++.exe $(CXX_DEFINES) $(CXX_INCLUDES) $(CXX_FLAGS) -E /cygdrive/d/linzhangfeng/MyGithub/boosttest/task/task_list.cpp > CMakeFiles/server.dir/task/task_list.cpp.i

CMakeFiles/server.dir/task/task_list.cpp.s: cmake_force
	@$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --green "Compiling CXX source to assembly CMakeFiles/server.dir/task/task_list.cpp.s"
	/usr/bin/c++.exe $(CXX_DEFINES) $(CXX_INCLUDES) $(CXX_FLAGS) -S /cygdrive/d/linzhangfeng/MyGithub/boosttest/task/task_list.cpp -o CMakeFiles/server.dir/task/task_list.cpp.s

CMakeFiles/server.dir/task/task_thread.cpp.o: CMakeFiles/server.dir/flags.make
CMakeFiles/server.dir/task/task_thread.cpp.o: ../task/task_thread.cpp
	@$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --green --progress-dir=/cygdrive/d/linzhangfeng/MyGithub/boosttest/build/CMakeFiles --progress-num=$(CMAKE_PROGRESS_18) "Building CXX object CMakeFiles/server.dir/task/task_thread.cpp.o"
	/usr/bin/c++.exe  $(CXX_DEFINES) $(CXX_INCLUDES) $(CXX_FLAGS) -o CMakeFiles/server.dir/task/task_thread.cpp.o -c /cygdrive/d/linzhangfeng/MyGithub/boosttest/task/task_thread.cpp

CMakeFiles/server.dir/task/task_thread.cpp.i: cmake_force
	@$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --green "Preprocessing CXX source to CMakeFiles/server.dir/task/task_thread.cpp.i"
	/usr/bin/c++.exe $(CXX_DEFINES) $(CXX_INCLUDES) $(CXX_FLAGS) -E /cygdrive/d/linzhangfeng/MyGithub/boosttest/task/task_thread.cpp > CMakeFiles/server.dir/task/task_thread.cpp.i

CMakeFiles/server.dir/task/task_thread.cpp.s: cmake_force
	@$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --green "Compiling CXX source to assembly CMakeFiles/server.dir/task/task_thread.cpp.s"
	/usr/bin/c++.exe $(CXX_DEFINES) $(CXX_INCLUDES) $(CXX_FLAGS) -S /cygdrive/d/linzhangfeng/MyGithub/boosttest/task/task_thread.cpp -o CMakeFiles/server.dir/task/task_thread.cpp.s

# Object files for target server
server_OBJECTS = \
"CMakeFiles/server.dir/main.cpp.o" \
"CMakeFiles/server.dir/common/config.cpp.o" \
"CMakeFiles/server.dir/common/common.cpp.o" \
"CMakeFiles/server.dir/common/log.cc.o" \
"CMakeFiles/server.dir/common/protobuf2json.cpp.o" \
"CMakeFiles/server.dir/common/sql_time.cpp.o" \
"CMakeFiles/server.dir/network/chttp.cpp.o" \
"CMakeFiles/server.dir/network/ws_client.cpp.o" \
"CMakeFiles/server.dir/network/ws_server.cpp.o" \
"CMakeFiles/server.dir/proto/login.pb.cc.o" \
"CMakeFiles/server.dir/proto/player.pb.cc.o" \
"CMakeFiles/server.dir/game/game.cpp.o" \
"CMakeFiles/server.dir/game/player.cpp.o" \
"CMakeFiles/server.dir/game/table.cpp.o" \
"CMakeFiles/server.dir/game/table_factory.cpp.o" \
"CMakeFiles/server.dir/game/table_shetiqi.cpp.o" \
"CMakeFiles/server.dir/task/task_list.cpp.o" \
"CMakeFiles/server.dir/task/task_thread.cpp.o"

# External object files for target server
server_EXTERNAL_OBJECTS =

server.exe: CMakeFiles/server.dir/main.cpp.o
server.exe: CMakeFiles/server.dir/common/config.cpp.o
server.exe: CMakeFiles/server.dir/common/common.cpp.o
server.exe: CMakeFiles/server.dir/common/log.cc.o
server.exe: CMakeFiles/server.dir/common/protobuf2json.cpp.o
server.exe: CMakeFiles/server.dir/common/sql_time.cpp.o
server.exe: CMakeFiles/server.dir/network/chttp.cpp.o
server.exe: CMakeFiles/server.dir/network/ws_client.cpp.o
server.exe: CMakeFiles/server.dir/network/ws_server.cpp.o
server.exe: CMakeFiles/server.dir/proto/login.pb.cc.o
server.exe: CMakeFiles/server.dir/proto/player.pb.cc.o
server.exe: CMakeFiles/server.dir/game/game.cpp.o
server.exe: CMakeFiles/server.dir/game/player.cpp.o
server.exe: CMakeFiles/server.dir/game/table.cpp.o
server.exe: CMakeFiles/server.dir/game/table_factory.cpp.o
server.exe: CMakeFiles/server.dir/game/table_shetiqi.cpp.o
server.exe: CMakeFiles/server.dir/task/task_list.cpp.o
server.exe: CMakeFiles/server.dir/task/task_thread.cpp.o
server.exe: CMakeFiles/server.dir/build.make
server.exe: CMakeFiles/server.dir/link.txt
	@$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --green --bold --progress-dir=/cygdrive/d/linzhangfeng/MyGithub/boosttest/build/CMakeFiles --progress-num=$(CMAKE_PROGRESS_19) "Linking CXX executable server.exe"
	$(CMAKE_COMMAND) -E cmake_link_script CMakeFiles/server.dir/link.txt --verbose=$(VERBOSE)

# Rule to build all files generated by this target.
CMakeFiles/server.dir/build: server.exe

.PHONY : CMakeFiles/server.dir/build

CMakeFiles/server.dir/clean:
	$(CMAKE_COMMAND) -P CMakeFiles/server.dir/cmake_clean.cmake
.PHONY : CMakeFiles/server.dir/clean

CMakeFiles/server.dir/depend:
	cd /cygdrive/d/linzhangfeng/MyGithub/boosttest/build && $(CMAKE_COMMAND) -E cmake_depends "Unix Makefiles" /cygdrive/d/linzhangfeng/MyGithub/boosttest /cygdrive/d/linzhangfeng/MyGithub/boosttest /cygdrive/d/linzhangfeng/MyGithub/boosttest/build /cygdrive/d/linzhangfeng/MyGithub/boosttest/build /cygdrive/d/linzhangfeng/MyGithub/boosttest/build/CMakeFiles/server.dir/DependInfo.cmake --color=$(COLOR)
.PHONY : CMakeFiles/server.dir/depend

