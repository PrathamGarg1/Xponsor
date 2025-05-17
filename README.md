Make these changes

Correct the routes and the flow should be like .. '/' should just ask them whether they are a brand or a influencer and that redirects to google sign in and so we will always get the userType in the beginning itself
after that if it chose to be influencer then it will be redirected to '/onboarding' .. there we dont need to again ask for influencer or brand .. just write some more text specific to influencers and convince them to connect their instagram and how we follow official instagram all rules
After that instagram redirects to the influencer dashboard
Influencers should not be able to edit the sections of the followerCnt and instagram handle by themselves .. it is fixed quantity whatever has came from instagram api
The Niche of influencers should be chosen from sufficiently disjoint fixed options ... ie as a dropdown in '/brand/influencers' and when updating the influencer profile .







#--------------------



This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
