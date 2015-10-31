# aka-archiver

A Node-based commandline tool that saves Akamai GTM configuration to local JSON files.

## Why?

Akamai provides no rollback functionality, version control, or backups of GTM domain, property, and data center configuration.

`aka-archiver` saves GTM configuration to JSON files. The JSON can be used to restore your Akamai GTM configuration should it disappear or be problematically modified.

## Installation

```
npm install -g aka-archiver
```

## Usage

Set the following environment variables the proper values based on your Akamai account:

```
AKAMAI_EDGEGRID_CLIENT_TOKEN
AKAMAI_EDGEGRID_CLIENT_SECRET
AKAMAI_EDGEGRID_ACCESS_TOKEN
AKAMAI_EDGEGRID_HOST
```

Save all the GTM configuration:

```
aka-archive all yourdomain.akadns.net
```

Result:

* `yourdomain.akadns.net_domain.json`
* `yourdomain.akadns.net_properties.json`
* `yourdomain.akadns.net_dataCenters.json`

Save only domain configuration:

```
aka-archive domain yourdomain.akadns.net
```

Save only properties configuration:

```
aka-archive properties yourdomain.akadns.net
```

Save only data centers configuration:

```
aka-archive dataCenters yourdomain.akadns.net
```
