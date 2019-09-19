#include "libgpio.h"

int main(int argc, char **argv) {
    int time = 0;
    int pin_number;
    int pin_mode;
    if (argc == 4) {
        if (strcmp(argv[1] , "-l") == 0) {
            int to_write;
            pin_mode = 0;  // out
            if (strcmp(argv[2], "0") == 0) {
                pin_number = 5;
            } else if (strcmp(argv[2], "1") == 0) {
                pin_number = 6;
            } else if (strcmp(argv[2], "2") == 0) {
                pin_number = 13;
            } else if (strcmp(argv[2], "3") == 0) {
                pin_number = 19;
            } else if (strcmp(argv[2], "4") == 0) {
                pin_number = 26;
            } else {
                printf("There are only 5 lights ranging from index 0 to 4");
                return -1;
            }
            if (strcmp(argv[3], "0") == 0) {
                to_write = 0;
            } else if (strcmp(argv[3], "1") == 0) {
                to_write = 1;
            } else {
                printf("Only 0 and 1 are valid states");
                return -1;
            }

            pinExport(pin_number);
            pinMode(pin_number, pin_mode);
            digitalWrite(pin_number, to_write);
            pinUnexport(pin_number);
            return 0;
        }
    } else if (argc == 3) {
        if (strcmp(argv[1] , "-d") == 0) {
            int to_return;
            pin_mode = 1;  // in
            if (strcmp(argv[2], "0") == 0) {
                pin_number = 12;
            } else if (strcmp(argv[2], "1") == 0) {
                pin_number = 16;
            } else if (strcmp(argv[2], "2") == 0) {
                pin_number = 20;
            } else if (strcmp(argv[2], "3") == 0) {
                pin_number = 21;
            } else {
                printf("There are only 4 doors ranging from index 0 to 3");
                return -1;
            }

            pinExport(pin_number);
            pinMode(pin_number, pin_mode);
            to_return = digitalRead(pin_number);
            pinUnexport(pin_number);
            return to_return;
        }
    }
    printf("Use this program as follows.\n");
    printf("To read the door status: ./house_controller -d [door_number]\n");
    printf("To set a light status: ./house_controller -l [light_number] [status]\n");

    return -1;
}
