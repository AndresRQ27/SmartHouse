cmake_minimum_required (VERSION 2.6)

#define the project
project (house_controller)
#add lib subdirectory to build
add_subdirectory (lib)
#include directories to building path
include_directories(${PROJECT_SOURCE_DIR}/include)
include_directories(${PROJECT_SOURCE_DIR}/lib)
# add the executable
add_executable (house_controller house_controller.c)
#link against required libraries
target_link_libraries(house_controller gpio)
#install the binary
install (TARGETS house_controller DESTINATION bin)
#package source generation
set(MAJOR "0")
set(MINOR "1")
set(PATCH "1")
set(CPACK_SOURCE_GENERATOR "TGZ")
set(CPACK_SOURCE_PACKAGE_FILE_NAME "${CMAKE_PROJECT_NAME}-${MAJOR}.${MINOR}.${PATCH}")
set(CPACK_SOURCE_IGNORE_FILES "/build/;${CPACK_SOURCE_IGNORE_FILES}")
include(CPack)