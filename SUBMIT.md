# Submit xgas.dollars — exact steps

Everything agent-side is built: native Expo app (iOS + Android, one codebase), icons, store listing copy, review notes. The only steps left are the ones that legally require *your* accounts and *your* Mac. No deploys or submissions happen without you running these.

## One-time (your Mac Terminal)

```bash
cd ~/xgas-mobile-app        # copy this folder from the workspace first
npm i -g eas-cli
eas login                   # your Expo account
npm install
```

## Build + submit iOS (App Store)

```bash
eas build -p ios --profile production
eas submit -p ios --profile production
```

- First run prompts for your Apple ID / App Store Connect and generates signing certs (EAS manages them).
- Fill `eas.json`: `ascAppId` after the first upload creates the ASC app record (bundle `dev.xgas.dollars`).
- Paste listing copy from `store/app-store.md`; review notes included there. Answer the export-compliance and financial-services questions in ASC.

## Build + submit Android (Google Play)

```bash
eas build -p android --profile production
eas submit -p android --profile production
```

- Needs `play-service-account.json` (Play Console → Setup → API access) in the project root; path already referenced in `eas.json`.
- Complete the financial-features + data-safety declarations in Play Console using `store/google-play.md`.

## Before real dollars go live (product, not stores)

1. HTTP bridge in front of `xgas-mcp` so the app calls quote/prepare/submit for real (demo build runs sim state; adapter map is commented in `App.tsx` and in `app.json` metadata).
2. Licensed payout partner for the bank rail signed, or bank rail ships as redeem-instructions.
3. Legal pass on yield copy: targets stay labeled targets everywhere.

## Honest blockers I cannot do for you

- I have no shell on your Mac and no access to your Apple/Google developer accounts — builds, certs, and the submit button are yours to run. Everything above is copy-paste ready.
