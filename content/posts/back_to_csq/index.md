---
title: "Back to C²"
author: Nykenik24
date: 2026-03-17
summary: "Arise, my child!"
tags: ["projects"]
draft: false
---

Welcome back to my lair! Recently I've revived a project that
some may know: C&sup2;.

C&sup2; is a superset of C, designed as basically a nicer-to-use C
version.

Some of the features/changes it has compared to C:

> These are **planned**.

- **Built-in error types** (Zig-like) with `error` unions and `void!`-like (`void`
  can be any type) function return types.
- **Namespaces** (not like C++).
- **Better enums** based in `enum class` from C++, as C's enums declare global
  constants that can collide in name, meaning most C programs must use some prefix
  for the enum, which is much less nice than just using `MyEnum.Whatever` instead
  `MyEnum_Whatever` as a constant.
- **Completely structural typing** where field names don't matter and types must
  only have fields/items of the same type to be considered compatible.
- **Better include system** that ditches headers for a module-based approach.
- **Better memory management** that ditches raw `malloc`s and `free` for allocator
  structures, built-in keyword-based freeing (`free` keyword) and `defer` for automatic
  end-of-block cleanup.
- **More types** quadruple-precision floats[^why], built-in from day one booleans
  (C got booleans pretty late as `_Bool` in C99, and there are still programs that
  use `<stdbool.h>` for booleans or `int` directly).
- **Safer types** by being more strict with casts, forcing uncasted values to be
  the exact same type (meaning that you can't assign an `uint` to an `ulong` witho
  ut casting) and clearer type-specific literals (`100.0f` for floats, `100u` for
  unsigned integers of any size, etc.).
- **VM-based** for faster iteration, packages supported and you can create binaries
  out of the runtime + the bytecode.

## What is implemented right now

For now, I've made a lexer that runs pretty fast (100k iterations in ~44μs, or
~0.000044 seconds), an error printing system:
![Error report showing 2 'unknown character' errors](./images/error_report.png#small)

and a test suite:
![Test suite showing two passed lexer tests](./images/test_suite.png#small)

Right now I am working in the parser, which will be probably finished soon and I
will start with the real deal: compilation!.

## Links

- [GitHub repo](https://github.com/csq-lang/csquared)

[^why]:
    some nicher although existing programs, such as fractal generation, some cryptography algorithms, etc. require
    128-bit precision floats (`_Float128` in C, which is a GCC extension). C&sup2; will include them by default
    as the `quad` type with it's own literal `100.0q` (and in exponential notation `100.0e1q`).
