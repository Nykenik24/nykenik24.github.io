---
title: "New programming language project"
author: L. Andrei
show: true
date: 2026-07-24 23:16
---

Welcome back! A few days ago I wanted to start a new programming language project called __Sable__, a systems lang that follows various relatively simple set of rules/concepts:
1. To be completely as pragmatic as possible without being a huge pain; in other words, to hide as little functionality as possible without suppressing all neatness _some_ hidden 
behavior might have.
2. To make memory management fun and allow for flexibility in the ways the user manages their program's memory. This means that raw memory allocation will be the encouraged standard, 
but I will still ship Sable with alternatives present in the standard library.
3. To minimize mandatory abstractions. It provides mechanisms rather than enforcing programming paradigms.
4. To make struct as generic and malleable as possible, meaning that there must not be an enforced paradigm over struct in the final result or at least not one that forces the user to
present and manage their struct in a way they don't prefer. As an example, Sable will __not__ enforce OOP nor encourage it, instead composition and procedural programming will be the
preferred ways to manage struct.
5. To allow for readability and implicitly good structure/architecture of programs without the user needing special effort to do so (although this doesn't necessarily mean developers
can't make code absolutely unreadable and unmanageable if they lack the minimum knowledge or intentionally _want_ to make it like this).

## Target & execution

Sable will most likely target [QBE](https://c9x.me/compile/), a compiler backend that offers a good portion of the performance of industrial optimizing compilers without being a huge
dependency and overall being much, much simpler than the aforementioned (such as, but not limited to, LLVM). In less buzzslop, QBE is _relatively_ fast and simple
and it allows for the generation of assembly from their [IL](https://en.wikipedia.org/wiki/Intermediate_representation#Intermediate_language) for three architectures and all major operative systems, making the backend of Sable much more 
maintainable and simple (which in turn helps me focus on the design rather than implementation). Although if I feel like it I might, in the far future, generate
my own assembly.

## Examples

I want Sable to inherit most of the syntax from the language I love and always will love: __C__. 

A bunch examples of how I __want__ Sable to look and feel:

{% center %}
{% badge "Hello, World", "green" %}
{% endcenter %}
This program introduces us to two very important features Sable will provide (which are both very common amongst programming languages nowadays, maybe even mandatory):
- `@include`, which _includes_ all symbols from a file in another file. `std` is a 
shortcut to where the standard library is located, and it allows to skip the
extension of each included file.
- `export`, which makes the symbol visible for other files. It is necessary for 
main for style reasons mostly, to signify that this main is the one Sable will
recognize as the entry point.

Also, note that __main will be mandatory__ in every Sable program and there must be __only one definition of
main (exported)__.
```sable
@include("std/io");

export fn int32 main() 
{
  io::println("Hello, World!");
  return 0;
}
```

---

{% center %}
{% badge "Variables", "green" %}
{% endcenter %}

In Sable, the keyword `let` followed by the type will be used to declare a new variable.
```sable
let int32 my_var = 5;
```

To declare a constant variable (meaning it can't change once it is first defined), 
we use the same structure but replacing `let` by `const`. Note that, as we said 
that it can't change __once it is first defined__ we can use `undefined` to
mutate a constant variable after declaration (after that there is no way
to mutate it again).
```sable
const int32 my_const = 99;

const int32 age = undefined;
age = 18;
```

---

{% center %}
{% badge "Functions", "green" %}
{% endcenter %}

To declare a function we use the `fn` keyword:
```sable
fn int32 add(int32 x, int32 y)
{
  return x + y;
}
```

Functions can have multiple return values:
```sable
fn (int32, int32) addsub(int32 x, int32 y)
{
  return x + y, x - y;
}
```

In which case a tuple is used (tuples are explained a bit more in depth in the next section).

---

{% center %}
{% badge "Tuples", "green" %}
{% endcenter %}

Tuples allow you to quickly bundle data, although this data is accessed through an index and not key like 
structure fields (structures are explain in depth later). Each value can have a different type.
```sable
let (int32, string, int32) tuple = {1, "hello", 2};
```

You can access each value in the tuple independently:
```sable
let string hi = tuple[1];
```

You can decompose tuples into multiple variables:
```sable
let int32 x, string y, int32 z = tuple;
```

---

{% center %}
{% badge "Control flow", "green" %}
{% endcenter %}

If we want to execute a block based on a condition, we use the if statement.
```sable
if (age >= 18) {
  allow_access("nsfw");
}
```

We can include `else` and `else if` blocks to run conditions if all other were false or if an alternative condition is true respectively.
```sable
if (5 > 5) {
  io::println("how?!?");
} else if (5 < 5) {
  io::println("how did this happen!!!");
} else {
  io::println("all regular");
}
```

If you need to handle a lot of cases, instead of using your typical long else-if block:
```sable
if (x == 5) {
  // ...
} else if (x == 6 or x == 9) {
  // ...
} else if (x == 7 or x == 8) {
  // ...
} // so on and so forth
```

It is encouraged to use switch statements:
```sable
switch (x) {
  case 5: {
    // ...
  },
  case 6, 9: {
    // ...
  },
  case 7, 8: {
    // ...
  } // so on and so forth
}
```

If you need to repeat logic various times, instead of writing it several times, use a repeat loop:
```sable
repeat (5) {
  foo();
}
```

If you need to repeat logic based on a condition, use a while loop:
```sable
while (!out_of_bounds()) {
  lex_next();
}
```

If you need to iterate over a range, use a for loop:
```sable
for (let int32 i = 0; i < 10; i++) {
  io::println(i);
}
```

---

{% center %}
{% badge "Collections", "green" %}
{% endcenter %}

When you need to store a fixed amount of elements, fixed arrays can be used. the `_` wildcard allows you
to infer the length of the array from the initializer.
```sable
let int32[3] arr      = {1, 2, 3}; // length 3
let int32[_] inferred = {1, 2, 3}; // length 3
```

If you need to reference a contiguous sequence of elements whose size is not know at compile time,
use an array pointer.
```sable
let int32[*] arr = mem::alloc(3 * @size(int32));

arr[0] = 1;
arr[1] = 2;
arr[2] = 3;
```

`int32[*]` is represented the same way as `int32*`, but it expresses that the pointer refers to an array.
This distinction exists for readability and allows the compiler to permit array operations such as indexing.

If this whole pointer thing confuses you, go to the next example (Memory).

Also, growable collections will be provided by the standard library rather than being built into the language. For example (__ALL CONCEPTUAL__):
```sable
@include("std/collections/vector")

let vector<int32> numbers = vector<int32>.new();

for (let int32 i = 0; i < 1024; i++) {
  numbers.push(i);
}
```

Also, I don't plan to add maps, as i will probably have an implementation in standard library of
hashmaps using arrays or just have users create their own maps. Either way, i want to make sable's
built-in stuff as small as possible so choosing how heavy you want your binary or how much overhead 
you allow is easy.

To iterate over a fixed-size array, you can use a for loop. We use a macro for the length as fixed-size
arrays have a length known from compile time:
```sable
for (let int32 i = 0; i < @len(arr); i++) {
  // ...
}
```

To iterate over an array pointer you use a similar for loop, but you need to track the length of the array
pointer yourself, as Sable can't do it for you. I would love to, but array pointers are meant to, at the
end of the day, behave as your regular pointer but with allowed indexing. I encourage the usage of vectors
if you are not familiar with the whole concept of pointers (you should be if want to use Sable when released, tho)
and array pointers for more control of your memory once you are familiar to have less overhead and binary size.

By the way, I highly encourage you create your own collections using the resources the language provides. This
is an example of how a very very simple integer stack would look in sable, using an array pointer. Note 
that it uses features from later examples, so go read the rest of this post first.
{% collapsible "stack collection" %}
```sable
@include("std/mem");

type stack = struct
{
  hidden let int32[*] items;
  hidden let int64 len; // length
  hidden let int64 cap; // capacity
};

static fn stack* stack.init() 
{
  static const int32 default_size = 8;

  let stack* st = mem::alloc(@size(stack));

  st.len = 0;
  st.cap = default_size;
  st.items = mem::alloc(@size(int32) * st.cap);

  return st;
}

fn void stack.push(stack* self, int32 val) 
{
  if (self.len >= self.cap) {
    self.cap *= 2;
    self.items = mem::realloc(self.items, @size(int32) * self.cap);
  }
  self.items[self.len++] = val;
}

fn int32 stack.pop(stack* self) 
{
  int32 val = self.items[self.len];
  self.items[self.len] = 0;
  self.len--;
  
  return val;
}

fn void stack.free(stack* self)
{
  if (!self)
    return;
  defer mem::free(self);

  if (self.items)
    mem::free(self.items);
}
```
{% endcollapsible %}

---

{% center %}
{% badge "Memory", "green" %}
{% endcenter %}

Sable's memory management is manual. All memory operations (allocation, freeing, etc.) are made through
the standard library module `mem`. It will be practically the same as `libc`'s memory management functions
(`malloc`, `free`, `realloc`, `calloc`, etc.).

Note that creating pointers is managed through built-in macros (`@addr` and `@deref` for C's `&` and `*` respectively).

Either way, some examples:

{% badge "Simple pointer"  %}
```sable
@include("std/io")

export fn int32 main()
{
  let int32  x  = 5;
  let int32* pX = @addr(x);
  io::println(@deref(pX));
  return 0;
}
```

{% collapsible "Equivalent code in C" %}
```c
#include <stdio.h>

int main(void)
{
  int  x  = 5;
  int* pX = &x;
  printf("%d\n", *pX);
  return 0;
}
```
{% endcollapsible %}

{% badge "Allocate 8 bytes of memory:" %}
```sable
@include("std/mem")

export fn int32 main()
{
  let byte[*] bytes = mem::alloc(@size(byte) * 8);
  return 0;
}
```

{% collapsible "Equivalent code in C" %}
```c
#include <stdio.h>
#include <stdlib.h>

int main(void)
{
  char* bytes = malloc(sizeof(char) * 8);
  return 0;
}
```
{% endcollapsible %}

---

{% badge "Structures", "green" %}

Sometimes you need to store data in a structured custom type that you can initialize as many
times as you can and every time it has the same exact structure and carries the same fields.

Well, that's where structure types enter. Structures (often declared with `struct`, Sable included) are 
very common across system and non-system languages. 

Structures in Sable follow various very simple rules:
- Every structure must be declared once.
- No structure must have hidden behavior, this being: operator overloads, constructors, destructors, etc.
(this does mean there is no RAII in Sable, but that was expected knowing memory management is manual).
- There is no such thing as inheritance, composition is the only way of having structures that share
other structure's field through an internal object of said super structure(s).

To declare a structure we use a type declaration, which always has the same structure, being `type <name> = <type_expr>`.
```sable
type point = struct 
{
  let int32 x;
  let int32 y;
};
```

In case we want to make a field only accessible by the methods of the structure or the current file + extending
files (see _Multiple files_), we can use the `hidden` keyword __alongside__ of `let`/`const`.
```sable
type list = struct 
{
  hidden let int32[*] items;
};
```

To declare a constant that ALL instances of the structure will share, we use `static` __alongside__ `let`/`const`/`hidden`.
```sable
type some_math = struct
{
  static const pi = 3.14;
};
```

`static` + `const` will create a variable that all instances share and that can't be changed in any way. `undefined`
is not allowed in `static constants`.

`static` + `let` will create a variable that all instances share and that can only be changed outside of 
the structure. Example:
```sable
type my_type = struct 
{
  static let int32 x = 5;
};

export int32 main()
{
  my_type::x *= 2;
  return 0;
} 
```

`hidden` + `static` _can_ go together.

If we want to declare a method, we use a simple field access:
```sable
export fn point* point.add(point* self, point* other)
{
  // ...
}

export fn int32 main()
{
  let point* p1 = point::init(1, 2); // imagine this exists, see static methods below
  let point* p2 = point::init(3, 4);
  let point* p3 = p1.add(p2); // self = p1
  return 0;
}
```

`self` doesn't need to be passed; Sable will automatically pass it when
calling the method from an object. It is optional.

If we want to declare a method that can be used outside of an instance,
so directly through the type (similar to static variables), we can use
`static fn`. These won't have a `self` field that is automatically filled out,
because there is no instance to fill it with.
```sable
export static fn point* point.init(int32 x, int32 y)
{
  // ...
}

export fn int32 main()
{
  let point* p = point::init(6, 9);
  return 0;
}
```

In case we need some generic type, we can always use `<>` for generics.
```sable
type list = struct<T = typename>
{
  hidden let T[*] items;
};
```

> The reason `= typename` will be used for now is because I plan to add type constraints. Basically, stuff like:
> ```sable
> export fn add<T = typename::numeric>(T x, T y);
> export fn print_value<T = typename::anyof<int32, string, uint32>>(T v);
> ```
> But I don't really know how they will look, feel or if I will even add them.

---

{% badge "Enum types", "green" %}

Enum types are very simple, they just assign an index to each identifier in a list for matching.
```sable
type week = enum
{
  Monday, // 0
  Tuesday, // 1
  Wednesday, // 2
  Thursday, // 3
  Friday, // 4
  Saturday, // 5
  Sunday // 6
};
```

There are some useful macros for enum types
```sable
let week day = week::Wednesday;
let string name = @tag_name(day); // Wednesday
let int32 as_n = @as(day, int32); // 2
```

---

{% badge "Error handling", "green" %}

In case a function _might_ fail in Sable, we can use fallible types. These are inspired by Zig's error handling.

We first declare an error enum, similar to an enum but it can only be used for fallible types and has
some extra methods:
```sable
type divide_error = error 
{
  divide_by_zero
};
```

Then, we can use a fallible type to indicate a function _might_ fail:
```sable
export fn int32!divide_error divide(int32 x, int32 y);
```

Inside of the function we can either return an `int32` or a `divide_error`:
```sable
export fn int32!divide_error divide(int32 x, int32 y)
{
  if (y == 0) { return divide_error::divide_by_zero; }
  return x / y;
}
```

Then, you can either `try` to propagate the error (can only be used inside fallible functions) or
`must` to panic in case an error happens (which can be used in any function). It is encouraged to
`try`. Also, main can be fallible if needed, in which case you can use `int32!` with no error enum,
all propagations from main will equal to panics:
```sable
export fn int32! main()
{
  let int32 x = try divide(10, 2);
  return 0;
}
```

In case a fallible function fails, we won't get the error as a value, but it will halt execution of
the current function and propagate the error. We can catch to prevent this halt, this time getting
the error value:
```sable
export fn int32! main()
{
  let int32 x = try divide(64, 0) catch (let divide_error err) 
  {
    // ...
  };
  return 0;
}
```

In case we need an instantaneous panic, ignoring all propagation, we can use `must`:
```sable
export fn int32! main()
{
  let int32 x = must divide(40, 0);
  return 0;
}
```

Must can't be catched.

---

{% center %}
{% badge "Multiple files", "green" %}
{% endcenter %}

Sometimes we need to split logic between multiple files, that's when we use `@include`.

Imagine we have this file called `math.sbl`:
```sable
export fn int32 add(int32 x, int32 y)
{
  return x + y;
}

export fn int32 sub(int32 x, int32 y)
{
  return x - y;
}
```

And we want to use these functions in a file called `main.sbl` in the same directory.
In that case we do this:
```sable
@include("math.sbl");

export fn int32 main()
{
  math::add(1, 2);
  math::sub(3, 4);
}
```

The thing is, sometimes we want to force users of our API to not ignore return values,
indicate a function is deprecated, etc. That's where we use attributes:
```sable
#{no_ignore_return}
export fn int32 add(int32 x, int32 y) 
{
  return x + y;
}

#{deprecated}
export fn int32 oldadd(int32 x, int32 y)
{
  return x - y;
}
```

In case want to access hidden fields or declare methods in structure from other files, 
we can use `@extends`:


{% badge "list.sbl" %}
```sable
export type list = struct
{
  hidden let int32[*] items;
  hidden let int64 len;
};
```

{% badge "list_methods.sbl" %}
```sable
@extends("list.sbl");

export fn void list.push(list* self, int32 value)
{
  // grow if not enough capacity here...
  self.items[self.len++] = value;
}
```

{% badge "main.sbl" %}
```sable
@include("list_methods.sbl");

export fn int32 main()
{
  let list* numbers = list::init(); // imagine this exists
  numbers.push(42);
  return 0;
}
```
