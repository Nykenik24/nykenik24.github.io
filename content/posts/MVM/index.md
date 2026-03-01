---
title: "MVM"
author: Nykenik24
date: 2026-03-01
summary: "A project I recently finished."
tags: ["idea", "projects"]
draft: false
---

So, this week I've worked in a project called _MVM (Minuscule Virtual Machine)_,
a register-based program VM which has:

- It's own very simple architecture.
- A small assembler.
- 7 registers, flags, conditions, etc.

## Example

```nasm
LDI 1, 10
JPT ; jump point 1
  ADDI 0, 1, 0
  PUTN 0
  CEQ 0, 1 ; R0 == 10
  JF 1 ; jump to 1
```

Line-by-line:

1. Sets the register 1 to _10_.
2. Defines _jump point_ 1, which allows us to jump there at any moment.
3. Adds 1 to register 0's value, and stores the result in register 0
   (incrementing it by 1).
4. Outputs the value of register 0.
5. Checks if register 0's value equals register 1's value (10).
6. If it's not equal, it jumps to the jump point we defined before.

## Architecture

| Name | Description                                                           | Params                 |
| ---- | --------------------------------------------------------------------- | ---------------------- |
| HALT | Stops execution                                                       | _None_                 |
| LD   | Loads a value from memory into a register                             | `reg`, `offset`        |
| LDI  | Loads an immediate value into a register                              | `reg`, `imm`           |
| ST   | Stores a register into memory                                         | `reg`                  |
| ADD  | Adds `reg0` and `reg1` and stores the value at `reg2`                 | `reg0`, `reg1`, `reg2` |
| ADDI | Adds `reg0` and `imm` and stores the value at `reg1`                  | `reg0`, `reg1`         |
| SUB  | Subtracts `reg1` from `reg0` and stores the value at `reg2`           | `reg0`, `reg1`, `reg2` |
| SUBI | Subtracts `imm` from `reg0` and stores the value at `reg1`            | `reg0`, `imm`, `reg1`  |
| MUL  | Multiplies `reg0` and `reg1` and stores the value at `reg2`           | `reg0`, `reg1`, `reg2` |
| MULI | Multiplies `reg0` and `imm` and stores the value at `reg1`            | `reg0`, `imm`, `reg1`  |
| DIV  | Divides `reg0` by `reg1` and stores the value at `reg2`               | `reg0`, `reg1`, `reg2` |
| DIVI | Divides `reg0` by `imm` and stores the value at `reg1`                | `reg0`, `imm`, `reg1`  |
| CGR  | Checks if `reg0` > `reg1` and stores the result at `CND`              | `reg0`, `reg1`         |
| CLO  | Checks if `reg0` < `reg1` and stores the result at `CND`              | `reg0`, `reg1`         |
| CEQ  | Checks if `reg0` == `reg1` and stores the result at `CND`             | `reg0`, `reg1`         |
| JMP  | Jumps to `jpt`                                                        | `jpt`                  |
| JT   | Jumps to `jpt` **IF** `CND` is true                                   | `jpt`                  |
| JF   | Jumps to `jpt` **IF** `CND` is false                                  | `jpt`                  |
| JZ   | Jumps to `jpt` **IF** `FLAG` is `Z` (Zero)                            | `jpt`                  |
| JNZ  | Jumps to `jpt` **IF** `FLAG` is **NOT** `Z` (Zero)                    | `jpt`                  |
| JN   | Jumps to `jpt` **IF** `FLAG` is `N` (Negative)                        | `jpt`                  |
| JNN  | Jumps to `jpt` **IF** `FLAG` is **NOT** `N` (Negative)                | `jpt`                  |
| PUTN | Output number at `reg`                                                | `reg`                  |
| PUTS | Output string of len `strlen`. Will read `strlen` characters in code. | `strlen`, `...`        |
| JPT  | Define a new jump point                                               | _None_                 |

## Links

- [GitHub repository](https://github.com/Nykenik24/MVM).
- [Specification](https://github.com/Nykenik24/MVM/tree/main/spec).
