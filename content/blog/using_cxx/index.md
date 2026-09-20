---
title: "Trying to enjoy C++."
author: L. Andrei
show: true
date: "2026-09-20 18:45"
---

This is a short one, but I just wanted to talk about how I am going to try and enjoy C++, or at least a subset of features from it.

## Features I am using

1. __RAII (destructors)__: this is literally a life-saver, an angel sent from the sky to save programming. Jokes aside, RAII is very useful and one of the few reasons
C++ is worth it.
2. __Basic templates__: templates can become some real assholes but, if used simply, they are also a really useful feature C++ offers over C.
3. __Non-owning views__: `std::span<T>` for making an efficient view of vectors, arrays, etc. and `std::string_view` for making an efficient
non-owning view of a string.
4. __`std::unique_ptr` and `std::array`__: single ownership without manual free, and arrays know their size.
5. __Namespaces and `enum class`__: they replace `mylib_subthingy_` prefixes by nicer `MyLib::Subthingy::` and avoid enum-name collisions, also life savers.
6. __`constexpr` and `auto`__: `constexpr` replaces a lot of macro constants and lookup-table generation. `auto` saves me from spelling out long typenames.
7. __Lambdas__: no more `callback + void* userdata` with captured state.

## Features I am banning

1. Inheritance and `virtual`.
2. Exceptions (`-fno-exceptions`).
3. RTTI (`-fno-rtti`).
4. Operator overloading unless ultra necessary (math types).
5. `iostream`.
6. `<algorithm>`/ranges pipelines.
7. Anything with SFINAE.

## Drawbacks

1. __RAII drags in copy/move semantics__: I have to learn move semantics mandatorily if I want to use C++, at some point I will need to decide what happens to a type
when it's copied or moved.
2. __Subset is self-enforced__: every library, header and error will still use the full language. Some errors are still awful even if I limit my feature usage.

## Conclusions

I am going to try and use C++ with a limited subset, seeing if I like it by making the same program in plain C and in this C++ subset.

At the end of the day, there are some C++ features I _do_ enjoy.
