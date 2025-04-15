# Tauri devlog

Quick experimentation with Tauri

1. I wanted a system tray

I looked at this reference implementation, https://github.com/jeffrafter/tauri-v2-tray-example
once installed the plugin and the permission it was pretty easy.

In tauri almost anything you do at the system level needs to have permission setted up, this is done by interaction with <src-tauri/capabilities/default.json>

The permissions namespace are very inconsistent, in the web you'll find pleanty of examples that don't work

2. I wanted to interact with fs, installed a new plugin and new permissions, worked great

3. Wanted to create global keybindings, the plugin does not work

## Takeaways
at the end of the day you need to know Rust to use tauri
there is poor documentation and a relatively small community
small footprint tho



## Build with
Vite + React + Tauri
