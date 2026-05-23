module.exports = function (api) {
  api.cache(true);

  const presets = ['babel-preset-expo'];
  const plugins = [];

  // nativewind/babel returns { plugins: [...] } which is a preset format
  // Skip in test environment where it's not needed
  if (process.env.NODE_ENV !== 'test') {
    presets.push(require('nativewind/babel'));
  }

  return { presets, plugins };
};
