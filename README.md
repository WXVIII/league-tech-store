# LeagueTech Commerce

LeagueTech storefront for ordering Mesh Tag + MeshApp in Nigeria. The checkout flow validates buyer details, sends a secure email OTP for verification, and confirms the order with a Paystack-ready checkout flow.

## Production domain

Use this site URL in your deployment and Supabase Auth configuration:

- https://leaguetech.store/

## Development

You need Node.js and npm or Bun.

```sh
git clone <this-repository-url>
cd <repository-name>
npm install
npm run dev
```

## Auth and email setup

Configure the following in your deployment environment and Supabase Auth dashboard:

- `SITE_URL=https://leaguetech.store`
- `APP_URL=https://leaguetech.store`
- `VITE_SITE_URL=https://leaguetech.store`
- `VITE_APP_URL=https://leaguetech.store`
- Supabase Auth Site URL: `https://leaguetech.store`
- Email OTP sender domain: configure the custom email domain in Supabase Auth and verify the domain before use.
