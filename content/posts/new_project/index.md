---
title: "New project!!!"
author: "Nykenik"
date: 2025-11-02T22:10:06+01:00
summary: "I FINALLY HAD AN IDEA!!!!"
tags: ["idea", "projects"]
---

### The idea
The idea I had was making a daemon that holds a "journal" with logs, then you query them either through:
- Direct CURL.
- CLI.
- UI (later).

A log consists of a YAML/JSON file and any amount of adjacent files, such as images or text.

A simple shopping list per example would be:
```
.
└── shopping_list/
    ├── log.json
    └── list.txt
```

`log.json` would (probably) be:
```json
{
  "title": "Shopping list",
  "ID": "randomly generated UUID",
  "files": {
    "txt/plaintext": ["./list.txt"]
  }
}
```
*Format is still to be determined.*

If you want the list to also be JSON AND include an image of each product:
```
.
└── shopping_list/
    ├── log.json
    ├── list.json
    └── images/
        ├── pear.png
        ├── onion.png
        └── soda.png
```

`log.json`:
```json
{
  "title": "Shopping list",
  "ID": "randomly generated UUID",
  "files": {
    "txt/json": ["./list.json"],
    "img/png": [
      "./images/pear.png", 
      "./images/onion.png", 
      "./images/soda.png"
    ]
  }
}
```

### "But, why would I use this?"
Well, superficially (and by how I explained it) it seems useless or just unnecessary, but just imagine for a minute how useful a lightweight daemon that:
- Locally stores data, meaning that if you deploy it in your computer poweroffs don't cause looses and if you deploy it in a 24/7 unit then you have complete control of your data.
- Can be deployed anywhere.
- Allows you to create ultra lightweight logs with an easy format, which can also be even *easier* to create with the CLI.
- You can then query these logs by title, ID, date or any other custom property.
- Can be used through direct communication with it, a simple CLI and even UI (later).
- Can be expanded with simple add-ons made in Lua to support other formats, add additional properties to logs, among other useful things.

**Would be.**

*Sounds cool once you see that list, huh?* 

And also, if I execute it well, it will also be ultra fast and use very few resources. Disk space might worry you a bit, but it completely depends on what YOU store, because text files will not occupy GBs of space, heck, rare for a `.txt` file to occupy a MB, considering one character is normally one byte.
