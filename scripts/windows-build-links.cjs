// Next's standalone output can use directory junctions on Windows without
// administrator privileges. This preload is used only by build processes.
if (process.platform === 'win32') {
  const fs = require('node:fs')
  const promises = require('node:fs/promises')
  const path = require('node:path')
  const Module = require('node:module')
  const compile = Module.prototype._compile
  Module.prototype._compile = function (source, filename) {
    if (/[\\/]esbuild[\\/]lib[\\/]main\.js$/.test(filename)) {
      // Workers supply cloudflare:* modules. Resolving them as Windows paths
      // fails before esbuild can preserve the optional runtime import.
      source += '\nconst medwholeBuild = module.exports.build; module.exports = { ...module.exports, build: (options) => medwholeBuild(options.bundle ? { ...options, external: [...new Set([...(options.external || []), "cloudflare:*"])] } : options) };\n'
    }
    return compile.call(this, source, filename)
  }
  const symlink = promises.symlink.bind(promises)
  const symlinkSync = fs.symlinkSync.bind(fs)

  promises.symlink = async (target, destination, type) => {
    try {
      return await symlink(target, destination, type)
    } catch (error) {
      if (error.code !== 'EPERM' || type === 'junction') throw error
      const absoluteTarget = path.resolve(path.dirname(destination), target)
      return (await promises.stat(absoluteTarget)).isDirectory()
        ? symlink(absoluteTarget, destination, 'junction')
        : promises.link(absoluteTarget, destination)
    }
  }
  fs.symlink = (target, destination, type, callback) => {
    if (typeof type === 'function') { callback = type; type = undefined }
    promises.symlink(target, destination, type).then(() => callback(null), callback)
  }
  fs.symlinkSync = (target, destination, type) => {
    try {
      return symlinkSync(target, destination, type)
    } catch (error) {
      if (error.code !== 'EPERM' || type === 'junction') throw error
      const absoluteTarget = path.resolve(path.dirname(destination), target)
      return fs.statSync(absoluteTarget).isDirectory()
        ? symlinkSync(absoluteTarget, destination, 'junction')
        : fs.linkSync(absoluteTarget, destination)
    }
  }
}
