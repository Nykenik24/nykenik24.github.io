---
title: "LÖVE tools"
desc: "A series of utilties for the LÖVE game engine"
layout: project.html
show: true
---

[LÖVE tools](https://github.com/Nykenik24/love2d-tools), or `love2d-tools`, is a series of LÖVE utilities, inspired by batteries.

### Installation
1. Clone the repository
```bash
git clone https://github.com/Nykenik24/love2d-tools.git
```
Or add it as a submodule **(recommended)**
```bash
git submodule add https://github.com/Nykenik24/love2d-tools.git path/to/library
```
You can also download the latest release, but if you want the latest modules and features, i recomend cloning or adding as a submodule. I don't make a release every time i add a module, only when i
make patches or release various modules.

2. Require the library in your `main.lua` or the file where you load libraries.
```lua
Tools = require("love2d-tools.lib")
-- or you can require every module individually
Class = require("love2d-tools.modules.class")
```

3. Now you can use the library, all the modules are documented.
```lua
Tools = require("love2d-tools.lib")
ClassTool = Tools.class
DebugTool = Tools.debug --note that lua already has a standard debug library, so don't name the module "debug".
TimerTool = Tools.timer

MyClass = ClassTool {
    smth = "Hello World!",
    other_thing = 5
}
MyClass_obj = MyClass:new()

MyTimer = Timer(5) --5 is the duration of the timer
MyTimer:Update()

MyTimer.OnEnd = function(self) --will be called every time the timer ends
    DebugTool.Equal(MyClass_obj.other_thing, 5)
end
```

### Modules
These are the modules it comes with:
- **OOP** (`class`): Class system, has: objects *(obviously)*, subclasses, *"merging"* and *"cloning"* classes; etc.
- **Timer** (`timer`): Allows to create timers, has an automatic `update` method and an `OnEnd` method that you can customize.
- **Input** (`input`): Mouse/keyboard input helper.
- **MessageBus** (`messagebus`): Message bus that handles publishers and suscribers. Made by *[zalanwastaken](https://github.com/zalanwastaken)*.
- **StateMachine** (`state`): State machine that handles: info, an update function, etc.
- **Easing** (`easing`): Easing helper to make smoother movement or ease values. Licenses of used resources in the [licenses directory](https://github.com/Nykenik24/love2d-tools/tree/main/licenses).
- **Vector2** (`vec2`): Simple vec2 system.
- **Mathx** (`math`): Useful math functions not present in `lua` and `love2d`.
- **Tablex** (`table`): Table handling extension. **Category**: Lua extensions.
- **Logger** (`logger`): Logging module that uses a separate thread for minimum performance impact. Made by *[zalanwastaken](https://github.com/zalanwastaken)*.
- **Debug** (`debug`): Basic debug utility with assert functions.
- **Database** (`database`): Database-like data managing system. Made by *[zalanwastaken](https://github.com/zalanwastaken)*.
- **Set** (`set`): Simple set implementation.

### More
To read about contributing, the roadmap, etc., visit [the GitHub repository](https://github.com/Nykenik24/love2d-tools)
