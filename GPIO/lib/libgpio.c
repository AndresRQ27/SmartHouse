#include <libgpio.h>

void pinExport(int pin) {
  //write file
  int fd, len;
  char buffer[50];

  fd = open("/sys/class/gpio/export", O_WRONLY);
  if (fd > 0) {
    len = snprintf(buffer, sizeof(buffer), "%d", pin);
    if (write(fd, buffer, len) < 0) {
      printf("Failed to export GPIO.\n");
    }
    close(fd);
  } else {
    printf("Failed to open export.\n");
  }
}

void pinUnexport(int pin) {
  FILE *fp = fopen("/sys/class/gpio/unexport", "w");

  if (fp != NULL) {
    if (fprintf(fp, "%d", pin) < 0)
      printf("Failed to unexport GPIO.\n");
    fclose(fp);
  } else {
    printf("Failed to open unexport.\n");
  }
}

void pinMode(int pin, int mode) {
  if (mode == 0 || mode == 1) {
    char mode_str[4];
    char filepath[100];
    char buffer[50];
    int fd, len;
    if (mode == 0)
      sprintf(mode_str, "out");
    else if (mode == 1)
      sprintf(mode_str, "in");

    sprintf(filepath, "/sys/class/gpio/gpio%d/direction", pin);
    fd = open(filepath, O_WRONLY);
    if (fd > 0) {
      len = snprintf(buffer, sizeof(buffer), "%s", mode_str);
      if (write(fd, buffer, len) < 0) {
        printf("Failed to set GPIO mode.\n");
      }
      close(fd);
    } else {
      printf("Failed to open direction.\n");
    }
  } else {
    printf("Invalid mode.\n");
  }
}

int digitalRead(int pin) {
  //read file
  char buffer[50];
  int fd;
  char filepath[100];
  char val[3];
  sprintf(filepath, "/sys/class/gpio/gpio%d/value", pin);
  fd = open(filepath, O_RDONLY);
  if (fd > 0) {
    if (read(fd, val, 3) < 0) {
      printf("Failed to read GPIO value.\n");
      return -1;
    }
    close(fd);
    printf("Read value: %s\n", val);
    return (atoi(val));
  } else {
    printf("Failed to open value.\n");
    return -1;
  }
}

void blink(int pin, int freq, int duration) {
  int blinks = freq * duration;
  int val = 0;
  float time = 1 / (float)freq;
  for (int i = 0; i < blinks; ++i) {
    digitalWrite(pin, val);
    if (val == 0)
      val = 1;
    else if (val == 1)
      val = 0;
    usleep(time * 1000000);
  }
}
