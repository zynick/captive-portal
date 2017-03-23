
# MikroTik Hotspot Pages

## Setup

```
1. copy login.html
2. delete alogin.html (if exist) from server /hotspot directory
```

## The Logic Flow of Setting Up Mikrotik Hotspot Page

http://wiki.mikrotik.com/wiki/Manual:Customizing_Hotspot#Serving_Servlet_Pages

1. **request for a remote host**
    - if user is logged in and advertisement is due to be displayed, radvert.html is displayed. This page makes redirect to the scheduled advertisment page
    - if user is logged in and advertisement is not scheduled for this user, the requested page is served
    - if user is not logged in, but the destination host is allowed by walled garden, then the request is also served
    - if user is not logged in, and the destination host is disallowed by walled garden, rlogin.html is displayed; if rlogin.html is not found, redirect.html is used to redirect to the login page

2. **request for "/" on the HotSpot host**
    - if user is logged in, rstatus.html is displayed; if rstatus.html is not found, redirect.html is used to redirect to the status page
    - if user is not logged in, rlogin.html is displayed; if rlogin.html is not found, redirect.html is used to redirect to the login page request for "/login" page
    - if user has successfully logged in (or is already logged in), alogin.html is displayed; if alogin.html is not found, redirect.html is used to redirect to the originally requested page or the status page (in case, original destination page was not given)
    - if user is not logged in (username was not supplied, no error message appeared), login.html is showed
    - if login procedure has failed (error message is supplied), flogin.html is displayed; if flogin.html is not found, login.html is used
    - in case of fatal errors, error.html is showed

3. **request for "/status" page**
    - if user is logged in, status.html is displayed
    - if user is not logged in, fstatus.html is displayed; if fstatus.html is not found, redirect.html is used to redirect to the login page

4. **request for '/logout' page**
    - if user is logged in, logout.html is displayed
    - if user is not logged in, flogout.html is displayed; if flogout.html is not found, redirect.html is used to redirect to the login page

## Available Pages

http://wiki.mikrotik.com/wiki/Manual:Customizing_Hotspot#Available_Pages

Main HTML servlet pages, which are shown to user:

- **redirect.html** - redirects user to another url (for example, to login page)
- **login.html** - login page shown to a user to ask for username and password. This page may take the following parameters:
    - **username** - username
    - **password** - either plain-text password (in case of PAP authentication) or MD5 hash of chap-id variable, password and CHAP challenge (in case of CHAP authentication). This value is used as e-mail address for trial users
    - **dst** - original URL requested before the redirect. This will be opened on successfull login
    - **popup** - whether to pop-up a status window on successfull login
    - **radius\<id\>** - send the attribute identified with \<id\> in text string form to the RADIUS server (in case RADIUS authentication is used; lost otherwise)
    - **radius\<id\>u** - send the attribute identified with \<id\> in unsigned integer form to the RADIUS server (in case RADIUS authentication is used; lost otherwise)
    - **radius\<id\>-\<vnd-id\>** - send the attribute identified with \<id\> and vendor ID \<vnd-id\> in text string form to the RADIUS server (in case RADIUS authentication is used; lost otherwise)
    - **radius\<id\>-\<vnd-id\>u** - send the attribute identified with \<id\> and vendor ID \<vnd-id\> in unsigned integer form to the RADIUS server (in case RADIUS authentication is used; lost otherwise)
- **md5.js** - JavaScript for MD5 password hashing. Used together with http-chap login method
- **alogin.html** - page shown after client has logged in. It pops-up status page and redirects browser to originally requested page (before he/she was redirected to the HotSpot login page)
- **status.html** - status page, shows statistics for the client. It is also able to display advertisements automatically
- **logout.html** - logout page, shown after user is logged out. Shows final statistics about the finished session. This page may take the following additional parameters:
    - erase-cookie - whether to erase cookies from the HotSpot server on logout (makes impossible to log in with cookie next time from the same browser, might be useful in multiuser environments)
- **error.html** - error page, shown on fatal errors only

Some other pages are available as well, if more control is needed:

- **rlogin.html** - page, which redirects client from some other URL to the login page, if authorization of the client is required to access that URL
- **rstatus.html** - similarly to rlogin.html, only in case if the client is already logged in and the original URL is not known
- **radvert.html** - redirects client to the scheduled advertisement link
- **flogin.html** - shown instead of login.html, if some error has happened (invalid username or password, for example)
- **fstatus.html** - shown instead of redirect, if status page is requested, but client is not logged in
- **flogout.html** - shown instead of redirect, if logout page is requested, but client is not logged in

