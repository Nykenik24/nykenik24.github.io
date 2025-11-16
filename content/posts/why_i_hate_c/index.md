---
title: "Why I hate C++"
author: Nykenik24
date: 2025-11-16
summary: "C is just better tbh."
tags: []
draft: true
---

I have a bad reputation with C++, one so bad I just gave up using it.

No matter how hard I want to like it, I just can't. And these are the reasons.

> Note: this is my opinion and things that happened to me. If you develop in C++ and feel comfortable with it, no hate to you, just to the language from my point of view.

## Size (=bloated af)
C++ is a *beast*, and I mean it. Like, include one header and `std` will be full of methods that you will probably never use.

In C you will probably do most things yourself with as many methods, variables or types as you please, and headers don't include too much. In C++? Well, if you need something is already there.

This might seem like it's super cool, right? I mean, you don't have to do anything yourself! Yeah, no. This just makes it:
- Hard to find the best way to do something (or at least a good one), because there are 1000 methods that do the same BUT one takes one argument more used for this obscure situation, the other is type safe but gives you no control so it's preferred to use the type unsafe one that gives you more control, the thing is it's not only type unsafe, but also in certain situations can cause segmentation faults for just using it so you have to account for a gazillion factors, blah blah.
- Hard to decide if you either use those methods and read documentation 95% of your development time, or to make it yourself and spend 95% of your development time writing boilerplate, where you will also encounter these problems.

And it also sections a lot the community. It's just so big that you will be using a very small fraction of it, and when you want help on the internet you might encounter someone that uses another fraction of it and does things completely different, so it's harder for them to help you.

C++ headers often include tons of other headers.

For example, this tiny snippet:
```cpp
#include <iostream>
```
Brings:
- Multiple streams: `iostream`, `ostream`, `istream`, `streambuf`.
- `ios`, `locale`.
- Everything the above also bring (spoiler: a lot).

In C, the same snippet brings:
- `printf`.
- `FILE`.
- Other small definitions.
And that's it. `printf` and the "other small definitions" are all functions and types, and `FILE` is a macro.

### What do I use?

Do you want to create a string in C++? Yeah, choose one of these:
```cpp
std::string s = "hi";
std::string s("hi"); // might seem the same as above, but its slightly different
auto s = std::string("hi");
std::string s{'h', 'i'};
std::string s = std::string_view("hi");
```
Each one brings has advantages and disavantages, may cause errors in some situations, does it's own things in the background, etc. Basically like choosing kart and character in mario kart, each combo has unique stats.

In C? Well:
```c
char* s = "hi";
char s[] = "hi"; // same as above
```

Want to remove something from your precious vector (another bloated class)?

```cpp
v.erase(v.begin() + i);
v.erase(std::remove(v.begin(), v.end(), x), v.end());
std::erase(v, x);
v.clear(); // wrong, but people do it by mistake, just so you know
v.pop_back();
```
Same as above, but this is more of a "how do I X" more than "how do I create X".

Both situations demonstrate that in C++ there are 1000 ways of doing everything, and each one is wrong in some way.


## Complexity
In C you would normally just either do everything yourself using a set of simple methods to make complex things (which is how it should be). But C++ completely shifted that, and now you use a set of complex methods to do simple things.

Like, there are all of these features, abstractions, standard library headers, etc. and it just makes it so hard to make simple things without just writing C code inside C++ with slight moficiations. And if I am going to basically write C then I will just use C.

### Abstractions everywhere
Want to read a file line-by-line?

In C:
```c
FILE *f = fopen("data.txt", "r");
char buf[256];
while (fgets(buf, sizeof(buf), f)) {
    /* use buf */
}
fclose(f);
```

In C++ (*"simple"* version):
```cpp
std::ifstream f("data.txt");
std::string line;
while (std::getline(f, line)) {
    // use line
}
```

But then you have to account for:
- `std::ios::failbit` vs `eofbit` vs `badbit`.
- Exception vs non-exception versions.
- Stream state magic.
- Locale issues.
- Performance penalties.

And reading binary is **yet another fucking API**.

### Memory ownership

In C:
```c
int *p = malloc(sizeof(int));
free(p);
```

You know exactly what happened.

In C++, using new is “wrong,” unique_ptr might block copying, shared_ptr might create reference cycles, and passing them to C APIs is a nightmare:
```cpp
std::shared_ptr<Foo> a = std::make_shared<Foo>();
std::shared_ptr<Foo> b = a;
```

Brace for impact, because there is a projectile coming that contains:
- Atomic reference counting.
- Possible cycles.
- Hidden allocations.
- Control blocks.
- Destructor behavior depending on template parameters.

For *one pointer* 😭 (so bad I had to use an emoji to express my feelings).

## Does what it wants
In C you can easily know and control everything that happens in the background by just looking at the code. Want to do the same in C++? Well, install these packages to check debug logs, memory addresses/leaks, etc., then go through all your code and write everything down because you will go so deep you're 100% forgetting important things, and you will have finally learnt what your code does.

What I am trying to say is that there is so much happening internally in C++ that you either leave it like that and encounter errors that take hours of debugging or understand it from the ground up, which also takes hours in middle-sized projects. You are losing time anyway, so chose the one you prefer.

### Implicit conversions
This **line**:
```cpp
auto x = someVector[0];
```

May (and will mostly likely):
- Call a custom copy constructor.
- Allocate memory.
- Run arbitrary user-defined code.
- Invoke move semantics.
- Extend lifetimes *subtly*.
- Or, depending on overloads, not copy at all.

And you have to read all the bible and climb mount everest wihout using any limbs (=know all the rules) to predict it.

### Template detonations
This tiny piece:
```cpp
std::vector<int> v;
v.push_back(5);
```

Instantiates:
- `vector<int>`.
- `allocator<int>`.
- A dozen, hell, TWO dozens of inline constructors/destructors.
- Maybe move constructors.
- Maybe debug iterators.

And when there’s a singular error you get 300 lines of template tracebacks.

## Boilerplate
Oh boy, I make abominations in C with headers, yes, but if in C is bad, in C++ is ten times worse.

"Bu- but, you are just following bwad practices~" Mate, what practices should I follow? You will write boilerplate in any language, yes, but with how big and complex C++ is probably the top 1 in the boilerplate requiring languages.

### A "simple" class
This is “minimal” but still huge:
```cpp
class Point {
public:
    int x, y;

    Point(int x, int y) : x(x), y(y) {}
    Point() : x(0), y(0) {}

    bool operator==(const Point &other) const {
        return x == other.x && y == other.y;
    }
};
```

In C:
```c
typedef struct {
    int x, y;
} Point;
```

Done.
