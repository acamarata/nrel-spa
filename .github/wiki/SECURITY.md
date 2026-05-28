# Security Policy

## Supported Versions

| Version | Supported |
| --- | --- |
| 2.x | Yes |
| 1.x | No |

Only the latest major version receives security fixes.

## Reporting a Vulnerability

Do not open a public GitHub issue for security vulnerabilities.

Email: aric.camarata@gmail.com

Include:

- A description of the vulnerability
- Steps to reproduce
- Potential impact
- Any suggested fix, if you have one

You will receive an acknowledgment within 48 hours and a resolution timeline within 7 days. Once a fix is ready and deployed, the vulnerability will be disclosed publicly with credit to the reporter (unless you prefer to remain anonymous).

## Scope

This package is a pure computation library. It performs no network requests, reads no files, and holds no credentials. The algorithm is a direct port of the [NREL SPA C source](https://midcdmz.nrel.gov/spa/) and contains no dynamic code loading.
