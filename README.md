## Upload to Cloudflare

If wrangler (Cloudflare) is not yet installed
```bash
npm install -g wrangler
```

Login
```bash
wrangler login
```

Make a new build
```bash
npm run build
```

(Optional) If you wanna see how it looks, you can 
```bash
npm run preview
```


Deploy to pages
```bash
npx wrangler pages deploy
```

More info at https://docs.astro.build/en/guides/deploy/cloudflare/
