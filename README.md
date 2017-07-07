# Intent

Intent language compiler.

### Progress

  - [x] Watchdog
    - [x] Watch FS events by path or regexp (use [chokidar](https://github.com/paulmillr/chokidar))
    - [x] Debounce
    - [x] Easy attach/listen/detach
    - [x] CLI options
    - [x] Re/Parsing initiation on FS events
  - [x] AST builder
    - [x] AST Parser
      - [ ] Todo:
        - [ ] Streamed tokenization
        - [ ] Diff tokenization
    - [ ] Todo:
      - [ ] BNF grammar processing
      - [ ] AST patching based on diff tokenization
  - [x] Transpiler
    - [ ] Todo:
      - [ ] More flexible transpiling pipeline
      - [ ] Transpile patched AST
  - [x] Emit
    - [x] Emit to file
    - [x] No-emit
    - [ ] Todo:
      - [ ] Emit to virtual filesystem + different filesystems implementation (emit to real fs, no-emit, emit to output stream, emit as socket events etc.)
  - [ ] Todo:
    - [ ] Server
      - [x] Socket listener
      - [ ] Event processor
    - [ ] Web-app
      - [x] SPA scaffold
      - [ ] Chip dependency tree visualizer
      - [ ] AST visualizer
      - [ ] Transpiling pipeline visualizer
      - [ ] Chip tree visualizer
        - [ ] Specs visualizer
    - [ ] General project improvements
      - [ ] Separate submodules into different packages
        - [ ] Utils
        - [ ] Watchdog
        - [ ] AST builder
        - [ ] Transpiling
        - [ ] Emitting
        - [ ] Event server
        - [ ] Web-app
      - [ ] Publish packages via NPM

### Changelog

  - 0.0.1 &rarr; 0.02
    - Watchdog implementation
    - AST builder implementation
      - Parser implementation
    - Transpiler implementation
    - Output emitters implementation
      - Emit to file
      - No emit
    
