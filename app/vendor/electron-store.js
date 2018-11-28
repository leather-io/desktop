"use strict";
import path from "path";
import electron from "electron";
import Conf from "./conf";

class ElectronStore extends Conf {
  constructor(opts) {
    const defaultCwd = (electron.app || electron.remote.app).getPath(
      "userData"
    );

    opts = Object.assign({ name: "config" }, opts);

    if (opts.cwd) {
      opts.cwd = path.isAbsolute(opts.cwd)
        ? opts.cwd
        : path.join(defaultCwd, opts.cwd);
    } else {
      opts.cwd = defaultCwd;
    }

    opts.configName = opts.name;
    delete opts.name;
    super(opts);
  }

  openInEditor() {
    electron.shell.openItem(this.path);
  }
}

export default ElectronStore;
