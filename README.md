# microauth

Microauth is a lightweight OIDC identity provider.

I made Microauth because I had a lot of services that needed authentication, but no existing solution met all of my requirements. I wanted something fully self contained that required virtually no setup. For that reason, Microauth has a fairly minimal set of features:

- OIDC is the only protocol implemented
    - Only the authorization code flow is supported at the moment
- No multi-tenant support
- SQLite is used instead of a standalone database
- Two MFA methods are supported
    - WebAuthn security key
    - OTP authenticator apps

SMS/Email MFA are not supported, both because I'm lazy and because they're insecure.

# Should you use Microauth?

No. I have no clue what I'm doing.

# TODO

- Pages in progress
    - Sign in 
    - Sign up
    - Error
    - Set up 2FA
    - Auth with 2FA
    - Send password reset
    - Reset password
    - Edit user?
        - change username
        - change password
        - change email
        - manage 2fa
        - delete account