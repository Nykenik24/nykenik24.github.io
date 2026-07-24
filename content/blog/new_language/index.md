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
4. To make data as generic and malleable as possible, meaning that there must not be an enforced paradigm over data in the final result or at least not one that forces the user to
present and manage their data in a way they don't prefer. As an example, Sable will __not__ enforce OOP nor encourage it, instead composition and procedural programming will be the
preferred ways to manage data.
5. To allow for readability and implicitly good structure/architecture of programs without the user needing special effort to do so (although this doesn't necessarily mean developers
can't make code absolutely unreadable and unmanageable if they lack the minimum knowledge to fail the task or intentionally _want_ to make it like this).

## Target & execution

Sable will most likely target [QBE](https://c9x.me/compile/), a compiler backend that offers a good portion of the performance of industrial optimizing compilers without being a huge
dependency and overall being much, much simpler than the aforementioned (such as, but not limited to, LLVM). In less buzzslop, QBE is _relatively_ fast and simple
and it allows for the generation of assembly from their [IL](https://en.wikipedia.org/wiki/Intermediate_representation#Intermediate_language) for three architectures and all major operative systems, making the backend of Sable much more 
maintainable and simple (which in turn helps me focus on the design rather than implementation). Although if I feel like it I might, in the far future, generate
my own assembly.

## Examples

I want Sable to inherit most of the syntax from the language I love and always will love: __C__. 

A bunch examples of how I __want__ Sable to look and feel:

{% badge "Hello, World", "green" %}
```sable
@include("std/io");

export fn int32 main() 
{
  io::println("Hello, World!");
  return 0;
}
```

{% badge "Variables", "green" %}
```sable
export fn int32 main()
{
  defer return 0;

  /* mutable */
  let int32 x = 5;
  let infer y = "string"; // type inferance is explicit

  x++;
  y = "string 2: Electric Boogaloo";

  /* immutable */
  const int32 imut_x = 5;
  const infer imut_y = "string"; // can still infer as usual
  const int32 not_init = undefined;
  not_init = 6; // can't mutate again!

  /* optional */
  let int32<optional> optional = null;

  /* collections */
  let int32[3] arr          = {1, 2, 3};
  let int32[_] infered_size = {1, 2, 3}; // size 3
  let int32[*] dynamic      = {1, 2, 3};

  dynamic.insert(4);
  // arr.insert(4) -> error

  /* collection operations */
  let int32 n = arr[1];
  let int32 first = arr.first();
  let int32 last = arr.last();
  let uint64 len = dynamic.len(); // 4
  let uint64 size = @size(dynamic); // 4 * 4 = 16 bytes

  /* attribute: growable */
  let int32[_]<growable> can_grow = {1, 2, 3};
  let uint64 new_size = can_grow.grow(1); // relative grow
  new_size = can_grow.shrink(1); // relative shrink
  new_size = can_grow.set_size(4);
  can_grow.insert(4); // won't fail, as we grew to size 4

  /* immutable collections */
  const int32[_] imut_array = {1, 2, 3};
  // imut_coll[1] = 3; -> error

  const int32[*] imut_dyn = {1, 2, 3};
  // imut_dyn[1] = 3; -> error
  imut_dyn.insert(4); // allowed!

  const int32[_]<growable> imut_grow = {1, 2, 3};
  // imut_grow[1] = 3; -> error
  imut_grow.grow(1); // allowed!
  // imut_grow.shrink(1); -> disallowed (mutates data inside of array)
  imut_grow.insert(4) // allowed!
}
```

{% badge "Control flow", "green" %}
```sable
@include("std/io");

export fn int32 main()
{
  defer return 0; // end of block

  let int32 x = 5;
  if (x < 7) {
    // ...
  } else if (x > 7) {
    // ...
  } else {
    // ...
  }

  switch (x) {
    case 1: {
      // ...
    },
    case 2, 3, 4: {
      // ...
    },
    else {
      // ...
    }
  }

  while (true) { 
    // stop current loop
    break;

    // continue to next iteration
    continue;
  }

  const string[_] arr = {"hello", "world"};
  for (let int32 i = 0; i < arr.len(); i++) {
    io::println(arr[i]);
  }
}
```

{% badge "Memory", "green" %}
```sable
@include("std/mem")

export fn int32 main()
{
  let int32 x = 5;
  let int32* pX = @addr(x);
  let int32 y = @deref(pX) - 2;
  mem::free(pX);
  // let int32 z = @deref(pX); -> error
  // mem::free(pX); -> error

  let int32[_] nums = {1, 2, 3, 4};

  let int32*[*] ptr_list = mem::calloc(nums.len(), @size(int32*));
  for (let uint64 i = 0; i < nums.len(); i++) {
    ptr_list.insert(@addr(nums[i]));
  }
  defer ptr_list.free();
}
```

{% badge "Data types", "green" %}
```sable
@include("std/mem")

// size: 8 bytes * 2 = 16 bytes
type point = data 
{
  let double x;
  let double y;
};

static method fn point* point.init(int32<optional> x, int32<optional> y)
{
  let point* p = mem::malloc(point);
  p.x = x or 0;
  p.y = y or 0;
  return p;
}

method fn void point.free(point* self) 
{
  if (!self) { return; }
  mem::free(self);
}

method fn int32[2] point.as_array(point* self) 
{
  return int32[2]{self.x, self.y};
}

export fn int32 main()
{
  point* p = point::init(5, 2);
  defer p.free();
  let int32[2] arr = p.as_array();
}

```

{% badge "Enum types", "green" %}
```sable
@include("std/io")

type weekday = enum 
{
  Monday,
  Tuesday,
  Wednesday,
  Thursday,
  Friday,
  Saturday,
  Sunday
};

export fn int32 main()
{
  let weekday day = weekday::Monday;
  io::println(@tag_string(day)); // Monday
  io::println(@as(day, int64)); // 0
}
```

{% badge "Union types", "green" %}
```sable
@include("std/io")

type numeric = union
{
  int16 short;
  int32 int;
  int64 long;
  float32 float;
  float64 double;
};

export fn int32 main()
{
  let numeric n = @as(float64, 3.14);
  switch (@inspect(n)) {
    case int16, int32, int64: {
      io::println("int");
    },
    case float32, float64: {
      io::println("float");
    }
  }
}
```

{% badge "Possible standard library memory helpers", "green" %}
```sable
@include("std/mem");

type point = data 
{
  let double x;
  let double y;
};

export fn int32 main()
{
  // init(uint64 initial_capacity)
  let mem::arena arena = mem::arena::init(@size(point));
  defer arena.free();

  let point* p = @as(arena.alloc(@size(point)), point*);
}
```

{% badge "Functions & error handling", "green" %}

_Fallible types are inspired by Rust's results._
```sable
@include("std/io");

error DivideError {
  DivideByZero
};

fn fallible<int32, DivideError> divide(int32 a, int32 b) 
{ 
  if (b < 1) {
    throw DivideError::DivideByZero;
  }
  return a / b;
}

export fn int32 main()
{
  let infer res = divide(8, 2); // fallible<int32, DivideError>, value Ok, unwraps to 4
  res = divide(8, 0); // same type, value Error, unwraps to DivideError::DivideByZero

  switch (res) {
    case Ok: |v| {
      io::println(v);
    },
    case Error: |err| {
      switch (err) {
        case DivideError::DivideByZero {
          io::println("can't divide by zero");
          return -1;
        }
      }
    }
  }

  return 0;
}
```

{% badge "Multiple files", "green" %}

{% center %}
{% badge "math" %}
{% endcenter %}
```sable
#{no_ignore_return}
export fn int32 add(int32 a, int32 b)
{
  return a + b;
}

#{no_ignore_return}
export fn int32 sub(int32 a, int32 b)
{
  return a - b;
}

#{no_ignore_return}
fn int32 mul(int32 a, int32 b)
{
  return a * b;
}
```

{% center %}
{% badge "main" %}
{% endcenter %}
```sable
@include("./math.sbl");

export fn int32 main()
{
  const int32 x = 2;
  const int32 y = 5;
  
  const int32 z = math::add(x, y);
  const int32 a = math::sub(x, y);
  // const int32 b = math::mul(x, y); -> error (not exported)

  // math::add(x, y); -> error (has no_ignore_return)
  // math::sub(x, y); -> error (has no_ignore_return)
}
```

{% badge "Multiple file (advanced)", "green" %}

{% center %}
{% badge "person" %}
{% endcenter %}
```sable
@include("std/mem");

export type person = data
{
  let string name;
  let string[*] surnames;
  let int32 age;
};

export static method fn person.init(string name, string[_] surnames, int32 age) 
{
  let person* p = mem::malloc(@size(person));
  p.name = name;
  p.surnames = surnames;
  p.age = age;
  return p;
}

export method fn person.free(person* self) 
{
  if (!self) { return; }
  mem::free(self);
}
```

{% center %}
{% badge "person_methods" %}
{% endcenter %}
```sable
@extends("./person.sbl")

method fn string person.full_name(person* self)
{
  let string full = self.name + " ";
  for (let uint64 i = 0; i < self.surnames.len(); i++) {
    full += " " + self.surnames[i];
  }
  return full;
}
```

{% center %}
{% badge "main" %}
{% endcenter %}
```sable
@include("./person.sbl");
@include("std/io");

export fn int32 main()
{
  let person::person* p = person::person::init("John", string[_]{"Doe"}, 18);
  defer p.free();
  io::println(p.full_name());
}
```

{% badge "File attributes", "green" %}

{% center %}
{% badge "point" %}
{% endcenter %}
```sable
#file.cannot_extend; // disallows @extends.
#file.types_only; // disallows function declarations/definitions.

export type point = data
{
  let int32 x;
  let int32 y;
}
```

{% center %}
{% badge "main" %}
{% endcenter %}
```sable
#file.cannot_include; // disallows @include
#file.cannot_extend;

export fn int32 main()
{
  return 0;
}
```

{% badge "Generics and typename handling", "green" %}
```sable



```
