#ifndef _LIBGPIO_H
#define _LIBGPIO_H

#include <fcntl.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>

void pinExport(int pin);
void pinUnexport(int pin);
void pinMode(int pin, int mode);
static int digitalWrite(int pin, int value);
int digitalRead(int pin);
void blink(int pin, int freq, int duration);

static int digitalWrite(int pin, int value) {
  //write file
  char buffer[50];
  int fd, len;
  char filepath[100];
  sprintf(filepath, "/sys/class/gpio/gpio%d/value", pin);
  fd = open(filepath, O_WRONLY);
  if (fd > 0) {
    len = snprintf(buffer, sizeof(buffer), "%d", value);
    if (write(fd, buffer, len) < 0) {
      printf("Failed to set GPIO value.\n");
      close(fd);
      return -1;
    }
    close(fd);
    return 0;

  } else {
    printf("Failed to open value.\n");
    return -1;
  }
}

#endif
