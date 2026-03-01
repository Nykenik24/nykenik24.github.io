---
title: "Reactive signals"
author: Nykenik24
date: 2026-03-01
summary: "A brand new project!"
tags: ["idea", "projects"]
draft: false
---

Recently I've been motivated to work on small, self-contained projects,
and this is one of them.

My last project, [MVM](/posts/mvm), was quite simple and only took a few days
to finish. This time, I wanted to build something a bit more complicated
and architectural, something related to states and state updates.

If you've read the title, you already know what this project is about:
a _reactive signal_ system.

## Signals

> What exactly is a signal?

In this context, a signal is not a message, nor an event sent through a channel.

A signal is a **reactive value**, a piece of state that automatically notifies
dependent signals of when it updates, so they can recompute their value.

If that sounds too abstract for you, think of a spreadsheet.

If cell `B1` contains the formula `=A1 * 2`, then `B1` depends on `A1`.
When `A1` changes, `B1` updates automatically. No one manually triggers it
nor an event/message is broadcasted. The dependency simply exists,
and the system propagates changes to it.

That’s the core idea behind signals.

- A signal stores a value.
- Signals can derive their value from one another.
- Effects run whenever the value associated changes.

The system builds a dependency graph at runtime, so when a signal updates,
only the computations that depend on it are re-evaluated, meaning there is
no polling or broadcasting happening, just dependencies and dependents
that update in real-time.

So, I wanted to explore how to implement that model in C, in a way that
makes it useful (without being too complicated to make).

## Use cases

> What would be the use case of this project?

Reactive signals are **SUPER** useful in some cases.

As C isn't a functional language where state is all that matters, values
aren't recomputed when one member changes.

In this code for example:

```c
int x = 5;
int y = x * 7; // 35
x = 3;
```

_y_ will still be 35 at the end, even if _x_ changed, as C just replaces
_x_ with 5 in _y_'s declaration at compile time.

If we wanted a state change, we would use pointers:

```c
int x = 5;
int* y = &x; // 5
x = 3;
printf("%d\n", *y); // 3
```

But this has some obvious issues (if you ever used C), as you know that:

1. You can't multiply _x_'s address, meaning it can't be as the example
   above and you need to manually write `*y * 7` each time.
2. You now have to deal with pointers, which can be a problem you don't want
   to deal with plus it's overkill to use pointers here as, at the end of the day,
   you can just use _x_ and avoid making the pointer _y_ using _x_'s address.

That's where signals are introduced.

If we have reactive signals, then the code becomes:

```c
// create X: a reactive signal
signal_t* x = signal_new_int(5);

// create Y: a computed signal which depends on X
signal_t* y = computed_signal_int(() -> {
    return signal_get_int(x) * 7;
});

// create an effect that prints Y whenever it changes
effect(y, () -> {
    printf("y = %d\n", signal_get_int(y));
});

// update X
signal_set_int(x, 3);
// which would update Y and trigger Y's effect.
```

> The code is stripped down from a real example, as one would
> contain cleanup, includes and obviously the definition of
> main function. Maybe even other names or parameters for the
> functions used. This is just an example.

The model here is:

- `signal_t` represents any kind of signal, and stores all important
  information associated to that signal.
- `signal_new_int` creates a new **reactive** signal containing an integer value.
- `computed_signal_int` creates a new computed signal (which updates each time
  dependencies update) containing an integer value.
- `effect` creates a new effect associated to a signal which happens each
  time it updates (both through direct updates or through updates of dependencies).
- `signal_set_int` updates a signal containing an integer value.

It might seem like overkill at first: instead of just two declarations and an
assignment, we now create signal objects, call a few functions, and rely on the
library to manage updates.

But the payoff is clear:

1. **Automatic state updates** – when we set `_x_` with `signal_set_int`,
   all dependent signals automatically recompute. No manual tracking required.
2. **Managed memory** – we no longer handle raw pointers for dependencies; the
   library keeps track of signal objects, which can be cleaned up with a single
   `signal_free` call.

In short, we trade a bit of verbosity for a system that handles state propagation
reliably and cleanly, letting us focus on the logic rather than manually updating
everything ourselves.

And we can get much shorter:

```c
signal_t* x = signal_new_int(5);
signal_t* y = computed_signal_int(() -> {
    return signal_get_int(x) * 7;
});
signal_set_int(x, 3);
```

With just a 5 lines of code and a few function calls, we now have a system where
state updates propagate automatically, computed signals re-evaluate when their
dependencies change, and effects run deterministically. This makes managing state
in C cleaner and safer than manually tracking dependencies with pointers.
