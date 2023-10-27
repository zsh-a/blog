---
title: linux programing
tag:
    - linux
    - os
---

# Interaction With the Execution environment

## Using getopt_long
`#include <getopt.h>`  
for example:  
`$ program -h -v -o name`  

`const char* const short_options = "ho:v";`  
`:`indicate a argument followed  

```c
const struct option long_options[] = {
    // long option,has argument,NULL,short option
	{ "help", 0, NULL, 'h' },
	{ "output", 1, NULL, '0' },
	{ "verbose", 0, NULL, 'v' },
	{ NULL, 0, NULL, 0 }
    // ended with 0
};
```

```c
#include <getopt.h>
#include <stdio.h>
#include <stdlib.h>
/* The name of this program. */
const char* program_name;
/* Prints usage information for this program to STREAM (typically
stdout or stderr), and exit the program with EXIT_CODE. Does not
return. */
void print_usage (FILE* stream, int exit_code)
{
    fprintf (stream, "Usage: %s options [ inputfile ... ]\n", program_name);
    fprintf (stream,
    " -h --help Display this usage information.\n"
    " -o --output filename Write output to file.\n"
    " -v --verbose Print verbose messages.\n");
    exit (exit_code);
}
/* Main program entry point. ARGC contains number of argument list
elements; ARGV is an array of pointers to them. */
int main (int argc, char* argv[])
{
    int next_option;
    /* A string listing valid short options letters. */
    const char* const short_options = "ho:v";
    /* An array describing valid long options. */
    const struct option long_options[] = {
    	// long option,has argument,NULL,short option
		{ "help", 0, NULL, 'h' },
		{ "output", 1, NULL, '0' },
		{ "verbose", 0, NULL, 'v' },
		{ NULL, 0, NULL, 0 }
	};
    // ended with 0

    /* The name of the file to receive program output, or NULL for
    standard output. */
    const char* output_filename = NULL;
    /* Whether to display verbose messages. */
    int verbose = 0;
    /* Remember the name of the program, to incorporate in messages.
    The name is stored in argv[0]. */
    program_name = argv[0];
    do {
        next_option = getopt_long (argc, argv, short_options,
        long_options, NULL);
        switch (next_option)
        {
        case 'h': /* -h or --help */
            /* User has requested usage information. Print it to standard
            output, and exit with exit code zero (normal termination). */
            print_usage (stdout, 0);
        case 'o': /* -o or --output */
            /* This option takes an argument, the name of the output file. */
            output_filename = optarg;
            break;
        case 'v': /* -v or --verbose */
            verbose = 1;
            break;
        case '?': /* The user specified an invalid option. */
            /* Print usage information to standard error, and exit with exit
            code one (indicating abnormal termination). */
            print_usage (stderr, 1);
        case -1: /* Done with options. */
            break;
            default: /* Something else: unexpected. */
            abort ();
        }
    }
    while (next_option != -1);
    /* Done with options. OPTIND points to first nonoption argument.
    For demonstration purposes, print them if the verbose option was
    specified. */
};
```
## Standard I/O  

- `stdin` 
- `stdout` default line buffered  
- `stderr` default no buffered  

`fprint(stderr,msg)` 

`$ program > output_file.txt 2>&1`  
`$ program 2>&1 | filter`  
`2>&1` indicate fd **2**(`stderr`) merged into fd **1**(`stdout`)

## The Environment
- access environment variable value using `$varname`.  
`$ echo $HOME`  
`$ echo $PATH`
- export variable  
`$ export HOME="/bin"`  
- functions in `<stdlib.h>`  
`char *getenv (const char *__name)`  
`int setenv (const char *__name, const char *__value, int __replace)`  
# IPC
## Pipe
`pipe(int* fds)` create a pipe, fds[0] is read end, dfs[1] is write end.  
`int dup2(int oldfd, int newfd)`, newfd equated file with oldfd  
### pipe redirect
```c
#include <stdio.h>
#include<unistd.h>
#include<sys/types.h>
#include<sys/wait.h>

int main()
{
    int fds[2];
    pid_t pid;
    pipe(fds);

    pid = fork();
    if(pid == 0){
        // child
        close(fds[1]);
        dup2(fds[0],STDIN_FILENO); // read from `stdin` as same as pipe
        execlp("sort","sort",0);
    }else{
        FILE* stream = fdopen(fds[1],"w");
        fprintf(stream,"This is a test.\n");
        fprintf(stream,"This is a test.\n");
        fprintf(stream,"Hello world\n");
        fprintf(stream,"My dog\n");
        fprintf(stream,"This prog\n");
        fprintf(stream,"One fish.\n");
        fflush(stream);
        close(fds[1]);
        waitpid(pid,NULL,0);
    }
    return 0;
}
```
## Socket
### Local Sockets
server.c
```c
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <sys/socket.h>
#include <sys/un.h>
#include <unistd.h>
/* Read text from the socket and print it out. Continue until the
socket closes. Return nonzero if the client sent a “quit”
message, zero otherwise. */
int server (int client_socket)
{
    while (1) {
        int length;
        char* text;
        /* First, read the length of the text message from the socket. If
        read returns zero, the client closed the connection. */
        if (read (client_socket, &length, sizeof (length)) == 0)
            return 0;
        /* Allocate a buffer to hold the text. */
        text = (char*) malloc (length);
        /* Read the text itself, and print it. */
        read (client_socket, text, length);
        printf (“%s\n”, text);
        /* Free the buffer. */
        free (text);
        /* If the client sent the message “quit,” we’re all done. */
        if (!strcmp (text, “quit”))
            return 1;
    }
}
int main (int argc, char* const argv[])
{
    const char* const socket_name = argv[1];
    int socket_fd;
    struct sockaddr_un name;
    int client_sent_quit_message;
    /* Create the socket. */
    socket_fd = socket (PF_LOCAL, SOCK_STREAM, 0);
    // `PF_LOCAL` local namespace
    /* Indicate that this is a server. */
    name.sun_family = AF_LOCAL;
    strcpy (name.sun_path, socket_name);
    bind (socket_fd, &name, SUN_LEN (&name));
    /* Listen for connections. */
    listen (socket_fd, 5);
    /* Repeatedly accept connections, spinning off one server() to deal
    with each client. Continue until a client sends a “quit” message. */
    do {
        struct sockaddr_un client_name;
        socklen_t client_name_len;
        int client_socket_fd;
        /* Accept a connection. */
        client_socket_fd = accept (socket_fd, &client_name, &client_name_len);
        /* Handle the connection. */
        client_sent_quit_message = server (client_socket_fd);
        /* Close our end of the connection. */
        close (client_socket_fd);
    }
    while (!client_sent_quit_message);
    /* Remove the socket file. */
    close (socket_fd);
    unlink (socket_name);
    return 0;
}
```
client.c
```c
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <sys/socket.h>
#include <sys/un.h>
#include <unistd.h>
void write_text (int socket_fd, const char* text)
{
    /* Write the number of bytes in the string, including
    NUL-termination. */
    int length = strlen (text) + 1;
    write (socket_fd, &length, sizeof (length));
    /* Write the string. */
    write (socket_fd, text, length);
}
int main (int argc, char* const argv[])
{
    const char* const socket_name = argv[1];
    const char* const message = argv[2];
    int socket_fd;
    struct sockaddr_un name;
    /* Create the socket. */
    socket_fd = socket (PF_LOCAL, SOCK_STREAM, 0);
    /* Store the server’s name in the socket address. */
    name.sun_family = AF_LOCAL;
    strcpy (name.sun_path, socket_name);
    /* Connect the socket. */
    connect (socket_fd, &name, SUN_LEN (&name));
    /* Write the text on the command line to the socket. */
    write_text (socket_fd, message);
    close (socket_fd);
    return 0;
}
```
### Internet-Domain Sockets
```c
#include <stdlib.h>
#include <stdio.h>
#include <netinet/in.h>
#include <netdb.h>
#include <sys/socket.h>
#include <unistd.h>
#include <string.h>
/* Print the contents of the home page for the server’s socket.
Return an indication of success. */
void get_home_page (int socket_fd)
{
    char buffer[10000];
    ssize_t number_characters_read;
    /* Send the HTTP GET command for the home page. */
    sprintf (buffer, “GET /\n”);
    write (socket_fd, buffer, strlen (buffer));
    /* Read from the socket. The call to read may not
    return all the data at one time, so keep
    trying until we run out. */
    while (1) {
        number_characters_read = read (socket_fd, buffer, 10000);
        if (number_characters_read == 0)
            return;
        /* Write the data to standard output. */
        fwrite (buffer, sizeof (char), number_characters_read, stdout);
    }
}
int main (int argc, char* const argv[])
{
    int socket_fd;
    struct sockaddr_in name;
    struct hostent* hostinfo;
    /* Create the socket. */
    socket_fd = socket (PF_INET, SOCK_STREAM, 0);
    /* Store the server’s name in the socket address. */
    name.sin_family = AF_INET;
    /* Convert from strings to numbers. */
    hostinfo = gethostbyname (argv[1]);
    if (hostinfo == NULL)
        return 1;
    else
    name.sin_addr = *((struct in_addr *) hostinfo->h_addr);
    /* Web servers use port 80. */
    name.sin_port = htons (80);
    /* Connect to the Web server */
    if (connect (socket_fd, &name, sizeof (struct sockaddr_in)) == -1) {
        perror (“connect”);
        return 1;
    }
    /* Retrieve the server’s home page. */
    get_home_page (socket_fd);
    return 0;
}
```
# System Call

## Using strace
`sudo apt install strace`  
