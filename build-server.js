import * as esbuild from 'esbuild';

await esbuild.build({
  entryPoints: ['server/_core/index.ts'],
  bundle: true,
  platform: 'node',
  target: 'node18',
  format: 'esm',
  outfile: 'dist/index.js',
  external: [
    // All node built-ins
    'node:*',
    // All dependencies that should not be bundled
    'drizzle-orm',
    'drizzle-kit',
    'mysql2',
    'express',
    '@trpc/server',
    'bcryptjs',
    'cookie',
    'dotenv',
    'jose',
    'jsonwebtoken',
    'nanoid',
    'openai',
    'superjson',
    'zod',
    '@aws-sdk/client-s3',
    '@aws-sdk/s3-request-presigner',
  ],
  logLevel: 'info',
});

console.log('✓ Server build complete');
