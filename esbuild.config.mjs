import { build, context } from 'esbuild';
import { copyFileSync, mkdirSync } from 'fs';

const isWatch = process.argv.includes('--watch');

const buildOptions = {
  entryPoints: ['src/main.tsx'],
  bundle: true,
  outfile: 'dist/bundle.js',
  format: 'iife',
  target: 'es2017',
  jsx: 'automatic',
  minify: !isWatch,
  sourcemap: isWatch,
  logLevel: 'info',
};

mkdirSync('dist', { recursive: true });
copyFileSync('public/index.html', 'dist/index.html');

if (isWatch) {
  const ctx = await context(buildOptions);
  await ctx.watch();
  const { host, port } = await ctx.serve({ servedir: 'dist', port: 3000 });
  console.log(`Dev server: http://localhost:${port}`);
} else {
  await build(buildOptions);
}
